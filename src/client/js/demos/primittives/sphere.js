import { Harmony3D, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [2, -20, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 30;
	ambientLight.remove();


	let material = new Harmony3D.MeshFlatMaterial();
	let sphere = scene.addChild(new Harmony3D.Sphere({ radius: 5, segments: 12, rings: 12, material: material/*, phiLength:1.57, thetaLength:1.57*/ }));


	let light = scene.addChild(new Harmony3D.PointLight());
	light.position = perspectiveCamera.position;

}
