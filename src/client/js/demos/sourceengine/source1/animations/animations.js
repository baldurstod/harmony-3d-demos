import { AddSource1Model, InitDemoStd, Harmony3D, GlMatrix, HarmonyUi } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene, { htmlDemoContent }) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testAnimations(renderer, scene, htmlDemoContent);
}

async function testAnimations(renderer, scene, htmlDemoContent) {
	perspectiveCamera.position = [500, 0, 80];
	orbitCameraControl.target.position = [0, 0, 80];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	renderer.clearColor(GlMatrix.vec4.fromValues(0.0, 0.0, 0.0, 255));

	testMedic(renderer, scene);
	testScout(renderer, scene);
	testEngie(renderer, scene);
	testDemo(renderer, scene);

	HarmonyUi.defineHarmonySwitch();

	const sw = HarmonyUi.createElement('harmony-switch', {
		parent: htmlDemoContent,
		i18: '#new_animations',
		events: {
			change: event => Harmony3D.Source1ModelInstance.useNewAnimSystem = event.target.state,
		}
	});

	sw.state = true;
}

async function testMedic(renderer, scene) {
	const medic = await AddSource1Model('tf2', 'models/player/medic', renderer, scene);
	const gun = await AddSource1Model('tf2', 'models/weapons/c_models/c_syringegun/c_syringegun', renderer, medic);
	await gun.addAnimation(0, 'idle');

	await medic.addAnimation(0, 'stand_primary');
	////await medic.addAnimation(1, 'attackstand_primary');
	await medic.addAnimation(1, 'reloadstand_primary');
	//await medic.addAnimation(1, 'ref');
	//await medic.addAnimation(1, 'a_flinch01');

	medic.playSequence('reloadstand_primary');

	return;
	const medic2 = await AddSource1Model('tf2', 'models/player/medic', renderer, scene);
	await medic2.addAnimation('stand_primary');
	medic2.position = [0, 50, 0];
}

async function testScout(renderer, scene) {
	const scout = await AddSource1Model('tf2', 'models/player/scout', renderer, scene);
	await AddSource1Model('tf2', 'models/weapons/c_models/c_scattergun', renderer, scout);

	await scout.setAnimation(0, 'stand_primary');
	await scout.setAnimation(1, 'primary_reload_loop');
	//await scout.addAnimation(1, 'reloadstand_primary');
	//await scout.addAnimation(1, 'ref');
	//await scout.addAnimation(1, 'a_flinch01');

	scout.playSequence('stand_primary');
}

async function testEngie(renderer, scene) {
	const engineer = await AddSource1Model('tf2', 'models/player/engineer', renderer, scene);

	await engineer.addAnimation(0, 'stand_item2');
	await engineer.addAnimation(1, 'item2_swing');
}

async function testDemo(renderer, scene) {
	const demo = await AddSource1Model('tf2', 'models/player/demo', renderer, scene);
	await AddSource1Model('tf2', 'models/weapons/c_models/c_stickybomb_launcher/c_stickybomb_launcher', renderer, demo);

	await demo.addAnimation(0, 'stand_primary');
	await demo.addAnimation(1, 'gesture_primary_help');
}
