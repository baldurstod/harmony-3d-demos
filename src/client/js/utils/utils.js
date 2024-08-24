import { GlMatrix, Harmony3D } from './application.js';

export function InitDemoStd(renderer, scene) {
	let perspectiveCamera;
	let orbitCameraControl;
	renderer.clearColor(GlMatrix.vec4.fromValues(0.5, 0.5, 0.5, 255));

	let ambientLight = scene.addChild(new Harmony3D.AmbientLight({ intensity: 1.0 }));

	perspectiveCamera = scene.addChild(new Harmony3D.Camera());
	orbitCameraControl = new Harmony3D.OrbitControl(perspectiveCamera, document.getElementById('demo-canvas'));
	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GRAPHICS_EVENT_TICK, (event) => orbitCameraControl.update(event.detail.delta / 1000));
	perspectiveCamera.setActiveCamera();
	scene.addChild(orbitCameraControl.target);
	Harmony3D.ContextObserver.observe(Harmony3D.GraphicsEvents, perspectiveCamera);

	//Harmony3D.SceneExplorer._manipulator.setCamera(perspectiveCamera);
	return [perspectiveCamera, orbitCameraControl, ambientLight];
}
