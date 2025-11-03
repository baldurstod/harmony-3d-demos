import { vec4 } from 'gl-matrix';
import { AmbientLight, Camera, ContextObserver, GraphicsEvents, OrbitControl, ColorBackground, GraphicsEvent } from 'harmony-3d';

export function InitDemoStd(renderer, scene) {
	let perspectiveCamera;
	let orbitCameraControl;

	let ambientLight = scene.addChild(new AmbientLight({ intensity: 1.0 }));

	perspectiveCamera = scene.addChild(new Camera({ autoResize: true }));
	orbitCameraControl = new OrbitControl(perspectiveCamera, document.getElementById('demo-canvas'));
	GraphicsEvents.addEventListener(GraphicsEvent.Tick, (event) => orbitCameraControl.update(event.detail.delta / 1000));
	perspectiveCamera.setActiveCamera();
	scene.addChild(orbitCameraControl.target);
	ContextObserver.observe(GraphicsEvents, perspectiveCamera);

	scene.background = new ColorBackground({ color: [0.5, 0.5, 0.5, 1] });

	//Harmony3D.SceneExplorer._manipulator.setCamera(perspectiveCamera);
	return [perspectiveCamera, orbitCameraControl, ambientLight];
}
