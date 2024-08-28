import { AddSource2Model, InitDemoStd, Harmony3D, HarmonyUi } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
let hero
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	ambientLight.intensity = 0.1;
	//testHero(renderer, scene);
	scene.addChild(new Harmony3D.PointLight({ position: [50, -10, 60], intensity: 10000 }));

	for (const name in heroes) {
		const path = heroes[name];

		HarmonyUi.createElement('button', {
			parent: document.getElementById('demo-content'),
			innerText: name,
			events: {
				click: () => testHero(renderer, scene, path),
			}
		});
	}
}

async function testHero(renderer, scene, path) {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;


	const items = [
	]

	if (hero) {
		hero.remove();
	}

	hero = await AddSource2Model('deadlock', path, renderer, scene);
	hero.playAnimation('idle_loadout');

	for (const item of items) {
		const itemModel = await AddSource2Model('dota2', item, renderer, hero);
		itemModel.playSequence('ACT_DOTA_IDLE');
	}
}


const heroes = {
	'Archer': 'models/heroes_staging/archer/archer'
	, 'Astro': 'models/heroes_staging/astro/astro'
	, 'Atlas detective': 'models/heroes_staging/atlas_detective_v2/atlas_detective'
	, 'Kelvin': 'models/heroes_staging/kelvin/kelvin'
	, 'Bebop': 'models/heroes_staging/bebop/bebop'
	, 'Cadence': 'models/heroes_staging/cadence/cadence'
	, 'Chrono': 'models/heroes_staging/chrono/chrono'
	, 'Digger': 'models/heroes_staging/digger/digger'
	, 'Engineer': 'models/heroes_staging/engineer/engineer'
	, 'Ghost': 'models/heroes_staging/ghost/ghost'
	, 'Gigawatt': 'models/heroes_staging/gigawatt/gigawatt'
	, 'gigawatt_prisoner': 'models/heroes_staging/gigawatt_prisoner/gigawatt_prisoner'
};
