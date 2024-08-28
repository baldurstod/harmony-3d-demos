/*
import { AddSource1Model } from '../js/source1.js';
import { InitDemoStd } from '../js/utils.js';
import * as Harmony3D from '../../../dist/harmony-3d.browser.js';
import { getRandomInt, exportToBinaryFBX } from '../../../dist/harmony-3d.browser.js';
import { quat, HALF_PI, Circle } from '../../../dist/harmony-3d.browser.js';

import { SaveFile, setTimeoutPromise, FBXExporter, createElement } from '../../../dist/examples/js/modules.js';
*/

import { AddSource1Model, InitDemoStd, HarmonyUi, HarmonyUtils, Harmony3D, HarmonyBrowserUtils } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -200, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;
	//TestExportFbx(renderer, scene);
	//testExportFbx2(renderer, scene);
	//testExportSoldier(renderer, scene);
	testExportFireBell(renderer, scene);
	//testExportTransforms(renderer, scene);
	//testExportCircle(renderer, scene);

	HarmonyUi.createElement('button', {
		parent: document.getElementById('demo-content'),
		innerHTML: 'Export fbx',
		events: {
			click: () => exportFBX(scene)
		}
	});
}

async function testExportFbx(renderer, scene) {
	let modelName;
	modelName = 'models/weapons/c_models/c_wooden_bat/c_wooden_bat';
	modelName = 'models/player/heavy';
	//modelName = 'models/weapons/c_models/c_minigun/c_minigun';
	let model = await AddSource1Model('tf2', modelName, renderer, scene);
	model.playSequence('stand_primary');
	//model.playSequence('idle');
	await HarmonyUtils.setTimeoutPromise(1000);
	exportFBX(scene);
	return;
}


async function testExportFbx2(renderer, scene) {

	//let sphere = scene.addChild(new Harmony3D.Sphere({segments: 16, rings: 16}));
	let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	//let minigun = await AddSource1Model('tf2', 'models/weapons/c_models/c_minigun/c_minigun', renderer, heavy);
	let heavy_zombie = await AddSource1Model('tf2', 'models/player/items/heavy/heavy_zombie', renderer, heavy);
	//heavy.playSequence('taunt_laugh');
	heavy.playSequence('stand_primary');
	//minigun.playSequence('idle');
	heavy_zombie.playSequence('idle');
	heavy.skin = 4;
	//minigun.visible = false;
	await HarmonyUtils.setTimeoutPromise(2000);
	exportFBX(scene);
}

async function testExportSoldier(renderer, scene) {
	let soldier = await AddSource1Model('tf2', 'models/player/soldier', renderer, scene);
	soldier.rotateZ(-90);
	let soldier_viking = await AddSource1Model('tf2', 'models/player/items/soldier/soldier_viking', renderer, soldier);
	soldier.playSequence('stand_primary');
	soldier_viking.playSequence('idle');
	await HarmonyUtils.setTimeoutPromise(2000);
	exportFBX(scene);
}

async function testExportFireBell(renderer, scene) {
	//testExportFireBell2();
	//return;
	/*let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	heavy.playSequence('stand_primary');
	heavy.quaternion = [0, 0, 0.7, -0.7];*/
	let bot_worker = await AddSource1Model('tf2', 'models/bots/bot_worker/bot_worker', renderer, scene);
	bot_worker.playSequence('panic');
	bot_worker.quaternion = [0, 0, 0.7, -0.7];
	/*let fire_bell01 = await AddSource1Model('tf2', 'models/props_spytech/fire_bell01', renderer, scene);
	fire_bell01.quaternion = [0, 0, 0.7, -0.7];
	fire_bell01.playSequence('idle');*/
	await HarmonyUtils.setTimeoutPromise(1000);
	//exportFBX(scene);
}

async function testExportCircle(renderer, scene) {
	const circle = new Circle({ segments: 8 });
	scene.addChild(circle);
	await HarmonyUtils.setTimeoutPromise(2000);
	//exportFBX(scene);
}

async function testExportTransforms(renderer, scene) {
	testExportFireBell2();
	const root = new Harmony3D.Entity();
	scene.addChild(root);
	root.rotateZ(1);
	root.scale = [1, 1, 10];

	let cylinder = new Harmony3D.Cylinder({ height: 1, name: 'test cylinder' });
	//cylinder.scale = [1, 1, 10];
	cylinder.position = [10, 0, 0.5];

	root.addChild(cylinder);
	await HarmonyUtils.setTimeoutPromise(2000);
	//exportFBX(scene);
}

async function testExportFireBell2() {

	function toEuler(out, q) {
		const test = q[0] * q[3] - q[1] * q[2];

		if (test > 0.4995) { // singularity at north pole
			out[1] = 2 * Math.atan2(q[1], q[0]);
			out[0] = Math.PI / 2;
			out[3] = 0;
			return out;
		}

		if (test < -0.4995) { // singularity at south pole
			out[1] = -2 * Math.atan2(q[1], q[0]);
			out[0] = -Math.PI / 2;
			out[2] = 0;
			return out;
		}

		// roll (x-axis rotation)
		const sinr_cosp = 2 * (q[3] * q[0] + q[1] * q[2]);
		const cosr_cosp = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
		out[0] = Math.atan2(sinr_cosp, cosr_cosp);

		// pitch (y-axis rotation)
		const sinp = Math.sqrt(1 + 2 * (q[3] * q[1] - q[0] * q[2]));
		const cosp = Math.sqrt(1 - 2 * (q[3] * q[1] - q[0] * q[2]));
		out[1] = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

		// yaw (z-axis rotation)
		const siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
		const cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
		out[2] = Math.atan2(siny_cosp, cosy_cosp);


		return out;
	}

	for (let i = -5; i < 5; i++) {
		const q = quat.fromValues(0, 0, 1, -1);
		quat.normalize(q, q);
		const ROTATE_Z = quat.create();
		quat.rotateX(ROTATE_Z, ROTATE_Z, -HALF_PI);

		quat.mul(q, ROTATE_Z, q);


		quat.rotateZ(q, q, i / 20);
		//quat.identity(q);

		console.log(q, toEuler([0, 0, 0], q));

	}

}

async function exportFBX(scene) {
	//let fbxFile = await entitytoFBXFile(scene);

	let binaryFBX = await Harmony3D.exportToBinaryFBX(scene);//new FBXExporter().exportBinary(fbxFile);
	HarmonyBrowserUtils.SaveFile(new File([binaryFBX], 'test.fbx'));

	return;

	let resultJSON = JSON.stringify(fbxFile, null, '	');
	HarmonyBrowserUtils.SaveFile(new File([resultJSON], 'test.json'));

	return;

	let meshes = scene.getMeshList();
	//	console.log(meshes);

	let fbxMeshes = [];
	for (let mesh of meshes) {
		if (!mesh.isStaticMesh) {
			continue;
		}
		let fbxMesh = { name: 'test', modelId: getRandomInt(Number.MAX_SAFE_INTEGER), geometryId: getRandomInt(Number.MAX_SAFE_INTEGER), materialId: getRandomInt(Number.MAX_SAFE_INTEGER) };
		let meshDatas = mesh.exportObj();
		//console.log(meshDatas);

		let polygons = [];
		let edges = [];

		let vertexIndices = meshDatas.f;
		let vertexIndex1;
		let vertexIndex2;
		let vertexIndex3;
		for (let i = 0, l = vertexIndices.length; i < l; i += 3) {
			vertexIndex1 = vertexIndices[i];
			vertexIndex2 = vertexIndices[i + 1];
			vertexIndex3 = vertexIndices[i + 2];
			polygons.push(vertexIndex1, vertexIndex2, ~vertexIndex3);
			edges.push(vertexIndex1, vertexIndex2, vertexIndex3);
		}

		fbxMesh.vertices = meshDatas.v;
		fbxMesh.normals = meshDatas.vn;
		fbxMesh.vertices = meshDatas.v;
		fbxMesh.polygons = polygons;
		fbxMesh.edges = edges;

		//console.log(polygons);
		//console.log(edges);
		fbxMeshes.push(fbxMesh);
	}

	exportFBX(fbxMeshes, 'test.fbx');
}

function exportFBX2(fbxMeshes, filename) {

	let exporter = new FBXExporter();

	let fbxFile = createEmptyFile();
	fbxFile.version = 7400

	for (let fbxMesh of fbxMeshes) {
		fbxFile.addGeometry(fbxMesh);
	}
	let exportedBinary;
	exportedBinary = exporter.exportBinary(fbxFile);

	let resultJSON = JSON.stringify(fbxFile, null, '	');
	//await writeFile('test/created.json', resultJSON);
	//console.log(exportedBinary);

	//await writeFile('test/created.fbx', new Uint8Array(exportedBinary));
	HarmonyBrowserUtils.SaveFile(new File([exportedBinary], filename));
	HarmonyBrowserUtils.SaveFile(new File([resultJSON], filename + '.json'));
}
