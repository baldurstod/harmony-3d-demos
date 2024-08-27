import { AddSource1Model, InitDemoStd, Harmony3D, HarmonyUtils } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -20, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;
	testWireframe(renderer, scene);

}

async function testWireframe(renderer, scene) {
	let sphere = scene.addChild(new Harmony3D.Sphere());
	sphere.wireframe = 0;
	new Harmony3D.Wireframe({ parent: sphere });


	return;
	let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	heavy.playSequence('taunt_laugh');
	heavy.setWireframe(true);

	//await HarmonyUtils.setTimeoutPromise(5000);
	//heavy.setWireframe(false);
}
