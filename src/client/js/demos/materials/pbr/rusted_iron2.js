import { Harmony3D, GlMatrix, createPbrMaterial, createTextureFromUrl, getPbrParams, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	ambientLight.intensity = 0.1;
	perspectiveCamera.position = [0, -10, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 1000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 50;
	scene.background.setColor(GlMatrix.vec4.fromValues(0.1, 0.1, 0.1, 1));

	let l = new Harmony3D.PointLight({ position: [0, -2, -0], intensity: 1, parent: scene });
	new Harmony3D.Sphere({ position: [-1, 0, 0], parent: scene, radius: 1, material: createPbrMaterial('rustediron2'), segments: 32, rings: 32 });
	new Harmony3D.Sphere({ position: [1, 0, 0], parent: scene, radius: 1, material: createCustomMaterial('rustediron2'), segments: 32, rings: 32 });
}


function createCustomMaterial(name) {
	const material = new Harmony3D.ShaderMaterial({
		vertex: `
layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aVertexNormal;
layout (location = 2) in vec2 aTextureCoord;

out vec2 TexCoords;
out vec3 WorldPos;
out vec3 Normal;

#include declare_matrix_uniforms
#include declare_vertex_uv
#include declare_vertex_skinning

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;


#include varying_standard

void main()
{
	TexCoords = aTextureCoord;
	WorldPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
	Normal = uNormalMatrix * aVertexNormal;

	gl_Position =  uProjectionMatrix * uViewMatrix * vec4(WorldPos, 1.0);

	#include compute_vertex_uv
	#include compute_vertex
	#include compute_vertex_skinning
	#include compute_vertex_projection
	#include compute_vertex_color
	#include compute_vertex_standard
}
		`,
		fragment: `
in vec2 TexCoords;
in vec3 WorldPos;
in vec3 Normal;

// material parameters
uniform sampler2D uColorTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uMetalnessTexture;
uniform sampler2D uRoughnessTexture;
uniform sampler2D aoMap;

// lights
uniform vec3 lightPositions[4];
uniform vec3 lightColors[4];

uniform vec3 uAmbientLight;

struct PBRLight {
	vec3 position;
	vec3 radiance;
};
uniform PBRLight uPbrLights[4];

uniform vec3 uCameraPosition;

// ----------------------------------------------------------------------------
// Easy trick to get tangent-normals to world-space to keep PBR code simplified.
// Don't worry if you don't get what's going on; you generally want to do normal
// mapping the usual way for performance anyways; I do plan make a note of this
// technique somewhere later in the normal mapping tutorial.
vec3 getNormalFromMap()
{
	vec3 tangentNormal = texture(uNormalTexture, TexCoords).xyz * 2.0 - 1.0;
	tangentNormal = vec3(0., 0., 1.);

	vec3 Q1  = dFdx(WorldPos);
	vec3 Q2  = dFdy(WorldPos);
	vec2 st1 = dFdx(TexCoords);
	vec2 st2 = dFdy(TexCoords);

	vec3 N   = normalize(Normal);
	vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
	vec3 B  = -normalize(cross(N, T));
	mat3 TBN = mat3(T, B, N);

	return normalize(TBN * tangentNormal);
}
// ----------------------------------------------------------------------------
float DistributionGGX(vec3 N, vec3 H, float roughness)
{
	float a = roughness*roughness;
	float a2 = a*a;
	float NdotH = max(dot(N, H), 0.0);
	float NdotH2 = NdotH*NdotH;

	float nom   = a2;
	float denom = (NdotH2 * (a2 - 1.0) + 1.0);
	denom = PI * denom * denom;

	return nom / denom;
}
// ----------------------------------------------------------------------------
float GeometrySchlickGGX(float NdotV, float roughness)
{
	float r = (roughness + 1.0);
	float k = (r*r) / 8.0;

	float nom   = NdotV;
	float denom = NdotV * (1.0 - k) + k;

	return nom / denom;
}
// ----------------------------------------------------------------------------
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
	float NdotV = max(dot(N, V), 0.0);
	float NdotL = max(dot(N, L), 0.0);
	float ggx2 = GeometrySchlickGGX(NdotV, roughness);
	float ggx1 = GeometrySchlickGGX(NdotL, roughness);

	return ggx1 * ggx2;
}
// ----------------------------------------------------------------------------
vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
	return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
// ----------------------------------------------------------------------------

#include varying_standard

void main()
{

	#include compute_fragment_normal
	#include compute_fragment_normal_world_space
	vec3 albedo	 = pow(texture(uColorTexture, TexCoords).rgb, vec3(2.2));
	float metallic  = texture(uMetalnessTexture, TexCoords).r;
	float roughness = texture(uRoughnessTexture, TexCoords).r;
	float ao		= 1.0;//texture(aoMap, TexCoords).r;

	vec3 N = getNormalFromMap();
	N = normalize(TBNMatrixWorldSpace * vec3(0., 0., 1.));
	vec3 V = normalize(uCameraPosition - WorldPos);


	// calculate reflectance at normal incidence; if dia-electric (like plastic) use F0
	// of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)
	vec3 F0 = vec3(0.04);
	F0 = mix(F0, albedo, metallic);

	// reflectance equation
	vec3 Lo = vec3(0.0);
	for(int i = 0; i < 4; ++i)
	{
		// calculate per-light radiance
		vec3 L = normalize(uPbrLights[i].position - WorldPos);
		vec3 H = normalize(V + L);
		float distance = length(uPbrLights[i].position - WorldPos);
		float attenuation = 1.0 / (distance * distance);
		vec3 radiance = uPbrLights[i].radiance * attenuation;

		// Cook-Torrance BRDF
		float NDF = DistributionGGX(N, H, roughness);
		float G   = GeometrySmith(N, V, L, roughness);
		vec3 F	= fresnelSchlick(max(dot(H, V), 0.0), F0);

		vec3 numerator	= NDF * G * F;
		float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001; // + 0.0001 to prevent divide by zero
		vec3 specular = numerator / denominator;

		// kS is equal to Fresnel
		vec3 kS = F;
		// for energy conservation, the diffuse and specular light can't
		// be above 1.0 (unless the surface emits light); to preserve this
		// relationship the diffuse component (kD) should equal 1.0 - kS.
		vec3 kD = vec3(1.0) - kS;
		// multiply kD by the inverse metalness such that only non-metals
		// have diffuse lighting, or a linear blend if partly metal (pure metals
		// have no diffuse light).
		kD *= 1.0 - metallic;

		// scale light by NdotL
		float NdotL = max(dot(N, L), 0.0);

		// add to outgoing radiance Lo
		Lo += (kD * albedo / PI + specular) * radiance * NdotL;  // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
	}

	// ambient lighting (note that the next IBL tutorial will replace
	// this ambient lighting with environment lighting).
	vec3 ambient = vec3(uAmbientLight) * albedo * ao;

	vec3 color = ambient + Lo;

	// HDR tonemapping
	color = color / (color + vec3(1.0));
	// gamma correct
	color = pow(color, vec3(1.0/2.2));

	fragColor = vec4(color, 1.0);
	//fragColor = vec4(normalize(abs(vec3(color))), 1.0);
	//fragColor = vec4(normalize(abs(vec3(N))), 1.0);
	//fragColor.rgb = texture(uColorTexture, TexCoords).rgb;
	//fragColor.rgb = vec3(TexCoords, 0.0);
	//fragColor.a = 1.0;
	//fragColor = vec4(1.0);
}
`,
	});

	const prefix = '/assets/textures/pbr/';

	material.addParameter('color', Harmony3D.MateriaParameterType.Color4, null, newValue => material.setColor4Uniform('uColor', newValue ?? GlMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0)));
	material.addParameter('metalness', Harmony3D.MateriaParameterType.NormalizedFloat, 0, newValue => { material.uniforms['uMetalness'] = newValue });
	material.addParameter('roughness', Harmony3D.MateriaParameterType.NormalizedFloat, 0, newValue => { material.uniforms['uRoughness'] = newValue });
	material.addParameter('color_texture', Harmony3D.MateriaParameterType.Texture, null, newValue => material.setTexture('uColorTexture', newValue, 'USE_COLOR_TEXTURE'));
	material.addParameter('normal_texture', Harmony3D.MateriaParameterType.Texture, null, newValue => material.setTexture('uNormalTexture', newValue, 'USE_NORMAL_TEXTURE'));
	material.addParameter('metalness_texture', Harmony3D.MateriaParameterType.Texture, null, newValue => material.setTexture('uMetalnessTexture', newValue, 'USE_METALNESS_TEXTURE'));
	material.addParameter('roughness_texture', Harmony3D.MateriaParameterType.Texture, null, newValue => material.setTexture('uRoughnessTexture', newValue, 'USE_ROUGHNESS_TEXTURE'));

	const params = getPbrParams(name);
	if (params) {
		let colorTexture, normalTexture, metalnessTexture, roughnessTexture;
		if (params.color) {
			colorTexture = createTextureFromUrl(prefix + params.path + '/' + params.color);
		}
		if (params.normal) {
			normalTexture = createTextureFromUrl(prefix + params.path + '/' + params.normal);
		}
		if (params.metalness) {
			metalnessTexture = createTextureFromUrl(prefix + params.path + '/' + params.metalness);
		}
		if (params.metalness) {
			roughnessTexture = createTextureFromUrl(prefix + params.path + '/' + params.roughness);
		}

		material.setParameterValue('color_texture', colorTexture);
		material.setParameterValue('normal_texture', normalTexture);
		material.setParameterValue('metalness_texture', metalnessTexture);
		material.setParameterValue('roughness_texture', roughnessTexture);
	}
	return material;
}
