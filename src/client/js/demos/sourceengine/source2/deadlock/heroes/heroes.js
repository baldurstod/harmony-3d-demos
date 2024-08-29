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

	const htmlHeroList = HarmonyUi.createElement('div', {
		parent: document.getElementById('demo-content'),
		style: 'display: flex;flex-direction: column;',
	});

	for (const name in heroes) {
		const h = heroes[name];

		HarmonyUi.createElement('button', {
			parent: htmlHeroList,
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
		heroModel.remove();
	}

	heroModel = await AddSource2Model('deadlock', hero.model, renderer, scene);
	heroModel.playAnimation(hero.anim ?? 'idle_loadout');

	for (const item of items) {
		const itemModel = await AddSource2Model('dota2', item, renderer, heroModel);
		itemModel.playSequence('ACT_DOTA_IDLE');
	}
}


const heroes = {
	'Archer': {
		model: 'models/heroes_staging/archer/archer'
	}
	, 'Astro': {
		model: 'models/heroes_staging/astro/astro'
	}
	, 'Atlas detective': {
		model: 'models/heroes_staging/atlas_detective_v2/atlas_detective'
	}
	, 'Kelvin': {
		model: 'models/heroes_staging/kelvin/kelvin'
	}
	, 'Bebop': {
		model: 'models/heroes_staging/bebop/bebop'
	}
	, 'Cadence': {
		model: 'models/heroes_staging/cadence/cadence'
	}
	, 'Chrono': {
		model: 'models/heroes_staging/chrono/chrono'
	}
	, 'Digger': {
		model: 'models/heroes_staging/digger/digger'
	}
	, 'Engineer': {
		model: 'models/heroes_staging/engineer/engineer'
	}
	, 'Ghost': {
		model: 'models/heroes_staging/ghost/ghost'
	}
	, 'Gigawatt': {
		model: 'models/heroes_staging/gigawatt/gigawatt'
	}
	, 'gigawatt_prisoner': {
		model: 'models/heroes_staging/gigawatt_prisoner/gigawatt_prisoner'
	}
	, 'gunslinger': {
		model: 'models/heroes_staging/gunslinger/gunslinger'
	}
	, 'haze': {
		model: 'models/heroes_staging/haze/haze'
	}
	, 'haze_v2': {
		model: 'models/heroes_staging/haze_v2/haze'
	}
	, 'hornet': {
		model: 'models/heroes_staging/hornet_v3/hornet'
	}
	, 'inferno': {
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
	, 'lash': {
		model: 'models/heroes_staging/lash_v2/lash'
	}
	, 'mirage': {
		model: 'models/heroes_staging/mirage/mirage'
	}
	, 'nano': {
		model: 'models/heroes_staging/nano/nano_v2/nano'
	}
	, 'prof_dynamo': {
		model: 'models/heroes_staging/prof_dynamo/prof_dynamo'
	}
	, 'rutger': {
		model: 'models/heroes_staging/rutger/rutger',
		anim: 'primary_stand_idle'
	}
	, 'shiv': {
		model: 'models/heroes_staging/shiv/shiv'
	}
	, 'skymonk': {
		model: 'models/heroes_staging/skymonk/skymonk',
		anim: 'primary_stand_idle'
	}
	, 'slork': {
		model: 'models/heroes_staging/slork/slork',
		anim: 'primary_stand_idle'
	}
	, 'synth': {
		model: 'models/heroes_staging/synth/synth'
	}
	, 'tengu': {
		model: 'models/heroes_staging/tengu/tengu_v2/tengu',
		anim: 'primary_stand_idle'
	}
	, 'thumper': {
		model: 'models/heroes_staging/thumper/thumper',
		anim: 'primary_stand_idle'
	}
	, 'tokamak': {
		model: 'models/heroes_staging/tokamak/tokamak'
	}
	, 'vindicta': {
		model: 'models/heroes_staging/vindicta/vindicta',
		anim: 'primary_stand_idle'
	}
	, 'viscous': {
		model: 'models/heroes_staging/viscous/viscous'
	}
	, 'viscous_v2': {
		model: 'models/heroes_staging/viscous_v2/viscous'
	}
	, 'warden': {
		model: 'models/heroes_staging/warden/warden',
		anim: 'primary_stand_idle'
	}
	, 'wraith': {
		model: 'models/heroes_staging/wraith/wraith',
		anim: 'primary_stand_idle'
	}
	, 'wraith_gen_man': {
		model: 'models/heroes_staging/wraith_gen_man/wraith_gen_man',
		anim: 'primary_stand_idle'
	}
	, 'wraith_magician': {
		model: 'models/heroes_staging/wraith_magician/wraith_magician',
		anim: 'primary_stand_idle'
	}
	, 'wraith_puppeteer': {
		model: 'models/heroes_staging/wraith_puppeteer/wraith_puppeteer',
		anim: 'primary_stand_idle'
	}
	, 'wrecker': {
		model: 'models/heroes_staging/wrecker/wrecker'
	}
	, 'yakuza': {
		model: 'models/heroes_staging/yakuza/yakuza',
		anim: 'primary_stand_idle'
	}
	, 'yamato': {
		model: 'models/heroes_staging/yamato_v2/yamato'
	}
};
