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
	const revolver = await AddSource2Model('cs2', 'weapons/models/revolver/weapon_pist_revolver.vmdl_c', renderer, scene);
	console.info(revolver);
}
