import { vec4 } from 'gl-matrix';
import { Camera, ColorBackground, OrbitControl, Scene, Source1ModelInstance } from 'harmony-3d';
import { createElement, defineHarmonySwitch, HarmonySwitchChange, HTMLHarmonySwitchElement } from 'harmony-ui';
import { AddSource1Model } from '../../../../utils/source1';
import { InitDemoStd } from '../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../demos';

class Source1AnimationsDemo implements Demo {
	static readonly path = 'sourceengine/source1/animations/animations';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		testAnimations(scene, params.htmlDemoContent, perspectiveCamera, orbitCameraControl);

		/*
		canvas.scenes = [{
			scene,
			camera: perspectiveCamera,
		}];
		*/
	}
}

registerDemo(Source1AnimationsDemo);

async function testAnimations(scene: Scene, htmlDemoContent: HTMLElement, perspectiveCamera: Camera, orbitCameraControl: OrbitControl) {
	perspectiveCamera.position = [500, 0, 80];
	orbitCameraControl.target.position = [0, 0, 80];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	scene.background = new ColorBackground({ color: vec4.fromValues(0.1, 0.1, 0.1, 1) });

	testMedic(scene);
	testScout(scene);
	testEngie(scene);
	testDemo(scene);

	defineHarmonySwitch();

	const sw = createElement('harmony-switch', {
		parent: htmlDemoContent,
		i18n: '#new_animations',
		state: true,
		$change: (event: CustomEvent<HarmonySwitchChange>) => Source1ModelInstance.useNewAnimSystem = event.detail.state as boolean,

	}) as HTMLHarmonySwitchElement;

	//sw.state = true;
}

async function testMedic(scene: Scene) {
	const medic = (await AddSource1Model('tf2', 'models/player/medic', scene))!;
	const gun = (await AddSource1Model('tf2', 'models/weapons/c_models/c_syringegun/c_syringegun', medic))!;
	await gun.addAnimation(0, 'idle');

	await medic.addAnimation(0, 'stand_primary');
	////await medic.addAnimation(1, 'attackstand_primary');
	await medic.addAnimation(1, 'reloadstand_primary');
	//await medic.addAnimation(1, 'ref');
	//await medic.addAnimation(1, 'a_flinch01');

	medic.playSequence('reloadstand_primary');
}

async function testScout(scene: Scene) {
	const scout = (await AddSource1Model('tf2', 'models/player/scout', scene))!;
	await AddSource1Model('tf2', 'models/weapons/c_models/c_scattergun', scout);

	await scout.setAnimation(0, 'stand_primary', 1);
	await scout.setAnimation(1, 'primary_reload_loop', 1);
	//await scout.addAnimation(1, 'reloadstand_primary');
	//await scout.addAnimation(1, 'ref');
	//await scout.addAnimation(1, 'a_flinch01');

	scout.playSequence('stand_primary');
}

async function testEngie(scene: Scene) {
	const engineer = (await AddSource1Model('tf2', 'models/player/engineer', scene))!;

	await engineer.addAnimation(0, 'stand_item2');
	await engineer.addAnimation(1, 'item2_swing');
}

async function testDemo(scene: Scene) {
	const demo = (await AddSource1Model('tf2', 'models/player/demo', scene))!;
	await AddSource1Model('tf2', 'models/weapons/c_models/c_stickybomb_launcher/c_stickybomb_launcher', demo);

	await demo.addAnimation(0, 'stand_primary');
	await demo.addAnimation(1, 'gesture_primary_help');
}
