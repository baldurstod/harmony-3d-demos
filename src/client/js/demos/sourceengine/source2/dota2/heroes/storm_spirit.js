import { AddSource2Model } from '/js/source2.js';
import { InitDemoStd } from '/js/utils.js';

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
		'models/heroes/storm_spirit/storm_hat',
		'models/heroes/storm_spirit/storm_shoulder',
		'models/heroes/storm_spirit/storm_shirt',
	]

	const hero = await AddSource2Model('dota2', 'models/heroes/storm_spirit/storm_spirit', renderer, scene);
	hero.playSequence('ACT_DOTA_IDLE');

	for (const item of items) {
		const itemModel = await AddSource2Model('dota2', item, renderer, hero);
		itemModel.playSequence('ACT_DOTA_IDLE');
	}
}
