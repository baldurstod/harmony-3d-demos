import { AddSource2Model, InitDemoStd } from '/js/application.js';


let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testItem(renderer, scene);
}

async function testItem(renderer, scene) {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	const item = await AddSource2Model('dota2', 'models/items/dark_willow/dark_willow_ether_head/dark_willow_ether_head', renderer, scene);
	item.playSequence('ACT_DOTA_LOADOUT');
}
