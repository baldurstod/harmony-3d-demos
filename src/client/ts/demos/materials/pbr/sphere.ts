import { Harmony3D, GlMatrix, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, 0, -2];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 1000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 50;
	scene.background.setColor(GlMatrix.vec4.fromValues(0.1, 0.1, 0.1, 1));

	Harmony3D.FontManager.setFontsPath('./json/fonts/');
	let l = new Harmony3D.PointLight({ position: [1.25, 1.0, -2], intensity: 1, color: [1, 1, 1], parent: scene });
	let material = new Harmony3D.MeshBasicPbrMaterial({ metalness: 0, roughness: 0.2, color: [1, 0, 0, 1] });
	let sphere = new Harmony3D.Sphere({ parent: scene, material: material, segments: 32, rings: 32 });
}
