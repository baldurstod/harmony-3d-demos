import { AddSource1Model, InitDemoStd, Harmony3D } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
let planeMesh;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);

	perspectiveCamera.position = [500, 0, 150];
	orbitCameraControl.target.position = [0, 0, 50];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 10;

	testNodeImageEditor(renderer, scene);
}

async function testNodeImageEditor(renderer, scene) {
	planeMesh = new Harmony3D.Plane({ width: 200, height: 200 });
	scene.addChild(planeMesh);
	Harmony3D.SourceEngineMaterialManager.getMaterial('tf2', 'materials/models/weapons/c_models/c_minigun/c_minigun').then(
		(material) => planeMesh.setMaterial(material)
	)
	testUberSaw(renderer, scene);
}

async function testUberSaw(renderer, scene) {
	let c_ubersaw = await AddSource1Model('tf2', 'models/weapons/c_models/c_ubersaw/c_ubersaw', renderer, scene);
	c_ubersaw.playSequence('idle');

	let nodeImageEditor = new Harmony3D.NodeImageEditor(Harmony3D.Graphics);
	let nodeImageEditorGui = new Harmony3D.NodeImageEditorGui(nodeImageEditor);
	document.getElementById('demo-content').append(nodeImageEditorGui.html);
	nodeImageEditor.textureSize = 1024;

	//let stickerNode = nodeImageEditor.addNode('sticker');
	//stickerNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'patterns/autumn/sticker_a_bomb', 0);

	let applyStickerNode = nodeImageEditor.addNode('apply_sticker');
	//applyStickerNode.setPredecessor('input0', stickerNode, 'output');
	applyStickerNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'patterns/autumn/sticker_a_bomb', 0);



	let groupsLookupNode = nodeImageEditor.addNode('texture lookup');
	groupsLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_groups', 0);
	let aoLookupNode = nodeImageEditor.addNode('texture lookup');
	aoLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_ao', 0);
	let blankLookupNode = nodeImageEditor.addNode('texture lookup');
	blankLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'patterns/blank_white', 0);
	let albedoLookupNode = nodeImageEditor.addNode('texture lookup');
	albedoLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_albedo', 0);
	let techLookupNode = nodeImageEditor.addNode('texture lookup');
	techLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'patterns/workshop/smissmas_2017/1181727321/1181727321_tech', 0);
	let techBlackLookupNode = nodeImageEditor.addNode('texture lookup');
	techBlackLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'patterns/workshop/smissmas_2017/1181727321/1181727321_tech_solid_black', 0);
	let techGreenLookupNode = nodeImageEditor.addNode('texture lookup');
	techGreenLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'patterns/workshop/smissmas_2017/1181727321/1181727321_tech_solid_green', 0);
	let wearLookupNode = nodeImageEditor.addNode('texture lookup');
	wearLookupNode.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_wearblend', 0);


	let multiplyNode = nodeImageEditor.addNode('multiply');
	multiplyNode.setPredecessor('input0', blankLookupNode, 'output');
	multiplyNode.setPredecessor('input1', blankLookupNode, 'output');

	let lerpNode = nodeImageEditor.addNode('combine_lerp');
	lerpNode.setPredecessor('input0', multiplyNode, 'output');
	lerpNode.setPredecessor('input1', blankLookupNode, 'output');
	lerpNode.setPredecessor('weight', wearLookupNode, 'output');

	let multiplyNode2 = nodeImageEditor.addNode('multiply');
	multiplyNode2.setPredecessor('input0', blankLookupNode, 'output');
	multiplyNode2.setPredecessor('input1', lerpNode, 'output');

	let selectParametersNode = nodeImageEditor.addNode('int array', { length: 16 });
	selectParametersNode.setValue(0, 32);
	selectParametersNode.setValue(1, 112);
	selectParametersNode.setValue(2, 128);
	selectParametersNode.setValue(3, 176);
	selectParametersNode.setValue(4, 208);

	let selectNode = nodeImageEditor.addNode('select');
	selectNode.setPredecessor('input', groupsLookupNode, 'output');
	selectNode.setPredecessor('selectvalues', selectParametersNode, 'output');
	/*let selectValues = selectNode.getInput('selectvalues');
	selectValues.setArrayValue(32);
	selectValues.setArrayValue(112);
	selectValues.setArrayValue(128);
	selectValues.setArrayValue(176);
	selectValues.setArrayValue(208);*/


	let selectParametersNode2 = nodeImageEditor.addNode('int array', { length: 16 });
	selectParametersNode2.setValue(0, 160);
	selectParametersNode2.setValue(1, 192);
	selectParametersNode2.setValue(2, 224);
	selectParametersNode2.setValue(3, 240);

	let selectNode2 = nodeImageEditor.addNode('select');
	selectNode2.setPredecessor('input', groupsLookupNode, 'output');
	selectNode2.setPredecessor('selectvalues', selectParametersNode2, 'output');
	/*let selectValues2 = selectNode2.getInput('selectvalues');
	selectValues2.setArrayValue(160);
	selectValues2.setArrayValue(192);
	selectValues2.setArrayValue(224);
	selectValues2.setArrayValue(240);*/

	let lerpNode2 = nodeImageEditor.addNode('combine_lerp');
	lerpNode2.setPredecessor('input0', techLookupNode, 'output');
	lerpNode2.setPredecessor('input1', techBlackLookupNode, 'output');
	lerpNode2.setPredecessor('weight', selectNode, 'output');

	let lerpNode3 = nodeImageEditor.addNode('combine_lerp');
	lerpNode3.setPredecessor('input0', lerpNode2, 'output');
	lerpNode3.setPredecessor('input1', techGreenLookupNode, 'output');
	lerpNode3.setPredecessor('weight', selectNode2, 'output');

	let lerpNode4 = nodeImageEditor.addNode('combine_lerp');
	lerpNode4.setPredecessor('input0', albedoLookupNode, 'output');
	lerpNode4.setPredecessor('input1', lerpNode3, 'output');
	lerpNode4.setPredecessor('weight', multiplyNode2, 'output');



	let multiplyNode4 = nodeImageEditor.addNode('multiply');
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
	window.finalNode = finalNode;

	let p_paintkit_tool_wearblend = nodeImageEditor.addNode('texture lookup');
	p_paintkit_tool_wearblend.inputTexture = await Harmony3D.Source1TextureManager.getTextureAsync('tf2', 'models/items/paintkit_tool/p_paintkit_tool_wearblend', 0);
	p_paintkit_tool_wearblend.params.adjustBlack = 0.27;
	p_paintkit_tool_wearblend.params.adjustWhite = 1;
	p_paintkit_tool_wearblend.params.adjustGamma = 1.1;

	let [outputTextureName, outputTexture] = Harmony3D.Source1TextureManager.addInternalTexture();
	window.outputTexture = outputTexture;
	finalNode.getOutput('output')._value = outputTexture;

	outputTexture.texImage2D(Harmony3D.Graphics.glContext, Harmony3D.GL_TEXTURE_2D, 1, 1, Harmony3D.TextureFormat.Rgba, Harmony3D.TextureType.UnsignedByte, new Uint8Array([255, 255, 255, 255]));


	//texImage2D(glContext, target, width, height, format, type, pixels = null, level = 0) {

	setInterval(() => {
		if (!finalNode.isValid()) {
			finalNode.redraw();
			c_ubersaw.materialsParams['WeaponSkin'] = outputTextureName;
			planeMesh.materialsParams['WeaponSkin'] = outputTextureName;
		}
	}, 100);
}
