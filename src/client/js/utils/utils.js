import { vec4 } from 'gl-matrix';
import { AmbientLight, Camera, ContextObserver, GraphicsEvents, OrbitControl, ColorBackground, GraphicsEvent, Graphics, CanvasLayout, CanvasView } from 'harmony-3d';

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
	scene.activeCamera = perspectiveCamera;

	scene.background = new ColorBackground({ color: [0.5, 0.5, 0.5, 1] });

	const mainCanvas = Graphics.getCanvas('main_canvas');

	mainCanvas.useLayout = 'default';
	mainCanvas.addLayout(new CanvasLayout('default', [
		new CanvasView({ name: 'view', scene }),
	]));



	//Harmony3D.SceneExplorer._manipulator.setCamera(perspectiveCamera);
	return [perspectiveCamera, orbitCameraControl, ambientLight];
}
