import { Scene } from 'harmony-3d';
import { InitDemoStd } from '../utils/utils';
import { Demo, InitDemoParams, registerDemo } from './demos';

class BlankDemo implements Demo {
	static readonly path = 'blank';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
	}
}

registerDemo(BlankDemo);
