import { AddSource2Model, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testModel(renderer, scene);
}

async function testModel(renderer, scene) {
	perspectiveCamera.position = [0, 130, -15];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;
	const ak47 = await AddSource2Model('cs2', 'weapons/models/ak47/weapon_rif_ak47', renderer, scene);
	console.info(ak47);
}
