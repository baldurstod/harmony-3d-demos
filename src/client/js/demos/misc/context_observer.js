import { Harmony3D, InitDemoStd, GlMatrix } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let ambientLight;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [0, -40, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 30;
	//ambientLight.remove();

	renderer.clearColor(GlMatrix.vec4.fromValues(0., 0., 0., 255));


	let material = new Harmony3D.MeshFlatMaterial();
	let sphere = scene.addChild(new Harmony3D.Sphere({ radius: 5, segments: 12, rings: 12, material: material/*, phiLength:1.57, thetaLength:1.57*/ }));


	let light = scene.addChild(new Harmony3D.PointLight());
	light.position = perspectiveCamera.position;

	const orthoCam = scene.addChild(new Harmony3D.Camera({ projection: Harmony3D.CameraProjection.Orthographic }));

	//Harmony3D.ContextObserver.observe(Harmony3D.GraphicsEvents, this);

	orthoCam.position = [0, 0, 10];
	orthoCam.orthoZoom = 10;
	Harmony3D.ContextObserver.observe(Harmony3D.GraphicsEvents, orthoCam);
	Harmony3D.ContextObserver.unobserve(Harmony3D.GraphicsEvents, orthoCam);
	Harmony3D.ContextObserver.unobserve(Harmony3D.GraphicsEvents, perspectiveCamera);


	Harmony3D.ContextObserver.observe(Harmony3D.GraphicsEvents, perspectiveCamera);


}
