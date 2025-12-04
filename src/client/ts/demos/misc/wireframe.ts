import { Scene, Sphere, Wireframe } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class WireframeDemo implements Demo {
	static readonly path = 'misc/wireframe';

	initDemo(scene: Scene, params: InitDemoParams): void {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, -20, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 10;
		testWireframe(scene);
	}
}

registerDemo(WireframeDemo);

async function testWireframe(scene: Scene) {
	let sphere = scene.addChild(new Sphere()) as Sphere;
	sphere.wireframe = 0;
	sphere.addChild(new Wireframe());

	//let heavy = (await AddSource1Model('tf2', 'models/player/heavy', scene))!;
	//heavy.playSequence('taunt_laugh');
}
