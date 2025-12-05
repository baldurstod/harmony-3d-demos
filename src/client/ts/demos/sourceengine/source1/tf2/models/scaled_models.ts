import { Scene } from 'harmony-3d';
import { AddSource1Model } from '../../../../../utils/source1';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class ScaledModelsDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/models/scaled_models';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [500, 0, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;

		let modelName;
		let rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
		let stattrackPath = 'models/weapons/c_models/stattrack.mdl';

		let rocketLauncher = (await AddSource1Model('tf2', rocketLauncherPath, scene))!;
		let stattrack = (await AddSource1Model('tf2', stattrackPath, scene))!;
		stattrack.scale = [10, 10, 10];

		rocketLauncher.addChild(stattrack);
		rocketLauncher.playSequence('');

		let stattrakBone = rocketLauncher.getBoneByName('c_weapon_stattrack');
		if (stattrakBone) {
			let scale = 1.2;
			stattrakBone.scale = [scale, scale, scale];
		}

		rocketLauncher.scale = [10, 10, 10];
	}
}

registerDemo(ScaledModelsDemo);
