import { Camera, GraphicMouseEventData, GraphicsEvent, GraphicsEvents, Raycaster, Scene, Sphere } from 'harmony-3d';
import { InitDemoStd } from '../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../demos';

class CircleDemo implements Demo {
	static readonly path = 'misc/raycasting/camera_raycasting';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [500, 0, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 50;
		//scene.addChild(new Box({width: 200, height: 200, depth: 200}));
		scene.addChild(new Sphere({ position: [0, 0, 100], radius: 100, scale: [1, 1, 2], segments: 32, rings: 32 }));

		await testCastray(scene, perspectiveCamera);
	}
}

registerDemo(CircleDemo);

async function testCastray(scene: Scene, perspectiveCamera: Camera) {
	GraphicsEvents.addEventListener(GraphicsEvent.MouseDown, (event) => {
		let normalizedX = ((event as CustomEvent<GraphicMouseEventData>).detail.x / (event as CustomEvent<GraphicMouseEventData>).detail.width) * 2 - 1;
		let normalizedY = 1 - ((event as CustomEvent<GraphicMouseEventData>).detail.y / (event as CustomEvent<GraphicMouseEventData>).detail.height) * 2;

		let raycaster = new Raycaster();
		let intersections = raycaster.castCameraRay(perspectiveCamera, normalizedX, normalizedY, [scene], true);
		console.error(intersections);


		for (let intersection of intersections) {
			let sphere = new Sphere({ radius: 5 });
			sphere.position = intersection.position;
			sphere.material.setMeshColor([1, 0, 0, 1]);
			scene.addChild(sphere);
		}
	});
}
