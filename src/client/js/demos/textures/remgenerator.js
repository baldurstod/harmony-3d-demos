import { Graphics } from 'harmony-3d';
import { InitDemoStd, Harmony3D, GlMatrix, HarmonyUi } from '/js/application.js';

export const useCustomRenderLoop = true;

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene, { htmlDemoContent }) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, 0, 20];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 80;
	scene.background.setColor(GlMatrix.vec4.fromValues(0., 0., 0., 1));

	HarmonyUi.createElement('button', {
		parent: htmlDemoContent,
		innerText: 'Demo',
		events: {
			click: () => testRemGenerator(renderer, scene),
		}
	});

	testRemGenerator(renderer, scene);
}

async function testRemGenerator(renderer, scene) {
	const img = new Image(2048, 2048);
	img.src = './assets/textures/ldr/equirectangular/atlas1.jpg';
	await img.decode();
	const earthTexture = Harmony3D.TextureManager.createTextureFromImage(img, { flipY: true })
	earthTexture.addUser(this);

	const generator = new Harmony3D.RemGenerator(renderer);
	const renderTarget = new Harmony3D.RenderTarget();//= generator.fromEquirectangular(earthTexture);

	console.info(renderTarget);

	const renderTargetViewer = new Harmony3D.RenderTargetViewer(renderTarget);
	function animate(event) {
		renderer.render(scene, scene.activeCamera, event.detail.delta);
		renderTargetViewer.render(renderer.getForwardRenderer());
	}
	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GraphicsEvent.Tick, animate);


	const material = new Harmony3D.MeshBasicMaterial();
	material.setColorMap(earthTexture);
	material.setColorMap(renderTarget.getTexture());

	const plane = new Harmony3D.Plane({ material: material });
	//const quad = new Harmony3D.FullScreenQuad({ material: material });
	scene.addChild(plane);
	//scene.addChild(quad);

	scene.background.setColor(GlMatrix.vec4.fromValues(1, 0., 0., 1));
	renderer.getForwardRenderer().setToneMapping(Harmony3D.ToneMapping.Reinhard);
	renderer.getForwardRenderer().setToneMappingExposure(3.);

	const envMap = await new Harmony3D.RgbeImporter(new Graphics().glContext).fetch('./assets/textures/hdr/cubemaps/venice_sunset_1k.hdr');
	material.setColorMap(envMap);

	const renderTarget2 = generator.fromEquirectangular(envMap);
	renderTargetViewer.setRenderTarget(renderTarget2);

	scene.background = new Harmony3D.CubeBackground({ texture: renderTarget2.getTexture() });
	material.setColorMap(renderTarget2.getTexture());
}
