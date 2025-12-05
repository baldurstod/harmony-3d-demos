import { Scene } from 'harmony-3d';
import { addSource2Model } from '../../../../../../utils/source2';
import { InitDemoStd } from '../../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../../demos';

class Source2Cs2PlayerDemo implements Demo {
	static readonly path = 'sourceengine/source2/cs2/models/player';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [500, 0, 150];
		orbitCameraControl.target.position = [0, 0, 50];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;
		let antimage = (await addSource2Model('dota2', 'models/heroes/antimage/antimage', scene))!;
		antimage.playSequence('ACT_DOTA_RUN');
	}
}

registerDemo(Source2Cs2PlayerDemo);
