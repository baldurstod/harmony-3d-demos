import { Scene, Source2ModelInstance } from 'harmony-3d';
import { addSource2Model } from '../../../../../utils/source2';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class Dota2MarsDemo implements Demo {
	static readonly path = 'sourceengine/source2/dota2/heroes/mars';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [200, 0, 45];
		orbitCameraControl.target.position = [0, 0, 45];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 50;

		const items = [
			'models/heroes/mars/mars_spear',
		]

		const hero = await addSource2Model('dota2', 'models/heroes/mars/mars', scene) as Source2ModelInstance;
		hero.playSequence('ACT_DOTA_IDLE');

		for (const item of items) {
			const itemModel = await addSource2Model('dota2', item, hero) as Source2ModelInstance;
			itemModel.playSequence('ACT_DOTA_IDLE');
		}
	}
}

registerDemo(Dota2MarsDemo);
