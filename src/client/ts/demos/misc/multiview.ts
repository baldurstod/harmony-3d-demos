import { Harmony3D, InitDemoStd, GlMatrix, HarmonyUi } from '/js/application.js';

let perspectiveCamera;
let perspectiveCamera2;
let orbitCameraControl;
let orbitCameraControl2;
export function initDemo(renderer, scene, { htmlDemoContentTab, htmlDemoContent }) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -200, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;


	perspectiveCamera2 = scene.addChild(new Harmony3D.Camera({ autoResize: true }));
	orbitCameraControl2 = new Harmony3D.OrbitControl(perspectiveCamera2, Harmony3D.Graphics.getCanvas());
	perspectiveCamera2.position = [0, -200, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera2.farPlane = 10000;
	perspectiveCamera2.nearPlane = 0.1;
	perspectiveCamera2.verticalFov = 20;
	//Harmony3D.ContextObserver.observe(Harmony3D.GraphicsEvents, perspectiveCamera2);

	testMultiView(renderer, scene, htmlDemoContent);

	HarmonyUi.createElement('button', {
		parent: htmlDemoContentTab,
		innerHTML: 'Export fbx',
		events: {
			click: () => exportFBX(scene)
		}
	});
}

async function testMultiView(renderer, scene, htmlDemoContent) {
	let views = new Set();
	views.add({
		viewport: [0, 0, 0.5, 0.5],
		camera: perspectiveCamera
	});
	views.add({
		viewport: [0.65, 0.65, 0.35, 0.35,],
		camera: perspectiveCamera2
	});


	const mainCanvas = Harmony3D.Graphics.getCanvas('main_canvas');
	let viewport = GlMatrix.vec4.create();

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



	const layouts = [{ views: [] }, { views: [] }];
	mainCanvas.layouts.set('spheres', layouts[0]);
	mainCanvas.layouts.set('boxes', layouts[1],);
	for (let i = 0; i < 10; i++) {
		const scene = new Harmony3D.Scene({ background: new Harmony3D.ColorBackground({ color: [0.5, 0.5, 0.5, 1] }) });
		switch (i % 2) {
			case 0:
				scene.addChild(new Harmony3D.Sphere({ radius: 5, material: new Harmony3D.MeshFlatMaterial() }));
				break;
			case 1:
				scene.addChild(new Harmony3D.Box({ size: 5, material: new Harmony3D.MeshFlatMaterial() }));
				break;
		}
		//scene.addChild(new Harmony3D.Sphere({ radius: 5, segments: 12, rings: 12, material: new Harmony3D.MeshFlatMaterial() }));

		layouts[i % 2].views.push(
			{
				scene: scene,
				camera: perspectiveCamera,
				viewport: { x: Math.random(), y: Math.random(), width: Math.random() * 0.2 + 0.1, height: Math.random() * 0.2 + 0.1 },
			},
		);

		scene.addChild(new Harmony3D.AmbientLight({ intensity: 1.0 }));
	}


	HarmonyUi.defineHarmonySwitch();
	const sw = HarmonyUi.createElement('harmony-switch', {
		parent: htmlDemoContent,
		i18n: '#display_group',
		//$change: event => { groups[0].enabled = event.target.state; groups[1].enabled = !event.target.state },
		$change: event => { mainCanvas.useLayout = event.target.state ? 'spheres' : 'boxes' },
		state: true,
	});

	//renderer.addEventListener('tick', animate);
	//Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GraphicsEvent.Tick, animate);

	//scene.addChild(new Harmony3D.Sphere({ radius: 5, segments: 12, rings: 12, material: new Harmony3D.MeshFlatMaterial() }));

}
