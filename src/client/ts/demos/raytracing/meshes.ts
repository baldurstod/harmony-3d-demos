import { vec3, vec4 } from 'gl-matrix';
import { AmbientLight, Camera, CanvasLayout, CanvasView, ClearPass, ColorBackground, Composer, DEG_TO_RAD, getCurrentTexture, Graphics, GraphicsEvent, GraphicsEvents, GraphicTickEvent, PixelatePass, PointLight, RayTracingPass, Scene, ShaderMaterial, TextureManager, UniformValue } from 'harmony-3d';
import { float32, uint32 } from 'harmony-types';
import { createElement, defineHarmonyToggleButton, HTMLHarmonyToggleButtonElement } from 'harmony-ui';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';
import { RayTracingCamera } from './rt/Camera';
import { RayTracingScene } from './rt/Scene';

const COMPUTE_WORKGROUP_SIZE_X = 16;
const COMPUTE_WORKGROUP_SIZE_Y = 16;
const MAX_BOUNCES_INTERACTING = 1;

class RaytracingMeshesDemo implements Demo {
	static readonly path = 'raytracing/meshes';
	//readonly useCustomRenderLoop = true;
	#renderFrames = Infinity;

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		if (Graphics.isWebGLAny) {
			alert('This demo is only available in WebGPU mode');
			return;
		}
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });//.setColor(vec4.fromValues(0., 0., 0., 1));

		scene.addChild(new AmbientLight({ intensity: 1.0 }));
		scene.addChild(new PointLight({ position: [100, 0, 50] }));

		const cameraPosition = [-10.0, 2.0, -4.0];
		const cameraLookAt = [0, 1, 0];

		perspectiveCamera.position = cameraPosition;
		//perspectiveCamera.lookAt([0, 1, 0]);
		orbitCameraControl.target.setPosition([0, 1, 0]);
		perspectiveCamera.verticalFov = 60;
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.aperture = 0.;
		//orbitCameraControl.enabled = false;
		perspectiveCamera.rotateGlobalX(90 * DEG_TO_RAD);
		perspectiveCamera.rotateX(25 * DEG_TO_RAD);
		perspectiveCamera.rotateY(-10 * DEG_TO_RAD);
		perspectiveCamera.rotateGlobalZ(-90 * DEG_TO_RAD);

		perspectiveCamera.focus = vec3.distance(cameraPosition, cameraLookAt);

		const WIDTH = 400;
		const HEIGHT = 300;

		const mainCanvas = Graphics.getCanvas('main_canvas')!;
		mainCanvas.autoResize = false;
		mainCanvas.autoResize = false;
		mainCanvas.width = WIDTH;
		mainCanvas.height = HEIGHT;

		let accumulatedSamplesPerPixel = 0;
		let clearAccumulatedSamples = 0;
		let frameId = 0;

		defineHarmonyToggleButton();

		createElement('div', {
			parent: params.htmlDemoContent,
			style: 'display:flex;flex-direction:column;',
			childs: [
				createElement('button', {
					innerHTML: 'reset',
					$click: () => reset(),
				}),
				createElement('button', {
					innerHTML: 'render one frame',
					$click: () => this.#renderFrames = 1,
				}),
				createElement('harmony-toggle-button', {
					childs: [
						createElement('div', {
							slot: 'on',
							innerHTML: 'on',
						}),
						createElement('div', {
							slot: 'off',
							innerHTML: 'off',
						}),
					],
					$change: (event: Event) => {
						if ((event.target as HTMLHarmonyToggleButtonElement).state) {
							this.#renderFrames = Infinity;
						} else {
							this.#renderFrames = 0;
						}
					},
				}),
				createElement('label', {
					innerText: 'fov',
					child: createElement('input', {
						type: 'range',
						min: 1,
						max: 90,
						value: '30',
						step: 0.01,
						$input: (event: InputEvent) => {
							perspectiveCamera.verticalFov = Number((event.target as HTMLInputElement).value);
							reset();
						},
					}),
				}),
				createElement('label', {
					innerText: 'aperture',
					child: createElement('input', {
						type: 'range',
						min: 0,
						max: 1,
						value: '0',
						step: 0.01,
						$input: (event: InputEvent) => {
							perspectiveCamera.aperture = Number((event.target as HTMLInputElement).value);
							reset();
						},
					}),
				}),
				createElement('label', {
					innerText: 'focus',
					child: createElement('input', {
						type: 'range',
						min: 1,
						max: 20,
						value: '10',
						step: 0.01,
						$input: (event: InputEvent) => {
							perspectiveCamera.focus = Number((event.target as HTMLInputElement).value);
							reset();
						},
					}),
				}),
			],
		});

		const camera = new RayTracingCamera(
			mainCanvas.canvas,
			vec3.fromValues(0, 0, 3.5),
			60,
			mainCanvas.canvas.width / mainCanvas.canvas.height,
		);
		const rayTracingScene = new RayTracingScene();
		const { materials, faces, aabbs } = await rayTracingScene.loadModels();

		const raytracerMat = new ShaderMaterial({
			shaderSource: 'raytracer',
			uniforms: {
				samplingParams: {
					numSamplesPerPixel: 1,// TODO: param
					accumulatedSamplesPerPixel: accumulatedSamplesPerPixel,// TODO: param
					numBounces: 5,// TODO: param
					clearAccumulatedSamples: 0,
				},
				camera: computeCamera(perspectiveCamera),
				//frameData: [mainCanvas.width!, mainCanvas.height!, 1, 0],
				commonUniforms: {
					seed: new Uint32Array([Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff,]),
					frameCounter: 0,
					maxBounces: 4,
					flatShading: 0,
					debugNormals: 0,
				},
				cameraUniforms: {
					viewportSize: new Uint32Array([WIDTH, HEIGHT]),
					imageWidth: WIDTH,
					imageHeight: HEIGHT,
					pixel00Loc: vec3.create(),// Fake value
					pixelDeltaU: vec3.create(),// Fake value
					pixelDeltaV: vec3.create(),// Fake value
					aspectRatio: WIDTH / HEIGHT,
					center: vec3.create(),// Fake value
					vfov: perspectiveCamera.getVerticalFov(),
					lookFrom: vec3.fromValues(0, 0, 2),
					lookAt: vec3.create(),
					vup: vec3.fromValues(0, 1, 0),
					defocusAngle: 0,
					focusDist: 3.4,
					defocusDiscU: vec3.create(),
					defocusDiscV: vec3.create(),
				},
			},
			storages: {
				raytraceImageBuffer: WIDTH * HEIGHT * 4 * 4,// 4 elements * 4 bytes per element
				rngStateBuffer: WIDTH * HEIGHT * 4,// 4 bytes per element
				skyState: {
					// TODO: do a proper Hosek-Wilkie computation
					params: new Float32Array([-1.146293, -0.19404611, 0.6892759, 0.9089986, -2.0779164, 0.68428886, 0.21258523, 1.7967614, 0.6864839, -1.1500875, -0.22125047, 0.3443094, 0.37174478, -0.9696021, 0.64278126, 0.11194256, 2.956004, 0.6878244, -1.2532278, -0.4073885, -1.0929729, 1.48517, -0.056945086, 0.46961704, 0.019326262, 2.5557024, 0.6794679]),
					radiances: new Float32Array([5.8619566, 5.681205, 4.7109914]),
					sunDirection: new Float32Array([0.9961947, 0.087155804, 0.0, 0.0]),
				},
				spheres,
				materials,
				faces: {
					value: faces,
					raw: true,
				},
				AABBs: {
					value: aabbs,
					raw: true,
				},
				textures,
				lights: new Uint32Array([1, 2, 3, 9]),
			},
			gpuConstants: {
				WORKGROUP_SIZE_X: COMPUTE_WORKGROUP_SIZE_X,
				WORKGROUP_SIZE_Y: COMPUTE_WORKGROUP_SIZE_Y,
				OBJECTS_COUNT_IN_SCENE: RayTracingScene.MODELS_COUNT,
				MAX_BVs_COUNT_PER_MESH: RayTracingScene.MAX_NUM_BVs_PER_MESH,
				MAX_FACES_COUNT_PER_MESH: RayTracingScene.MAX_NUM_FACES_PER_MESH,
			},
			workgroupSize: vec3.fromValues(COMPUTE_WORKGROUP_SIZE_X, COMPUTE_WORKGROUP_SIZE_Y, 1),
		});

		//new FullScreenQuad({ parent: scene, material: raytracerMat, });

		let pos = perspectiveCamera.getWorldPosition();


		const tempTexture = TextureManager.createTexture({
			webgpuDescriptor: {
				size: {
					width: WIDTH,
					height: HEIGHT,
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,

			}
		});

		let composer = new Composer();
		let clearPass = new ClearPass(vec4.fromValues(0.2, 0.2, 0.2, 1), 1, 0);
		let rayTracingPass = new RayTracingPass(scene, perspectiveCamera);
		rayTracingPass.material = raytracerMat;
		composer.addPass(clearPass);
		composer.addPass(rayTracingPass);
		/*
		const pixelatePass = new PixelatePass(perspectiveCamera);
		pixelatePass.horizontalTiles = 80;
		composer.addPass(pixelatePass);
		*/

		//const mainCanvas = Graphics.getCanvas('main_canvas')!;

		mainCanvas.useLayout = 'default';
		mainCanvas.addLayout(new CanvasLayout('default', [
			new CanvasView({ name: 'view', scene, composer }),
			//new CanvasView({ name: 'view', scene, composer, viewport: new Viewport({ width: 0.5, }) }),
			//new CanvasView({ name: 'view', scene, viewport: new Viewport({ x: 0.5, width: 0.5, }) }),
		]));

		GraphicsEvents.addEventListener(GraphicsEvent.Tick, (event: CustomEvent<GraphicTickEvent>) => {
			let pos2 = perspectiveCamera.getWorldPosition();
			if (pos[0] != pos2[0] || pos[1] != pos2[1] || pos[2] != pos2[2]) {
				reset();
			}
			pos = pos2;
			++accumulatedSamplesPerPixel;// TODO: increment by the sample per pixel value
			++frameId;// TODO: increment by the sample per pixel value
			//(raytracerMat.uniforms['samplingParams'] as Record<string, UniformValue>).accumulatedSamplesPerPixel = accumulatedSamplesPerPixel;
			//(raytracerMat.uniforms['samplingParams'] as Record<string, UniformValue>).clearAccumulatedSamples = clearAccumulatedSamples;
			(raytracerMat.uniforms['commonUniforms'] as Record<string, UniformValue>).frameCounter = frameId;
			//raytracerMat.uniforms['frameData'] = [mainCanvas.width!, mainCanvas.height!, frameId, 0];
			raytracerMat.uniforms['camera'] = computeCamera(perspectiveCamera);
			//raytracerMat.uniforms['outTexture'] = tempTexture;
			//raytracerMat.uniforms['outTexture'] = getCurrentTexture();
			raytracerMat.setDefine('OUTPUT_FORMAT', 'rgba8unorm'/*WebGPUInternal.format*/);
			//raytracerMat.storage.get('rngStateBuffer').value = null;

			clearAccumulatedSamples = 0;

			if (false && this.#renderFrames > 0) {
				Graphics.renderMultiCanvas(event.detail.delta, event.detail.context);
				raytracerMat.uniforms['outTexture'] = getCurrentTexture();
				Graphics.compute(raytracerMat, {
					width: WIDTH,
					height: HEIGHT,
				}, WIDTH, HEIGHT);

				--this.#renderFrames;
			}
		});

		function reset() {
			accumulatedSamplesPerPixel = 0;
			frameId = 0;
			clearAccumulatedSamples = 1;
		}
	}
}
registerDemo(RaytracingMeshesDemo);


class RayTracer {
	constructor() {

	}

}

function sphere(pos: vec3, radius: number, materialIdx: uint32): { centerAndPad: vec4, radius: number, materialIdx: uint32 } {
	return {
		centerAndPad: vec4.fromValues(pos[0], pos[1], pos[2], 0),
		radius,
		materialIdx,
	}
}

type GpuMaterial = {
	id: uint32,
	desc1: GpuTextureDescriptor,
	desc2: GpuTextureDescriptor,
	x: float32,
}

type GpuTextureDescriptor = {
	width: uint32,
	height: uint32,
	offset: uint32,
}

const emptyTexture: GpuTextureDescriptor = {
	width: 0,
	height: 0,
	offset: 0xffffffff,
}

let textures = new Float32Array();

function addToGlobalTextureData(texture: HdrImageData): GpuTextureDescriptor {
	const offset = textures.length / 3;
	const growth = texture.width * texture.height * 3;

	const old = textures;
	textures = new Float32Array(textures.length + growth);
	textures.set(old);
	textures.set(texture.data, old.length);

	return {
		width: texture.width,
		height: texture.height,
		offset,
	}
}

function lambertian(albedo: HdrImageData): GpuMaterial {
	return {
		id: 0,
		desc1: addToGlobalTextureData(albedo),
		desc2: emptyTexture,
		x: 0,
	}
}

function metal(albedo: HdrImageData, fuzz: number): GpuMaterial {
	return {
		id: 1,
		desc1: addToGlobalTextureData(albedo),
		desc2: emptyTexture,
		x: fuzz,
	}
}

function dielectric(refractionIndex: number): GpuMaterial {
	return {
		id: 2,
		desc1: emptyTexture,
		desc2: emptyTexture,
		x: refractionIndex,
	}
}

function checkerboard(even: HdrImageData, odd: HdrImageData,): GpuMaterial {
	return {
		id: 3,
		desc1: addToGlobalTextureData(even),
		desc2: addToGlobalTextureData(odd),
		x: 0,
	}
}

function emissive(emit: HdrImageData): GpuMaterial {
	return {
		id: 4,
		desc1: addToGlobalTextureData(emit),
		desc2: emptyTexture,
		x: 0,
	}
}

const spheres = [
	sphere(vec3.fromValues(0.0, -500.0, -1.0), 500.0, 0),
	// left row
	sphere(vec3.fromValues(-5.0, 1.0, -4.0), 1.0, 7),
	sphere(vec3.fromValues(0.0, 1.0, -4.0), 1.0, 8),
	sphere(vec3.fromValues(5.0, 1.0, -4.0), 1.0, 9),
	// middle row
	sphere(vec3.fromValues(-5.0, 1.0, 0.0), 1.0, 2),
	sphere(vec3.fromValues(0.0, 1.0, 0.0), 1.0, 3),
	sphere(vec3.fromValues(5.0, 1.0, 0.0), 1.0, 6),
	// right row
	sphere(vec3.fromValues(-5.0, 0.8, 4.0), 0.8, 1),
	sphere(vec3.fromValues(0.0, 1.2, 4.0), 1.2, 4),
	sphere(vec3.fromValues(5.0, 2.0, 4.0), 2.0, 5),
];

class HdrImageData {
	data: Float32Array;
	width: number;
	height: number;

	constructor(data: Float32Array, width: number, height: number) {
		this.data = data;
		this.width = width;
		this.height = height;
	}
}
/*
const materials = [
	{
		materialType: 0,
		reflectionRatio: 0,
		reflectionGloss: 1,
		refractionIndex: 1,
		albedo: vec3.fromValues(0.5, 0.5, 0.5),
	},
	checkerboard(
		new HdrImageData(new Float32Array([0.5, 0.7, 0.8]), 1, 1),
		new HdrImageData(new Float32Array([0.9, 0.9, 0.9]), 1, 1),
	),
	lambertian(
		await loadTexture('assets/textures/ldr/equirectangular/moon.jpeg'),
	),
	metal(
		new HdrImageData(new Float32Array([1, 0.85, 0.57]), 1, 1),
		0.4,
	),
	dielectric(
		1.5,
	),
	lambertian(
		await loadTexture('assets/textures/ldr/equirectangular/earth.jpg'),
	),
	emissive(
		await loadTexture('assets/textures/ldr/equirectangular/sun.jpeg', 50),
	),
	lambertian(
		new HdrImageData(new Float32Array([0.3, 0.9, 0.9]), 1, 1),
	),
	emissive(
		new HdrImageData(new Float32Array([50, 0., 0.]), 1, 1),
	),
	emissive(
		new HdrImageData(new Float32Array([0, 50., 0.]), 1, 1),
	),
	emissive(
		new HdrImageData(new Float32Array([0, 0., 50.]), 1, 1),
	),
];
*/

async function loadTexture(path: string, scale: number = 1): Promise<HdrImageData> {
	const img = new Image();
	img.src = path;
	await img.decode();
	const canvas = createElement('canvas', { width: img.naturalWidth, height: img.naturalHeight }) as HTMLCanvasElement;
	const context = canvas.getContext('2d')!;
	context.drawImage(img, 0, 0);
	const datas = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data;

	const texture = new Float32Array(img.naturalWidth * img.naturalHeight * 3);

	let k = 0;
	let l = 0;
	for (let j = 0; j < img.naturalHeight; ++j) {
		for (let i = 0; i < img.naturalWidth; ++i) {
			texture[k++] = datas[l++]! / 255 * scale;
			texture[k++] = datas[l++]! / 255 * scale;
			texture[k++] = datas[l++]! / 255 * scale;
			l++;
		}
	}

	return new HdrImageData(texture, img.naturalWidth, img.naturalHeight);
}


function computeCamera(perspectiveCamera: Camera) {
	const mainCanvas = Graphics.getCanvas('main_canvas')!;

	let lensRadius = 0.5 * perspectiveCamera.aperture;
	let aspect = mainCanvas.width! / mainCanvas.height!;
	let halfHeight = perspectiveCamera.focus * perspectiveCamera.getTanHalfVerticalFov();
	let halfWidth = aspect * halfHeight;

	const forwardVector = perspectiveCamera.getViewDirection();

	const w = vec3.normalize(forwardVector, forwardVector);
	const world_up = vec3.fromValues(0.0, 1.0, 0.0);

	const right = vec3.cross(vec3.create(), forwardVector, world_up);
	const upVector = vec3.cross(vec3.create(), right, forwardVector);

	const v = vec3.normalize(vec3.create(), upVector);
	const u = vec3.cross(vec3.create(), w, v);

	const lowerLeftCorner = perspectiveCamera.getWorldPosition();
	vec3.scaleAndAdd(lowerLeftCorner, lowerLeftCorner, w, perspectiveCamera.focus);
	vec3.scaleAndAdd(lowerLeftCorner, lowerLeftCorner, u, -halfWidth);
	vec3.scaleAndAdd(lowerLeftCorner, lowerLeftCorner, v, -halfHeight);

	const horizontal = vec3.scale(vec3.create(), u, 2 * halfWidth);
	const vertical = vec3.scale(vec3.create(), v, 2 * halfHeight);

	return {
		eye: perspectiveCamera.getPosition(),
		horizontal,
		vertical,
		u,
		v,
		lensRadius,
		lowerLeftCorner,
	};
}
