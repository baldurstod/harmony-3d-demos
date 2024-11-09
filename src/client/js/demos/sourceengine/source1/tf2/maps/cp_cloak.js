import { Graphics } from 'harmony-3d';
import { InitDemoStd, Harmony3D } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	testMap(renderer, scene);
}

async function testMap(renderer, scene) {
	ambientLight.remove();
	perspectiveCamera.position = [0, 0, 5000];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 100000;
	perspectiveCamera.nearPlane = 100;
	perspectiveCamera.verticalFov = 50;
	new Graphics().setIncludeCode('test', '#define PHYSICALLY_CORRECT_LIGHTS');

	//WORKING
	//cp_dustbowl
	//itemtest
	//arena_watchtower
	//koth_harvest_final
	//sfm_photostudio_lite
	//koth_viaduct
	//cp_cloak

	//MOSTLY WORKS
	//arena_lumberyard

	//DON'T WORK
	//pl_badwater
	//pl_barnblitz
	//pl_pier
	//koth_suijin
	//pl_wutville_event
	//pl_snowycoast
	let mapName;
	mapName = 'maps/cp_cloak.bsp';
	//mapName = 'maps/itemtest.bsp';
	//mapName = 'maps/cp_5gorge.bsp';

	let map = await (new Harmony3D.SourceEngineBSPLoader()).load('tf2', mapName);
	console.error(map);
	scene.addChild(map);
	map.initMap();

	/*let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	heavy.playSequence('taunt_laugh');*/

	const BOX_SIZE = 100;
	let box = scene.addChild(new Harmony3D.Box({ width: BOX_SIZE, height: BOX_SIZE, depth: BOX_SIZE, material: new Harmony3D.MeshPhongMaterial() }));
	box.material.setMeshColor([0.5, 0.5, 0.5, 0.5]);
	//box.material.renderFace(Harmony3D.RenderFace.Back);
}
