import { vec4 } from 'gl-matrix';
import { Camera, ChoreographiesManager, ColorBackground, OrbitControl, Scene } from 'harmony-3d';
import { AddSource1Model } from '../../../../../utils/source1';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class ChoreographyDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/misc/dueling_banjo';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [500, 0, 50];
		orbitCameraControl.target.setPosition([0, 0, 50]);
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;

		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });

		await new ChoreographiesManager().init('tf2', './scenes/scenes.image');
		const engineer = (await AddSource1Model('tf2', 'models/player/engineer', scene))!;
		const prop = (await AddSource1Model('tf2', 'models/workshop/player/items/engineer/taunt_bumpkins_banjo/taunt_bumpkins_banjo.mdl', engineer))!;
		await new ChoreographiesManager().playChoreography('scenes/workshop/player/engineer/low/taunt_bumpkins_banjo.vcd', [engineer]);
	}
}

registerDemo(ChoreographyDemo);
