import { Harmony3D, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [20, -20, 10];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;
	testTexturedBox(renderer, scene);

}

async function testTexturedBox(renderer, scene) {

	let material = new Harmony3D.MeshBasicMaterial();
	material.renderFace(Harmony3D.RenderFace.Both);

	let img = new Image(2048, 2048);
	img.src = './assets/textures/ldr/equirectangular/atlas1.jpg';
	await img.decode();


	material.setColorMap(Harmony3D.TextureManager.createTextureFromImage(img, { flipY: true }));


	//updateGeometry(radius = 1, widthSegments = 8, heightSegments = 6, phiStart = 0, phiLength = TWO_PI, thetaStart = 0, thetaLength = Math.PI) {

	let box = scene.addChild(new Harmony3D.Box({ material: material }));
	let sphere = scene.addChild(new Harmony3D.Sphere({ radius: 1, segments: 32, rings: 32 }));
	let decal = box.addChild(new Harmony3D.Decal({ size: [1, 1, 1], material: box.material.clone() }));

	box.visible = true;
	decal.visible = true;

	decal.material.setColorMap(Harmony3D.TextureManager.createTextureFromImage(img, { flipY: true }));
	decal.material.polygonOffset = true;
	decal.position = [1, 0, 0];
	decal.refreshGeometry();


	sphere.position = [0, -2, 0];

	//decal.material.setColorMap(Harmony3D.Source1TextureManager.getTexture('tf2', parameters['$iris'], 0));
	//decal.material.setColorMap(Harmony3D.TextureManager.createCheckerTexture());
}
