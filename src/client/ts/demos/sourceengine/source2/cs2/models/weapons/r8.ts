import { Scene } from 'harmony-3d';
import { addSource2Model } from '../../../../../../utils/source2';
import { InitDemoStd } from '../../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../../demos';

class Source2Cs2R8Demo implements Demo {
	static readonly path = 'sourceengine/source2/cs2/weapons/r8';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [0, 130, -15];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;
		const revolver = await addSource2Model('cs2', 'weapons/models/revolver/weapon_pist_revolver.vmdl_c', scene);
		console.info(revolver);
	}
}

registerDemo(Source2Cs2R8Demo);
