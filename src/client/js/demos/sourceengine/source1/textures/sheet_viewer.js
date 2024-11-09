import { Graphics } from 'harmony-3d';
import { InitDemoStd, Harmony3D, HarmonyUtils } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;

const LINE_WIDTH = 5;
const sequencesGroup = new Harmony3D.Group();
const raycaster = new Harmony3D.Raycaster();
const planes = new Map();
const pickerPlaneMaterial = new Harmony3D.MeshBasicMaterial();
pickerPlaneMaterial.colorMode = Harmony3D.MATERIAL_COLOR_PER_MESH;
pickerPlaneMaterial.color = [1, 0, 0, 0.3];
pickerPlaneMaterial.setBlending(Harmony3D.MATERIAL_BLENDING_NORMAL);

const pickupScene = new Harmony3D.Scene();

const SEQUENCE_COLORS = [
	[0, 0, 1, 1],
	[1, 0, 1, 1],
	[0, 1, 0, 1],
	[1, 0, 0, 1],
	[0, 1, 1, 1],
	[1, 1, 0, 1],
]
function getColor() {
	const ret = SEQUENCE_COLORS[getColor.i];
	++getColor.i;
	if (getColor.i >= SEQUENCE_COLORS.length) {
		getColor.i = 0;
	}

	return ret;
}
getColor.i = 0;


export function initDemo(renderer, scene, params) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testMaterials(renderer, scene);
	scene.addChild(sequencesGroup);


	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GraphicsEvent.MouseMove, event => {
		let normalizedX = (event.detail.x / new Graphics().canvas.width) * 2 - 1;
		let normalizedY = 1 - (event.detail.y / new Graphics().canvas.height) * 2;
		//console.log(normalizedX, normalizedY);


		let intersections = raycaster.castCameraRay(perspectiveCamera, normalizedX, normalizedY, [pickupScene], true);
		//console.error(intersections);

		for (let intersection of intersections) {
			const seq = planes.get(intersection.entity);
			if (seq) {
				for (const [plane, _] of planes) {
					if (plane != intersection.entity) {
						pickupScene.addChild(plane);
					}
				}
				scene.addChild(intersection.entity);
				params.htmlDemoContent.innerHTML = `<div>Sequence: ${seq.sequence}</div><div>Frame: ${seq.frame}</div>`;
			}
		}
	});
}

async function testMaterials(renderer, scene) {
	perspectiveCamera.position = [0, 0, 10];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 1;
	perspectiveCamera.verticalFov = 10;


	/*let plane2 = new Harmony3D.Plane();
	scene.addChild(plane2);
	plane2.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/models/workshop/player/items/all_class/fall2013_the_special_eyes/fall2013_the_special_eyes_1.vmt'));*/

	let plane = new Harmony3D.Plane();
	scene.addChild(plane);
	plane.quaternion = [1, 1, 0, 0];

	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/tile/floor_tile_001a.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/models/workshop/player/items/all_class/fall2013_the_special_eyes_style1/fall2013_the_special_eyes_style1.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/creepysmile.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/axeoutline.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/crystal_ball/ghost_hand.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/devilish_horns.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/particle/flamethrowerfire/flamethrowerfire102.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/buble/buble1.vmt'));
	plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/tail_right.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/animatedeyes/animated_eyes.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/debris/nutsnbolts.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/animatedtentmonster/animated_tentmonster01.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/skeleton_dance/skeleton_dance.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkin_face_class_sprites/pumpkin_face_class_sprites.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/halloween_evil_eyes/lurkingeyes.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/animated_ghost/animated_ghost.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/unusual_eyeboss.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/gargoyle_spin.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/monoculus_eye.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkin_glow.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/unusual_lantern.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/animatedmoth/animated_moth.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkinhead/pumpkinhead.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/effects/workshop/pumpkin_moon_sprites/pumpkin_moon_faces.vmt'));
	//plane.setMaterial(await Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/models/workshop/player/items/all_class/fall2013_the_special_eyes/fall2013_the_special_eyes'));
	//workshop/player/items/all_class/fall2013_the_special_eyes_style1/fall2013_the_special_eyes_style1_1.vmt
	plane.material.renderFace(Harmony3D.RenderFace.Back);

	await HarmonyUtils.setTimeoutPromise(1000);
	console.log(plane.material.colorMap.vtf);
	makeSheet(plane.material.colorMap.vtf);
}

function makeSheet(vtf) {
	if (!vtf.sheet) {
		return;
	}

	sequencesGroup.removeChildren();
	planes.clear();
	console.log(vtf.sheet)
	let sequenceId = 0;
	for (const sequence of vtf.sheet.sequences) {
		const lineMaterial = new Harmony3D.LineMaterial();
		lineMaterial.lineWidth = LINE_WIDTH;
		lineMaterial.colorMode = Harmony3D.MATERIAL_COLOR_PER_MESH;
		lineMaterial.color = getColor();
		let frameId = 0;
		for (const sample of sequence.m_pSamples2) {
			const coordData = sample.m_TextureCoordData[0];
			//console.log(coordData);
			addFrame(coordData.m_fLeft_U0, coordData.m_fRight_U0, coordData.m_fTop_V0, coordData.m_fBottom_V0, lineMaterial, sequenceId, frameId);
			++frameId;
		}
		++sequenceId;
	}
}

const delta = LINE_WIDTH / 2048;
async function addFrame(left, right, top, bottom, lineMaterial, sequence, frame) {
	sequencesGroup.addChild(new Harmony3D.Line({ start: texCoordToWorld(left + delta, top + delta), end: texCoordToWorld(right - delta, top + delta), material: lineMaterial }));
	sequencesGroup.addChild(new Harmony3D.Line({ start: texCoordToWorld(left + delta, bottom - delta), end: texCoordToWorld(right - delta, bottom - delta), material: lineMaterial }));
	sequencesGroup.addChild(new Harmony3D.Line({ start: texCoordToWorld(left + delta, top + delta), end: texCoordToWorld(left + delta, bottom - delta), material: lineMaterial }));
	sequencesGroup.addChild(new Harmony3D.Line({ start: texCoordToWorld(right - delta, top + delta), end: texCoordToWorld(right - delta, bottom - delta), material: lineMaterial }));

	const plane = pickupScene.addChild(new Harmony3D.Plane({ position: texCoordToWorld((right + left) * 0.5, (top + bottom) * 0.5), height: right - left, width: bottom - top, material: pickerPlaneMaterial }));
	planes.set(plane, { sequence: sequence, frame: frame });

}

function texCoordToWorld(u, v) {
	return [v - 0.5, u - 0.5, 0];
}
