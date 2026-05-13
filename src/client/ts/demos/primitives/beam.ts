import { vec3 } from 'gl-matrix';
import { BeamBufferGeometry, BeamSegment, Camera, GraphicsEvent, GraphicsEvents, Mesh, Scene, Wireframe } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class BeamDemo implements Demo {
	static readonly path = 'primitives/beam';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		perspectiveCamera.position = [2, -50, 0];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 30;
		ambientLight.remove();

		const beamCamera = new Camera({ position: [0, 0, 1000] });

		//let light = new PointLight({ parent: scene });
		//light.setPosition(perspectiveCamera.position);

		const geometry = new BeamBufferGeometry();
		const mesh = new Mesh({ geometry, parent: scene });

		const segments: BeamSegment[] = [];

		const div = 50;
		const radius = 10;
		for (let i = 0; i <= div; i++) {
			let angle = i / div * 2 * Math.PI;
			const pos = vec3.fromValues(radius * Math.cos(angle), radius * Math.sin(angle), radius * Math.sin(angle));
			segments.push(new BeamSegment(pos, [1, 1, 1, 1], i / div, 1));
		}

		const wireframe = new Wireframe();

		GraphicsEvents.addEventListener(GraphicsEvent.Tick, () => {
			geometry.setSegments(segments, beamCamera);
			mesh.addChild(wireframe);
		});
	}
}

registerDemo(BeamDemo);
