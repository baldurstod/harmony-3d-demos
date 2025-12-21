import { CanvasAttributes, ContextType, exportToBinaryFBX, Graphics, GraphicsEvent, GraphicsEvents, GraphicTickEvent, Repositories, Scene, SceneExplorer, ShaderEditor, Source1ModelManager, WebGLStats, WebRepository } from 'harmony-3d';
import { saveFile } from 'harmony-browser-utils';
import { themeCSS } from 'harmony-css';
import { ColorPickerEventData, createElement, defineHarmonyColorPicker, defineHarmonyTab, defineHarmonyTabGroup, documentStyle, hide, HTMLHarmonyTabElement, I18n, show, toggle } from 'harmony-ui';
import { CS2_REPOSITORY, DEADLOCK_REPOSITORY, DOTA2_REPOSITORY, HLA_REPOSITORY, TF2_REPOSITORY } from '../constants';
import applicationCSS from '../css/application.css';
import htmlCSS from '../css/html.css';
import varsCSS from '../css/vars.css';
import { getDemo, getDemoList } from './demos/demos';
export * from './demos/export';

documentStyle(htmlCSS);
documentStyle(themeCSS);
documentStyle(varsCSS);
documentStyle(applicationCSS)

class Application {
	#htmlElement!: HTMLElement;
	#htmlCanvas!: HTMLCanvasElement;
	#htmlCanvasContainer!: HTMLElement;
	#htmlStats!: HTMLElement;
	#htmlDemoContent!: HTMLElement;
	#htmlDemoList!: HTMLElement;
	#htmlDemoContentTab!: HTMLHarmonyTabElement;
	#htmlOptionsTab!: HTMLElement;
	#scene = new Scene();
	#sceneExplorerTab!: HTMLElement;
	#shaderEditorTab!: HTMLElement;
	#sceneExplorer = new SceneExplorer();
	#renderer!: typeof Graphics;
	#useDefaultRenderLoop = true;
	#shaderEditor = new ShaderEditor();
	#mainCanvas!: CanvasAttributes;
	#contextType = ContextType.WebGL;

	constructor() {
		this.#init();
	}

	async #init() {
		window.addEventListener('hashchange', (event) =>
			this.#loadUri(event.newURL)
		);
		this.#initRepositories();
		this.#initHTML();
		await this.#initEngine();
		this.#loadUri(document.URL);
		this.#loadDemos();
		this.#sceneExplorer.setScene(this.#scene);
		I18n.start();
	}

	#initRepositories() {
		Repositories.addRepository(new WebRepository('tf2', TF2_REPOSITORY));
		Repositories.addRepository(new WebRepository('dota2', DOTA2_REPOSITORY));
		Repositories.addRepository(new WebRepository('hla', HLA_REPOSITORY));
		Repositories.addRepository(new WebRepository('cs2', CS2_REPOSITORY));
		Repositories.addRepository(new WebRepository('deadlock', DEADLOCK_REPOSITORY));
		Source1ModelManager.loadManifest('tf2');
		/*
		Source1ParticleControler.loadManifest('tf2');
		Source2ModelManager.loadManifest('cs2');
		Source2ModelManager.loadManifest('dota2');
		Source2ModelManager.loadManifest('hla');
		Source2ModelManager.loadManifest('deadlock');
		Source1MaterialManager.addRepository('tf2');
		Source2ParticleManager.loadManifests('cs2', 'dota2', 'hla');
		*/
	}

	#initHTML() {
		defineHarmonyColorPicker();
		defineHarmonyTab();
		defineHarmonyTabGroup();
		this.#htmlElement = createElement('div', {
			parent: document.body,
			class: 'demos',
			childs: [
				createElement('div', {
					class: 'demo-list',
					childs: [
						createElement('harmony-tab-group', {
							class: 'demo-tabs',
							adoptStyle: `
								.demos-list-dir{
									cursor: pointer;
								}
								.demos-list-dir-title::before{
									content: '+'
								}
								.demos-list-dir-content{
									padding-left: 20px;
								}`,
							childs: [
								createElement('harmony-tab', {
									'data-i18n': '#demos',
									childs: [
										createElement('button', {
											style: 'height:30px;',
											innerText: 'Picture',
											events: {
												click: () => this.#renderer.savePicture(this.#scene, this.#scene.activeCamera!, 'test.png', 1920, 1080),
											}
										}),
										createElement('button', {
											style: 'height:30px;',
											innerText: 'Export FBX',
											events: {
												click: async () => {
													saveFile(new File([await exportToBinaryFBX(this.#scene)], 'test.fbx'));
												},
											}
										}),
										this.#htmlDemoList = createElement('div', {
											style: 'height:300px;',
										}),
									],
								}),
								createElement('harmony-tab', {
									'data-i18n': '#options',
									child: this.#htmlOptionsTab = createElement('div', {
										class: 'demo-options-tab',
										childs: [
											createElement('harmony-color-picker', {
												$change: (event: CustomEvent<ColorPickerEventData>) => this.#renderer.clearColor(event.detail.rgba),
											}),
										],
									}),
								}),
								createElement('harmony-tab', {
									'data-i18n': '#scene_explorer',
									child: this.#sceneExplorerTab = createElement('div', {
										style: 'height:100%;',
										child: this.#sceneExplorer.htmlElement,
									}),
								}),
								this.#shaderEditorTab = createElement('harmony-tab', {
									'data-i18n': '#shader_editor',
									events: {
										activated: () => {
											this.#shaderEditor.initEditor({ aceUrl: '/assets/js/ace-builds/src-min/ace.js', displayCustomShaderButtons: false });
											this.#shaderEditorTab.append(this.#shaderEditor);
										}
									},
								}),
								this.#htmlDemoContentTab = createElement('harmony-tab', {
									'data-i18n': '#demo_content',
								}) as HTMLHarmonyTabElement,
							],
						}),
					],
				}),
				this.#htmlCanvasContainer = createElement('div', {
					class: 'demo-view',
					childs: [
						/*
						this.#htmlCanvas = createElement('canvas', {
							id: 'demo-canvas',
						}),
						*/
						this.#htmlStats = createElement('div', {
							class: 'stats',
						}),
						this.#htmlDemoContent = createElement('div', {
							id: 'demo-content',
						}),
					],
				}),
			],
		});
	}

	async #initEngine() {
		//this.#shaderEditor = new ShaderEditor();
		//this.#sceneExplorer.scene = this.#scene;

		const url = new URL(document.URL);
		//if (url.pathname.startsWith('/@webgpu')) {
		if (url.hash.substring(1) == 'webgpu') {
			this.#contextType = ContextType.WebGPU;
		}

		this.#renderer = await Graphics.initCanvas({
			useOffscreenCanvas: true,
			autoResize: true,
			type: this.#contextType,
			webGL: {
				alpha: true,
				//preserveDrawingBuffer: true,
				premultipliedAlpha: false
			},
			webGPU: {
				alphaMode: 'premultiplied',
			}
		});

		this.#mainCanvas = Graphics.addCanvas({
			name: 'main_canvas',
			/*
			scene: {
				scene: loadoutScene,
				composer: this.#composer,
			},
			*/
			autoResize: true
		})!;

		this.#htmlCanvasContainer.append(this.#mainCanvas.canvas);


		this.#renderer.play();
		WebGLStats.start();
		this.#htmlStats.append(WebGLStats.htmlElement);

		GraphicsEvents.addEventListener(GraphicsEvent.Tick, (event) => this.#animate(event as CustomEvent<GraphicTickEvent>));

	}

	#animate(event: CustomEvent<GraphicTickEvent>) {
		WebGLStats.tick();
		if (this.#useDefaultRenderLoop && this.#scene.activeCamera) {
			//this.#renderer.render(this.#scene, this.#scene.activeCamera, event.detail.delta, {});
			Graphics.renderMultiCanvas(event.detail.delta);
		}
	}

	#loadUri(uri: string) {
		const url = new URL(uri);
		//const hash = url.hash.substring(1);

		if (url.pathname.startsWith('/@')) {
			this.#initDemo(url.pathname.substring(2));
		}
	}

	async #initDemo(path: string): Promise<void> {
		this.#expand(path);
		this.#htmlDemoContentTab.innerText = '';
		this.#htmlDemoContent.innerText = '';
		//TODO: cleanup scene and renderer
		this.#scene.removeChildren();
		if (path && !path.endsWith('/')) {

			const demo = getDemo(path);
			if (demo) {
				demo.initDemo(this.#scene, {
					htmlDemoContentTab: this.#htmlDemoContentTab,
					htmlDemoContent: this.#htmlDemoContent,
				});
			}
			/*
			import('./demos/' + path + '.js').then(
				(module) => {
					this.#useDefaultRenderLoop = !(module.useCustomRenderLoop == true);
					module.initDemo(this.#renderer, this.#scene, {
						htmlDemoContentTab: this.#htmlDemoContentTab,
						htmlDemoContent: this.#htmlDemoContent,
					});
				},
				(err) => console.error(err)
			);
			*/
		}
	}

	#expand(path: string) {
		let container = this.#htmlDemoList;
		let arr = path.split('/');
		while (arr.length) {
			let value = arr.shift();
			for (let child of container.children) {
				if (child.firstChild && (child.firstChild as HTMLElement).innerHTML == value) {
					show(child.lastChild as HTMLElement);
					container = child.lastChild as HTMLElement;
					break;
				}
			}
		}
	}

	#loadDemos(): void {
		//let divs = [];
		//let response = await fetch('/list');
		//let json = await response.json();
		type toto = [HTMLElement, Record<string, HTMLElement | toto>];

		let container = this.#htmlDemoList;
		const divs: toto = [container, {}];

		for (let file of getDemoList()) {
			let arr = file.split('/');
			let currentLevel: toto | undefined = divs;
			for (let i = 0; i < arr.length - 1; ++i) {
				let d: HTMLElement | undefined = currentLevel![1]![arr[i]!] as HTMLElement;
				if (!d) {
					d = createElement('div', { class: 'demos-list-dir' });
					let header = createElement('div', { class: 'demos-list-dir-title', innerText: arr[i]! });
					let content = createElement('div', { class: 'demos-list-dir-content' });
					currentLevel[0].append(d);
					d.append(header, content);
					currentLevel[1][arr[i]!] = [content, {}];
					hide(content);
					header.addEventListener('click', () => toggle(content));
				}
				currentLevel = currentLevel[1][arr[i]!] as toto;
			}
			let demo = createElement('div', { innerText: arr[arr.length - 1] });
			demo.addEventListener('click', () => {
				let location = new URL(document.location.toString());
				//new Location().
				location.pathname = '/@' + file;
				//document.location = location.toString();

				history.pushState({}, '', location);
				this.#loadUri(location.toString());
			}
			);
			currentLevel[0].append(demo);
		}
		this.#expand(new URL(document.URL).hash.substring(1));
	}
}
new Application();
