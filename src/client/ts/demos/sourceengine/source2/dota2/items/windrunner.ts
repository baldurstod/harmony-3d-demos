import { AddSource2Model, InitDemoStd, HarmonyUtils } from '/js/application.js';
import { Harmony3D } from '/js/application.js';


let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testItem(renderer, scene);
}

async function testItem(renderer, scene) {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	const item = await AddSource2Model('dota2', 'models/items/windrunner/fluttering_breeze/fluttering_breeze_weapon_arcana.vmdl', renderer, scene);
	item.playSequence('ACT_DOTA_LOADOUT');

	let i = 0;
	while(true) {
		item.setBodyGroup('arcana', (i++) % 3);
		await HarmonyUtils.setTimeoutPromise(1000);
	}
}









async function testItem2(renderer, scene) {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	const repo = new Harmony3D.OverrideRepository(new Harmony3D.Repositories().getRepository('dota2'));
	new Harmony3D.Repositories().addRepository(repo);


	let response = await fetch('./assets/models/test_mesh_groups.vmdl_c');
	let objFile = await response.arrayBuffer();


	repo.overrideFile('test_mesh_groups.vmdl_c', new File([objFile], 'test_mesh_groups'))

	const item = await AddSource2Model('dota2', 'test_mesh_groups', renderer, scene);
	item.playSequence('ACT_DOTA_LOADOUT');

	item.setBodyGroup('arcana', 2);
}
