import { vec4 } from 'gl-matrix';
import { ColorBackground, PointLight, Scene } from 'harmony-3d';
import { addSource2Model } from '../../../../utils/source2';
import { InitDemoStd } from '../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../demos';

class Source2DogDemo implements Demo {
	static readonly path = 'sourceengine/source2/alyx/dog';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		ambientLight.intensity = 0.2;
		perspectiveCamera.position = [100, 1800, 150];
		orbitCameraControl.target.position = [0, 0, 50];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;
		let dog = (await addSource2Model('hla', 'models/characters/dog/dog', scene))!;
		//dog.playAnimation('dog_endscene_01_idle');
		//dog.playAnimation('anim_test');
		dog.playAnimation('endscene_post_idle');
		scene.background = new ColorBackground({ color: vec4.fromValues(0.1, 0.1, 0.1, 1) });


		//let l = new PointLight({ position: [40, 0, 85], intensity: 10000, parent: scene });
		let l = new PointLight({ position: [0, 150, 0], intensity: 100000, parent: scene });
	}
}

registerDemo(Source2DogDemo);
