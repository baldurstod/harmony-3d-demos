import { Scene, Source2ModelInstance } from 'harmony-3d';
import { addSource2Model } from '../../../../../utils/source2';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class Dota2VenomancerDemo implements Demo {
	static readonly path = 'sourceengine/source2/dota2/items/venomancer';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [200, 0, 45];
		orbitCameraControl.target.position = [0, 0, 45];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 50;

		const item = await addSource2Model('dota2', 'models/items/venomancer/mechamancer/mechamancer_arms', scene) as Source2ModelInstance;
		item.playSequence('ACT_DOTA_LOADOUT');
	}
}

registerDemo(Dota2VenomancerDemo);
