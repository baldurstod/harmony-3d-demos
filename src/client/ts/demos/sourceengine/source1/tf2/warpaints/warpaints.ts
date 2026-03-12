import { Scene } from 'harmony-3d';
import { AddSource1Model } from '../../../../../utils/source1';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';
import { quat, vec3 } from 'gl-matrix';
import { WeaponManager } from 'harmony-3d-utils';
import { setTimeoutPromise } from 'harmony-utils';
import { WarpaintDefinitions } from 'harmony-tf2-utils';

class WarpaintsDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/warpaints/warpaints';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, -200, 0];
		orbitCameraControl.target.setPosition([0, 0, 0]);
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 15;

		const rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
		const rocketLauncher = await AddSource1Model('tf2', rocketLauncherPath, scene);
		rocketLauncher.playAnimation('idle');

		await setTimeoutPromise(1000);

		const TF2_REPOSITORY = 'https://tf2content.loadout.tf/';
		const TF2_WARPAINT_DEFINITIONS_URL = TF2_REPOSITORY + 'generated/warpaint_definitions.json';

		WarpaintDefinitions.setWarpaintDefinitionsURL(TF2_WARPAINT_DEFINITIONS_URL);

		WeaponManager.refreshWarpaint({
			id: '205~0',// RL
			warpaintId: 112,
			warpaintWear: 0,
			warpaintSeed: 0n,
			model: rocketLauncher,
			team: 0,
			textureSize: 1024,
			updatePreview: false,
		});
	}
}

registerDemo(WarpaintsDemo);
