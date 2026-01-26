import { AnimatedTexture, ApplySticker, CombineLerp, IntArrayNode, Multiply, NodeImageEditor, NodeImageEditorGui, Plane, Scene, Select, Source1MaterialManager, Source1TextureManager, Texture, TextureLookup } from 'harmony-3d';
import { HTMLHarmonyTabElement } from 'harmony-ui';
import { AddSource1Model } from '../../../utils/source1';
import { InitDemoStd } from '../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../demos';

class ParametersNodeDemo implements Demo {
	static readonly path = 'misc/nodeimageeditor/parametersnode';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);

		perspectiveCamera.position = [500, 0, 150];
		orbitCameraControl.target.position = [0, 0, 50];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;

		testNodeImageEditor(scene, params.htmlDemoContentTab);
	}
}

registerDemo(ParametersNodeDemo);

async function testNodeImageEditor(scene: Scene, htmlDemoContentTab: HTMLHarmonyTabElement) {
	const planeMesh = new Plane({ width: 200, height: 200 });
	scene.addChild(planeMesh);
	const material = await Source1MaterialManager.getMaterial('tf2', 'materials/models/weapons/c_models/c_minigun/c_minigun');
	if (material) {
		planeMesh.setMaterial(material);
	}

	testUberSaw(scene, htmlDemoContentTab, planeMesh);
}

async function testUberSaw(scene: Scene, htmlDemoContentTab: HTMLHarmonyTabElement, planeMesh: Plane) {
	let c_ubersaw = (await AddSource1Model('tf2', 'models/weapons/c_models/c_ubersaw/c_ubersaw', scene))!;
	c_ubersaw.playSequence('idle');

	let nodeImageEditor = new NodeImageEditor();
	let nodeImageEditorGui = new NodeImageEditorGui(nodeImageEditor);
	htmlDemoContentTab.append(nodeImageEditorGui.htmlElement);
	nodeImageEditor.textureSize = 1024;

	//let stickerNode = nodeImageEditor.addNode('sticker');
	//stickerNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'patterns/autumn/sticker_a_bomb', 0);

	let applyStickerNode = nodeImageEditor.addNode('apply_sticker', { textureSize: 1024 }) as ApplySticker;
	//applyStickerNode.setPredecessor('input0', stickerNode, 'output');
	applyStickerNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'patterns/autumn/sticker_a_bomb', 0, false);



	let groupsLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	groupsLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_groups', 0, false);
	let aoLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	aoLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_ao', 0, false);
	let blankLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	blankLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'patterns/blank_white', 0, false);
	let albedoLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	albedoLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_albedo', 0, false);
	let techLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	techLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'patterns/workshop/smissmas_2017/1181727321/1181727321_tech', 0, false);
	let techBlackLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	techBlackLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'patterns/workshop/smissmas_2017/1181727321/1181727321_tech_solid_black', 0, false);
	let techGreenLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	techGreenLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'patterns/workshop/smissmas_2017/1181727321/1181727321_tech_solid_green', 0, false);
	let wearLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	wearLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_wearblend', 0, false);


	let multiplyNode = nodeImageEditor.addNode('multiply', { textureSize: 1024 }) as Multiply;
	multiplyNode.setPredecessor('input0', blankLookupNode, 'output');
	multiplyNode.setPredecessor('input1', blankLookupNode, 'output');

	let lerpNode = nodeImageEditor.addNode('combine_lerp', { textureSize: 1024 }) as Multiply;
	lerpNode.setPredecessor('input0', multiplyNode, 'output');
	lerpNode.setPredecessor('input1', blankLookupNode, 'output');
	lerpNode.setPredecessor('weight', wearLookupNode, 'output');

	let multiplyNode2 = nodeImageEditor.addNode('multiply', { textureSize: 1024 }) as Multiply;
	multiplyNode2.setPredecessor('input0', blankLookupNode, 'output');
	multiplyNode2.setPredecessor('input1', lerpNode, 'output');

	let selectParametersNode = nodeImageEditor.addNode('int array', { length: 16 }) as IntArrayNode;
	selectParametersNode.setValue(0, 32);
	selectParametersNode.setValue(1, 112);
	selectParametersNode.setValue(2, 128);
	selectParametersNode.setValue(3, 176);
	selectParametersNode.setValue(4, 208);

	let selectNode = nodeImageEditor.addNode('select') as Select;
	selectNode.setPredecessor('input', groupsLookupNode, 'output');
	selectNode.setPredecessor('selectvalues', selectParametersNode, 'output');
	/*let selectValues = selectNode.getInput('selectvalues');
	selectValues.setArrayValue(32);
	selectValues.setArrayValue(112);
	selectValues.setArrayValue(128);
	selectValues.setArrayValue(176);
	selectValues.setArrayValue(208);*/


	let selectParametersNode2 = nodeImageEditor.addNode('int array', { length: 16 }) as IntArrayNode;
	selectParametersNode2.setValue(0, 160);
	selectParametersNode2.setValue(1, 192);
	selectParametersNode2.setValue(2, 224);
	selectParametersNode2.setValue(3, 240);

	let selectNode2 = nodeImageEditor.addNode('select') as Select;
	selectNode2.setPredecessor('input', groupsLookupNode, 'output');
	selectNode2.setPredecessor('selectvalues', selectParametersNode2, 'output');
	/*let selectValues2 = selectNode2.getInput('selectvalues');
	selectValues2.setArrayValue(160);
	selectValues2.setArrayValue(192);
	selectValues2.setArrayValue(224);
	selectValues2.setArrayValue(240);*/

	let lerpNode2 = nodeImageEditor.addNode('combine_lerp') as CombineLerp;
	lerpNode2.setPredecessor('input0', techLookupNode, 'output');
	lerpNode2.setPredecessor('input1', techBlackLookupNode, 'output');
	lerpNode2.setPredecessor('weight', selectNode, 'output');

	let lerpNode3 = nodeImageEditor.addNode('combine_lerp') as CombineLerp;
	lerpNode3.setPredecessor('input0', lerpNode2, 'output');
	lerpNode3.setPredecessor('input1', techGreenLookupNode, 'output');
	lerpNode3.setPredecessor('weight', selectNode2, 'output');

	let lerpNode4 = nodeImageEditor.addNode('combine_lerp') as CombineLerp;
	lerpNode4.setPredecessor('input0', albedoLookupNode, 'output');
	lerpNode4.setPredecessor('input1', lerpNode3, 'output');
	lerpNode4.setPredecessor('weight', multiplyNode2, 'output');



	let multiplyNode4 = nodeImageEditor.addNode('multiply') as Multiply;
	multiplyNode4.setPredecessor('input0', aoLookupNode, 'output');
	//multiplyNode4.setPredecessor('input1', groupsLookupNode, 'output');
	multiplyNode4.setPredecessor('input1', lerpNode4, 'output');
	//nodeImageEditorGui._organizeNodes();

	//aoLookupNode.params.adjustBlack = 0.25;
	//aoLookupNode.params.adjustWhite = 0.75;
	//aoLookupNode.params.adjustGamma = 2.2;
	//aoLookupNode.invalidate();

	let finalNode = multiplyNode4;
	finalNode.autoRedraw = true;
	//window.finalNode = finalNode;

	let p_paintkit_tool_wearblend = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	p_paintkit_tool_wearblend.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'models/items/paintkit_tool/p_paintkit_tool_wearblend', 0, false);
	p_paintkit_tool_wearblend.setParam('adjust black', 0.27);
	p_paintkit_tool_wearblend.setParam('adjust white', 1);
	p_paintkit_tool_wearblend.setParam('adjust gamma', 1.1);

	let { name: outputTextureName, texture: outputTexture } = Source1TextureManager.addInternalTexture('tf2');
	//window.outputTexture = outputTexture;
	finalNode.getOutput('output')!._value = outputTexture.frames[0];

	//outputTexture.texImage2D(Graphics.glContext, GL_TEXTURE_2D, 1, 1, TextureFormat.Rgba, TextureType.UnsignedByte, new Uint8Array([255, 255, 255, 255]));


	//texImage2D(glContext, target, width, height, format, type, pixels = null, level = 0) {

	setInterval(async () => {
		if (!finalNode.isValid()) {
			await finalNode.redraw();

			const texture = new AnimatedTexture();
			texture.addFrame(0, finalNode.getOutput('output')!._value as Texture);

			//let { name: outputTextureName, texture: outputTexture } = Source1TextureManager.addInternalTexture('tf2', undefined, texture);
			Source1TextureManager.setTexture('tf2', 'test', texture);
			//			finalNode.getOutput('output')!._value = outputTexture.frames[0];

			c_ubersaw.materialsParams['WeaponSkin'] = 'test';
			planeMesh.materialsParams['WeaponSkin'] = 'test';
		}
	}, 100);
}
