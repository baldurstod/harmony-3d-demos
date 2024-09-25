import { HarmonyUi, GlMatrix, Harmony3D, InitDemoStd } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene, params) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [70, -85, 80];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 30;
	perspectiveCamera.orthoZoom = 10;
	//ambientLight.remove();

	scene.background.setColor(GlMatrix.vec4.fromValues(0., 0., 0., 1));


	let material = new Harmony3D.MeshFlatMaterial();
	let sphere = scene.addChild(new Harmony3D.Sphere({ radius: 5, segments: 12, rings: 12, material: material/*, phiLength:1.57, thetaLength:1.57*/ }));
	scene.addChild(new Harmony3D.Grid());


	let light = scene.addChild(new Harmony3D.PointLight());
	light.position = perspectiveCamera.position;

	initButtons(params.htmlDemoContent);

	const orthoCam = scene.addChild(new Harmony3D.Camera());
	orthoCam.position = [0, 0, 10];
	orthoCam.orthoZoom = 10;
	orthoCam.projectionType = Harmony3D.ORTHOGRAPHIC_CAMERA;
	Harmony3D.ContextObserver.observe(Harmony3D.GraphicsEvents, orthoCam);

	const frustum = orthoCam.addChild(new Harmony3D.CameraFrustum());


	Harmony3D.Graphics.useLogDepth(true);
}

const lambda = 10;
function initButtons(htmlDemoContent) {
	HarmonyUi.createElement('input', {
		parent: htmlDemoContent,
		type: 'range',
		min: 0,
		max: 100,
		events: {
			input: (event) => perspectiveCamera.setProjectionMix(event.target.value * 0.01),
		}
	});
	HarmonyUi.createElement('button', {
		parent: htmlDemoContent,
		innerHTML: 'ortho',
		events: {
			click: () => perspectiveCamera.projectionType = Harmony3D.ORTHOGRAPHIC_CAMERA
		}
	});

	HarmonyUi.createElement('button', {
		parent: htmlDemoContent,
		innerHTML: 'persp',
		events: {
			click: () => perspectiveCamera.projectionType = Harmony3D.PERSPECTIVE_CAMERA
		}
	});
}
