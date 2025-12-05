import { vec4 } from 'gl-matrix';
import { ColorBackground, CubeBackground, Graphics, HALF_PI, OBJImporter, PointLight, RemGenerator, RgbeImporter, Scene } from 'harmony-3d';
import { createPbrMaterial } from '../../../utils/pbrmaterials';
import { registerDemo } from '../../demos';
import { InitDemoStd } from '../../../utils/utils';
import { Demo, InitDemoParams } from '../../demos';

class PbrCerberusDemo implements Demo {
	static readonly path = 'materials/pbr/cerberus';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		ambientLight.intensity = 0.1;
		perspectiveCamera.position = [2, 0, 0];
		orbitCameraControl.target.position = [0, 0.35, 0];
		perspectiveCamera.farPlane = 1000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 50;
		scene.background = new ColorBackground({ color: vec4.fromValues(0.1, 0.1, 0.1, 1) });

		let l = new PointLight({ position: [0, -2 * 0, -0], intensity: 10, parent: perspectiveCamera });
		//new Sphere({ parent: scene, radius: 1, material: createPbrMaterial('rustediron2'), segments: 32, rings: 32 });
		testCerberus(scene);
	}
}

registerDemo(PbrCerberusDemo);

async function testCerberus(scene: Scene) {
	let response = await fetch('./assets/models/obj/cerberus.obj');
	let objFile = await response.text();

	let mesh = OBJImporter.load(objFile);
	mesh.name = 'Cerberus';
	mesh.rotateX(HALF_PI);
	mesh.rotateY(-HALF_PI);
	mesh.setMaterial(createPbrMaterial('cerberus')!);

	scene.addChild(mesh);


	const envMap = await new RgbeImporter(Graphics.glContext).fetch('./assets/textures/hdr/cubemaps/venice_sunset_1k.hdr');
	const generator = new RemGenerator(Graphics.getForwardRenderer()!);
	const renderTarget = generator.fromEquirectangular(envMap);
	scene.background = new CubeBackground({ texture: renderTarget.getTexture() });
}
