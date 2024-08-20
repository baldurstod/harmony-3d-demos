import { InitDemoStd } from '/js/utils.js';
import { Harmony3D, GlMatrix, createPbrMaterial } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -100, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;
	renderer.clearColor(GlMatrix.vec4.fromValues(0.1, 0.1, 0.1, 255));

	let l = new Harmony3D.PointLight({ position: [0, -100, -0], intensity: 2, parent: scene });
	new Harmony3D.Sphere({ parent: scene, radius: 10, material: createPbrMaterial('rustediron2'), segments: 32, rings: 32 });
}
