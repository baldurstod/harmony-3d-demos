import { InitDemoStd } from '/js/utils.js';
import { Harmony3D } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -100, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	Harmony3D.FontManager.setFontsPath('./json/fonts/');
	const group = new Harmony3D.Group({ parent: scene });

	const metalnessText = new Harmony3D.Text3D({ text: 'metalness', size: 5, depth: 1, position: [-20, 0, -35], scale: [1, 1, 0.1], parent: scene });
	const roughnessText = new Harmony3D.Text3D({ text: 'roughness', size: 5, depth: 1, position: [-35, 0, -20], quaternion: [0.5, -0.5, 0.5, 0.5], scale: [1, 1, 0.1], parent: scene });

	for (let i = 0; i <= 10; i++) {
		for (let j = 0; j <= 10; j++) {
			let material = new Harmony3D.MeshBasicPbrMaterial({ metalness: i / 10, roughness: j / 10 });
			let sphere = new Harmony3D.Sphere({ material: material, segments: 16, rings: 16 });
			sphere.position = [(i - 5) * 5, 0, (j - 5) * 5];
			group.addChild(sphere);
		}
	}
}
