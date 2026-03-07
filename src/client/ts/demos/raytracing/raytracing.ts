import { vec3, vec4 } from 'gl-matrix';
import { AmbientLight, Camera, CanvasLayout, CanvasView, ClearPass, ColorBackground, Composer, DEG_TO_RAD, FullScreenQuad, getCurrentTexture, Graphics, GraphicsEvent, GraphicsEvents, GraphicTickEvent, PointLight, Raytracer, RayTracingPass, Scene, ShaderMaterial, TextureManager, UniformValue } from 'harmony-3d';
import { float32, uint32 } from 'harmony-types';
import { createElement, defineHarmonyToggleButton, HTMLHarmonyToggleButtonElement } from 'harmony-ui';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';
import { RayTracingCamera } from './rt/Camera';
import { RayTracingScene } from './rt/Scene';

class RaytracingDemo implements Demo {
	static readonly path = 'raytracing/raytracing';
	#renderFrames = Infinity;

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		if (Graphics.isWebGLAny) {
			alert('This demo is only available in WebGPU mode');
			return;
		}
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });//.setColor(vec4.fromValues(0., 0., 0., 1));

		scene.addChild(new AmbientLight({ intensity: 1.0 }));
		scene.addChild(new PointLight({ position: [100, 0, 50] }));

		const cameraPosition = [-10.0, 2.0, -4.0];
		const cameraLookAt = [0, 1, 0];

		perspectiveCamera.position = cameraPosition;
		//perspectiveCamera.lookAt([0, 1, 0]);
		orbitCameraControl.target.setPosition([0, 1, 0]);
		perspectiveCamera.verticalFov = 60;
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.aperture = 0.;
		//orbitCameraControl.enabled = false;
		perspectiveCamera.rotateGlobalX(90 * DEG_TO_RAD);
		perspectiveCamera.rotateX(25 * DEG_TO_RAD);
		perspectiveCamera.rotateY(-10 * DEG_TO_RAD);
		perspectiveCamera.rotateGlobalZ(-90 * DEG_TO_RAD);

		perspectiveCamera.focus = vec3.distance(cameraPosition, cameraLookAt);
		//perspectiveCamera.focus = 3.4;

		const WIDTH = 400;
		const HEIGHT = 300;

		const mainCanvas = Graphics.getCanvas('main_canvas')!;
		mainCanvas.autoResize = false;
		mainCanvas.width = WIDTH;
		mainCanvas.height = HEIGHT;

		const raytracer = new Raytracer();


		const rayTracingScene = new RayTracingScene();
		const { materials, faces, aabbs } = await rayTracingScene.loadModels();

		raytracer.configure(scene, WIDTH, HEIGHT,
			materials, faces, aabbs,
			RayTracingScene.MODELS_COUNT, RayTracingScene.MAX_NUM_BVs_PER_MESH, RayTracingScene.MAX_NUM_FACES_PER_MESH);
		raytracer.play();

		const raytracerMat = new ShaderMaterial({
			shaderSource: 'presentation',
			uniforms: {
				inTexture: raytracer.getOutputTexture(),
			},
		});


		new FullScreenQuad({ parent: scene, material: raytracerMat, });

	}
}
registerDemo(RaytracingDemo);
