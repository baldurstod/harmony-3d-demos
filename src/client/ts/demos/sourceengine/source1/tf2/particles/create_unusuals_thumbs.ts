//import { Harmony3D.KeepOnlyLastChild, Graphics, Harmony3D.ColorBackground } from '../../../../../dist/harmony-3d.browser.js';
import { AddSource1Model, GlMatrix, Harmony3D, HarmonyBrowserUtils, HarmonyUtils, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let heavy;
let scout;
export function initDemo(renderer, scene, { htmlDemoContentTab }) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	renderUnusuals(renderer, scene, htmlDemoContentTab);
}

const THUMB_SIZE = 256;

async function renderUnusuals(renderer, scene, demoContentTab) {
	perspectiveCamera.position = [100, 0, 50];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 1000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 50;

	heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	heavy.visible = false;
	heavy.playSequence('ref');
	scout = await AddSource1Model('tf2', 'models/player/scout', renderer, scene);
	scout.visible = false;
	scout.playSequence('stand_PRIMARY');

	//rgb(52, 113, 255)
	//rgb(38, 62, 117);
	renderer.clearColor(GlMatrix.vec4.fromValues(0.5, 0.5, 0.5, 1.0));
	renderer.clearColor(GlMatrix.vec4.fromValues(38 / 256, 62 / 256, 117 / 256, 1.0));
	renderer.clearColor(GlMatrix.vec4.fromValues(0x13 / 256, 0x38 / 256, 0x5D / 256, 1.0));

	// Dark color
	scene.background = new Harmony3D.ColorBackground({ color: GlMatrix.vec4.fromValues(0x21 / 255, 0x25 / 255, 0x2b / 255, 1.0) });
	scene.background = new Harmony3D.ColorBackground({ color: GlMatrix.vec4.fromValues(49 / 255, 51 / 255, 56 / 255, 1.0) });

	// Light color
	//scene.background = new Harmony3D.ColorBackground({ color: GlMatrix.vec4.fromValues(222 / 256, 218 / 256, 212 / 256, 1.0) });

	renderer.autoResize = false;
	renderer.setSize(THUMB_SIZE, THUMB_SIZE);

	let start = Date.now() / 1000;
	await renderUnusualList(EffectList, scene.addChild(new Harmony3D.KeepOnlyLastChild()), scene, demoContentTab);
	//await renderUnusualList(KillstreakList, scene.addChild(new Harmony3D.KeepOnlyLastChild()), scene, demoContentTab);
	//await renderUnusualList(UnusualTauntList, scene.addChild(new Harmony3D.KeepOnlyLastChild()), scene, demoContentTab);
	let end = Date.now() / 1000;

	console.log(`Finished in ${Math.round(end - start)}s`)
}


async function renderUnusualList(list, parent, scene, demoContentTab) {
	const ONE_BIG_PICTURE = false;
	let canvas = document.createElement('canvas');
	//document.getElementById('demo-content').append(canvas);
	demoContentTab.append(canvas);

	canvas.width = THUMB_SIZE;
	if (ONE_BIG_PICTURE) {
		canvas.height = THUMB_SIZE * list.length;
	} else {
		canvas.height = THUMB_SIZE;
	}

	let ctx = canvas.getContext('2d');

	let dy = 0;
	for (const unusual of list) {
		console.error('Rendering ' + unusual.system);
		await renderUnusual(unusual, parent, scene);

		Harmony3D.Graphics.savePicture(scene, perspectiveCamera, `${unusual.system}.webp`, THUMB_SIZE, THUMB_SIZE, 'image/webp', 1.0);
		/*
			ctx.drawImage(new Harmony3D.Graphics().getCanvas(), 0, dy, THUMB_SIZE, THUMB_SIZE);
			if (ONE_BIG_PICTURE) {
				dy += THUMB_SIZE;
			} else {
				canvas.toBlob((blob) => HarmonyBrowserUtils.saveFile(new File([blob], `${unusual.system}.webp`)), 'image/webp', 1.0);
			}
		*/
	}
}

async function renderUnusual(unusual, parent, scene) {
	perspectiveCamera.position = GlMatrix.vec3.add(GlMatrix.vec3.create(), unusual.position ?? [100, 0, 0], [0, 0, unusual.isTaunt ? 0 : 80]);
	perspectiveCamera.verticalFov = unusual.fov ?? 30;
	orbitCameraControl.target.position = GlMatrix.vec3.add(GlMatrix.vec3.create(), unusual.target ?? [100, 0, 0], [0, 0, unusual.isTaunt ? 0 : 80]);

	if (unusual.upVector) {
		orbitCameraControl.upVector = unusual.upVector;
	} else {
		orbitCameraControl.upVector = [0, 0, 1];
	}
	let sys2;
	let sys = await Harmony3D.Source1ParticleControler.createSystem('tf2', unusual.system);
	sys.start();
	parent.addChild(sys);


	if (!unusual.isKillstreak) {
		sys.getControlPoint(0).position = [0, 0, 80];
	}

	if (unusual.setQuaternion) {
		sys.getControlPoint(0).quaternion = [-1, 0, 0, 1];
	}

	if (unusual.isTaunt) {
		sys.getControlPoint(0).position = [0, 0, 0];
		scout.addChild(sys.getControlPoint(0));
		sys.reset();
	}

	if (unusual.isKillstreak) {
		sys2 = await Harmony3D.Source1ParticleControler.createSystem('tf2', unusual.system);
		sys2.start();
		scene.addChild(sys2);
		sys.getControlPoint(9).position = [1, 111 / 255, 5 / 255];
		sys2.getControlPoint(9).position = [1, 111 / 255, 5 / 255];

		heavy.getAttachement('eyeglow_R').addChild(sys.getControlPoint(0));
		heavy.getAttachement('eyeglow_L').addChild(sys2.getControlPoint(0));
	}

	await HarmonyUtils.setTimeoutPromise(unusual.wait ?? 5000);
	sys.stop();
	if (sys2) {
		sys2.stop();
		sys2.remove();
	}
}


const EffectList = [
	/*
	{system:'superrare_confetti_green', name:'Green Confetti', fov:60, position:[30, 0, 0], target:[0, 0, 0], wait:2200},
	{system:'superrare_confetti_purple', name:'Purple Confetti', fov:60, position:[30, 0, 0], target:[0, 0, 0], wait:2200},
	{system:'superrare_ghosts', name:'Haunted Ghosts', fov:50, position:[30, 0, 0], target:[0, 0, 0], wait:1500},
	{system:'superrare_greenenergy', name:'Green Energy', fov:50, position:[30, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'superrare_purpleenergy', name:'Purple Energy', fov:50, position:[30, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'superrare_circling_tf', name:'Circling TF Logo', fov:50, position:[30, 30, 0], target:[0, 0, 0], wait:1000},
	{system:'superrare_burning1', name:'Burning Flames', fov:50, position:[30, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'superrare_burning2', name:'Scorching Flames', fov:50, position:[30, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'superrare_plasma1', name:'Searing Plasma', fov:50, position:[30, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'superrare_plasma2', name:'Vivid Plasma', fov:50, position:[30, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'superrare_beams1', name:'Sunbeams', fov:70, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'superrare_circling_peacesign', name:'Circling Peace Sign', fov:50, position:[30, 30, 0], target:[0, 0, 0], wait:1000},
	{system:'superrare_circling_heart', name:'Circling Heart', fov:50, position:[30, 30, 0], target:[0, 0, 0], wait:1000},
	{system:'superrare_flies', name:'Massed Flies', fov:50, position:[50, 0, 0], target:[0, 0, 0], wait:2000},
	{system:'unusual_storm', name:'Stormy Storm', fov:50, position:[50, 0, 0], target:[0, 0, 20], wait:5120},
	{system:'unusual_blizzard', name:'Blizzardy Storm', fov:50, position:[50, 0, 0], target:[0, 0, 15], wait:6000},
	{system:'unusual_orbit_nutsnbolts', name:'Nuts n\' Bolts', fov:40, position:[50, 0, 20], target:[0, 0, 5], wait:2000},
	{system:'unusual_orbit_planets', name:'Orbiting Planets', fov:40, position:[50, 0, 20], target:[0, 0, 5], wait:2000},
	{system:'unusual_orbit_fire', name:'Orbiting Fire', fov:40, position:[50, 0, 20], target:[0, 0, 15], wait:2000},
	{system:'unusual_bubbles', name:'Bubbling', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_smoking', name:'Smoking', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_steaming', name:'Steaming', fov:40, position:[50, 0, 0], target:[0, 0, 0], wait:1000},
	{system:'unusual_orbit_jack_flaming', name:'Flaming Lantern', fov:50, position:[50, 0, 20], target:[0, 0, 15], wait:1000},
	{system:'unusual_fullmoon_cloudy', name:'Cloudy Moon', fov:50, position:[30, 0, 0], target:[0, 0, 20], wait:1500},
	{system:'unusual_bubbles_green', name:'Cauldron Bubbles', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_orbit_fire_dark', name:'Eerie Orbiting Fire', fov:40, position:[50, 0, 20], target:[0, 0, 15], wait:2000},
	{system:'unusual_storm_knives', name:'Knifestorm', fov:60, position:[50, 0, 0], target:[0, 0, 15], wait:5700},
	{system:'unusual_skull_misty', name:'Misty Skull', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:4000},
	{system:'unusual_fullmoon_cloudy_green', name:'Harvest Moon', fov:40, position:[30, 0, 0], target:[0, 0, 20], wait:1200},
	{system:'unusual_fullmoon_cloudy_secret', name:'It\'s A Secret To Everybody', fov:40, position:[30, 0, 0], target:[0, 0, 20], wait:10000},
	{system:'unusual_storm_spooky', name:'Stormy 13th Hour', fov:50, position:[50, 0, 0], target:[0, 0, 20], wait:5120},
	{system:'unusual_zap_yellow', name:'Kill-a-Watt', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_zap_green', name:'Terror-Watt', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_hearts_bubbling', name:'Cloud 9', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_orbit_cards_teamcolor_red', name:'Aces High (RED)', fov:50, position:[50, 0, 20], target:[0, 0, 5], wait:2000},
	{system:'unusual_orbit_cards_teamcolor_blue', name:'Aces High (BLU)', fov:50, position:[50, 0, 20], target:[0, 0, 5], wait:2000},
	{system:'unusual_orbit_cash', name:'Dead Presidents', fov:50, position:[50, 0, 20], target:[0, 0, 10], wait:1000},
	{system:'unusual_crisp_spotlights', name:'Miami Nights', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_spotlights', name:'Disco Beat Down', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_robot_holo_glow_green', name:'Phosphorous', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_robot_holo_glow_orange', name:'Sulphurous', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_robot_orbit_binary', name:'Memory Leak', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_robot_orbit_binary2', name:'Overclocked', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_robot_radioactive', name:'Anti-Freeze', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_robot_radioactive2', name:'Roboactive', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_robot_time_warp', name:'Time Warp', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'unusual_robot_time_warp2', name:'Green Black Hole', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'unusual_robot_orbiting_sparks', name:'Electrostatic', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_robot_orbiting_sparks2', name:'Power Surge', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_spellbook_circle_green', name:'Arcana', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_spellbook_circle_purple', name:'Spellbound', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_bats_flaming_proxy_green', name:'Chiroptera Venenata', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_bats_flaming_proxy_purple', name:'Poisoned Shadows', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_bats_flaming_proxy_orange', name:'Something Burning This Way Comes', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_meteor_shower_parent_orange', name:'Hellfire', fov:40, position:[50, 0, 50], target:[0, 0, 20], wait:1000},
	{system:'unusual_meteor_shower_parent_purple', name:'Darkblaze', fov:40, position:[50, 0, 50], target:[0, 0, 20], wait:1000},
	{system:'unusual_meteor_shower_parent_green', name:'Demonflame', fov:40, position:[50, 0, 50], target:[0, 0, 20], wait:1000},
	{system:'unusual_tentmonster_purple_parent', name:'Bonzo The All-Gnawing', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:1000},
	{system:'unusual_eyes_purple_parent', name:'Amaranthine', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:1500},
	{system:'unusual_eyes_orange_parent', name:'Stare From Beyond', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:1500},
	{system:'unusual_eyes_green_parent', name:'The Ooze', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:1500},
	{system:'unusual_souls_purple_parent', name:'Ghastly Ghosts Jr.', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:2000},
	{system:'unusual_souls_green_parent', name:'Haunted Phantasm Jr.', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:2000},
	{system:'unusual_eotl_frostbite', name:'Frostbite', fov:40, position:[50, 0, 0], target:[0, 0, 15], wait:2000},
	{system:'unusual_eotl_sunrise', name:'Morning Glory', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:1000},
	{system:'unusual_eotl_sunset', name:'Death at Dusk', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:1000},
	{system:'unusual_eotl_oribiting_burning_duck_parent', name:'Molten Mallard', fov:50, position:[50, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'unusual_invasion_abduction', name:'Abduction', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_invasion_atomic', name:'Atomic', fov:40, position:[50, 0, 30], target:[0, 0, 0], wait:2000},
	{system:'unusual_invasion_atomic_green', name:'Subatomic', fov:40, position:[50, 0, 30], target:[0, 0, 0], wait:2000},
	{system:'unusual_invasion_boogaloop', name:'Electric Hat Protector', fov:30, position:[50, 0, 30], target:[0, 0, 7], wait:2000},
	{system:'unusual_invasion_boogaloop_2', name:'Magnetic Hat Protector', fov:30, position:[50, 0, 30], target:[0, 0, 7], wait:2000},
	{system:'unusual_invasion_boogaloop_3', name:'Voltaic Hat Protector', fov:30, position:[50, 0, 30], target:[0, 0, 7], wait:2000},
	{system:'unusual_invasion_codex', name:'Galactic Codex', fov:30, position:[50, 0, 20], target:[0, 0, 10], wait:2000},
	{system:'unusual_invasion_codex_2', name:'Ancient Codex', fov:30, position:[50, 0, 20], target:[0, 0, 10], wait:2000},
	{system:'unusual_invasion_nebula', name:'Nebula', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000},
	{system:'unusual_hw_deathbydisco_parent', name:'Death by Disco', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:2000},
	{system:'unusual_mystery_parent', name:'It\'s a mystery to everyone', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_mystery_parent_green', name:'It\'s a puzzle to me', fov:40, position:[50, 0, 30], target:[0, 0, 10], wait:1000},
	{system:'unusual_nether_blue', name:'Ether Trail', fov:25, position:[50, 50, 0], target:[0, 0, 15], wait:1000},
	{system:'unusual_nether_pink', name:'Nether Trail', fov:25, position:[50, 50, 0], target:[0, 0, 15], wait:1000},
	{system:'unusual_eldritch_flames_orange', name:'Eldrich Flame', fov:40, position:[50, 0, 0], target:[0, 0, 15], wait:6000},
	{system:'unusual_eldritch_flames_purple', name:'Ancient Eldrich', fov:40, position:[50, 0, 0], target:[0, 0, 15], wait:6000},
	{system:'unusual_universe', name:'Neutron Star', fov:30, position:[50, 0, 50], target:[0, 0, 12], wait:1000},
	{system:'unusual_tesla_flash', name:'Tesla Coil', fov:30, position:[50, 0, 50], target:[0, 0, 12], wait:2500},
	{system:'unusual_star_green_parent', name:'Starstorm Insomnia', fov:30, position:[50, 0, 50], target:[0, 0, 15], wait:2000},
	{system:'unusual_star_purple_parent', name:'Starstorm Slumber', fov:30, position:[50, 0, 50], target:[0, 0, 15], wait:2000},
	{system:'unusual_bubble_mess_parent_green', name:'Brain Drain', fov:30, position:[50, 0, 0], target:[0, 0, 12], wait:2000},
	{system:'unusual_bubble_mess_parent_orange', name:'Open Mind', fov:30, position:[50, 0, 0], target:[0, 0, 12], wait:2000},
	{system:'unusual_bubble_mess_parent_purple', name:'Head of Steam', fov:30, position:[50, 0, 0], target:[0, 0, 12], wait:2000},
	{system:'unusual_constellations_blue', name:'Head of Steam', fov:30, position:[50, 0, 50], target:[0, 0, 20], wait:2000},
	{system:'unusual_constellations_pink', name:'The Eldritch Opening', fov:30, position:[50, 0, 50], target:[0, 0, 20], wait:2000},
	{system:'unusual_constellations_purple', name:'The Dark Doorway', fov:30, position:[50, 0, 50], target:[0, 0, 20], wait:2000},
	{system:'unusual_symbols_parent_fire', name:'Ring of Fire', fov:35, position:[50, 0, 50], target:[0, 0, 10], wait:2000},
	{system:'unusual_symbols_parent_dead', name:'Vicious Circle', fov:35, position:[50, 0, 50], target:[0, 0, 10], wait:2000},
	{system:'unusual_symbols_parent_lightning', name:'White Lightning', fov:35, position:[50, 0, 50], target:[0, 0, 10], wait:2000},
	{system:'unusual_crystalball', name:'Omniscient Orb', fov:30, position:[40, 0, 0], target:[0, 0, 17], wait:10000},
	{system:'unusual_psychic_eye', name:'Clairvoyance', fov:35, position:[50, 0, 0], target:[0, 0, 22], wait:1000},
	{system:'unusual_dimension_parent', name:'Fifth Dimension', fov:50, position:[50, 0, 0], target:[0, 0, 15], wait:15000},
	{system:'unusual_aura_purple_parent', name:'Vicious Vortex', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:4000},
	{system:'unusual_aura_green_parent', name:'Menacing Miasma', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:4000},
	{system:'unusual_aura_red_parent', name:'Abyssal Aura', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:5000},
	{system:'unusual_forest_scene_parent_purple', name:'Wicked Wood', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'unusual_forest_scene_parent_green', name:'Ghastly Grove', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'unusual_magicsmoke_purple_parent', name:'Mystical Medley', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:1000},
	{system:'unusual_magicsmoke_green_parent', name:'Ethereal Essence', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:1000},
	{system:'unusual_magicsmoke_blue_parent', name:'Twisted Radiance', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:1000},
	{system:'unusual_vortex_energy_parent_p', name:'Violet Vortex', fov:30, position:[40, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_vortex_energy_parent_g', name:'Verdant Vortex', fov:30, position:[40, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_vortex_energy_parent_o', name:'Valiant Vortex', fov:30, position:[40, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_sparkling_lights_parent02', name:'Sparkling Lights', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_icecave_parent', name:'Frozen Icefall', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:5000},
	{system:'unusual_aurora_parent_green', name:'Fragmented Gluons', fov:35, position:[50, 0, 50], target:[0, 0, 15], wait:1000},
	{system:'unusual_aurora_parent_orange', name:'Fragmented Quarks', fov:35, position:[50, 0, 50], target:[0, 0, 15], wait:1000},
	{system:'unusual_aurora_parent_purple', name:'Fragmented Photons', fov:35, position:[50, 0, 50], target:[0, 0, 15], wait:1000},
	{system:'unusual_polygon_teamcolor_red', name:'Defragmenting Reality (RED)', fov:25, position:[50, 0, 0], target:[0, 0, 7], wait:1000},
	{system:'unusual_polygon_teamcolor_blue', name:'Defragmenting Reality (BLU)', fov:25, position:[50, 0, 0], target:[0, 0, 7], wait:1000},
	{system:'unusual_polygon_green', name:'Fragmenting Reality', fov:25, position:[50, 0, 0], target:[0, 0, 7], wait:1000},
	{system:'unusual_polygon_amber', name:'Refragmenting Reality', fov:25, position:[50, 0, 0], target:[0, 0, 7], wait:1000},
	{system:'unusual_snowfall_blue', name:'Snowfallen', fov:25, position:[50, 0, 0], target:[0, 0, 15], wait:1500},
	{system:'unusual_snowfall_white', name:'Snowblinded', fov:25, position:[50, 0, 0], target:[0, 0, 15], wait:1500},
	{system:'unusual_mayor_balloonicorn_teamcolor_red', name:'Pyroland Daydream (RED)', fov:40, position:[50, 0, 50], target:[0, 0, 10], wait:1500},
	{system:'unusual_mayor_balloonicorn_teamcolor_blue', name:'Pyroland Daydream (BLU)', fov:40, position:[50, 0, 50], target:[0, 0, 10], wait:1500},
	{system:'unusual_circling_spell_green_parent', name:'Verdatica', fov:40, position:[50, 0, 50], target:[0, 0, 7], wait:1500},
	{system:'unusual_circling_spell_orange_parent', name:'Aromatica', fov:40, position:[50, 0, 50], target:[0, 0, 7], wait:1500},
	{system:'unusual_circling_spell_purple_parent', name:'Chromatica', fov:40, position:[50, 0, 50], target:[0, 0, 7], wait:1500},
	{system:'unusual_circling_spell_blue_parent', name:'Prismatica', fov:40, position:[50, 0, 50], target:[0, 0, 7], wait:1500},
	{system:'unusual_bees', name:'Bee Swarm', fov:50, position:[50, 0, 0], target:[0, 0, 0], wait:4000},
	{system:'unusual_playflies_green_parent', name:'Frisky Fireflies', fov:50, position:[50, 0, 10], target:[0, 0, 10], wait:2000},
	{system:'unusual_playflies_orange_parent', name:'Smoldering Spirits', fov:50, position:[50, 0, 10], target:[0, 0, 10], wait:2000},
	{system:'unusual_playflies_purple_parent', name:'Wandering Wisps', fov:50, position:[50, 0, 10], target:[0, 0, 10], wait:2000},
	{system:'unusual_kaleido_scope_parent', name:'Kaleidoscope', fov:30, position:[50, 0, 0], target:[0, 0, 0], wait:2000},
	{system:'unusual_face_parent_G', name:'Green Giggler', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:4000},
	{system:'unusual_face_parent_O', name:'Laugh-O-Lantern', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:4000},
	{system:'unusual_face_parent_P', name:'Plum Prankster', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:4000},
	{system:'unusual_undead_mayor_balloonicorn', name:'Pyroland Nightmare', fov:40, position:[50, 0, 50], target:[0, 0, 10], wait:1500},
	{system:'unusual_gargoyle', name:'Gravelly Ghoul', fov:25, position:[50, 0, 0], target:[0, 0, 12], wait:2000},
	{system:'unusual_gargoyle2', name:'Vexed Volcanics', fov:25, position:[50, 0, 0], target:[0, 0, 12], wait:2000},
	{system:'unusual_candy_parent', name:'Gourdian Angel', fov:20, position:[50, 0, 0], target:[0, 0, 15], wait:1000},
	{system:'unusual_pumpkinhead_parent', name:'Pumpkin Party', fov:40, position:[50, 0, 0], target:[0, 0, 12], wait:1500},
	{system:'unusual_froststorm_blue_parent', name:'Frozen Fractals', fov:30, position:[50, 0, 0], target:[0, 0, 12], wait:6000},
	{system:'unusual_froststorm_purple_parent', name:'Lavender Landfall', fov:30, position:[50, 0, 0], target:[0, 0, 12], wait:6000},
	{system:'unusual_froststorm_yellow_parent', name:'Special Snowfall', fov:30, position:[50, 0, 0], target:[0, 0, 12], wait:6000},
	{system:'unusual_swirlybeams_goldpurple_parent', name:'Divine Desire', fov:20, position:[50, 0, 0], target:[0, 0, 7], wait:2000},
	{system:'unusual_swirlybeams_pinkblue_parent', name:'Distant Dream', fov:20, position:[50, 0, 0], target:[0, 0, 7], wait:2000},
	{system:'unusual_icetornado_blue_parent', name:'Violent Wintertide', fov:35, position:[50, 0, 25], target:[0, 0, 15], wait:2000},
	{system:'unusual_icetornado_purple_parent', name:'Blighted Snowstorm', fov:35, position:[50, 0, 25], target:[0, 0, 15], wait:2000},
	{system:'unusual_icetornado_white_parent', name:'Pale Nimbus', fov:35, position:[50, 0, 25], target:[0, 0, 15], wait:2000},
	{system:'unusual_genplasmos_parent', name:'Genus Plasmos', fov:35, position:[50, 0, 0], target:[0, 0, 6], wait:4000},
	{system:'unusual_genplasmos_b_parent', name:'Serenus Lumen', fov:35, position:[50, 0, 0], target:[0, 0, 6], wait:4000},
	{system:'unusual_genplasmos_c_parent', name:'Ventum Maris', fov:35, position:[50, 0, 0], target:[0, 0, 6], wait:4000},
	{system:'unusual_mistletoe_teamcolor_red', name:'Mirthful Mistletoe (RED)', fov:35, position:[50, 0, 50], target:[0, 0, 6], wait:1000},
	{system:'unusual_mistletoe_teamcolor_blue', name:'Mirthful Mistletoe (BLU)', fov:35, position:[50, 0, 50], target:[0, 0, 6], wait:1000},
	{system:'unusual_breaker_green_parent', name:'Resonation', fov:35, position:[50, 0, 0], target:[0, 0, 8], wait:1500},
	{system:'unusual_breaker_orange_parent', name:'Aggradation', fov:35, position:[50, 0, 0], target:[0, 0, 8], wait:1500},
	{system:'unusual_breaker_purple_parent', name:'Lucidation', fov:35, position:[50, 0, 0], target:[0, 0, 8], wait:1500},
	{system:'unusual_star_parent', name:'Stunning', fov:35, position:[50, 0, 30], target:[0, 0, 5], wait:1500},
	{system:'unusual_magic_stingers_orange_parent', name:'Ardentum Saturnalis', fov:35, position:[50, 0, 30], target:[0, 0, 5], wait:3500},
	{system:'unusual_magic_stingers_pink_parent', name:'Fragrancium Elementalis', fov:35, position:[50, 0, 30], target:[0, 0, 5], wait:3500},
	{system:'unusual_magic_stingers_teamcolor_red', name:'Reverium Irregularis (RED)', fov:35, position:[50, 0, 30], target:[0, 0, 5], wait:3500},
	{system:'unusual_magic_stingers_teamcolor_blue', name:'Reverium Irregularis (BLU)', fov:35, position:[50, 0, 30], target:[0, 0, 5], wait:3500},
	{system:'unusual_flowers_parent', name:'Perennial Petals', fov:25, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_bloomhead_orangepurple_parent', name:'Flavorsome Sunset', fov:25, position:[0, 0, 50], target:[0, 0, 0], wait:3000},
	{system:'unusual_bloomhead_pinkgreen_parent', name:'Raspberry Bloom', fov:25, position:[0, 0, 50], target:[0, 0, 0], wait:3000},
	{system:'unusual_magicalorb_parent', name:'Iridescence', fov:35, position:[50, 0, 0], target:[0, 0, 0], wait:12500},
	{system:'unusual_demonhorns_green_parent', name:'Tempered Thorns', fov:30, position:[0, 50, 0], target:[0, 0, 3], wait:1000},
	{system:'unusual_demonhorns_orange_parent', name:'Devilish Diablo', fov:30, position:[0, 50, 0], target:[0, 0, 3], wait:1000},
	{system:'unusual_demonhorns_purple_parent', name:'Severed Serration', fov:30, position:[0, 50, 0], target:[0, 0, 3], wait:1000},
	{system:'unusual_souls_shades_parent', name:'Shrieking Shades', fov:30, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_souls_teamcolor_red', name:'Restless Wraiths (RED)', fov:30, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_souls_teamcolor_blue', name:'Restless Wraiths (BLU)', fov:30, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_phantomcrown_green_parent', name:'Infernal Wraith', fov:30, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_phantomcrown_purple_parent', name:'Phantom Crown', fov:30, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_phantomcrown_yellow_parent', name:'Ancient Specter', fov:30, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_lurking_eyes_parent_g', name:'Viridescent Peeper', fov:30, position:[0, 50, 0], target:[0, 0, 15], wait:2000},
	{system:'unusual_lurking_eyes_parent_o', name:'Eyes of Molten', fov:30, position:[0, 50, 0], target:[0, 0, 15], wait:2000},
	{system:'unusual_lurking_eyes_parent_p', name:'Ominous Stare', fov:30, position:[0, 50, 0], target:[0, 0, 15], wait:2000},
	{system:'unusual_pumpkin_moon_parent', name:'Pumpkin Moon', fov:35, position:[0, 50, 0], target:[0, 0, 17], wait:3000},
	{system:'unusual_wacky_spooky_ghost_parent_g', name:'Frantic Spooker', fov:30, position:[50, 0, 0], target:[0, 0, 17], wait:1000},
	{system:'unusual_wacky_spooky_ghost_parent_o', name:'Frightened Poltergeist', fov:30, position:[50, 0, 0], target:[0, 0, 17], wait:1000},
	{system:'unusual_wacky_spooky_ghost_parent_p', name:'Energetic Haunter', fov:30, position:[50, 0, 0], target:[0, 0, 17], wait:1000},
	{system:'unusual_smissmas_tree_parent', name:'Smissmas Tree', fov:30, position:[50, 0, 0], target:[0, 0, 8], wait:1000},
	{system:'unusual_tree3_yellow_parent', name:'Hospitable Festivity', fov:35, position:[50, 0, 0], target:[0, 0, 13], wait:2000, setQuaternion: true},
	{system:'unusual_tree3_teamcolor_red', name:'Condescending Embrace (RED)', fov:35, position:[50, 0, 0], target:[0, 0, 13], wait:2000, setQuaternion: true},
	{system:'unusual_tree3_teamcolor_blue', name:'Condescending Embrace (BLU)', fov:35, position:[50, 0, 0], target:[0, 0, 13], wait:2000, setQuaternion: true},
	{system:'unusual_sparkletree_gold_parent', name:'Sparkling Spruce', fov:25, position:[50, 0, 0], target:[0, 0, 20], wait:1000},
	{system:'unusual_sparkletree_silver_parent', name:'Glittering Juniper', fov:25, position:[50, 0, 0], target:[0, 0, 20], wait:1000},
	{system:'unusual_sparkletree_RGB_parent', name:'Prismatic Pine', fov:25, position:[50, 0, 0], target:[0, 0, 20], wait:1000},
	{system:'unusual_fairylights_green_parent', name:'Spiraling Lights', fov:30, position:[50, 0, 50], target:[0, 0, 0], wait:10000, setQuaternion: true},
	{system:'unusual_fairylights_purple_parent', name:'Twisting Lights', fov:30, position:[50, 0, 50], target:[0, 0, 0], wait:10000, setQuaternion: true},
	{system:'unusual_spire_star_parent', name:'Stardust Pathway', fov:25, position:[50, 0, 0], target:[0, 0, 15], wait:1500},
	{system:'unusual_spire_snowball_parent', name:'Flurry Rush', fov:25, position:[50, 0, 0], target:[0, 0, 15], wait:1500},
	{system:'unusual_spire_firework_teamcolor_red', name:'Spark of Smissmas (RED)', fov:25, position:[50, 0, 0], target:[0, 0, 15], wait:1500},
	{system:'unusual_spire_firework_teamcolor_blue', name:'Spark of Smissmas (BLU)', fov:25, position:[50, 0, 0], target:[0, 0, 15], wait:1500},
	{system:'unusual_snowflake_parent', name:'Polar Forecast', fov:35, position:[50, 0, 0], target:[0, 0, 10], wait:1500},
	{system:'unusual_antlers_gold_parent', name:'Shining Stag', fov:25, position:[0, 50, 0], target:[0, 0, 10], wait:1500, setQuaternion: true},
	{system:'unusual_antlers_purple_parent', name:'Holiday Horns', fov:25, position:[0, 50, 0], target:[0, 0, 10], wait:1500, setQuaternion: true},
	{system:'unusual_antlers_teamcolor_red', name:'Ardent Antlers (RED)', fov:25, position:[0, 50, 0], target:[0, 0, 10], wait:1500, setQuaternion: true},
	{system:'unusual_antlers_teamcolor_blue', name:'Ardent Antlers (BLU)', fov:25, position:[0, 50, 0], target:[0, 0, 10], wait:1500, setQuaternion: true},
	{system:'unusual_festive_lights_lights1_parent', name:'Festive Lights', fov:30, position:[0, 50, 0], target:[0, 0, 15], wait:1500},
	{system:'unusual_spycrabs_teamcolor_red', name:'Crustacean Sensation (RED)', fov:30, position:[0, 50, 0], target:[0, 0, 0], wait:1500},
	{system:'unusual_spycrabs_teamcolor_blue', name:'Crustacean Sensation (BLU)', fov:30, position:[0, 50, 0], target:[0, 0, 0], wait:1500},
	{system:'unusual_sprinkles_teamcolor_red', name:'Frosted Decadence (RED)', fov:40, position:[50, 0, 0], target:[0, 0, 15], wait:3000},
	{system:'unusual_sprinkles_teamcolor_blue', name:'Frosted Decadence (BLU)', fov:40, position:[50, 0, 0], target:[0, 0, 15], wait:3000},
	{system:'unusual_sprinkles_rainbow_parent', name:'Sprinkled Delights', fov:40, position:[50, 0, 0], target:[0, 0, 15], wait:3000},
	{system:'unusual_liquidmagic_green_parent', name:'Terrestrial Favor', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1500},
	{system:'unusual_liquidmagic_ocean_parent', name:'Tropical Thrill', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1500},
	{system:'unusual_liquidmagic_pink_parent', name:'Flourishing Passion', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1500},
	{system:'unusual_firework_blue_red_parent', name:'Dazzling Fireworks', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:3000},
	{system:'unusual_firework_green_yellow_parent', name:'Blazing Fireworks', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:3000},
	{system:'unusual_firework_orange_yellow_parent', name:'Shimmering Fireworks', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:3000},
	{system:'unusual_firework_pgb_parent', name:'Twinkling Fireworks', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:3000},
	{system:'unusual_firework_purple_yellow_parent', name:'Sparkling Fireworks', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:3000},
	{system:'unusual_firework_rainbow_parent', name:'Glowing Fireworks', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:3000},
	{system:'unusual_firework_wgb_parent', name:'Glimmering Fireworks', fov:30, position:[50, 0, 0], target:[0, 0, 20], wait:3000},
	{system:'unusual_lanterns_teamcolor_red', name:'Flying Lights (RED)', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:4000},
	{system:'unusual_lanterns_teamcolor_blue', name:'Flying Lights (BLU)', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:4000},
	{system:'unusual_lanterns_green_parent', name:'Limelight', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:4000},
	{system:'unusual_lanterns_yellow_parent', name:'Shining Star', fov:40, position:[50, 0, 0], target:[0, 0, 20], wait:4000},
	{system:'unusual_coldcosmos_parent', name:'Cold Cosmos', fov:25, position:[50, 0, 0], target:[0, 0, 15], wait:2000},
	{system:'unusual_helix_parent', name:'Refracting Fractals', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_stardust_teamcolor_red', name:'Startrance (RED)', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'unusual_stardust_teamcolor_blue', name:'Startrance (BLU)', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'unusual_stardust_green_parent', name:'Starlush', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'unusual_stardust_orange_parent', name:'Starfire', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'unusual_stardust_white_parent', name:'Stardust', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1500},
	{system:'unusual_erupt_alien_parent', name:'Contagious Eruption', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_erupt_daydream_parent', name:'Daydream Eruption', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_erupt_volcan_parent', name:'Volcanic Eruption', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_supernova_parent', name:'Divine Sunlight', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:3000},
	{system:'unusual_audio_soundwave_green_parent', name:'Audiophile', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'unusual_audio_soundwave_orange_parent', name:'Soundwave', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'unusual_audio_soundwave_purple_parent', name:'Synesthesia', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'unusual_kraken_green_parent', name:'Haunted Kraken', fov:35, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_kraken_purple_parent', name:'Eerie Kraken', fov:35, position:[0, 50, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_ghostaxe_parent_green', name:'Soulful Slice', fov:30, position:[50, 0, 0], target:[0, 0, 7], wait:2000, setQuaternion: true},
	{system:'unusual_ghostaxe_parent_purple', name:'Horsemann\'s Hack', fov:30, position:[50, 0, 0], target:[0, 0, 7], wait:2000, setQuaternion: true},
	{system:'unusual_hauntedforever_teamcolor_red', name:'Haunted Forever! (RED)', fov:25, position:[50, 0, 0], target:[0, 0, 10], wait:1000, setQuaternion: true},
	{system:'unusual_hauntedforever_teamcolor_blue', name:'Haunted Forever! (BLU)', fov:25, position:[50, 0, 0], target:[0, 0, 10], wait:1000, setQuaternion: true},
	{system:'unusual_hauntedforever_green_parent', name:'Forever And Forever!', fov:25, position:[50, 0, 0], target:[0, 0, 10], wait:1000, setQuaternion: true},
	{system:'unusual_hauntedforever_purple_parent', name:'Cursed Forever!', fov:25, position:[50, 0, 0], target:[0, 0, 10], wait:1000, setQuaternion: true},
	{system:'unusual_moths_parent', name:'Moth Plague', fov:50, position:[50, 0, 0], target:[0, 0, 10], wait:4000},
	{system:'unusual_eyeboss_parent', name:'Malevolent Monoculi', fov:40, position:[50, 0, 0], target:[0, 0, 5], wait:4000},
	{system:'unusual_ghostly_flame_teamcolor_red', name:'Haunted Wick (RED)', fov:45, position:[0, 0, 50], target:[0, 12, 0], wait:1000, setQuaternion: true, upVector: [0, 1, 0]},
	{system:'unusual_ghostly_flame_teamcolor_blue', name:'Haunted Wick (BLU)', fov:45, position:[0, 0, 50], target:[0, 12, 0], wait:1000, setQuaternion: true, upVector: [0, 1, 0]},
	{system:'unusual_ghostly_flame_parent_orange', name:'Wicked Wick', fov:45, position:[0, 0, 50], target:[0, 12, 0], wait:1000, setQuaternion: true, upVector: [0, 1, 0]},
	{system:'unusual_ghostly_flame_parent_purple', name:'Spectral Wick', fov:45, position:[0, 0, 50], target:[0, 12, 0], wait:1000, setQuaternion: true, upVector: [0, 1, 0]},
	{system:'unusual_sheetmusic_gold_parent', name:'Musical Maelstrom', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_sheetmusic_green_parent', name:'Verdant Virtuoso', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_sheetmusic_silver_parent', name:'Silver Serenade', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:1000},
	{system:'unusual_constellation_teamcolor_red', name:'Cosmic Constellations (RED)', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:13000},
	{system:'unusual_constellation_teamcolor_blue', name:'Cosmic Constellations (BLU)', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:13000},
	{system:'unusual_constellation_green_parent', name:'Dazzling Constellations', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:13000},
	{system:'unusual_blood_snow_parent', name:'Tainted Frost', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_aestheticneons_parent', name:'Starlight Haze', fov:30, position:[50, 0, 0], target:[0, 0, 15], wait:4000},
	{system:'unusual_hardcarry_teamcolor_red', name:'Hard Carry (RED)', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_hardcarry_teamcolor_blue', name:'Hard Carry (BLU)', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_jellyfish_teamcolor_red', name:'Jellyfish Field (RED)', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_jellyfish_teamcolor_blue', name:'Jellyfish Field (BLU)', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_jellyfish_green_parent', name:'Jellyfish Hunter', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_jellyfish_purple_parent', name:'Jellyfish Jam', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:3000},
	{system:'unusual_shootingstar_green_parent', name:'Global Clusters', fov:50, position:[50, 0, 0], target:[0, 0, 10], wait:3500},
	{system:'unusual_shootingstar_purple_parent', name:'Celestial Starburst', fov:50, position:[50, 0, 0], target:[0, 0, 10], wait:3500},
	{system:'unusual_shootingstar_orange_parent', name:'Sylicone Succiduous', fov:50, position:[50, 0, 0], target:[0, 0, 10], wait:3500},
	{system:'unusual_sakura_smokebomb', name:'Sakura Smoke Bomb', fov:60, position:[50, 0, 0], target:[0, 0, 10], wait:3500},
	{system:'unusual_australian_riches', name:'Treasure Trove', fov:60, position:[50, 0, 0], target:[0, 0, 10], wait:3500},
	{system:'unusual_buble_parent', name:'Bubble Breeze', fov:40, position:[50, 0, 0], target:[0, 0, 10], wait:2000},
	{system:'unusual_fireflies', name:'Fireflies', fov:50, position:[50, 0, 0], target:[0, 0, 10], wait:1000},
	{system:'unusual_mountainhalo_parent', name:'Mountain Halo', fov:20, position:[50, 0, 50], target:[0, 0, 10], wait:3000},
	{system:'unusual_risingstar_green_parent', name:'Celestial Summit', fov:30, position:[50, 0, 50], target:[0, 0, 10], wait:3000},
	{system:'unusual_risingstar_purple_parent', name:'Stellar Ascent', fov:30, position:[50, 0, 50], target:[0, 0, 10], wait:3000},
	{system:'unusual_sapper_teamcolor_red', name:'Sapped (RED)', fov:30, position:[50, 0, 50], target:[0, 0, 10], wait:3000},
	{system:'unusual_sapper_teamcolor_blue', name:'Sapped (BLU)', fov:30, position:[50, 0, 50], target:[0, 0, 10], wait:3000},
	{system:'unusual_devilish_teamcolor_red', name:'Hellspawned Horns (RED)', fov:30, position:[-35, -20, 30], target:[0, 0, 5], wait:3000, setQuaternion: true},
	{system:'unusual_devilish_teamcolor_blue', name:'Hellspawned Horns (BLU)', fov:30, position:[-35, -20, 30], target:[0, 0, 5], wait:3000, setQuaternion: true},
	{system:'unusual_devilish_green_parent', name:'Demonic Impaler', fov:30, position:[-35, -20, 30], target:[0, 0, 5], wait:3000, setQuaternion: true},
	{system:'unusual_devilish_purple_parent', name:'Revenant\'s Rack', fov:30, position:[-35, -20, 30], target:[0, 0, 5], wait:3000, setQuaternion: true},
	{system:'unusual_sixthsense_teamcolor_red', name:'Sixth Sense (RED)', fov:30, position:[-35, -20, 30], target:[0, 0, 5], wait:3000, setQuaternion: true},
	{system:'unusual_sixthsense_teamcolor_blue', name:'Sixth Sense (BLU)', fov:30, position:[-35, -20, 30], target:[0, 0, 5], wait:3000, setQuaternion: true},
	{system:'unusual_sixthsense_pink_parent', name:'Amygdala', fov:30, position:[-35, -20, 30], target:[0, 0, 5], wait:3000, setQuaternion: true},
	{system:'unusual_skullhead_parent', name:'The Bone Zone', fov:30, position:[50, 0, 50], target:[0, 0, 10], wait:3000, setQuaternion: true},
	{system:'unusual_spiderweb_parent', name:'Arachne\'s Web', fov:30, position:[50, 0, 50], target:[0, 0, 10], wait:3000, setQuaternion: true},
	{system:'unusual_deepsmoke_parent_g', name:'Acidic Climate', fov:35, position:[50, 0, 50], target:[0, 0, 20], wait:3000, setQuaternion: true},
	{system:'unusual_deepsmoke_parent_p', name:'Otherworldly Weather', fov:35, position:[50, 0, 50], target:[0, 0, 20], wait:3000, setQuaternion: true},
	{system:'unusual_deepsmoke_parent_o', name:'Nightmarish Storm', fov:35, position:[50, 0, 50], target:[0, 0, 20], wait:3000, setQuaternion: true},
	{system:'unusual_icearrow_teamcolor_red', name:'Icestruck (RED)', fov:20, position:[50, 20, 50], target:[0, 0, 0], wait:3000, setQuaternion: true},
	{system:'unusual_icearrow_teamcolor_blue', name:'Icestruck (BLU)', fov:20, position:[50, 20, 50], target:[0, 0, 0], wait:3000, setQuaternion: true},
	{system:'unusual_goldarrow_parent', name:'Goldstruck', fov:20, position:[50, 20, 50], target:[0, 0, 0], wait:3000, setQuaternion: true},
	{system:'unusual_aestheticsigns_teamcolor_red', name:'Radiant Rivalry (RED)', fov:20, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_aestheticsigns_teamcolor_blue', name:'Radiant Rivalry (BLU)', fov:20, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_aestheticsigns_mannco_parent', name:'Radiant Legacy', fov:20, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_frosty_flavours_teamcolor_red', name:'Frosty Flavours (RED)', fov:35, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_frosty_flavours_teamcolor_blue', name:'Frosty Flavours (BLU)', fov:35, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_frosty_mint_glow_parent', name:'Mint Frost', fov:35, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_northstar_teamcolor_red', name:'North Star (RED)', fov:25, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_northstar_teamcolor_blue', name:'North Star (BLU)', fov:25, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_northstar_parent_purple', name:'Prettiest Star', fov:25, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_orbitingstar_parent', name:'Festive Falling Star', fov:25, position:[50, 0, 50], target:[0, 0, 15], wait:3000, setQuaternion: true},
	{system:'unusual_firefly_teamcolor_red', name:'Lunar Lights (RED)', fov:35, position:[50, 0, 50], target:[0, 0, 20], wait:5000, setQuaternion: true},
	{system:'unusual_firefly_teamcolor_blue', name:'Lunar Lights (BLU)', fov:35, position:[50, 0, 50], target:[0, 0, 20], wait:5000, setQuaternion: true},
	{system:'unusual_firefly_purple_parent', name:'Fairy Lights', fov:35, position:[50, 0, 50], target:[0, 0, 20], wait:5000, setQuaternion: true},
	{system:'unusual_firefly_green_parent', name:'Natural Lights', fov:35, position:[50, 0, 50], target:[0, 0, 20], wait:5000, setQuaternion: true},
*/
	/*
		{system:'unusual_corrodedknight_teamcolor_red', name:'Loyalist\'s Coronet (RED)', fov:35, position:[0, 30, 0], target:[0, 0, 7], wait:1000, setQuaternion: true},
		{system:'unusual_corrodedknight_teamcolor_blue', name:'Loyalist\'s Coronet (BLU)', fov:35, position:[0, 30, 0], target:[0, 0, 7], wait:1000, setQuaternion: true},
		{system:'unusual_corrodedknight_parent_silver', name:'Knight\'s Prideful Spirit', fov:35, position:[0, 30, 0], target:[0, 0, 7], wait:1000, setQuaternion: true},
		{system:'unusual_corrodedknight_parent_golden', name:'Baron\'s Cherished Chaplet', fov:35, position:[0, 30, 0], target:[0, 0, 7], wait:1000, setQuaternion: true},
		{system:'unusual_poseidon_teamcolor_red', name:'Lure of the Deep (RED)', fov:25, position:[50, 30, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_poseidon_teamcolor_blue', name:'Lure of the Deep (BLU)', fov:25, position:[50, 30, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_poseidon_parent_green', name:'Violent Viridian', fov:25, position:[50, 30, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_poseidon_parent_purple', name:'Magenta Monstrum', fov:25, position:[50, 30, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_rainglow_parent', name:'Rainbow Reverie', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_cubancigar_parent', name:'Cuban Smoke', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_mohawk_teamcolor_red', name:'Melting Mohawk (RED)', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_mohawk_teamcolor_blue', name:'Melting Mohawk (BLU)', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_mohawk_parent_green', name:'Scorched Scalp', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_mohawk_parent_purple', name:'Ignited Crest', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_rare_shine_glow_parent', name:'Rare Shine', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_horstars_teamcolor_red', name:'Distant Drift (RED)', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_horstars_teamcolor_blue', name:'Distant Drift (BLU)', fov:30, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_electric_parent_white', name:'Warp Drive', fov:30, position:[50, 0, 0], target:[0, 0, 0], wait:2000, setQuaternion: true},
		{system:'unusual_electric_parent_gold', name:'Overdrive', fov:30, position:[50, 0, 0], target:[0, 0, 0], wait:2000, setQuaternion: true},
		{system:'unusual_butterflyhead_teamcolor_red', name:'Butterfly Season (RED)', fov:35, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_butterflyhead_teamcolor_blue', name:'Butterfly Season (BLU)', fov:35, position:[50, 0, 0], target:[0, 0, 5], wait:2000, setQuaternion: true},
		{system:'unusual_hippieaura_parent', name:'Psycho-delic', fov:35, position:[50, 0, 0], target:[0, 0, 5], wait:3000, setQuaternion: true},
		{system:'unusual_butterfly_parent', name:'Bewitching Bugs', fov:35, position:[0, 0, 50], target:[0, 0, 0], wait:3000, setQuaternion: true},
		*/
	/*
	// Halloween 2024 Unusual
	{system:'unusual_spectral_fire_parent', name:'Spectral Fire', fov:20, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_galactic_fire_parent', name:'Galactic Flame', fov:20, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_frank_green_parent', name:'Revived Recharge', fov:20, position:[30, 30, 30], target:[0, 0, 5], wait:2000, setQuaternion: true},
	{system:'unusual_frank_purple_parent', name:'Undead Electricity', fov:20, position:[30, 30, 30], target:[0, 0, 5], wait:2000, setQuaternion: true},
	{system:'unusual_frank_yellow_parent', name:'Frankencharged', fov:20, position:[30, 30, 30], target:[0, 0, 5], wait:2000, setQuaternion: true},
	{system:'unusual_skullsmoke_green_parent', name:'Phantom Plague', fov:30, position:[30, 30, 30], target:[0, 0, 5], wait:4000, setQuaternion: true},
	{system:'unusual_skullsmoke_purple_parent', name:'Haunting Haze', fov:30, position:[30, 30, 30], target:[0, 0, 5], wait:4000, setQuaternion: true},
	{system:'unusual_pigeons_green_parent', name:'Bats', fov:20, position:[30, 30, 30], target:[0, 0, 10], wait:2000, setQuaternion: true},
	{system:'unusual_pigeons_purple_parent', name:'Ravens', fov:20, position:[30, 30, 30], target:[0, 0, 10], wait:2000, setQuaternion: true},
	{system:'unusual_pigeons_white_parent', name:'Doves', fov:20, position:[30, 30, 30], target:[0, 0, 10], wait:2000, setQuaternion: true},
	{system:'unusual_stove_teamcolor_red', name:'Searing Stove (RED)', fov:20, position:[30, 30, 30], target:[0, 0, 5], wait:2000, setQuaternion: true},
	{system:'unusual_stove_teamcolor_blue', name:'Searing Stove (BLU)', fov:20, position:[30, 30, 30], target:[0, 0, 5], wait:2000, setQuaternion: true},
	{system:'unusual_electricfire_teamcolor_red', name:'Über Blaze (RED)', fov:20, position:[30, 30, 30], target:[0, 0, 5], wait:2000, setQuaternion: true},
	{system:'unusual_electricfire_teamcolor_blue', name:'Über Blaze (BLU)', fov:20, position:[30, 30, 30], target:[0, 0, 5], wait:2000, setQuaternion: true},
	*/

	// Smissmas 2024 Unusual
	/*
	{system:'unusual_sizzling_parent', fov:20, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_icrown_teamcolor_red', fov:30, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_icrown_teamcolor_blue', fov:30, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_icrown_parent_purple', fov:30, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_timeghosts_parent', fov:30, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_aurora_parent', fov:30, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_bokehsparkle_parent', fov:30, position:[0, 0, 50], target:[0, 0, 0], wait:2000, setQuaternion: true},
	{system:'unusual_playful_purple_parent', fov:30, position:[50, 0, 0], target:[0, 0, 10], wait:2000, setQuaternion: true},
	{ system: 'unusual_playful_yellow_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	*/

	// Summer 2025 Unusual
	/*
	{ system: 'unusual_drunk_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_excalibur_teamcolor_red', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_excalibur_teamcolor_blue', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_excalibur_parent_purple', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_uber_teamcolor_red', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_uber_teamcolor_blue', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_uber_gold_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_orbitingbullet_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_typhoon_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	 */

	// Halloween 2025 Unusual
	{ system: 'unusual_ocean_swirl_teamcolor_red', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_ocean_swirl_teamcolor_blue', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_ocean_swirl_green_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_candle_teamcolor_red', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_candle_teamcolor_blue', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_deadlyaroma_teamcolor_red', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_deadlyaroma_teamcolor_blue', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_deadlyaroma_green_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_conductor_teamc_teamcolor_red', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_conductor_teamc_teamcolor_blue', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
	{ system: 'unusual_sandy_parent', fov: 30, position: [50, 0, 0], target: [0, 0, 10], wait: 2000, setQuaternion: true },
]

const EffectList2 = new Map([


	['community_sparkle', 'community_sparkle'],

]);

const KillstreakList = [
	//{system:'killstreak_t1_lvl2', name:'Fire Horns', fov:40, position:[30, 0, 0], target:[0, 0, 12], wait:1500, isKillstreak: true},
	//{system:'killstreak_t2_lvl2', name:'Cerebral Discharge', fov:50, position:[30, 0, 0], target:[0, 0, 12], wait:1000, isKillstreak: true},
	//{system:'killstreak_t3_lvl2', name:'Tornado', fov:35, position:[30, 0, 0], target:[0, 0, 8], wait:2000, isKillstreak: true},
	//{system:'killstreak_t4_lvl2', name:'Flames', fov:50, position:[30, 0, 0], target:[0, 0, 10], wait:2000, isKillstreak: true},
	//{system:'killstreak_t5_lvl2', name:'Singularity', fov:20, position:[30, 0, 0], target:[0, 0, 7], wait:2000, isKillstreak: true},
	//{system:'killstreak_t6_lvl2', name:'Incinerator', fov:40, position:[30, 0, 0], target:[0, 0, 10], wait:1000, isKillstreak: true},
	//{system:'killstreak_t7_lvl2', name:'Hypno-Beam', fov:40, position:[30, 0, 0], target:[0, 0, 8], wait:2000, isKillstreak: true},

	{ system: 'killstreak_t1_lvl1', name: 'Fire Horns (5 kills)', fov: 40, position: [30, 0, 0], target: [0, 0, 12], wait: 1500, isKillstreak: true },
	{ system: 'killstreak_t2_lvl1', name: 'Cerebral Discharge (5 kills)', fov: 50, position: [30, 0, 0], target: [0, 0, 12], wait: 1000, isKillstreak: true },
	{ system: 'killstreak_t3_lvl1', name: 'Tornado (5 kills)', fov: 35, position: [30, 0, 0], target: [0, 0, 8], wait: 2000, isKillstreak: true },
	{ system: 'killstreak_t4_lvl1', name: 'Flames (5 kills)', fov: 50, position: [30, 0, 0], target: [0, 0, 10], wait: 2000, isKillstreak: true },
	{ system: 'killstreak_t5_lvl1', name: 'Singularity (5 kills)', fov: 20, position: [30, 0, 0], target: [0, 0, 7], wait: 2000, isKillstreak: true },
	{ system: 'killstreak_t6_lvl1', name: 'Incinerator (5 kills)', fov: 40, position: [30, 0, 0], target: [0, 0, 10], wait: 1000, isKillstreak: true },
	{ system: 'killstreak_t7_lvl1', name: 'Hypno-Beam (5 kills)', fov: 40, position: [30, 0, 0], target: [0, 0, 8], wait: 2000, isKillstreak: true },
]

const UnusualTauntList = [
	/*
		{system:'utaunt_disco_party', name:'\'72', fov:25, position:[30, 0, 0], target:[0, 0, 100], wait:800},
		{system:'utaunt_hearts_glow_parent', name:'Fountain of Delight', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:1000},
		{system:'utaunt_beams_yellow', name:'Holy Grail', fov:60, position:[100, 0, 0], target:[0, 0, 30], wait:1500},
		{system:'utaunt_lightning_parent', name:'Mega Strike', fov:60, position:[100, 0, 0], target:[0, 0, 30], wait:600},
		{system:'utaunt_tornado_parent_black', name:'Midnight Whirlwind', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:4000},
		{system:'utaunt_tornado_parent_white', name:'Silver cyclone', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:4000},
		{system:'utaunt_meteor_parent', name:'Screaming Tiger', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:2000},
		{system:'utaunt_firework_teamcolor_blue', name:'Showstopper (BLU)', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:2000},
		{system:'utaunt_firework_teamcolor_red', name:'Showstopper (RED)', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:2000},
		{system:'utaunt_cash_confetti', name:'Skill Gotten Gains', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:1500},
		{system:'utaunt_souls_green_parent', name:'Haunted Phantasm', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:3000},
		{system:'utaunt_souls_purple_parent', name:'Ghastly Ghosts', fov:60, position:[100, 0, 0], target:[0, 0, 50], wait:3000},
		{system:'utaunt_hellpit_parent', name:'Hellish Inferno', fov:40, position:[100, 0, 100], target:[0, 0, 0], wait:1800},
		{system:'utaunt_hellswirl', name:'Spectral Swirl', fov:40, position:[100, 0, 100], target:[0, 0, 15], wait:1500},
		{system:'utaunt_headless', name:'Infernal Flames', fov:40, position:[100, 0, 100], target:[0, 0, 15], wait:1500},
		{system:'utaunt_merasmus', name:'Infernal Smoke', fov:40, position:[100, 0, 100], target:[0, 0, 15], wait:1500},
		{system:'utaunt_bubbles_glow_green_parent', name:'Acidic Bubbles of Envy', fov:40, position:[100, 0, 100], target:[0, 0, 15], wait:4000},
		{system:'utaunt_bubbles_glow_orange_parent', name:'Flammable Bubbles of Attraction', fov:40, position:[100, 0, 100], target:[0, 0, 15], wait:4000},
		{system:'utaunt_bubbles_glow_purple_parent', name:'Poisonous Bubbles of Regret', fov:40, position:[100, 0, 100], target:[0, 0, 15], wait:4000},
		{system:'utaunt_firework_dragon_parent', name:'Roaring Rockets', fov:40, position:[100, 0, 0], target:[0, 0, 100], wait:2000},
		{system:'utaunt_smoke_moon_parent', name:'Spooky Night', fov:50, position:[150, 0, 150], target:[0, 0, 50], wait:1500},
		{system:'utaunt_smoke_moon_green_parent', name:'Ominous Night', fov:50, position:[150, 0, 150], target:[0, 0, 50], wait:1500},
		{system:'utaunt_arcane_purple_parent', name:'Bewitched', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_arcane_green_parent', name:'Accursed', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_arcane_yellow_parent', name:'Enchanted', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_electric_mist_parent', name:'Static Mist', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_electricity_cloud_parent_WP', name:'Eerie Lightning', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_electricity_cloud_parent_WB', name:'Terrifying Thunder', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_electricity_cloud_parent_WY', name:'Jarate Shock', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_portalswirl_purple_parent', name:'Nether Void', fov:40, position:[100, 0, 100], target:[0, 0, 20], wait:2000},
		{system:'utaunt_present_parent', name:'Good-Hearted Goodies', fov:40, position:[100, 0, 100], target:[0, 0, 30], wait:2000},
		{system:'utaunt_snowring_icy_parent', name:'Wintery Wisp', fov:40, position:[100, 0, 100], target:[0, 0, 30], wait:2000},
		{system:'utaunt_snowring_space_parent', name:'Arctic Aurora', fov:40, position:[100, 0, 100], target:[0, 0, 30], wait:2000},
		{system:'utaunt_spirit_winter_parent', name:'Winter Spirit', fov:40, position:[100, 0, 100], target:[0, 0, 30], wait:2000},
		{system:'utaunt_spirit_festive_parent', name:'Festive Spirit', fov:40, position:[100, 0, 100], target:[0, 0, 30], wait:2000},
		{system:'utaunt_spirit_magical_parent', name:'Magical Spirit', fov:40, position:[100, 0, 100], target:[0, 0, 30], wait:2000},
		{system:'utaunt_astralbodies_greenorange_parent', name:'Spectral Escort', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:2000, isTaunt: true},
		{system:'utaunt_astralbodies_tealpurple_parent', name:'Astral Presence', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:2000, isTaunt: true},
		{system:'utaunt_astralbodies_teamcolor_red', name:'Arcane Assistance (RED)', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:2000, isTaunt: true},
		{system:'utaunt_astralbodies_teamcolor_blue', name:'Arcane Assistance (BLU)', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:2000, isTaunt: true},
		{system:'utaunt_glowyplayer_green_parent', name:'Emerald Allurement', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:2000, isTaunt: true},
		{system:'utaunt_glowyplayer_orange_parent', name:'Pyrophoric Personality', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:2000, isTaunt: true},
		{system:'utaunt_glowyplayer_purple_parent', name:'Spellbound Aspect', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:2000, isTaunt: true},
		{system:'utaunt_electricity_parent', name:'Static Shock', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:3000, isTaunt: true},
		{system:'utaunt_electricity_purple_parent', name:'Veno Shock', fov:40, position:[100, -100, 0], target:[0, 20, 50], wait:3000, isTaunt: true},
		{system:'utaunt_spider_green_parent', name:'Toxic Terrors', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_spider_orange_parent', name:'Arachnid Assault', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_spider_purple_parent', name:'Creepy Crawlies', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_tf2smissmas_tree_parent', name:'Delightful Star', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_tf2smissmas_tree_parent_w', name:'Frosted Star', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_spirits_blue_parent', name:'Apotheosis', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:2500, isTaunt: true},
		{system:'utaunt_spirits_purple_parent', name:'Ascension', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:2500, isTaunt: true},
		{system:'utaunt_balloonicorn_reindeer_teamcolor_red', name:'Reindoonicorn Rancher (RED)', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2500, isTaunt: true},
		{system:'utaunt_balloonicorn_reindeer_teamcolor_blue', name:'Reindoonicorn Rancher (BLU)', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2500, isTaunt: true},
		{system:'utaunt_twinkling_rgb_parent', name:'Twinkling Lights', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_twinkling_goldsilver_parent', name:'Shimmering Lights', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_chain_green_parent', name:'Spectral Shackles', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_chain_purple_parent', name:'Cursed Confinement', fov:50, position:[-50, 100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},
		{system:'utaunt_tarotcard_teamcolor_red', name:'Cavalier de Carte (RED)', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_tarotcard_teamcolor_blue', name:'Cavalier de Carte (BLU)', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_tarotcard_orange_parent', name:'Hollow Flourish', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_tarotcard_purple_parent', name:'Magic Shuffle', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_elebound_green_parent', name:'Vigorous Pulse', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:1000, isTaunt: true},
		{system:'utaunt_elebound_purple_parent', name:'Thundering Spirit', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:1000, isTaunt: true},
		{system:'utaunt_elebound_yellow_parent', name:'Galvanic Defiance', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:1000, isTaunt: true},
		{system:'utaunt_wispy_parent_g', name:'Wispy Halos', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_wispy_parent_p', name:'Nether Wisps', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_auroraglow_green_parent', name:'Aurora Borealis', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_auroraglow_orange_parent', name:'Aurora Australis', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_auroraglow_purple_parent', name:'Aurora Polaris', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:2000, isTaunt: true},
		{system:'utaunt_snowswirl_purple_parent', name:'Amethyst Winds', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_snowswirl_yellow_parent', name:'Golden Gusts', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_snowswirl_teamcolor_red', name:'Smissmas Swirls (RED)', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_snowswirl_teamcolor_blue', name:'Smissmas Swirls (BLU)', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_treespiral_green_parent', name:'Minty Cypress', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_treespiral_purple_parent', name:'Pristine Pine', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_treespiral_teamcolor_red', name:'Sparkly Spruce (RED)', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_treespiral_teamcolor_blue', name:'Sparkly Spruce (BLU)', fov:70, position:[-50, 100, 50], target:[0, 0, 60], wait:3000, isTaunt: true},
		{system:'utaunt_gifts_teamcolor_red', name:'Festive Fever (RED)', fov:70, position:[-50, 100, 50], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_gifts_teamcolor_blue', name:'Festive Fever (BLU)', fov:70, position:[-50, 100, 50], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_glitter_parent_gold', name:'Golden Glimmer', fov:50, position:[-50, 100, 50], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_glitter_parent_silver', name:'Frosty Silver', fov:50, position:[-50, 100, 50], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_glitter_teamcolor_red', name:'Glamorous Dazzle (RED)', fov:50, position:[-50, 100, 50], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_glitter_teamcolor_blue', name:'Glamorous Dazzle (BLU)', fov:50, position:[-50, 100, 50], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_ice_parent', name:'Sublime Snowstorm', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:3000, isTaunt: true},
		{system:'utaunt_marigoldritual_teamcolor_red', name:'Marigold Ritual (RED)', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:3000, isTaunt: true},
		{system:'utaunt_marigoldritual_teamcolor_blue', name:'Marigold Ritual (BLU)', fov:50, position:[-50, 100, 50], target:[0, 0, 30], wait:3000, isTaunt: true},
		{system:'utaunt_poison_parent_green', name:'Pungent Poison', fov:60, position:[-50, 100, 50], target:[0, 0, 0], wait:1500, isTaunt: true},
		{system:'utaunt_poison_parent_orange', name:'Blazed Brew', fov:60, position:[-50, 100, 50], target:[0, 0, 0], wait:1500, isTaunt: true},
		{system:'utaunt_poison_parent_purple', name:'Mysterious Mixture', fov:60, position:[-50, 100, 50], target:[0, 0, 0], wait:1500, isTaunt: true},
		{system:'utaunt_runeprison_green_parent', name:'Linguistic Deviation', fov:40, position:[-50, 100, 100], target:[0, 0, 20], wait:1500, isTaunt: true},
		{system:'utaunt_runeprison_yellow_parent', name:'Aurelian Seal', fov:40, position:[-50, 100, 100], target:[0, 0, 20], wait:1500, isTaunt: true},
		{system:'utaunt_runeprison_teamcolor_red', name:'Runic Imprisonment (RED)', fov:40, position:[-50, 100, 100], target:[0, 0, 20], wait:1500, isTaunt: true},
		{system:'utaunt_runeprison_teamcolor_blue', name:'Runic Imprisonment (BLU)', fov:40, position:[-50, 100, 100], target:[0, 0, 20], wait:1500, isTaunt: true},
		{system:'utaunt_prismatichaze_parent', name:'Prismatic Haze', fov:40, position:[50, -100, 100], target:[0, 0, 50], wait:1500, isTaunt: true},
		{system:'utaunt_risingsprit_teamcolor_red', name:'Rising Ritual (RED)', fov:50, position:[50, 100, 100], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_risingsprit_teamcolor_blue', name:'Rising Ritual (BLU)', fov:50, position:[50, 100, 100], target:[0, 0, 40], wait:3000, isTaunt: true},
		{system:'utaunt_hands_teamcolor_red', name:'Bloody Grip (RED)', fov:30, position:[50, 100, 50], target:[0, 0, 10], wait:1500, isTaunt: true},
		{system:'utaunt_hands_teamcolor_blue', name:'Bloody Grip (BLU)', fov:30, position:[50, 100, 50], target:[0, 0, 10], wait:1500, isTaunt: true},
		{system:'utaunt_hands_green_parent', name:'Toxic Grip', fov:30, position:[50, 100, 50], target:[0, 0, 10], wait:1500, isTaunt: true},
		{system:'utaunt_hands_orange_parent', name:'Infernal Grip', fov:30, position:[50, 100, 50], target:[0, 0, 10], wait:1500, isTaunt: true},
		{system:'utaunt_hands_purple_parent', name:'Death Grip', fov:30, position:[50, 100, 50], target:[0, 0, 10], wait:1500, isTaunt: true},
		{system:'utaunt_storm_parent_g', name:'Charged Arcane', fov:60, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_storm_parent_k', name:'Thunderous Rage', fov:60, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_storm_parent_o', name:'Convulsive Fiery', fov:60, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_festivelights_teamcolor_red', name:'Festivized Formation (RED)', fov:60, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_festivelights_teamcolor_blue', name:'Festivized Formation (BLU)', fov:60, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_glow_spirit_parent_cr', name:'Twirling Spirits', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_glow_spirit_parent_og', name:'Squash n\' Twist', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_glow_spirit_parent_pp', name:'Midnight Sparklers', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_snowflakesaura_parent', name:'Boundless Blizzard', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'set_taunt_saharan_spy', name:'Saharan Spy', fov:40, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'xms_snowburst', name:'Noise Maker - Winter', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:2000, isTaunt: true},

		{system:'utaunt_sun_sand_rays_parent', name:'Solar Scorched', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:3000, isTaunt: true},
		{system:'utaunt_undersea_teamcolor_red', name:'Deepsea Rave (RED)', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:1500, isTaunt: true},
		{system:'utaunt_undersea_teamcolor_blue', name:'Deepsea Rave (BLU)', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:1500, isTaunt: true},
		{system:'utaunt_lavalamp_green_parent', name:'Blooming Beacon', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:3000, isTaunt: true},
		{system:'utaunt_lavalamp_purple_parent', name:'Beaming Beacon', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:3000, isTaunt: true},
		{system:'utaunt_lavalamp_yellow_parent', name:'Blazing Beacon', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:3000, isTaunt: true},
		{system:'utaunt_fish_parent', name:'Floppin\' Frenzy', fov:60, position:[50, -100, 50], target:[0, 0, 20], wait:3000, isTaunt: true},
		{system:'utaunt_rainbow_teamcolor_red', name:'Pastel Trance (RED)', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:3000, isTaunt: true},
		{system:'utaunt_rainbow_teamcolor_blue', name:'Pastel Trance (BLU)', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:3000, isTaunt: true},
		{system:'utaunt_wild_meadows_parent', name:'Wildflower Meadows', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:4000, isTaunt: true},


		{system:'utaunt_krakenmouth_green_parent', name:'Deep-sea Devourer', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:4000, isTaunt: true},
		{system:'utaunt_krakenmouth_purple_parent', name:'Eldritch Horror', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:4000, isTaunt: true},
		{system:'utaunt_leaftaunt_parent', name:'Autumn Leaves', fov:50, position:[50, -100, 50], target:[0, 0, 40], wait:4000, isTaunt: true},
		{system:'utaunt_graveparty_parent', name:'Dead Man\'s Party', fov:50, position:[50, -100, 50], target:[0, 0, 20], wait:4000, isTaunt: true},
		{system:'utaunt_spellsplash_parent', name:'Potion Explosion', fov:60, position:[50, -100, 50], target:[0, 0, 20], wait:4000, isTaunt: true},
		{system:'utaunt_cremation_purple_parent', name:'Haunted Cremation', fov:50, position:[50, -100, 50], target:[0, 0, 40], wait:4000, isTaunt: true},
		{system:'utaunt_cremation_black_parent', name:'Cremation', fov:50, position:[50, -100, 50], target:[0, 0, 40], wait:4000, isTaunt: true},


		{system:'utaunt_snowfall_parent', name:'Snowfall', fov:70, position:[50, -100, 50], target:[0, 0, 40], wait:4000, isTaunt: true},
		{system:'utaunt_constellations_teamcolor_red', name:'Galactic Connection (RED)', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:4000, isTaunt: true},
		{system:'utaunt_constellations_teamcolor_blue', name:'Galactic Connection (BLU)', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:4000, isTaunt: true},
		{system:'utaunt_constellations_purple_parent', name:'Dark Twilight', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:4000, isTaunt: true},
		{system:'utaunt_constellations_pink_parent', name:'Eldritch Rift', fov:70, position:[50, -100, 50], target:[0, 0, 50], wait:4000, isTaunt: true},
		{system:'utaunt_wispyworks_orangegreen_parent', name:'Selfless Sensation', fov:50, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_wispyworks_purpleblue_parent', name:'Distant Desire', fov:50, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_wispyworks_yellowpurple_parent', name:'Glamorous Glance', fov:50, position:[50, -100, 50], target:[0, 0, 50], wait:2000, isTaunt: true},
		{system:'utaunt_innerblizzard_teamcolor_red', name:'Permafrost Essence (RED)', fov:40, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
		{system:'utaunt_innerblizzard_teamcolor_blue', name:'Permafrost Essence (BLU)', fov:40, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
		{system:'utaunt_innerblizzard_purple_parent', name:'Arctic Delight', fov:40, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
		{system:'utaunt_spotlight_parent', name:'Winning Spirit', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
		{system:'utaunt_pedalfly_teamcolor_red', name:'Petal Prance (RED)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
		{system:'utaunt_pedalfly_teamcolor_blue', name:'Petal Prance (BLU)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
		*/
	/*
	// Summer 2024 Unusual Taunts
	{system:'utaunt_dragonfly_teamcolor_red', name:'Dragonflies\' Embrace (RED)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:3000, isTaunt: true},
	{system:'utaunt_dragonfly_teamcolor_blue', name:'Dragonflies\' Embrace (BLU)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:3000, isTaunt: true},
	{system:'utaunt_dragonfly_green_parent', name:'Dragonflies\' Nature', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:3000, isTaunt: true},
	{system:'utaunt_dragonfly_purple_parent', name:'Dragonflies\' Lucent', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:3000, isTaunt: true},
	{system:'utaunt_demigodery_teamcolor_red', name:'Electrocution (RED)', fov:50, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_demigodery_teamcolor_blue', name:'Electrocution (BLU)', fov:50, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_signalflares_teamcolor_red', name:'Distress Signal (RED)', fov:70, position:[50, -100, 50], target:[0, 0, 60], wait:2000, isTaunt: true},
	{system:'utaunt_signalflares_teamcolor_blue', name:'Distress Signal (BLU)', fov:70, position:[50, -100, 50], target:[0, 0, 60], wait:2000, isTaunt: true},
	{system:'utaunt_signalflares_green_parent', name:'Carioca\'s Call', fov:70, position:[50, -100, 50], target:[0, 0, 60], wait:2000, isTaunt: true},
	{system:'utaunt_celebrationtime_teamcolor_red', name:'Fiesta Royale (RED)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_celebrationtime_teamcolor_blue', name:'Fiesta Royale (BLU)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_celebrationtime_yellow_parent', name:'Grand Jubilee', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_god_lava_teamcolor_red', name:'Elemental (RED)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_god_lava_teamcolor_blue', name:'Elemental (BLU)', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_god_gold_parent', name:'Godlike', fov:70, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_aestheticlogo_teamcolor_red', name:'Teamwork Valorance (RED)', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_aestheticlogo_teamcolor_blue', name:'Teamwork Valorance (BLU)', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_aestheticlogo_orange_parent', name:'Legacy Logo', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_desert_wind_parent', name:'Desert Wind', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_desert_monsoon_parent', name:'Monsoon Season', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:1000, isTaunt: true},
	{system:'utaunt_treasure_teamcolor_red', name:'Bountiful Riches (RED)', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_treasure_teamcolor_blue', name:'Bountiful Riches (BLU)', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_hearttreasure_parent', name:'Luxurious Lover', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_wiggletube_teamcolor_red', name:'Amatory (RED)', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_wiggletube_teamcolor_blue', name:'Amatory (BLU)', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_wiggletube_coffee_parent', name:'Electrum', fov:60, position:[50, -100, 50], target:[0, 0, 35], wait:2000, isTaunt: true},
	{system:'utaunt_flowerrain_teamcolor_red', name:'Sakura Blessings (RED)', fov:60, position:[50, -100, 50], target:[0, 0, 60], wait:4000, isTaunt: true},
	{system:'utaunt_flowerrain_teamcolor_blue', name:'Sakura Blessings (BLU)', fov:60, position:[50, -100, 50], target:[0, 0, 60], wait:4000, isTaunt: true},
	{system:'utaunt_flowerrain_purple_parent', name:'Violent Violets', fov:60, position:[50, -100, 50], target:[0, 0, 60], wait:4000, isTaunt: true},
	*/

	// Halloween 2024 Unusual Taunts
	/*
	{system:'utaunt_poweraura_teamcolor_red', name:'Power Pressure (RED)', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_poweraura_teamcolor_blue', name:'Power Pressure (BLU)', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_poweraura_green_parent', name:'Magnifying Momentum', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_poweraura_purple_parent', name:'Charging Catalyst', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_poweraura_yellow_parent', name:'Amplifying Aura', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_mysticfusion_parent', name:'Mystic Fusion', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:1000, isTaunt: true},
	{system:'utaunt_confetti_gy_parent', name:'Obnoxious Confetti', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:3000, isTaunt: true},
	{system:'utaunt_confetti_pp_parent', name:'Lovable Confetti', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:3000, isTaunt: true},
	{system:'utaunt_confetti_yp_parent', name:'Confetti Celebration', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:3000, isTaunt: true},
	{system:'utaunt_heavyrain_parent', name:'Heavy Rain', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:1500, isTaunt: true},
	{system:'utaunt_field_parent', name:'Pumpkin Patch', fov:60, position:[50, -100, 50], target:[0, 0, 0], wait:3000, isTaunt: true},
	*/

	// Smissmas 2024 Unusual Taunts
	/*
	{system:'utaunt_whitesmissmas_parent', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_busysnow_teamcolor_red', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_busysnow_teamcolor_blue', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_busysnow_parent_p', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_busysnow_parent_g', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_roses_teamcolor_red', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_roses_teamcolor_blue', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_roses_gold_parent', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	{system:'utaunt_tangledlights_parent', fov:60, position:[50, -100, 50], target:[0, 0, 45], wait:2000, isTaunt: true},
	*/

	// Summer 2025 Unusual Taunts
	/*
	{ system: 'utaunt_seamine_teamcolor_red', fov: 60, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_seamine_teamcolor_blue', fov: 60, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_iconicoutline_teamcolor_red', fov: 60, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_iconicoutline_teamcolor_blue', fov: 60, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_iconicoutline_pink_parent', fov: 60, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_oceanreef_parent', fov: 60, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_signalinterference_parent', fov: 60, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_waterwave_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_sharkfin2_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 1000, isTaunt: true },
	 */

	// Halloween 2025 Unusual Taunts
	{ system: 'utaunt_phantasam_green_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_phantasam_grey_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_phantasam_purple_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_multicurse_teamcolor_red', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_multicurse_teamcolor_blue', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_voidcrawlers_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_tarpit_dinos_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_tarpit_people_parent', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_morbed_teamcolor_red', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
	{ system: 'utaunt_morbed_teamcolor_blue', fov: 80, position: [50, -100, 50], target: [0, 0, 45], wait: 2000, isTaunt: true },
]

const UnusualTauntList2 = new Map([
	['utaunt_snowflakesaura_parent', 'Boundless Blizzard'],

	['set_taunt_saharan_spy', 'Saharan Spy'],
	['xms_snowburst', 'Noise Maker - Winter'],
]);
