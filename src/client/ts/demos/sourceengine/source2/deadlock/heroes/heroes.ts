import { vec4 } from 'gl-matrix';
import { ColorBackground, Cone, Kv3Element, Kv3Value, PointLight, Repositories, Scene, Source2File, Source2FileLoader, Source2ModelInstance } from 'harmony-3d';
import { createElement } from 'harmony-ui';
import { addSource2Model } from '../../../../../utils/source2';
import { InitDemoStd } from '../../../../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../../../../demos';
import { parse } from 'harmony-vdf';

type Hero = {
	//name: string;
	model: string;
	anim?: string;
	released?: boolean;
}

class Source2DeadlockArcher implements Demo {
	static readonly path = 'sourceengine/source2/deadlock/heroes/heroes';
	#heroModel?: Source2ModelInstance;

	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> {
		const [perspectiveCamera, orbitCameraControl, ambientLight] = InitDemoStd(scene);
		perspectiveCamera.position = [200, 0, 45];
		orbitCameraControl.target.position = [0, 0, 45];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 1;
		perspectiveCamera.verticalFov = 50;
		ambientLight.intensity = 0.1;
		scene.background = new ColorBackground({ color: vec4.fromValues(0, 0, 0, 1) });
		scene.addChild(new PointLight({ position: [50, -10, 60], intensity: 10000 }));


		let htmlHeroListReleased;
		let htmlHeroListStaging;
		const htmlHeroList = createElement('div', {
			parent: params.htmlDemoContent,
			style: 'display: flex;flex-direction: column;',
			childs: [
				htmlHeroListReleased = createElement('div', {
					style: 'display: flex;flex-direction: column;',
					child: createElement('div', {
						innerText: 'Released heroes',
					}),
				}),
				htmlHeroListStaging = createElement('div', {
					style: 'display: flex;flex-direction: column;',
					child: createElement('div', {
						innerText: 'Shelved heroes',
					}),
				}),
			]
		});

		// Sort by name

		const heroes = await this.#loadHeroes()

		const ordered = [...heroes.keys()].sort().reduce((obj: Record<string, Hero>, key: string) => { obj[key] = heroes.get(key)!; return obj; }, {});
		for (const name in ordered) {
			const h = heroes.get(name)!;

			createElement('button', {
				parent: h.released ? htmlHeroListReleased : htmlHeroListStaging,
				innerText: name,
				events: {
					click: () => this.#testHero(scene, h),
				}
			});
		}

		await this.#loadHeroes();
	}

	async #testHero(scene: Scene, hero: Hero) {
		const items: string[] = [
		]

		if (this.#heroModel) {
			this.#heroModel.setVisible(false);
		}

		this.#heroModel = await addSource2Model('deadlock', hero.model, scene);
		this.#heroModel!.playAnimation(hero.anim ?? 'idle_loadout');

		for (const item of items) {
			const itemModel = await addSource2Model('dota2', item, this.#heroModel!) as Source2ModelInstance;
			itemModel.playSequence('ACT_DOTA_IDLE');
		}
	}

	async #loadHeroes(): Promise<Map<string, Hero>> {
		const heroes = new Map<string, Hero>();

		const dataFile = await new Source2FileLoader().load('deadlock', 'scripts/heroes.vdata_c') as Source2File;
		const kv = dataFile.getKeyValueRoot();

		if (!kv || !kv.root) {
			return heroes;
		}

		//const english = await new Source2FileLoader().load('deadlock', 'resource/localization/citadel_gc_hero_names/citadel_gc_hero_names_english.txt') as Source2File;
		//const kvEnglish = english.getKeyValueRoot();
		const response = await Repositories.getFileAsText('deadlock', 'resource/localization/citadel_gc_hero_names/citadel_gc_hero_names_english.txt');
		if (response.error) {
			return heroes;
		}

		const kvEnglish = parse(response.text!);
		console.info(kvEnglish);

		const tokens = kvEnglish?.getKeyByName('lang')?.getKeyByName('Tokens');

		for (const [token, property] of kv.root.getProperties()) {
			if (!(property as Kv3Value).isKv3Value) {
				continue;
			}

			const name = tokens?.getKeyByName(token + ':n'/* why do we do that ?*/);
			if (!name) {
				continue;
			}

			const elem = (property as Kv3Value).getValue();

			if (!(elem as Kv3Element).isKv3Element) {
				continue;
			}

			const modelName = (elem as Kv3Element).getSubValueAsResource('m_strModelName');
			//console.info(modelName);

			if (modelName) {
				heroes.set(name.value as string, { model: modelName });
			}
		}

		return heroes;
	}
}

registerDemo(Source2DeadlockArcher);
