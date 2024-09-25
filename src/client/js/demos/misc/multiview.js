import { Harmony3D, InitDemoStd, GlMatrix, HarmonyUi } from '/js/application.js';

let perspectiveCamera;
let perspectiveCamera2;
let orbitCameraControl;
let orbitCameraControl2;
export function initDemo(renderer, scene, { htmlDemoContentTab }) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -200, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;


	perspectiveCamera2 = scene.addChild(new Harmony3D.Camera());
	orbitCameraControl2 = new Harmony3D.OrbitControl(perspectiveCamera2, Harmony3D.Graphics.canvas);
	perspectiveCamera2.position = [0, -200, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera2.farPlane = 10000;
	perspectiveCamera2.nearPlane = 0.1;
	perspectiveCamera2.verticalFov = 20;
	Harmony3D.ContextObserver.observe(Harmony3D.GraphicsEvents, perspectiveCamera2);

	testMultiView(renderer, scene);

	HarmonyUi.createElement('button', {
		parent: htmlDemoContentTab,
		innerHTML: 'Export fbx',
		events: {
			click: () => exportFBX(scene)
		}
	});
}

async function testMultiView(renderer, scene) {
	function animate(event) {
		Harmony3D.WebGLStats.tick();
		renderer.scissorTest = true;
		perspectiveCamera.dirtyCameraMatrix = true;
		perspectiveCamera2.dirtyCameraMatrix = true;
		for (let view of views) {
			GlMatrix.vec4.copy(viewport, view.viewport);
			viewport[0] *= renderer._width;
			viewport[1] *= renderer._height;
			viewport[2] *= renderer._width;
			viewport[3] *= renderer._height;
			renderer.viewport = viewport;
			renderer.scissor = viewport;
			renderer.render(scene, view.camera);
		}
	}

	let views = new Set();
	views.add({
		viewport: [0, 0, 0.5, 0.5],
		camera: perspectiveCamera
	});
	views.add({
		viewport: [0.65, 0.65, 0.35, 0.35,],
		camera: perspectiveCamera2
	});

	let viewport = GlMatrix.vec4.create();


	//renderer.addEventListener('tick', animate);
	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GraphicsEvent.Tick, animate);

	scene.addChild(new Harmony3D.Sphere({ radius: 5, segments: 12, rings: 12, material: new Harmony3D.MeshFlatMaterial() }));
}
