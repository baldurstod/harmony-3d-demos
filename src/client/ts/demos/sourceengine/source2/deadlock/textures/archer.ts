import { Material, Plane, Scene, Source2MaterialManager } from 'harmony-3d';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class Source2DeadlockArcher implements Demo {
	static readonly path = 'sourceengine/source2/deadlock/textures/archer';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [0, 0, 80];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;
		let plane = scene.addChild(new Plane({ width: 10, height: 10 })) as Plane;
		const material = await Source2MaterialManager.getMaterial('deadlock', 'models/heroes_staging/archer/materials/archer.vmat_c') as Material;
		plane.setMaterial(material)
	}
}

registerDemo(Source2DeadlockArcher);
