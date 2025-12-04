import { Harmony3D, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, 0, 20];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;

	//scene.addChild(new Harmony3D.Circle(1, undefined, undefined, -1.57 * 0.5, 1.57))
	scene.addChild(new Harmony3D.Circle({ radius: 1, startAngle: -1.57 * 0.5, endAngle: 1.57 }));


}
