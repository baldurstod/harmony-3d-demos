import { AddSource2Model, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testHero(renderer, scene);
}

async function testHero(renderer, scene) {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	const items = [
	]

	const hero = await AddSource2Model('deadlock', 'models/heroes_staging/archer/archer', renderer, scene);
	hero.playSequence('ACT_DOTA_IDLE');

	for (const item of items) {
		const itemModel = await AddSource2Model('dota2', item, renderer, hero);
		itemModel.playSequence('ACT_DOTA_IDLE');
	}
}
