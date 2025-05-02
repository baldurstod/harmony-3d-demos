import { AddSource2Model, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testModel(renderer, scene);
}

async function testModel(renderer, scene) {
	perspectiveCamera.position = [500, 0, 150];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;
	let antimage = await AddSource2Model('dota2', 'models/heroes/antimage/antimage', renderer, scene);
	antimage.playSequence('ACT_DOTA_RUN');
}
