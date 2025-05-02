import { InitDemoStd, Harmony3D } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testHeavy(renderer, scene);
}

async function testHeavy(renderer, scene) {
	perspectiveCamera.position = [500, 0, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	scene.background = new Harmony3D.ColorBackground({ color: [0.0, 0.0, 0.0, 1] });

	let systemName;
	systemName = 'unusual_icrown_teamcolor_red';
	systemName = 'unusual_icrown_plasma_red';
	//systemName = 'unusual_icrown_gradient_red';
	//systemName = 'unusual_icrown_rays_red';

	let sys = await Harmony3D.Source1ParticleControler.createSystem('tf2', systemName);
	sys.start();
	scene.addChild(sys);
	let entity = new Harmony3D.Entity();
	scene.addChild(entity);
	entity.addChild(sys.getControlPoint(0));


return;
	sys = await Harmony3D.Source1ParticleControler.createSystem('tf2', 'superrare_greenenergy');
	sys.start();
	scene.addChild(sys);
	entity = new Harmony3D.Entity();
	scene.addChild(entity);
	entity.addChild(sys.getControlPoint(0));
}
