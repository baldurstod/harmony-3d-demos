
import { Camera, Group, MATERIAL_BLENDING_NORMAL, MaterialColorMode, MeshBasicMaterial, OrbitControl, Plane, RenderFace, Scene, Source1MaterialManager } from 'harmony-3d';
import { createElement } from 'harmony-ui';
import { setTimeoutPromise } from 'harmony-utils';
import { InitDemoStd } from '../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../demos';

const LINE_WIDTH = 1;

const pickerPlaneMaterial = new MeshBasicMaterial();
pickerPlaneMaterial.colorMode = MaterialColorMode.PerMesh;
pickerPlaneMaterial.color = [1, 0, 0, 0.3];
pickerPlaneMaterial.setBlending(MATERIAL_BLENDING_NORMAL);

class Source1TextureDemo implements Demo {
	static readonly path = 'sourceengine/source1/textures/texture';
	#sequencesGroup = new Group();
	#plane!: Plane;

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		this.#testMaterials(scene, perspectiveCamera, orbitCameraControl);
		scene.addChild(this.#sequencesGroup);

		const htmlSequenceFrame = createElement('div', { parent: params.htmlDemoContent, });
		const htmlMaterialInput = createElement('input', {
			parent: params.htmlDemoContent,
			$change: (event: Event) => {
				this.#initMaterial((event.target as HTMLInputElement).value);
			},
		});
	}

	async #testMaterials(scene: Scene, perspectiveCamera: Camera, orbitCameraControl: OrbitControl) {
		perspectiveCamera.position = [0, 0, 10];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 10;

		this.#plane = new Plane();
		scene.addChild(this.#plane);
		this.#plane.setQuaternion([1, 1, 0, 0]);

		this.#initMaterial('materials/particle/flamethrowerfire/flamethrowerfire102.vmt');
	}

	async #initMaterial(path: string) {
		this.#plane.setMaterial((await Source1MaterialManager.getMaterial('tf2', path))!);
		this.#plane.material.renderFace(RenderFace.Back);

		await setTimeoutPromise(1000);
	}
}

registerDemo(Source1TextureDemo);
