import { InitDemoStd, Harmony3D } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testImportObj(renderer, scene);
}

async function testImportObj(renderer, scene) {
	perspectiveCamera.position = [700, 0, 100];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 10;

	let response = await fetch('./assets/models/obj/alfa147.obj');
	let objFile = await response.text();

	let mesh = Harmony3D.OBJImporter.load(objFile);

	scene.addChild(mesh);
}
