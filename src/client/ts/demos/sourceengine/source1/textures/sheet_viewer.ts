
import { Camera, GraphicMouseEventData, GraphicsEvent, GraphicsEvents, Group, Line, LineMaterial, MATERIAL_BLENDING_NORMAL, MaterialColorMode, MeshBasicMaterial, OrbitControl, Plane, Raycaster, RenderFace, Scene, Source1MaterialManager, Source1Vtf } from 'harmony-3d';
import { createElement } from 'harmony-ui';
import { setTimeoutPromise } from 'harmony-utils';
import { InitDemoStd } from '../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../demos';

const LINE_WIDTH = 1;

const pickerPlaneMaterial = new MeshBasicMaterial();
pickerPlaneMaterial.colorMode = MaterialColorMode.PerMesh;
pickerPlaneMaterial.color = [1, 0, 0, 0.3];
pickerPlaneMaterial.setBlending(MATERIAL_BLENDING_NORMAL);

class SheetViewerDemo implements Demo {
	static readonly path = 'sourceengine/source1/textures/sheet_viewer';
	#sequencesGroup = new Group();
	#plane!: Plane;
	#planes = new Map();
	#raycaster = new Raycaster();
	#pickupScene = new Scene();

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


		GraphicsEvents.addEventListener(GraphicsEvent.MouseMove, event => {
			let normalizedX = ((event as CustomEvent<GraphicMouseEventData>).detail.x / (event as CustomEvent<GraphicMouseEventData>).detail.width) * 2 - 1;
			let normalizedY = 1 - ((event as CustomEvent<GraphicMouseEventData>).detail.y / (event as CustomEvent<GraphicMouseEventData>).detail.height) * 2;
			//console.log(normalizedX, normalizedY);


			let intersections = this.#raycaster.castCameraRay(perspectiveCamera, normalizedX, normalizedY, [this.#pickupScene], true);
			//console.error(intersections);

			for (let intersection of intersections) {
				const seq = this.#planes.get(intersection.entity);
				if (seq) {
					for (const [plane, _] of this.#planes) {
						if (plane != intersection.entity) {
							this.#pickupScene.addChild(plane);
						}
					}
					scene.addChild(intersection.entity);
					htmlSequenceFrame.innerHTML = `<div>Sequence: ${seq.sequence}</div><div>Frame: ${seq.frame}</div>`;
				}
			}
		});
	}

	async #testMaterials(scene: Scene, perspectiveCamera: Camera, orbitCameraControl: OrbitControl) {
		perspectiveCamera.position = [0, 0, 10];
		orbitCameraControl.target.position = [0, 0, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 10;


		/*let plane2 = new Plane();
		scene.addChild(plane2);
		plane2.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/models/workshop/player/items/all_class/fall2013_the_special_eyes/fall2013_the_special_eyes_1.vmt'));*/

		this.#plane = new Plane();
		scene.addChild(this.#plane);
		this.#plane.quaternion = [1, 1, 0, 0];

		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/tile/floor_tile_001a.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/models/workshop/player/items/all_class/fall2013_the_special_eyes_style1/fall2013_the_special_eyes_style1.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/creepysmile.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/axeoutline.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/crystal_ball/ghost_hand.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/devilish_horns.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', ));
		this.#initMaterial('materials/particle/flamethrowerfire/flamethrowerfire102.vmt');
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/buble/buble1.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/tail_right.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/animatedcards/animated_cards_blue.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/bubbles/bubble.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/animatedeyes/animated_eyes.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/debris/nutsnbolts.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/animatedtentmonster/animated_tentmonster01.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/skeleton_dance/skeleton_dance.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkin_face_class_sprites/pumpkin_face_class_sprites.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/halloween_evil_eyes/lurkingeyes.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/animated_ghost/animated_ghost.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/unusual_eyeboss.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/gargoyle_spin.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/monoculus_eye.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkin_glow.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/unusual_lantern.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/animatedmoth/animated_moth.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkinhead/pumpkinhead.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkin_moon_sprites/pumpkin_moon_faces.vmt'));
		//plane.setMaterial(await Source1MaterialManager.getMaterial('tf2', 'materials/models/workshop/player/items/all_class/fall2013_the_special_eyes/fall2013_the_special_eyes'));
		//workshop/player/items/all_class/fall2013_the_special_eyes_style1/fall2013_the_special_eyes_style1_1.vmt


	}

	async #initMaterial(path: string) {
		this.#plane.setMaterial((await Source1MaterialManager.getMaterial('tf2', path))!);
		this.#plane.material.renderFace(RenderFace.Back);

		await setTimeoutPromise(1000);
		//console.log(plane.material.colorMap.vtf);
		this.#makeSheet(this.#plane.material.colorMap!.properties.get('vtf'));

	}

	#makeSheet(vtf: Source1Vtf) {
		if (!vtf.sheet) {
			return;
		}

		this.#sequencesGroup.removeChildren();
		for (const [plane] of this.#planes) {
			plane.remove();
		}

		this.#planes.clear();
		console.log(vtf.sheet)
		let sequenceId = 0;
		for (const sequence of vtf.sheet.sequences) {
			const lineMaterial = new LineMaterial();
			lineMaterial.lineWidth = LINE_WIDTH;
			lineMaterial.setColorMode(MaterialColorMode.PerMesh);
			lineMaterial.color = getColor();
			let frameId = 0;
			for (const sample of sequence.frames) {
				const coordData = sample.coords[0]!;
				//console.log(coordData);
				this.addFrame(coordData.uMin, coordData.uMax, coordData.vMin, coordData.vMax, lineMaterial, sequenceId, frameId);
				++frameId;
			}
			++sequenceId;
		}
	}

	async addFrame(left: number, right: number, top: number, bottom: number, lineMaterial: LineMaterial, sequence: number, frame: number) {
		this.#sequencesGroup.addChild(new Line({ start: texCoordToWorld(left + delta, top + delta), end: texCoordToWorld(right - delta, top + delta), material: lineMaterial }));
		this.#sequencesGroup.addChild(new Line({ start: texCoordToWorld(left + delta, bottom - delta), end: texCoordToWorld(right - delta, bottom - delta), material: lineMaterial }));
		this.#sequencesGroup.addChild(new Line({ start: texCoordToWorld(left + delta, top + delta), end: texCoordToWorld(left + delta, bottom - delta), material: lineMaterial }));
		this.#sequencesGroup.addChild(new Line({ start: texCoordToWorld(right - delta, top + delta), end: texCoordToWorld(right - delta, bottom - delta), material: lineMaterial }));

		const plane = this.#pickupScene.addChild(new Plane({ position: texCoordToWorld((right + left) * 0.5, (top + bottom) * 0.5), height: right - left, width: bottom - top, material: pickerPlaneMaterial }));
		this.#planes.set(plane, { sequence: sequence, frame: frame });

	}
}

registerDemo(SheetViewerDemo);




const delta = LINE_WIDTH / 2048;


function texCoordToWorld(u: number, v: number): [number, number, number] {
	return [v - 0.5, u - 0.5, 0];
}


const SEQUENCE_COLORS: [number, number, number, number][] = [
	[0, 0, 1, 1],
	[1, 0, 1, 1],
	[0, 1, 0, 1],
	[1, 0, 0, 1],
	[0, 1, 1, 1],
	[1, 1, 0, 1],
]

function getColor(): [number, number, number, number] {
	const ret = SEQUENCE_COLORS[getColor.i]!;
	++getColor.i;
	if (getColor.i >= SEQUENCE_COLORS.length) {
		getColor.i = 0;
	}

	return ret;
}
getColor.i = 0;
