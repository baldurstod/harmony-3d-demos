import { ColorBackground, Entity, Scene, Source1ParticleControler } from 'harmony-3d';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';

class ParticlesDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/particles/particles';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [500, 0, 0];
		orbitCameraControl.target.setPosition([0, 0, 40]);
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;

		scene.background = new ColorBackground({ color: [1.0, 1.0, 1.0, 1] });
		scene.background = new ColorBackground({ color: [0.0, 0.0, 0.0, 1] });
		scene.background = new ColorBackground({ color: [0.5, 0.5, 0.5, 1] });

		Source1ParticleControler.fixedTime = 1 / 60;


		let systemName;
		systemName = 'unusual_icrown_teamcolor_red';
		systemName = 'unusual_icrown_plasma_red';
		systemName = 'utaunt_voidcrawlers_parent';
		systemName = 'utaunt_voidcrawlers_base';
		systemName = 'utaunt_voidcrawlers_ikrig_base';
		systemName = 'unusual_conductor_teamc_teamcolor_red';
		systemName = 'unusual_conductor_teamc_blu_lcp2';
		systemName = 'unusual_conductor_teamc_blu_cp';
		systemName = 'unusual_classicfortress_tflogo_logo';
		systemName = 'unusual_fullmoon_cloudy_green_clouds2';
		systemName = 'unusual_pumpkin_moon_parent';
		systemName = 'unusual_pumpkin_moon_smoke1';
		systemName = 'unusual_fullmoon_cloudy_green_clouds';
		systemName = 'unusual_pumpkin_moon_smoke1';
		systemName = 'unusual_pumpkin_moon_parent';
		systemName = 'unusual_fullmoon_cloudy_green';
		systemName = 'unusual_pumpkin_moon_parent';
		systemName = 'unusual_pumpkin_moon_smoke2';
		systemName = 'unusual_playful_purple_trail_bg';
		systemName = 'utaunt_seamine_red_water_1';
		systemName = 'unusual_stove_flame_main_1';
		systemName = 'unusual_mayor_balloonicorn_teamcolor_red';
		systemName = 'unusual_zap_yellow';
		systemName = 'utaunt_multicurse_teamcolor_red';
		//systemName = 'unusual_pumpkin_moon_smoke1';
		//systemName = 'unusual_pumpkin_moon_sparkles';
		//systemName = 'unusual_conductor_teamc_red_lightning_trail1';
		//systemName = 'unusual_conductor_teamc_blu_lcp1';
		//systemName = 'unusual_icrown_gradient_red';
		//systemName = 'unusual_icrown_rays_red';

		let sys2 = await Source1ParticleControler.createSystem('tf2', systemName);
		sys2.start();
		scene.addChild(sys2);
		let entity2 = new Entity();
		scene.addChild(entity2);
		entity2.addChild(sys2.getControlPoint(0));
		return;

		let sys = await Source1ParticleControler.createSystem('tf2', 'unusual_pumpkin_moon_smoke1');
		sys.start();
		scene.addChild(sys);
		let entity = new Entity();
		scene.addChild(entity);
		entity.addChild(sys.getControlPoint(0));
		//entity.setPosition([0, 0, 40]);

	}
}

registerDemo(ParticlesDemo);
