import { vec3, vec4 } from 'gl-matrix';
import { AmbientLight, Box, ColorBackground, DEG_TO_RAD, EmissiveMaterial, FullScreenQuad, Graphics, Plane, PointLight, Raytracer, RenderFace, Scene, SceneExplorer, ShaderMaterial, Source1BspLoader, Source2ModelInstance, SourceBSP, UniformValue } from 'harmony-3d';
import { WeaponManager } from 'harmony-3d-utils';
import { WarpaintDefinitions } from 'harmony-tf2-utils';
import { createElement, defineHarmonySwitch, HTMLHarmonyToggleButtonElement } from 'harmony-ui';
import { setTimeoutPromise } from 'harmony-utils';
import { AddSource1Model } from '../../utils/source1';
import { addSource2Model } from '../../utils/source2';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class RaytracingDemo implements Demo {
	static readonly path = 'raytracing/raytracing';
	#renderFrames = Infinity;

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		if (Graphics.isWebGLAny) {
			alert('This demo is only available in WebGPU mode');
			return;
		}
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });//.setColor(vec4.fromValues(0., 0., 0., 1));

		scene.addChild(new AmbientLight({ intensity: 1.0 }));
		scene.addChild(new PointLight({ position: [100, 0, 50] }));

		//const cameraPosition = [-20, -14, 44];
		const cameraPosition = [0, -500, 40];
		const cameraLookAt = [0, 150, 40];

		perspectiveCamera.position = cameraPosition;
		//perspectiveCamera.lookAt([0, 1, 0]);
		orbitCameraControl.target.setPosition([0, 150, 40]);
		//orbitCameraControl.target.setPosition([0, 0, 0]);
		perspectiveCamera.verticalFov = 18;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.aperture = 0.;
		//orbitCameraControl.enabled = false;
		perspectiveCamera.rotateGlobalX(90 * DEG_TO_RAD);
		perspectiveCamera.rotateX(25 * DEG_TO_RAD);
		perspectiveCamera.rotateY(-10 * DEG_TO_RAD);
		perspectiveCamera.rotateGlobalZ(-90 * DEG_TO_RAD);

		perspectiveCamera.focus = vec3.distance(cameraPosition, cameraLookAt);
		//perspectiveCamera.focus = 3.4;

		const raytracer = new Raytracer();
		defineHarmonySwitch();

		let htmlPlay: HTMLHarmonyToggleButtonElement;

		let htmlDebugColor: HTMLInputElement;
		let htmlDebugNormal: HTMLInputElement;

		function debugColor(debug: boolean): void {
			raytracer.getMaterial().setSubUniformValue('commonUniforms.debugColor', debug ? 1 : 0);
		}

		function debugNormals(debug: boolean): void {
			raytracer.getMaterial().setSubUniformValue('commonUniforms.debugNormals', debug ? 1 : 0);

		}

		createElement('div', {
			parent: params.htmlDemoContent,
			style: 'display:flex;flex-direction:column;',
			childs: [
				createElement('button', {
					innerHTML: 'reset',
					$click: () => reset(),
				}),
				htmlPlay = createElement('harmony-switch', {
					'data-i18n': '#play',
					state: '1',
					$change: (event: Event) => {
						if ((event.target as HTMLHarmonyToggleButtonElement).state) {
							play();
						} else {
							pause();
						}
					},
				}) as HTMLHarmonyToggleButtonElement,
				createElement('label', {
					innerText: 'debug color',
					child: htmlDebugColor = createElement('input', {
						type: 'checkbox',
						$input: (event: InputEvent) => {
							const debug = (event.target as HTMLInputElement).checked;
							debugColor(debug);
							if (debug) {
								debugNormals(false);
								htmlDebugNormal.checked = false;
							}
							reset();
						},
					}) as HTMLInputElement,
				}),
				createElement('label', {
					innerText: 'debug normals',
					child: htmlDebugNormal = createElement('input', {
						type: 'checkbox',
						$input: (event: InputEvent) => {
							const debug = (event.target as HTMLInputElement).checked;
							debugNormals(debug);
							if (debug) {
								debugColor(false);
								htmlDebugColor.checked = false;
							}
							reset();
						},
					}) as HTMLInputElement,
				}),
				createElement('label', {
					innerText: 'debug bhv',
					child: createElement('input', {
						type: 'checkbox',
						$input: (event: InputEvent) => {
							raytracer.debugBvh((event.target as HTMLInputElement).checked);
						},
					}),
				}),
				createElement('label', {
					innerText: 'bounces',
					child: createElement('input', {
						type: 'range',
						min: 0,
						max: 4,
						value: '1',
						$input: (event: InputEvent) => {
							raytracer.getMaterial().setSubUniformValue('commonUniforms.maxBounces', Number((event.target as HTMLInputElement).value));
							reset();
						},
					}),
				}),
			]
		});

		const downScale = 4;

		const WIDTH = 800;
		const HEIGHT = 600;

		const mainCanvas = Graphics.getCanvas('main_canvas')!;
		mainCanvas.autoResize = false;
		mainCanvas.width = WIDTH;
		mainCanvas.height = HEIGHT;


		const rtScene = new Scene({ camera: perspectiveCamera, childs: [perspectiveCamera] });

		new SceneExplorer().setScene(rtScene);

		const rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
		const rocketLauncher = await AddSource1Model('tf2', rocketLauncherPath, rtScene);
		rocketLauncher.playAnimation('idle');
		//rocketLauncher.scale = vec3.fromValues(0.04, 0.04, 0.04);
		rocketLauncher.translateX(0.5);
		rocketLauncher.translateY(-0.25);
		rocketLauncher.rotateGlobalX(-90 * DEG_TO_RAD);
		rocketLauncher.setVisible(false);

		const rtCanvas = Graphics.addCanvas({
			name: 'rt_canvas',
			scene: rtScene,
			autoResize: false,
			width: WIDTH,
			height: HEIGHT,
		});

		mainCanvas.canvas.parentElement.append(rtCanvas.canvas);
		mainCanvas.canvas.style.width = `${WIDTH}px`;
		mainCanvas.canvas.style.height = `${HEIGHT}px`;

		params.application.openShader('raytracer.wgsl');

		const mapName = 'maps/sfm_photostudio_lite.bsp';

		let map = (await (new Source1BspLoader()).load('tf2', mapName)) as SourceBSP;
		rtScene.addChild(map);
		map.initMap();
		//map.scale = vec3.fromValues(0.005, 0.005, 0.005);
		//map.translateY(-4);


		await setTimeoutPromise(1000);//TODO use an actual promise to wait for materials

		const emissiveMaterial = new EmissiveMaterial({ renderFace: RenderFace.Both });

		new Box({ parent: rtScene, size: 10, material: emissiveMaterial, position: [0, 150, 50] });
		const plane = new Plane({ parent: rtScene, width: 500, position: [0, 0, 300], material: emissiveMaterial });
		new AmbientLight({ parent: rtScene });
		plane.rotateX(180 * DEG_TO_RAD);

		await raytracer.configure(rtScene, WIDTH / downScale, HEIGHT / downScale);
		play();

		const raytracerMat = new ShaderMaterial({
			shaderSource: 'presentation',
			uniforms: {
				inTexture: raytracer.getOutputTexture(),
			},
		});


		new FullScreenQuad({ parent: scene, material: raytracerMat, });

		async function reset() {
			await raytracer.configure(rtScene, WIDTH / downScale, HEIGHT / downScale);
			play();
		}

		function play() {
			raytracer.play();
			htmlPlay.state = true;
		}
		function pause() {
			raytracer.pause();
			htmlPlay.state = false;
		}

		//await initMtt(rtScene);
		//await initWarpaint(rtScene);
		//await initAustralium(rtScene);
		await initSource2(rtScene);

	}
}

registerDemo(RaytracingDemo);

async function initMtt(scene: Scene): Promise<void> {
	for (const c of mtt) {
		const model = await AddSource1Model('tf2', `models/player/${c.m}`, scene);
		model.sourceModel.mdl.addExternalMdl('models/player/loadout_tf/' + c.m.toLowerCase().replace(/bots\/[^\/]*\/bot_/, 'player/') + '_loadout_tf_animations.mdl');
		model.playSequence('meettheteam');
		model.setPosition(c.p);
		model.setOrientation(c.o);

		if (c.m === 'soldier') {
			const rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
			const rocketLauncher = await AddSource1Model('tf2', rocketLauncherPath, model);
			rocketLauncher.playAnimation('idle');

			await setTimeoutPromise(1000);

			const TF2_REPOSITORY = 'https://tf2content.loadout.tf/';
			const TF2_WARPAINT_DEFINITIONS_URL = TF2_REPOSITORY + 'generated/warpaint_definitions.json';

			WarpaintDefinitions.setWarpaintDefinitionsURL(TF2_WARPAINT_DEFINITIONS_URL);

			WeaponManager.refreshWarpaint({
				id: '205~0',// RL
				warpaintId: 230,
				warpaintWear: 0,
				warpaintSeed: 0n,
				model: rocketLauncher,
				team: 0,
				textureSize: 1024,
				updatePreview: false,
			});
		}
	}
}

async function initWarpaint(scene: Scene): Promise<void> {
	const rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
	const rocketLauncher = await AddSource1Model('tf2', rocketLauncherPath, scene);
	rocketLauncher.playAnimation('idle');

	await setTimeoutPromise(1000);

	const TF2_REPOSITORY = 'https://tf2content.loadout.tf/';
	const TF2_WARPAINT_DEFINITIONS_URL = TF2_REPOSITORY + 'generated/warpaint_definitions.json';

	WarpaintDefinitions.setWarpaintDefinitionsURL(TF2_WARPAINT_DEFINITIONS_URL);

	WeaponManager.refreshWarpaint({
		id: '205~0',// RL
		warpaintId: 230,
		warpaintWear: 0,
		warpaintSeed: 0n,
		model: rocketLauncher,
		team: 0,
		textureSize: 1024,
		updatePreview: false,
	});
}

async function initAustralium(scene: Scene): Promise<void> {
	const soldier = await AddSource1Model('tf2', `models/player/soldier`, scene);
	soldier.playSequence('stand_primary');
	const rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
	const rocketLauncher = await AddSource1Model('tf2', rocketLauncherPath, scene);
	rocketLauncher.playAnimation('idle');
	rocketLauncher.setSkin('8');

	await setTimeoutPromise(1000);

	const TF2_REPOSITORY = 'https://tf2content.loadout.tf/';
	const TF2_WARPAINT_DEFINITIONS_URL = TF2_REPOSITORY + 'generated/warpaint_definitions.json';

	WarpaintDefinitions.setWarpaintDefinitionsURL(TF2_WARPAINT_DEFINITIONS_URL);

	soldier.setPoseParameter('body_pitch', 0.5);
}

async function initSource2(scene: Scene): Promise<void> {
	//const dawnbreaker = await addSource2Model('dota2', `models/heroes/dawnbreaker/dawnbreaker.vmdl_c`, scene);
	//dawnbreaker.playSequence('stand_primary');


	const items = [
		'models/heroes/dawnbreaker/dawnbreaker_arms',
		'models/heroes/dawnbreaker/dawnbreaker_armor',
		'models/heroes/dawnbreaker/dawnbreaker_weapon',
		'models/heroes/dawnbreaker/dawnbreaker_head',
	]

	const hero = await addSource2Model('dota2', 'models/heroes/dawnbreaker/dawnbreaker', scene) as Source2ModelInstance;
	hero.playSequence('ACT_DOTA_IDLE');
	hero.animationSpeed = 0.;

	for (const item of items) {
		const itemModel = await addSource2Model('dota2', item, hero) as Source2ModelInstance;
		itemModel.playSequence('ACT_DOTA_IDLE');
	}
}

const mtt = [
	{
		'm': 'pyro',
		'p': [-100.2281036377, 198.9871826172, 0],
		'o': [0, 0, 0.7659834027290344, -0.6428603529930115]
	},
	{
		'm': 'engineer',
		'p': [-75.0726394653, 213.8566589355, 0],
		'o': [
			0, 0, 0.649108350276947, -0.7606959939002991]
	},
	{
		'm': 'spy',
		'p': [-42.7902297974, 191.040435791, 0],
		'o': [0, 0, 0.8473811149597168, -0.5309851169586182]
	},
	{
		'm': 'heavy',
		'p': [-12.7672653198, 168.1013031006, 0],
		'o': [0, 0, 0.8095924258232117, -0.5869923830032349]
	},
	{
		'm': 'sniper',
		'p': [13.5784225464, 184.4625854492, 0],
		'o': [0, 0, 1, -1]
	},
	{
		'm': 'scout',
		'p': [24.4398727417, 144.8651275635, 0],
		'o': [0, 0, 0.6889068484306335, -0.7248498797416687]
	},
	{
		'm': 'soldier',
		'p': [45.6801071167, 199.4777526855, 0],
		'o': [0, 0, 1, -1]
	},
	{
		'm': 'demo',
		'p': [67.8846969604, 162.6588745117, 0],
		'o': [0, 0, -0.8936024904251099, 0.4488592743873596]
	},
	{
		'm': 'medic',
		'p': [90.9413299561, 182.8147583008, 0],
		'o': [0, 0, 1, -1]
	}
]
