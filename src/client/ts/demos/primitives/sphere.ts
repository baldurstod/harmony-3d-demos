import { AmbientLight, MeshFlatMaterial, PointLight, Scene, Sphere } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class DecalDemo implements Demo {
	static readonly path = 'primitives/sphere';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		perspectiveCamera.position = [2, -20, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 30;
		ambientLight.remove();

		//scene.addChild(new AmbientLight({ color: [1, 0.5, 0] }));

		let material = new MeshFlatMaterial();
		let sphere = scene.addChild(new Sphere({ radius: 5, segments: 12, rings: 12, material: material/*, phiLength:1.57, thetaLength:1.57*/ }));


		let light = new PointLight({ parent: scene });
		light.setPosition(perspectiveCamera.position);
	}
}

registerDemo(DecalDemo);
