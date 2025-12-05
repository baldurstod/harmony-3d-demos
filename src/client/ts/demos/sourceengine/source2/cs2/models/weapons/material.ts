import { Plane, Scene, Source2Material, Source2MaterialManager } from 'harmony-3d';
import { InitDemoStd } from '../../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../../demos';

class Source2Cs2Ak47MaterialDemo implements Demo {
	static readonly path = 'sourceengine/source2/cs2/weapons/material';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, 0, 80];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;
		let plane = scene.addChild(new Plane({ width: 10, height: 10 })) as Plane;
		//const material = await Source2MaterialManager.getMaterial('cs2', 'weapons/models/revolver/materials/weapon_pist_revolver.vmat_c');
		const material = await Source2MaterialManager.getMaterial('cs2', 'weapons/models/ak47/materials/weapon_rif_ak47.vmat_c') as Source2Material;
		plane.setMaterial(material)
	}
}

registerDemo(Source2Cs2Ak47MaterialDemo);
