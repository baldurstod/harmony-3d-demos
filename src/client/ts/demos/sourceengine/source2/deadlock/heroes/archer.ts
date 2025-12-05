import { PointLight, Scene, Source2ModelInstance } from 'harmony-3d';
import { addSource2Model } from '../../../../../utils/source2';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class Source2DeadlockArcher implements Demo {
	static readonly path = 'sourceengine/source2/deadlock/heroes/archer';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		ambientLight.intensity = 0.1;
		perspectiveCamera.position = [200, 0, 45];
		orbitCameraControl.target.position = [0, 0, 45];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 50;

		scene.addChild(new PointLight({ position: [50, -10, 60], intensity: 10000 }))

		const items: string[] = [
		]

		const hero = await addSource2Model('deadlock', 'models/heroes_staging/archer/archer', scene) as Source2ModelInstance;
		hero.playAnimation('idle_loadout');

		for (const item of items) {
			const itemModel = await addSource2Model('dota2', item, hero) as Source2ModelInstance;
			itemModel.playSequence('ACT_DOTA_IDLE');
		}
	}
}

registerDemo(Source2DeadlockArcher);
