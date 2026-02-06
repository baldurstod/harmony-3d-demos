import { vec4 } from 'gl-matrix';
import { AmbientLight, Camera, CanvasLayout, CanvasView, ClearPass, ColorBackground, Composer, CopyPass, createTexture, FullScreenQuad, Graphics, OrbitControl, OutlinePass, PixelatePass, PointLight, RenderPass, Scene, ShaderMaterial, Sphere, TextureManager } from 'harmony-3d';
import { AddSource1Model } from '../../utils/source1';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

import raytracer from './raytracer.wgsl';

class RaytracingSphereDemo implements Demo {
	static readonly path = 'raytracing/spheres';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		if (Graphics.isWebGLAny) {
			alert('This demo is only available in WebGPU mode');
			return;
		}
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });//.setColor(vec4.fromValues(0., 0., 0., 1));

		scene.addChild(new AmbientLight({ intensity: 1.0 }));
		scene.addChild(new PointLight({ position: [100, 0, 50] }));

		perspectiveCamera.position = [0, -20, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.lookAt([50, 0, 0]);
		perspectiveCamera.verticalFov = 50;
		perspectiveCamera.farPlane = 10000;

		//renderer.autoClear = false;

		let scene2 = new Scene();

		/*
		const imageBuffer = TextureManager.createTexture({
			webgpuDescriptor: {
				format: 'rgba8unorm',
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
				visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
				size: { width: 200, height: 200 },
			},
		});
		*/



		const imageBuffer = new Uint8Array(200 * 200 * 4);
		//this.mesh!.setStorage('particles', this.#imgData);


		const raytracerMat = new ShaderMaterial({
			wgsl: raytracer,
			uniforms: {
				samplingParams: {
					numSamplesPerPixel: 256,
				},
			},
			storages: {
				imageBuffer,

				skyState: {
					params: new Float32Array([0]),
					radiances: new Float32Array([0]),
					sunDirection: new Float32Array([1, 0, 0]),
					/*
					params: array<f32, 27>,
					radiances: array<f32, 3>,
					sunDirection: vec3<f32>,
					//*/

				},

	/*
	centerAndPad: vec4<f32>,
	radius: f32,
	materialIdx: u32,
	*/
				spheres: new Float32Array([0, 0, 0, 0, 5, 0, 0, 0]),
				materials: new Float32Array([0, 0, 0, 0, 5, 0, 0, 0]),
				textures: new Float32Array([0, 0, 0]),
				lights: new Float32Array([0]),
			}
		});





		new FullScreenQuad({ parent: scene, material: raytracerMat, });


	}
}
registerDemo(RaytracingSphereDemo);


class RayTracer {
	constructor() {

	}

}
