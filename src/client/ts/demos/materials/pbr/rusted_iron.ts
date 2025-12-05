import { vec4 } from 'gl-matrix';
import { ColorBackground, PointLight, Scene, Sphere } from 'harmony-3d';
import { createPbrMaterial } from '../../../utils/pbrmaterials';
import { InitDemoStd } from '../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../demos';

class RustedIronDemo implements Demo {
	static readonly path = 'materials/pbr/rusted_iron';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		ambientLight.intensity = 0.1;
		perspectiveCamera.position = [0, -10, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 1000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 50;
		scene.background = new ColorBackground({ color: vec4.fromValues(0.1, 0.1, 0.1, 1) });

		let l = new PointLight({ position: [0, -2, -0], intensity: 1, parent: scene });
		new Sphere({ parent: scene, radius: 1, material: createPbrMaterial('rustediron2')!, segments: 32, rings: 32 });
	}
}

registerDemo(RustedIronDemo);
