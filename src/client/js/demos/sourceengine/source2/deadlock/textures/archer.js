import { Harmony3D, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	TestMaterial(renderer, scene);
}

async function TestMaterial(renderer, scene) {
	perspectiveCamera.position = [0, 0, 80];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;
	let plane = scene.addChild(new Harmony3D.Plane({ width: 10, height: 10 }));
	const material = await Harmony3D.Source2MaterialManager.getMaterial('deadlock', 'models/heroes_staging/archer/materials/archer.vmat_c');
	plane.setMaterial(material)
}
