import { Harmony3D, GlMatrix, AddSource1Model, InitDemoStd } from '/js/application.js';

export const useCustomRenderLoop = true;

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	renderer.autoResize = false;
	renderer.setSize(0, 0);

	scene.background.color = GlMatrix.vec4.fromValues(0., 0., 0., 1);

	let ambientLight = scene.addChild(new Harmony3D.AmbientLight({ intensity: 1.0 }));
	let pointLight = scene.addChild(new Harmony3D.PointLight());
	pointLight.position = [100, 0, 50];


	perspectiveCamera.position = [0, -20, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.lookAt([50, 0, 0]);
	perspectiveCamera.verticalFov = 50;
	perspectiveCamera.farPlane = 10000;

	renderer.autoClear = false;

	let composer = new Harmony3D.Composer(renderer);
	let clearPass = new Harmony3D.ClearPass(GlMatrix.vec4.fromValues(0.2, 0.2, 0.2, 1), 1, 0);
	let renderPass = new Harmony3D.RenderPass(scene, perspectiveCamera);
	let pixelatePass = new Harmony3D.PixelatePass(perspectiveCamera);

	pixelatePass.horizontalTiles = 30;
	pixelatePass.pixelStyle = 0;

	composer.addPass(clearPass);
	composer.addPass(renderPass);
	composer.addPass(pixelatePass);

	function animate(event) {
		composer.render(event.detail.delta);

		//cube.material.uniforms.uColor = [Math.sin(performance.now()), 0, 0, 1];
		if (scene.activeCamera) {
			//renderer.render(scene, scene.activeCamera, event.detail.delta);
		}
	}
	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GRAPHICS_EVENT_TICK, animate);
	testHeavy(renderer, scene);

	renderer.autoResize = true;
}

async function testHeavy(renderer, scene) {
	perspectiveCamera.position = [500, 0, 150];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;
	let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	heavy.playSequence('taunt_laugh');
	heavy.selected = true;
	heavy.forEach((entity) => entity.selected = true);
}
