import { AmbientLight, Box, Camera, Graphics, MeshPhongMaterial, OrbitControl, Scene, Source1BspLoader, SourceBSP } from 'harmony-3d';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class CpCloackDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/maps/cp_cloak';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);

		ambientLight.remove();
		perspectiveCamera.position = [0, 0, 5000];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 100000;
		perspectiveCamera.nearPlane = 100;
		perspectiveCamera.verticalFov = 50;
		Graphics.setIncludeCode('test', '#define PHYSICALLY_CORRECT_LIGHTS');

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

		let map = (await (new Source1BspLoader()).load('tf2', mapName)) as SourceBSP;
		console.error(map);
		scene.addChild(map);
		map.initMap();

		/*let heavy = await AddSource1Model('tf2', 'models/player/heavy', renderer, scene);
		heavy.playSequence('taunt_laugh');*/

		const BOX_SIZE = 100;
		let box = scene.addChild(new Box({ width: BOX_SIZE, height: BOX_SIZE, depth: BOX_SIZE, material: new MeshPhongMaterial() })) as Box;
		box.getMaterial().setMeshColor([0.5, 0.5, 0.5, 0.5]);
		//box.material.renderFace(RenderFace.Back);
	}
}

registerDemo(CpCloackDemo);
