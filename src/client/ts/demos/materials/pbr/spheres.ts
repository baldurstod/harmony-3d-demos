import { vec3, vec4 } from 'gl-matrix';
import { ColorBackground, FontManager, GraphicsEvent, GraphicsEvents, GraphicTickEvent, Group, MeshBasicPbrMaterial, PointLight, Scene, Sphere, Text3D } from 'harmony-3d';
import { InitDemoStd } from '../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../demos';

class PbrSpheresDemo implements Demo {
	static readonly path = 'materials/pbr/spheres';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		ambientLight.intensity = 0.;
		perspectiveCamera.position = [0, -100, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 50;
		scene.background = new ColorBackground({ color: vec4.fromValues(0.1, 0.1, 0.1, 1) });

		FontManager.setFontsPath(new URL('./json/fonts/', document.location.origin));
		const group = new Group({ parent: scene });

		const metalnessText = new Text3D({ text: 'metalness', size: 5, depth: 1, position: [-20, 0, -35], scale: [1, 1, 0.1], parent: scene });
		const roughnessText = new Text3D({ text: 'roughness', size: 5, depth: 1, position: [-35, 0, -20], quaternion: [0.5, -0.5, 0.5, 0.5], scale: [1, 1, 0.1], parent: scene });


		const lights: PointLight[] = [];
		const teta: number[] = [];
		const speed: number[] = [];

		let color = vec3.create()
		for (let i = 0; i < 4; i++) {
			vec3.random(color);
			color[0] = Math.abs(color[0]);
			color[1] = Math.abs(color[1]);
			color[2] = Math.abs(color[2]);
			let l = new PointLight({ position: [0, -100, -0], intensity: 100000, color: color, parent: scene });
			lights.push(l);
			teta.push(Math.random() * 2 * Math.PI);
			speed.push(Math.random() * 2 - 1);
		}

		for (let i = 0; i <= 10; i++) {
			for (let j = 0; j <= 10; j++) {
				let material = new MeshBasicPbrMaterial({ metalness: i / 10, roughness: j / 10, color: [1, 0, 0, 1] });
				let sphere = new Sphere({ material: material, segments: 16, rings: 16 });
				sphere.position = [(i - 5) * 5, 0, (j - 5) * 5];
				group.addChild(sphere);
			}
		}

		GraphicsEvents.addEventListener(GraphicsEvent.Tick, (event) => {
			//orthoCameraControl.update(event.detail.delta / 1000)

			for (let i = 0; i < 4; i++) {
				let angle = 4 * speed[i]! * (event as CustomEvent<GraphicTickEvent>).detail.time / 1000. + teta[i]!;
				lights[i]!.position = [100 * Math.cos(angle), -100, 100 * Math.sin(angle)];
			}
		});
	}

}

registerDemo(PbrSpheresDemo);
