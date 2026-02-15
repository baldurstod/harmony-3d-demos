import { Scene } from 'harmony-3d';
import { createElement } from 'harmony-ui';
import { setTimeoutPromise } from 'harmony-utils';
import { exportFBX } from '../../utils/fbx';
import { AddSource1Model } from '../../utils/source1';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class FbxDemo implements Demo {
	static readonly path = 'exporters/fbx';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, -200, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 10;
		//TestExportFbx(renderer, scene);
		//testExportFbx2(renderer, scene);
		//testExportSoldier(renderer, scene);
		testExportFireBell(scene);
		//testExportTransforms(renderer, scene);
		//testExportCircle(renderer, scene);

		createElement('button', {
			parent: params.htmlDemoContent,
			innerHTML: 'Export fbx',
			events: {
				click: () => exportFBX(scene)
			}
		});
	}
}

registerDemo(FbxDemo);
/*
async function testExportFbx(renderer, scene) {
	let modelName;
	modelName = 'models/weapons/c_models/c_wooden_bat/c_wooden_bat';
	modelName = 'models/player/heavy';
	//modelName = 'models/weapons/c_models/c_minigun/c_minigun';
	let model = await AddSource1Model('tf2', modelName, renderer, scene);
	model.playSequence('stand_primary');
	//model.playSequence('idle');
	await setTimeoutPromise(1000);
	exportFBX(scene);
	return;
}


async function testExportFbx2(renderer, scene) {

	//let sphere = scene.addChild(new Sphere({segments: 16, rings: 16}));
	let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	//let minigun = await AddSource1Model('tf2', 'models/weapons/c_models/c_minigun/c_minigun', renderer, heavy);
	let heavy_zombie = await AddSource1Model('tf2', 'models/player/items/heavy/heavy_zombie', renderer, heavy);
	//heavy.playSequence('taunt_laugh');
	heavy.playSequence('stand_primary');
	//minigun.playSequence('idle');
	heavy_zombie.playSequence('idle');
	heavy.skin = 4;
	//minigun.visible = false;
	await setTimeoutPromise(2000);
	exportFBX(scene);
}

async function testExportSoldier(renderer, scene) {
	let soldier = await AddSource1Model('tf2', 'models/player/soldier', renderer, scene);
	soldier.rotateZ(-90);
	let soldier_viking = await AddSource1Model('tf2', 'models/player/items/soldier/soldier_viking', renderer, soldier);
	soldier.playSequence('stand_primary');
	soldier_viking.playSequence('idle');
	await setTimeoutPromise(2000);
	exportFBX(scene);
}
*/
async function testExportFireBell(scene: Scene) {
	//testExportFireBell2();
	//return;
	/*let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
	heavy.playSequence('stand_primary');
	heavy.quaternion = [0, 0, 0.7, -0.7];*/
	let bot_worker = (await AddSource1Model('tf2', 'models/bots/bot_worker/bot_worker', scene))!;
	bot_worker.playSequence('panic');
	bot_worker.quaternion = [0, 0, 0.7, -0.7];
	/*let fire_bell01 = await AddSource1Model('tf2', 'models/props_spytech/fire_bell01', renderer, scene);
	fire_bell01.quaternion = [0, 0, 0.7, -0.7];
	fire_bell01.playSequence('idle');*/
	await setTimeoutPromise(200);
	bot_worker.setPlaying(false);
	bot_worker.frame = 0.5;
	//exportFBX(scene);
}
/*
async function testExportCircle(renderer, scene) {
	const circle = new Circle({ segments: 8 });
	scene.addChild(circle);
	await setTimeoutPromise(2000);
	//exportFBX(scene);
}

async function testExportTransforms(renderer, scene) {
	testExportFireBell2();
	const root = new Entity();
	scene.addChild(root);
	root.rotateZ(1);
	root.scale = [1, 1, 10];

	let cylinder = new Cylinder({ height: 1, name: 'test cylinder' });
	//cylinder.scale = [1, 1, 10];
	cylinder.position = [10, 0, 0.5];

	root.addChild(cylinder);
	await setTimeoutPromise(2000);
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
	saveFile(new File([exportedBinary], filename));
	saveFile(new File([resultJSON], filename + '.json'));
}
*/
