import { vec3, vec4 } from 'gl-matrix';
import { AmbientLight, ColorBackground, DEG_TO_RAD, EmissiveMaterial, FullScreenQuad, Graphics, Plane, PointLight, Raytracer, Scene, ShaderMaterial } from 'harmony-3d';
import { createElement } from 'harmony-ui';
import { setTimeoutPromise } from 'harmony-utils';
import { AddSource1Model } from '../../utils/source1';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

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

		createElement('div', {
			parent: params.htmlDemoContent,
			style: 'display:flex;flex-direction:column;',
			childs: [
				createElement('button', {
					innerHTML: 'reset',
					$click: () => reset(),
				}),
			]
		});

		const scale = 1;

		const WIDTH = 800 / scale;
		const HEIGHT = 600 / scale;

		const mainCanvas = Graphics.getCanvas('main_canvas')!;
		mainCanvas.autoResize = false;
		mainCanvas.width = WIDTH;
		mainCanvas.height = HEIGHT;

		const raytracer = new Raytracer();

		const rtScene = new Scene({ camera: perspectiveCamera });
		const rocketLauncherPath = '/models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl';
		const rocketLauncher = await AddSource1Model('tf2', rocketLauncherPath, rtScene);
		rocketLauncher.playAnimation('idle');
		rocketLauncher.scale = vec3.fromValues(0.04, 0.04, 0.04);
		rocketLauncher.translateX(0.5);
		rocketLauncher.translateY(-0.25);
		rocketLauncher.rotateGlobalX(-90 * DEG_TO_RAD);

		const rtCanvas = Graphics.addCanvas({
			name: 'rt_canvas',
			scene: rtScene,
			autoResize: false,
			width: 256,
			height: 256,
		});

		mainCanvas.canvas.parentElement.append(rtCanvas.canvas);

		await setTimeoutPromise(1000);//TODO use an actual promise to wait for materials

		const emissiveMaterial = new EmissiveMaterial();

		//new Box({ parent: rtScene, size: 1, material: emissiveMaterial });
		const plane = new Plane({ parent: rtScene, width: 10, position: [0, 3, 0], material: emissiveMaterial });
		plane.rotateX(90 * DEG_TO_RAD);

		raytracer.configure(rtScene, WIDTH, HEIGHT);
		raytracer.play();

		const raytracerMat = new ShaderMaterial({
			shaderSource: 'presentation',
			uniforms: {
				inTexture: raytracer.getOutputTexture(),
			},
		});


		new FullScreenQuad({ parent: scene, material: raytracerMat, });

		function reset() {
			raytracer.configure(rtScene, WIDTH, HEIGHT,);
		}

	}
}
registerDemo(RaytracingDemo);
