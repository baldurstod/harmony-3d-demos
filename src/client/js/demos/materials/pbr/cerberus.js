import { Harmony3D, GlMatrix, createPbrMaterial, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	ambientLight.intensity = 0.1;
	perspectiveCamera.position = [2, 0, 0];
	orbitCameraControl.target.position = [0, 0.35, 0];
	perspectiveCamera.farPlane = 1000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 50;
	renderer.clearColor(GlMatrix.vec4.fromValues(0.1, 0.1, 0.1, 255));

	let l = new Harmony3D.PointLight({ position: [0, -2 * 0, -0], intensity: 10, parent: perspectiveCamera });
	//new Harmony3D.Sphere({ parent: scene, radius: 1, material: createPbrMaterial('rustediron2'), segments: 32, rings: 32 });
	testCerberus(renderer, scene);
}

async function testCerberus(renderer, scene) {
	let response = await fetch('./assets/models/obj/cerberus.obj');
	let objFile = await response.text();

	let mesh = Harmony3D.OBJLoader.load(objFile);
	mesh.name = 'Cerberus';
	mesh.rotateX(Harmony3D.HALF_PI);
	mesh.material = createPbrMaterial('cerberus');

	scene.addChild(mesh);
}
