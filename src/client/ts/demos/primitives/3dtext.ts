import { Camera, FontManager, Scene, Text3D } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class Text3dDemo implements Demo {
	static readonly path = 'primitives/3dtext';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, -20, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 10;
		test3DText(scene, perspectiveCamera);
	}
}

registerDemo(Text3dDemo);

async function test3DText(scene: Scene, perspectiveCamera: Camera) {
	perspectiveCamera.position = [0, -400, 0];

	FontManager.setFontsPath(new URL('./json/fonts/', document.location.origin));
	let font = await FontManager.getFont('tf2');
	console.error(font);

	scene.addChild(new Text3D({ text: 'TF2', size: 10 }));
}
