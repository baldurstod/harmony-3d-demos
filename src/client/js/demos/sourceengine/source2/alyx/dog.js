import { AddSource2Model, InitDemoStd, Harmony3D, GlMatrix } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	ambientLight.intensity = 0.2;
	TestDog(renderer, scene);
}

async function TestDog(renderer, scene) {
	perspectiveCamera.position = [1800, 0, 150];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;
	let dog = await AddSource2Model('hla', 'models/characters/dog/dog', renderer, scene);
	//dog.playAnimation('dog_endscene_01_idle');
	//dog.playAnimation('anim_test');
	dog.playAnimation('endscene_post_idle');
	renderer.clearColor(GlMatrix.vec4.fromValues(0.1, 0.1, 0.1, 255));


	//let l = new Harmony3D.PointLight({ position: [40, 0, 85], intensity: 10000, parent: scene });
	let l = new Harmony3D.PointLight({ position: [0, 150, 0], intensity: 100000, parent: scene });
}
