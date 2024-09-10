import { vec4 } from 'gl-matrix';
import { AmbientLight, Camera, ContextObserver, GRAPHICS_EVENT_TICK, GraphicsEvents, OrbitControl, ColorBackground } from 'harmony-3d';

export function InitDemoStd(renderer, scene) {
	let perspectiveCamera;
	let orbitCameraControl;

	let ambientLight = scene.addChild(new AmbientLight({ intensity: 1.0 }));

	perspectiveCamera = scene.addChild(new Camera());
	orbitCameraControl = new OrbitControl(perspectiveCamera, document.getElementById('demo-canvas'));
	GraphicsEvents.addEventListener(GRAPHICS_EVENT_TICK, (event) => orbitCameraControl.update(event.detail.delta / 1000));
	perspectiveCamera.setActiveCamera();
	scene.addChild(orbitCameraControl.target);
	ContextObserver.observe(GraphicsEvents, perspectiveCamera);

	scene.background = new ColorBackground({ color: [0.5, 0.5, 0.5, 1] });

	//Harmony3D.SceneExplorer._manipulator.setCamera(perspectiveCamera);
	return [perspectiveCamera, orbitCameraControl, ambientLight];
}
