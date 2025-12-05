import { Camera, OrbitControl, Repositories, Scene, ZipRepository } from 'harmony-3d';
import { AddSource1Model } from '../../../../../utils/source1';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class ZipRepoDemo implements Demo {
	static readonly path = 'sourceengine/source1/sfm/models/zip_repo';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		testZip(scene, perspectiveCamera, orbitCameraControl);
	}
}

registerDemo(ZipRepoDemo);

const filename = 'models_a134a9b8-6bac-41e1-8f77-86eaabd768dc.zip';

async function testZip(scene: Scene, perspectiveCamera: Camera, orbitCameraControl: OrbitControl) {
	perspectiveCamera.position = [500, 0, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	const response = await fetch('./assets/zip/sfm/' + filename);

	Repositories.addRepository(new ZipRepository(filename, new File([new Uint8Array(await response.arrayBuffer())], filename)));

	//let modelName;
	let modelName = 'models/jwe2/carnivores/velociraptor_blue_ilm.mdl';

	const model = (await AddSource1Model(filename, modelName, scene))!;
	model.playSequence('ref');
}
