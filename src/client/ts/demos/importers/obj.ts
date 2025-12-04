import { Camera, OBJImporter, OrbitControl, Scene } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class ImportObjDemo implements Demo {
	static readonly path = 'importers/obj';

	initDemo(scene: Scene, params: InitDemoParams): void {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		testImportObj(scene, perspectiveCamera, orbitCameraControl);
	}
}

registerDemo(ImportObjDemo);

async function testImportObj(scene: Scene, perspectiveCamera: Camera, orbitCameraControl: OrbitControl) {
	perspectiveCamera.position = [700, 0, 100];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 10;

	let response = await fetch('./assets/models/obj/alfa147.obj');
	let objFile = await response.text();

	let mesh = OBJImporter.load(objFile);

	scene.addChild(mesh);
}
