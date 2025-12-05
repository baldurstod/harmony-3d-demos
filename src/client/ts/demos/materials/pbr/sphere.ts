import { vec4 } from 'gl-matrix';
import { ColorBackground, FontManager, MeshBasicPbrMaterial, PointLight, Scene, Sphere } from 'harmony-3d';
import { InitDemoStd } from '../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../demos';

class PbrSphereDemo implements Demo {
	static readonly path = 'materials/pbr/sphere';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, 0, -2];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 1000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 50;
		scene.background = new ColorBackground({ color: vec4.fromValues(0.1, 0.1, 0.1, 1) });

		FontManager.setFontsPath(new URL('./json/fonts/', document.location.origin));
		let l = new PointLight({ position: [1.25, 1.0, -2], intensity: 1, color: [1, 1, 1], parent: scene });
		let material = new MeshBasicPbrMaterial({ metalness: 0, roughness: 0.2, color: [1, 0, 0, 1] });
		let sphere = new Sphere({ parent: scene, material: material, segments: 32, rings: 32 });
	}
}

registerDemo(PbrSphereDemo);
