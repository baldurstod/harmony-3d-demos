import { Camera, OrbitControl, OverrideRepository, Repositories, Scene, Source2ModelInstance } from 'harmony-3d';
import { setTimeoutPromise } from 'harmony-utils';
import { addSource2Model } from '../../../../../utils/source2';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class Dota2DarkWillowDemo implements Demo {
	static readonly path = 'sourceengine/source2/dota2/items/windrunner';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		testItem(scene, perspectiveCamera, orbitCameraControl);
	}
}

registerDemo(Dota2DarkWillowDemo);

async function testItem(scene: Scene, perspectiveCamera: Camera, orbitCameraControl: OrbitControl): Promise<void> {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	const item = await addSource2Model('dota2', 'models/items/windrunner/fluttering_breeze/fluttering_breeze_weapon_arcana.vmdl', scene) as Source2ModelInstance;
	item.playSequence('ACT_DOTA_LOADOUT');

	let i = 0;
	while (true) {
		item.setBodyGroup('arcana', (i++) % 3);
		await setTimeoutPromise(1000);
	}
}

async function testItem2(scene: Scene, perspectiveCamera: Camera, orbitCameraControl: OrbitControl): Promise<void> {
	perspectiveCamera.position = [200, 0, 45];
	orbitCameraControl.target.position = [0, 0, 45];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 50;

	const repo = new OverrideRepository(Repositories.getRepository('dota2')!);
	Repositories.addRepository(repo);


	let response = await fetch('./assets/models/test_mesh_groups.vmdl_c');
	let objFile = await response.arrayBuffer();


	repo.overrideFile('test_mesh_groups.vmdl_c', new File([objFile], 'test_mesh_groups'))

	const item = await addSource2Model('dota2', 'test_mesh_groups', scene) as Source2ModelInstance;
	item.playSequence('ACT_DOTA_LOADOUT');

	item.setBodyGroup('arcana', 2);
}
