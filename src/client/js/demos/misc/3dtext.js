import { Harmony3D, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -20, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;
	test3DText(renderer, scene);
}

async function test3DText(renderer, scene) {
	perspectiveCamera.position = [0, -400, 0];

	Harmony3D.FontManager.setFontsPath('./json/fonts/');
	let font = await Harmony3D.FontManager.getFont('tf2');
	console.error(font);

	let text = scene.addChild(new Harmony3D.Text3D('foobar'));
	text.text = 'TF2';
	text.size = 10;
}
