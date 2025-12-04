import { vec4 } from 'gl-matrix';
import { AmbientLight, Box, Camera, CanvasLayout, CanvasView, ColorBackground, Graphics, MeshFlatMaterial, OrbitControl, Scene, Sphere } from 'harmony-3d';
import { createElement, defineHarmonySwitch, HarmonySwitchChange } from 'harmony-ui';
import { exportFBX } from '../../utils/fbx';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';


/*
let perspectiveCamera;
let perspectiveCamera2;
let orbitCameraControl;
let orbitCameraControl2;
*/

class MultiviewDemo implements Demo {
	static readonly path = 'misc/multiview';

	initDemo(scene: Scene, params: InitDemoParams): void {
		//export function initDemo(renderer, scene, { htmlDemoContentTab, htmlDemoContent }) {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, -200, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 10;


		const perspectiveCamera2 = scene.addChild(new Camera({ autoResize: true, position: [0, -200, 0], farPlane: 10000, nearPlane: 0.1, verticalFov: 20, })) as Camera;
		const orbitCameraControl2 = new OrbitControl(perspectiveCamera2);
		orbitCameraControl.target.setPosition([0, 0, 0]);
		//ContextObserver.observe(GraphicsEvents, perspectiveCamera2);

		testMultiView(params.htmlDemoContent, perspectiveCamera, perspectiveCamera2);

		createElement('button', {
			parent: params.htmlDemoContentTab,
			innerHTML: 'Export fbx',
			events: {
				click: () => exportFBX(scene)
			}
		});
	}
}

registerDemo(MultiviewDemo);

async function testMultiView(htmlDemoContent: HTMLElement, perspectiveCamera: Camera, perspectiveCamera2: Camera): Promise<void> {
	let views = new Set();
	views.add({
		viewport: [0, 0, 0.5, 0.5],
		camera: perspectiveCamera
	});
	views.add({
		viewport: [0.65, 0.65, 0.35, 0.35,],
		camera: perspectiveCamera2
	});


	const mainCanvas = Graphics.getCanvas('main_canvas')!;
	let viewport = vec4.create();

	//canvas.groups = [
	/*
	{
		scene,
		camera: perspectiveCamera,
		viewport: { x: 0, y: 0, width: 0.5, height: 0.5 },
	},
	{
		scene,
		camera: perspectiveCamera,
		viewport: { x: 0.65, y: 0.65, width: 0.35, height: 0.35 },
	}
	*/
	/*

	{
		scene,
		camera: perspectiveCamera,
		viewport: { x: 0, y: 0, width: 0.25, height: 0.5 },
	}
	*/
	//];



	//const layouts = [{ views: [] }, { views: [] }];
	const layouts = [new CanvasLayout('spheres'), new CanvasLayout('boxes')];
	mainCanvas.addLayout(layouts[0]!);
	mainCanvas.addLayout(layouts[1]!);
	//mainCanvas.layouts.set('spheres', layouts[0]);
	//mainCanvas.layouts.set('boxes', layouts[1]);
	for (let i = 0; i < 10; i++) {
		const scene = new Scene({ background: new ColorBackground({ color: [0.5, 0.5, 0.5, 1] }) });
		switch (i % 2) {
			case 0:
				scene.addChild(new Sphere({ radius: 5, material: new MeshFlatMaterial() }));
				break;
			case 1:
				scene.addChild(new Box({ size: 5, material: new MeshFlatMaterial() }));
				break;
		}
		//scene.addChild(new Sphere({ radius: 5, segments: 12, rings: 12, material: new MeshFlatMaterial() }));

		layouts[i % 2]!.addView(new CanvasView({
			name: String(i),
			scene: scene,
			camera: perspectiveCamera,
			viewport: { x: Math.random(), y: Math.random(), width: Math.random() * 0.2 + 0.1, height: Math.random() * 0.2 + 0.1 },

		}));

		scene.addChild(new AmbientLight({ intensity: 1.0 }));
	}


	defineHarmonySwitch();
	const sw = createElement('harmony-switch', {
		parent: htmlDemoContent,
		i18n: '#display_group',
		//$change: event => { groups[0].enabled = event.target.state; groups[1].enabled = !event.target.state },
		$change: (event: CustomEvent<HarmonySwitchChange>) => { mainCanvas.useLayout = event.detail.state ? 'spheres' : 'boxes' },
		state: true,
	});

	//renderer.addEventListener('tick', animate);
	//GraphicsEvents.addEventListener(GraphicsEvent.Tick, animate);

	//scene.addChild(new Sphere({ radius: 5, segments: 12, rings: 12, material: new MeshFlatMaterial() }));

}
