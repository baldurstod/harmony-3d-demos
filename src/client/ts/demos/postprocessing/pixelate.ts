import { vec4 } from 'gl-matrix';
import { AmbientLight, Camera, CanvasLayout, CanvasView, ClearPass, ColorBackground, Composer, Graphics, OrbitControl, PixelatePass, PointLight, RenderPass, Scene } from 'harmony-3d';
import { AddSource1Model } from '../../utils/source1';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class PixelateDemo implements Demo {
	static readonly path = 'postprocessing/pixelate';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		//renderer.autoResize = false;
		//renderer.setSize(0, 0);

		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });//.setColor(vec4.fromValues(0., 0., 0., 1));

		let ambientLight = scene.addChild(new AmbientLight({ intensity: 1.0 }));
		let pointLight = new PointLight({ parent: scene });
		pointLight.position = [100, 0, 50];


		perspectiveCamera.position = [0, -20, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.lookAt([50, 0, 0]);
		perspectiveCamera.verticalFov = 50;
		perspectiveCamera.farPlane = 10000;

		//renderer.autoClear = false;

		let composer = new Composer();
		let clearPass = new ClearPass(vec4.fromValues(0.2, 0.2, 0.2, 1), 1, 0);
		let renderPass = new RenderPass(scene, perspectiveCamera);
		let pixelatePass = new PixelatePass(perspectiveCamera);

		pixelatePass.horizontalTiles = 30;
		pixelatePass.pixelStyle = 0;

		composer.addPass(clearPass);
		composer.addPass(renderPass);
		composer.addPass(pixelatePass);

		const mainCanvas = Graphics.getCanvas('main_canvas')!;

		mainCanvas.useLayout = 'default';
		mainCanvas.addLayout(new CanvasLayout('default', [
			new CanvasView({ name: 'view', scene, composer }),
			//new CanvasView({ name: 'view', scene, composer, viewport: new Viewport({ width: 0.5, }) }),
			//new CanvasView({ name: 'view', scene, viewport: new Viewport({ x: 0.5, width: 0.5, }) }),
		]));

		testHeavy(scene, perspectiveCamera, orbitCameraControl);
	}
}
registerDemo(PixelateDemo);

async function testHeavy(scene: Scene, perspectiveCamera: Camera, orbitCameraControl: OrbitControl) {
	perspectiveCamera.position = [500, 0, 150];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;
	let heavy = (await AddSource1Model('tf2', 'models/player/heavy', scene))!;
	heavy.playSequence('taunt_laugh');
	//heavy.selected = true;
	//heavy.forEach((entity) => entity.selected = true);
}
