import { vec4 } from 'gl-matrix';
import { Camera, CameraFrustum, CameraProjection, ColorBackground, Graphics, Grid, MeshFlatMaterial, PointLight, Scene, Sphere } from 'harmony-3d';
import { createElement } from 'harmony-ui';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class MixedProjectionDemo implements Demo {
	static readonly path = 'cameras/mixed_projection';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		perspectiveCamera.position = [70, -85, 80];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 30;
		perspectiveCamera.orthoZoom = 10;
		//ambientLight.remove();

		scene.background = new ColorBackground({ color: vec4.fromValues(0., 0., 0., 1) });


		let material = new MeshFlatMaterial();
		let sphere = scene.addChild(new Sphere({ radius: 5, segments: 12, rings: 12, material: material/*, phiLength:1.57, thetaLength:1.57*/ }));
		scene.addChild(new Grid());


		let light = scene.addChild(new PointLight({ position: perspectiveCamera.position }));

		initButtons(params.htmlDemoContent, perspectiveCamera);

		const orthoCam = scene.addChild(new Camera({ position: [0, 0, 10], orthoZoom: 10, projection: CameraProjection.Orthographic, autoResize: true })) as Camera;
		//ContextObserver.observe(GraphicsEvents, orthoCam);

		const frustum = orthoCam.addChild(new CameraFrustum());


		Graphics.useLogDepth(true);
	}
}

registerDemo(MixedProjectionDemo);

const lambda = 10;
function initButtons(htmlDemoContent: HTMLElement, perspectiveCamera: Camera) {
	createElement('input', {
		parent: htmlDemoContent,
		type: 'range',
		min: 0,
		max: 100,
		events: {
			input: (event: Event) => perspectiveCamera.setProjectionMix(Number((event.target as HTMLInputElement).value) * 0.01),
		}
	});
	createElement('button', {
		parent: htmlDemoContent,
		innerHTML: 'ortho',
		events: {
			click: () => perspectiveCamera.setProjection(CameraProjection.Orthographic)
		}
	});

	createElement('button', {
		parent: htmlDemoContent,
		innerHTML: 'persp',
		events: {
			click: () => perspectiveCamera.setProjection(CameraProjection.Perspective)
		}
	});
}
