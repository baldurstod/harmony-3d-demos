import { vec4 } from 'gl-matrix';
import { ColorBackground, CubeBackground, Graphics, GraphicsEvent, GraphicsEvents, GraphicTickEvent, MeshBasicMaterial, Plane, RemGenerator, RenderTarget, RenderTargetViewer, RgbeImporter, Scene, TextureManager, ToneMapping } from 'harmony-3d';
import { createElement } from 'harmony-ui';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class RemGeneratorDemo implements Demo {
	static readonly path = 'textures/remgenerator';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, 0, 20];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 80;
		scene.background = new ColorBackground({ color: vec4.fromValues(0.1, 0.1, 0.1, 1) });

		createElement('button', {
			parent: params.htmlDemoContent,
			innerText: 'Demo',
			events: {
				click: () => this.#testRemGenerator(scene),
			}
		});

		this.#testRemGenerator(scene);
	}

	async #testRemGenerator(scene: Scene) {
		const img = new Image(2048, 2048);
		img.src = './assets/textures/ldr/equirectangular/atlas1.jpg';
		await img.decode();
		const earthTexture = TextureManager.createTextureFromImage({
			webgpuDescriptor: {
				size: {
					width: img.naturalWidth,
					height: img.naturalHeight,
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			},
			image: img,
			flipY: true,
		});
		earthTexture.addUser(this);

		const generator = new RemGenerator(Graphics.getForwardRenderer()!);
		const renderTarget = new RenderTarget();//= generator.fromEquirectangular(earthTexture);

		console.info(renderTarget);

		const renderTargetViewer = new RenderTargetViewer(renderTarget);
		function animate(event: Event) {
			Graphics.render(scene, scene.activeCamera!, (event as CustomEvent<GraphicTickEvent>).detail.delta, {});
			renderTargetViewer.render();
		}
		GraphicsEvents.addEventListener(GraphicsEvent.Tick, animate);


		const material = new MeshBasicMaterial();
		material.setColorMap(earthTexture);
		material.setColorMap(renderTarget.getTexture());

		const plane = new Plane({ material: material });
		//const quad = new FullScreenQuad({ material: material });
		scene.addChild(plane);
		//scene.addChild(quad);

		scene.background = new ColorBackground({ color: vec4.fromValues(1, 0., 0., 1) });
		Graphics.getForwardRenderer()!.setToneMapping(ToneMapping.Reinhard);
		Graphics.getForwardRenderer()!.setToneMappingExposure(3.);

		const envMap = await new RgbeImporter(Graphics.glContext).fetch('./assets/textures/hdr/cubemaps/venice_sunset_1k.hdr');
		material.setColorMap(envMap);

		const renderTarget2 = generator.fromEquirectangular(envMap);
		renderTargetViewer.setRenderTarget(renderTarget2);

		scene.background = new CubeBackground({ texture: renderTarget2.getTexture() });
		material.setColorMap(renderTarget2.getTexture());
	}
}

registerDemo(RemGeneratorDemo);
