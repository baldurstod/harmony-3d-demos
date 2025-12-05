import { Circle, Scene } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class CircleDemo implements Demo {
	static readonly path = 'primitives/circle';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.setPosition([0, 0, 20]);
		orbitCameraControl.target.setPosition([0, 0, 0]);
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 10;

		//scene.addChild(new Circle(1, undefined, undefined, -1.57 * 0.5, 1.57))
		scene.addChild(new Circle({ radius: 1, startAngle: -1.57 * 0.5, endAngle: 1.57 }));
	}
}

registerDemo(CircleDemo);
