import { Scene } from 'harmony-3d';
import { AddSource1Model } from '../../../../../utils/source1';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';
import { quat, vec3 } from 'gl-matrix';

class MttDemo implements Demo {
	static readonly path = 'sourceengine/source1/tf2/models/mtt';

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [0, -200, 80];
		orbitCameraControl.target.setPosition([0, 0, 80]);
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 10;
		perspectiveCamera.verticalFov = 10;

		for (const character of mtt) {
			const modelName = `models/player/${character.class}`;
			const model = await AddSource1Model('tf2', modelName, scene);
			if (model) {
				model.sourceModel.mdl.addExternalMdl('models/player/loadout_tf/' + modelName.toLowerCase().replace(/bots\/[^\/]*\/bot_/, 'player/') + '_loadout_tf_animations.mdl');
				model.playSequence('meettheteam');
				model.setPosition(character.position as vec3);
				model.setOrientation(character.orientation as quat);
			}
		}
	}
}

registerDemo(MttDemo);


const mtt = [
	{
		class: 'pyro',
		"position": [
			-100.2281036377,
			198.9871826172,
			0
		],
		"orientation": [
			0,
			0,
			0.7659834027290344,
			-0.6428603529930115
		]
	},
	{
		class: 'engineer',
		"position": [
			-75.0726394653,
			213.8566589355,
			0
		],
		"orientation": [
			0,
			0,
			0.649108350276947,
			-0.7606959939002991
		]
	},
	{
		class: 'spy',
		"position": [
			-42.7902297974,
			191.040435791,
			0
		],
		"orientation": [
			0,
			0,
			0.8473811149597168,
			-0.5309851169586182
		]
	},
	{

		class: 'heavy',
		"position": [
			-12.7672653198,
			168.1013031006,
			0
		],
		"orientation": [
			0,
			0,
			0.8095924258232117,
			-0.5869923830032349
		]
	},
	{
		class: 'sniper',
		"position": [
			13.5784225464,
			184.4625854492,
			0
		],
		"orientation": [
			0,
			0,
			1,
			-1
		]
	},
	{
		class: 'scout',
		"position": [
			24.4398727417,
			144.8651275635,
			0
		],
		"orientation": [
			0,
			0,
			0.6889068484306335,
			-0.7248498797416687
		]
	},
	{
		class: 'soldier',
		"position": [
			45.6801071167,
			199.4777526855,
			0
		],
		"orientation": [
			0,
			0,
			1,
			-1
		]
	},
	{
		class: 'demo',
		"position": [
			67.8846969604,
			162.6588745117,
			0
		],
		"orientation": [
			0,
			0,
			-0.8936024904251099,
			0.4488592743873596
		]
	},
	{
		class: 'medic',
		"position": [
			90.9413299561,
			182.8147583008,
			0
		],
		"orientation": [
			0,
			0,
			1,
			-1
		]
	}
];
