import { AddSource1Model, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testHeavy(renderer, scene);
}

async function testHeavy(renderer, scene) {
	perspectiveCamera.position = [500, 0, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	let modelName;
	let rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
	let stattrackPath = 'models/weapons/c_models/stattrack.mdl';

	let rocketLauncher = await AddSource1Model('tf2', rocketLauncherPath, renderer, scene);
	let stattrack = await AddSource1Model('tf2', stattrackPath, renderer, scene);
	stattrack.scale = [10, 10, 10];

	rocketLauncher.addChild(stattrack);
	rocketLauncher.playSequence('');

	let stattrakBone = rocketLauncher.getBoneByName('c_weapon_stattrack');
	if (stattrakBone) {
		let scale = 1.2;
		stattrakBone.scale = [scale, scale, scale];
	}

	rocketLauncher.scale = [10, 10, 10];
}
