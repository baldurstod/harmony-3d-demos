import { AddSource2Model, InitDemoStd, Harmony3D, GlMatrix } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	ambientLight.intensity = 0.2;
	testGordon(renderer, scene);
}

async function testGordon(renderer, scene) {
	perspectiveCamera.position = [1800, 0, 150];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;
	const alyx = await AddSource2Model('hla', 'models/characters/gordon/gordon', renderer, scene);
	alyx.playAnimation('gordon_get_up');
	renderer.clearColor(GlMatrix.vec4.fromValues(0.1, 0.1, 0.1, 255));

	const l = new Harmony3D.PointLight({ position: [0, 150, 0], intensity: 100000, parent: scene });
}
