import { Box, Decal, MeshBasicMaterial, RenderFace, Scene, Sphere, TextureManager } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class DecalDemo implements Demo {
	static readonly path = 'primitives/decal';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [20, -20, 10];
		orbitCameraControl.target.setPosition([0, 0, 0]);
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 10;
		testTexturedBox(scene);

	}
}
registerDemo(DecalDemo);

async function testTexturedBox(scene: Scene) {

	let material = new MeshBasicMaterial();
	material.renderFace(RenderFace.Both);

	let img = new Image(2048, 2048);
	img.src = './assets/textures/ldr/equirectangular/atlas1.jpg';
	await img.decode();


	material.setColorMap(TextureManager.createTextureFromImage(img, { flipY: true }));


	//updateGeometry(radius = 1, widthSegments = 8, heightSegments = 6, phiStart = 0, phiLength = TWO_PI, thetaStart = 0, thetaLength = Math.PI) {

	let box = new Box({ material: material, parent: scene });
	let sphere = new Sphere({ radius: 1, segments: 32, rings: 32, parent: scene });
	let decal = new Decal({ size: [1, 1, 1], material: new MeshBasicMaterial() });
	box.addChild(decal);

	//box.set = true;
	//decal.visible = true;

	decal.getMaterial().setColorMap(TextureManager.createTextureFromImage(img, { flipY: true }));
	decal.getMaterial().polygonOffset = true;
	decal.position = [1, 0, 0];
	decal.refreshGeometry();


	sphere.position = [0, -2, 0];

	//decal.material.setColorMap(Source1TextureManager.getTexture('tf2', parameters['$iris'], 0));
	//decal.material.setColorMap(TextureManager.createCheckerTexture());
}
