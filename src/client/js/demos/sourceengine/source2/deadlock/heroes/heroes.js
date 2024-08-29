import { AddSource2Model, InitDemoStd, Harmony3D, HarmonyUi, GlMatrix } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
let heroModel;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	ambientLight.intensity = 0.1;
	renderer.clearColor(GlMatrix.vec4.fromValues(0., 0., 0., 255));
	scene.addChild(new Harmony3D.PointLight({ position: [50, -10, 60], intensity: 10000 }));

	let htmlHeroListReleased;
	let htmlHeroListStaging;
	const htmlHeroList = HarmonyUi.createElement('div', {
		parent: document.getElementById('demo-content'),
		style: 'display: flex;flex-direction: column;',
		childs: [
			htmlHeroListReleased = HarmonyUi.createElement('div', {
				style: 'display: flex;flex-direction: column;',
				child: HarmonyUi.createElement('div', {
					innerText: 'Released heroes',
				}),
			}),
			htmlHeroListStaging = HarmonyUi.createElement('div', {
				style: 'display: flex;flex-direction: column;',
				child: HarmonyUi.createElement('div', {
					innerText: 'Shelved heroes',
				}),
			}),
		]
	});

	// Sort by name
	const ordered = Object.keys(heroes).sort().reduce((obj, key) => { obj[key] = heroes[key]; return obj; }, {});
	for (const name in ordered) {
		const h = heroes[name];

		HarmonyUi.createElement('button', {
			parent: h.released ? htmlHeroListReleased : htmlHeroListStaging,
			innerText: name,
			events: {
				click: () => testHero(renderer, scene, h),
			}
		});
	}
}

async function testHero(renderer, scene, hero) {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	const items = [
	]

	if (heroModel) {
		heroModel.setVisible(false);
	}

	heroModel = await AddSource2Model('deadlock', hero.model, renderer, scene);
	heroModel.playAnimation(hero.anim ?? 'idle_loadout');

	for (const item of items) {
		const itemModel = await AddSource2Model('dota2', item, renderer, heroModel);
		itemModel.playSequence('ACT_DOTA_IDLE');
	}
}


const heroes = {
	'Grey Talon': {
		model: 'models/heroes_staging/archer/archer',
		released: true
	}
	, 'Astro': {
		model: 'models/heroes_staging/astro/astro'
	}
	, 'Abrams': {
		model: 'models/heroes_staging/atlas_detective_v2/atlas_detective',
		released: true
	}
	, 'Kelvin': {
		model: 'models/heroes_staging/kelvin/kelvin',
		released: true
	}
	, 'Bebop': {
		model: 'models/heroes_staging/bebop/bebop',
		released: true
	}
	, 'Cadence': {
		model: 'models/heroes_staging/cadence/cadence'
	}
	, 'Paradox': {
		model: 'models/heroes_staging/chrono/chrono',
		released: true
	}
	, 'Mo & Krill': {
		model: 'models/heroes_staging/digger/digger',
		released: true
	}
	, 'Mc Ginnis': {
		model: 'models/heroes_staging/engineer/engineer',
		released: true
	}
	, 'Lady Geist': {
		model: 'models/heroes_staging/ghost/ghost',
		released: true
	}
	, 'Seven': {
		model: 'models/heroes_staging/gigawatt/gigawatt',
		released: true
	}
	, 'Seven prisoner': {
		model: 'models/heroes_staging/gigawatt_prisoner/gigawatt_prisoner',
		released: true
	}
	, 'gunslinger': {
		model: 'models/heroes_staging/gunslinger/gunslinger'
	}
	, 'Haze': {
		model: 'models/heroes_staging/haze/haze',
		released: true
	}
	, 'haze_v2': {
		model: 'models/heroes_staging/haze_v2/haze'
	}
	, 'Infernus': {
		model: 'models/heroes_staging/inferno_v4/inferno',
		anim: 'primary_stand_gun_forward_idle'
	}
	, 'kali': {
		model: 'models/heroes_staging/kali/kali',
		anim: 'primary_stand_idle'
	}
	, 'kelvin': {
		model: 'models/heroes_staging/kelvin/kelvin'
	}
	, 'kelvin_explorer': {
		model: 'models/heroes_staging/kelvin_explorer/kelvin_explorer_shape'
	}
	, 'kelvin_v2': {
		model: 'models/heroes_staging/kelvin_v2/kelvin'
	}
	, 'Lash': {
		model: 'models/heroes_staging/lash_v2/lash',
		released: true
	}
	, 'mirage': {
		model: 'models/heroes_staging/mirage/mirage'
	}
	, 'nano': {
		model: 'models/heroes_staging/nano/nano_v2/nano'
	}
	, 'Dynamo': {
		model: 'models/heroes_staging/prof_dynamo/prof_dynamo'
	}
	, 'rutger': {
		model: 'models/heroes_staging/rutger/rutger',
		anim: 'primary_stand_idle'
	}
	, 'Shiv': {
		model: 'models/heroes_staging/shiv/shiv',
		released: true
	}
	, 'skymonk': {
		model: 'models/heroes_staging/skymonk/skymonk',
		anim: 'primary_stand_idle'
	}
	, 'slork': {
		model: 'models/heroes_staging/slork/slork',
		anim: 'primary_stand_idle'
	}
	, 'Pocket': {
		model: 'models/heroes_staging/synth/synth',
		released: true
	}
	, 'Ivy': {
		model: 'models/heroes_staging/tengu/tengu_v2/tengu',
		anim: 'primary_stand_idle',
		released: true
	}
	, 'thumper': {
		model: 'models/heroes_staging/thumper/thumper',
		anim: 'primary_stand_idle'
	}
	, 'tokamak': {
		model: 'models/heroes_staging/tokamak/tokamak'
	}
	, 'Vindicta': {
		model: 'models/heroes_staging/hornet_v3/hornet',
		anim: 'primary_stand_idle',
		released: true
	}
	, 'Viscous': {
		model: 'models/heroes_staging/viscous/viscous',
		released: true
	}
	, 'viscous_v2': {
		model: 'models/heroes_staging/viscous_v2/viscous'
	}
	, 'Warden': {
		model: 'models/heroes_staging/warden/warden',
		anim: 'primary_stand_idle',
		released: true
	}
	, 'Wraith': {
		model: 'models/heroes_staging/wraith/wraith',
		anim: 'primary_stand_idle',
		released: true
	}
	, 'Wraith 2': {
		model: 'models/heroes_staging/wraith_gen_man/wraith_gen_man',
		anim: 'primary_stand_idle',
		released: true
	}
	, 'Wraith magician': {
		model: 'models/heroes_staging/wraith_magician/wraith_magician',
		anim: 'primary_stand_idle',
		released: true
	}
	, 'Wraith puppeteer': {
		model: 'models/heroes_staging/wraith_puppeteer/wraith_puppeteer',
		anim: 'primary_stand_idle',
		released: true
	}
	, 'wrecker': {
		model: 'models/heroes_staging/wrecker/wrecker'
	}
	, 'yakuza': {
		model: 'models/heroes_staging/yakuza/yakuza',
		anim: 'primary_stand_idle'
	}
	, 'Yamato': {
		model: 'models/heroes_staging/yamato_v2/yamato',
		released: true
	}
};
