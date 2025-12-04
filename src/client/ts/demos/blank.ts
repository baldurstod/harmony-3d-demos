import { InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
}
