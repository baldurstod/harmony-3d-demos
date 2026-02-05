import { AnimatedTexture, AnimatedTextureProxy, ApplySticker, CombineLerp, createTexture, GL_TEXTURE_2D, Graphics, IntArrayNode, Multiply, NodeImageEditor, NodeImageEditorGui, Plane, Scene, Select, Source1MaterialManager, Source1TextureManager, Texture, TextureFormat, TextureLookup, TextureType } from 'harmony-3d';
import { HTMLHarmonyTabElement } from 'harmony-ui';
import { AddSource1Model } from '../../../utils/source1';
import { InitDemoStd } from '../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../demos';

class TextureLookupDemo implements Demo {
	static readonly path = 'misc/nodeimageeditor/select';

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

registerDemo(TextureLookupDemo);

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

	let groupsLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	groupsLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_groups', 0, false);

	let aoLookupNode = nodeImageEditor.addNode('texture lookup', { textureSize: 1024 }) as TextureLookup;
	aoLookupNode.inputTexture = await Source1TextureManager.getTextureAsync('tf2', 'models/weapons/c_models/c_ubersaw/p_ubersaw_ao', 0, false);


	let selectParametersNode2 = nodeImageEditor.addNode('int array', { length: 16 }) as IntArrayNode;
	selectParametersNode2.setValue(0, 160);
	selectParametersNode2.setValue(1, 192);
	selectParametersNode2.setValue(2, 224);
	selectParametersNode2.setValue(3, 240);

	let selectNode2 = nodeImageEditor.addNode('select') as Select;
	selectNode2.setPredecessor('input', groupsLookupNode, 'output');
	selectNode2.setPredecessor('selectvalues', selectParametersNode2, 'output');

	let multiplyNode4 = nodeImageEditor.addNode('multiply') as Multiply;
	multiplyNode4.setPredecessor('input0', aoLookupNode, 'output');
	multiplyNode4.setPredecessor('input1', selectNode2, 'output');

	let finalNode = groupsLookupNode;
	//finalNode.autoRedraw = true;
	//window.finalNode = finalNode;


	//outputTexture.texImage2D(Graphics.glContext, GL_TEXTURE_2D, 1, 1, TextureFormat.Rgba, TextureType.UnsignedByte, new Uint8Array([255, 255, 255, 255]));


	//texImage2D(glContext, target, width, height, format, type, pixels = null, level = 0) {

	setInterval(async () => {
		if (!finalNode.isValid()) {
			await finalNode.redraw({});

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
