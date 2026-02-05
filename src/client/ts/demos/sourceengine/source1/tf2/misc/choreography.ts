import { vec4 } from 'gl-matrix';
import { ChoreographiesManager, ColorBackground, Scene } from 'harmony-3d';
import { AddSource1Model } from '../../../../../utils/source1';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class ChoreographyDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/misc/choreography';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [0, 500, 80];
		orbitCameraControl.target.position = [0, 0, 80];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;

		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });

		await ChoreographiesManager.init('tf2', './scenes/scenes.image');
		let medic = (await AddSource1Model('tf2', 'models/player/medic', scene))!;
		await ChoreographiesManager.playChoreography('tf2', 'scenes\\player\\scout\\low\\taunt_brutalLegend.vcd', [medic]);
	}
}

registerDemo(ChoreographyDemo);
