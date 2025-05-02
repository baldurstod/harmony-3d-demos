import { AddSource1Model, InitDemoStd, Harmony3D } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testZip(renderer, scene);
}

const filename = 'models_a134a9b8-6bac-41e1-8f77-86eaabd768dc.zip';

async function testZip(renderer, scene) {
	perspectiveCamera.position = [500, 0, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	const response = await fetch('./assets/zip/sfm/' + filename);

	new Harmony3D.Repositories().addRepository(new Harmony3D.ZipRepository(filename, new File([new Uint8Array(await response.arrayBuffer())], filename)));

	//let modelName;
	let modelName = 'models/jwe2/carnivores/velociraptor_blue_ilm.mdl';

	const model = await AddSource1Model(filename, modelName, renderer, scene);
	model.playSequence('ref');
}
