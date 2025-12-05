import { ColorBackground, Entity, Scene, Source1ParticleControler } from 'harmony-3d';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class ParticlesDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/particles/particles';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [500, 0, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;

		scene.background = new ColorBackground({ color: [1.0, 1.0, 1.0, 1] });
		scene.background = new ColorBackground({ color: [0.0, 0.0, 0.0, 1] });

		let systemName;
		systemName = 'unusual_icrown_teamcolor_red';
		systemName = 'unusual_icrown_plasma_red';
		systemName = 'utaunt_voidcrawlers_parent';
		systemName = 'utaunt_voidcrawlers_base';
		systemName = 'utaunt_voidcrawlers_ikrig_base';
		systemName = 'unusual_conductor_teamc_teamcolor_red';
		systemName = 'unusual_conductor_teamc_blu_lcp2';
		systemName = 'unusual_conductor_teamc_blu_cp';
		//systemName = 'unusual_conductor_teamc_red_lightning_trail1';
		//systemName = 'unusual_conductor_teamc_blu_lcp1';
		//systemName = 'unusual_icrown_gradient_red';
		//systemName = 'unusual_icrown_rays_red';

		let sys = await Source1ParticleControler.createSystem('tf2', systemName);
		sys.start();
		scene.addChild(sys);
		let entity = new Entity();
		scene.addChild(entity);
		entity.addChild(sys.getControlPoint(0));
	}
}

registerDemo(ParticlesDemo);
