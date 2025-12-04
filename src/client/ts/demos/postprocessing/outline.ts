import { vec4 } from 'gl-matrix';
import { AmbientLight, Camera, CanvasLayout, CanvasView, ClearPass, ColorBackground, Composer, CopyPass, Graphics, OrbitControl, OutlinePass, PixelatePass, PointLight, RenderPass, Scene } from 'harmony-3d';
import { AddSource1Model } from '../../utils/source1';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class OutlineDemo implements Demo {
	static readonly path = 'postprocessing/outline';

	initDemo(scene: Scene, params: InitDemoParams): void {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });//.setColor(vec4.fromValues(0., 0., 0., 1));

		scene.addChild(new AmbientLight({ intensity: 1.0 }));
		scene.addChild(new PointLight({ position: [100, 0, 50] }));

		perspectiveCamera.position = [0, -20, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.lookAt([50, 0, 0]);
		perspectiveCamera.verticalFov = 50;
		perspectiveCamera.farPlane = 10000;

		//renderer.autoClear = false;

		let scene2 = new Scene();

		let composer = new Composer();
		let clearPass = new ClearPass(vec4.fromValues(0.2, 0.2, 0.2, 1), 1, 0);
		let renderPass = new RenderPass(scene, perspectiveCamera);
		let outlinePass = new OutlinePass(scene, perspectiveCamera);


		composer.addPass(clearPass);
		composer.addPass(renderPass);
		//composer.addPass(renderPass2);
		composer.addPass(outlinePass);

		testHeavy(scene, perspectiveCamera, orbitCameraControl);
	}
}
registerDemo(OutlineDemo);

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
