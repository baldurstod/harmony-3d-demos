import { AmbientLight, Camera, CanvasLayout, CanvasView, ColorBackground, Graphics, GraphicsEvent, GraphicsEvents, GraphicTickEvent, OrbitControl, Scene } from 'harmony-3d';

export function InitDemoStd(scene: Scene): [Camera, OrbitControl, AmbientLight] {
	let perspectiveCamera;
	let orbitCameraControl;

	let ambientLight = new AmbientLight({ intensity: 1.0, parent: scene, });

	perspectiveCamera = new Camera({ autoResize: true, parent: scene });
	orbitCameraControl = new OrbitControl(perspectiveCamera/*, document.getElementById('demo-canvas')*/);
	GraphicsEvents.addEventListener(GraphicsEvent.Tick, (event) => orbitCameraControl.update((event as CustomEvent<GraphicTickEvent>).detail.delta / 1000));
	perspectiveCamera.setActiveCamera();
	scene.addChild(orbitCameraControl.target);
	//ContextObserver.observe(GraphicsEvents, perspectiveCamera);
	scene.activeCamera = perspectiveCamera;

	scene.background = new ColorBackground({ color: [0.5, 0.5, 0.5, 1] });

	const mainCanvas = Graphics.getCanvas('main_canvas')!;

	mainCanvas.useLayout = 'default';
	mainCanvas.addLayout(new CanvasLayout('default', [
		new CanvasView({ name: 'view', scene }),
	]));

	//SceneExplorer._manipulator.setCamera(perspectiveCamera);
	return [perspectiveCamera, orbitCameraControl, ambientLight];
}
