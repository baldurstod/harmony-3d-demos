import { AddSource1Model, InitDemoStd, Harmony3D, GlMatrix } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testChoreo(renderer, scene);
}

async function testChoreo(renderer, scene) {
	perspectiveCamera.position = [0, 500, 80];
	orbitCameraControl.target.position = [0, 0, 80];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	renderer.clearColor(GlMatrix.vec4.fromValues(0.0, 0.0, 0.0, 255));

	await Harmony3D.ChoreographiesManager.init('tf2', './scenes/scenes.image');
	let medic = await AddSource1Model('tf2', 'models/player/medic', renderer, scene);
	await Harmony3D.ChoreographiesManager.playChoreography('scenes\\player\\scout\\low\\taunt_brutalLegend.vcd', [medic]);
}
