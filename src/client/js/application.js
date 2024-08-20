import { Graphics, GRAPHICS_EVENT_TICK, GraphicsEvents, Repositories, Repository, Scene, SceneExplorer, ShaderEditor, Source1ModelManager, Source1ParticleControler, Source2ModelManager, Source2ParticleManager, SourceEngineMaterialManager, WebGLStats } from 'harmony-3d';
import { themeCSS } from 'harmony-css';
import { createElement, documentStyle, hide, show, toggle } from 'harmony-ui';
import 'harmony-ui/dist/define/harmony-tab-group.js';
import 'harmony-ui/dist/define/harmony-tab.js';

export * as GlMatrix from 'gl-matrix';
export * as Harmony3D from 'harmony-3d';
export * as HarmonyUi from 'harmony-ui';
export * from './utils/pbrmaterials.js';

import applicationCSS from '../css/application.css';
import htmlCSS from '../css/html.css';
import varsCSS from '../css/vars.css';
import { CS2_REPOSITORY, DEADLOCK_REPOSITORY, DOTA2_REPOSITORY, HLA_REPOSITORY, TF2_REPOSITORY } from '../constants';

documentStyle(htmlCSS);
documentStyle(themeCSS);
documentStyle(varsCSS);
documentStyle(applicationCSS)

class Application {
	#htmlElement;
	#htmlCanvas;
	#htmlStats;
	#htmlDemoContent;
	#htmlDemoList;
	#htmlDemoContentTab;
	#scene = new Scene();
	#sceneExplorerTab;
	#shaderEditorTab;
	#sceneExplorer = new SceneExplorer();
	#renderer;
	#useDefaultRenderLoop = true;
	#shaderEditor;
	constructor() {
		window.addEventListener('hashchange', (event) =>
			this.#loadUri(event.newURL)
		);
		this.#initRepositories();
		this.#initHTML();
		this.#initEngine();
		this.#loadUri(document.URL);
		this.#loadDemos();
	}

	#initRepositories() {
		Repositories.addRepository(new Repository('tf2', TF2_REPOSITORY));
		Repositories.addRepository(new Repository('dota2', DOTA2_REPOSITORY));
		Repositories.addRepository(new Repository('hla', HLA_REPOSITORY));
		Repositories.addRepository(new Repository('cs2', CS2_REPOSITORY));
		Repositories.addRepository(new Repository('deadlock', DEADLOCK_REPOSITORY));

		Source1ParticleControler.loadManifest('tf2');
		Source1ModelManager.loadManifest('tf2');
		Source2ModelManager.loadManifest('cs2');
		Source2ModelManager.loadManifest('dota2');
		Source2ModelManager.loadManifest('hla');
		SourceEngineMaterialManager.addRepository('tf2');
		Source2ParticleManager.loadManifests('cs2', 'dota2', 'hla');
	}

	#initHTML() {
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
									content: "+"
								}
								.demos-list-dir-content{
									padding-left: 20px;
								}`,
							childs: [
								createElement('harmony-tab', {
									'data-i18n': '#demos',
									childs: [
										/*
										htmlButtonSavePicture = createElement('button', {
											style: "height:30px;",
											innerText: 'Picture',
										}),
										htmlButtonexportFBX = createElement('button', {
											style: "height:30px;",
											innerText: 'Export FBX',
										}),*/
										this.#htmlDemoList = createElement('div', {
											style: "height:300px;",
										}),
									],
								}),
								createElement('harmony-tab', {
									'data-i18n': '#scene_explorer',
									child: this.#sceneExplorerTab = createElement('div', {
										style: "height:100%;",
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
								}),
							],
						}),
					],
				}),
				createElement('div', {
					class: 'demo-view',
					childs: [
						this.#htmlCanvas = createElement('canvas', {
							id: 'demo-canvas',
						}),
						this.#htmlStats = createElement('div', {
							class: 'stats',
						}),
						this.#htmlDemoContent = createElement('div', {
							class: 'demo-content',
						}),
					],
				}),
			],
		});
	}

	#initEngine() {
		this.#shaderEditor = new ShaderEditor();
		this.#sceneExplorer.scene = this.#scene;

		this.#renderer = Graphics.initCanvas({
			canvas: this.#htmlCanvas,
			alpha: true,
			autoResize: true,
			preserveDrawingBuffer: true,
			premultipliedAlpha: false
		});
		this.#renderer.play();
		WebGLStats.start();
		this.#htmlStats.append(WebGLStats.htmlElement);

		GraphicsEvents.addEventListener(GRAPHICS_EVENT_TICK, (event) => this.#animate(event));

	}

	#animate(event) {
		WebGLStats.tick();
		if (this.#useDefaultRenderLoop && this.#scene.activeCamera) {
			this.#renderer.render(this.#scene, this.#scene.activeCamera, event.detail.delta);
		}
	}

	#loadUri(uri) {
		const url = new URL(uri);
		const hash = url.hash.substring(1);
		this.#initDemo(hash);
	}

	async #initDemo(demo) {
		this.#expand(demo);
		this.#htmlDemoContentTab.innerText = '';
		this.#htmlDemoContent.innerText = '';
		//TODO: cleanup scene and renderer
		this.#scene.removeChildren();
		if (demo) {
			import('./demos/' + demo + '.js').then(
				(module) => {
					this.#useDefaultRenderLoop = !(module.useCustomRenderLoop == true);
					module.initDemo(this.#renderer, this.#scene, {
						htmlDemoContentTab: this.#htmlDemoContentTab,
						htmlDemoContent: this.#htmlDemoContent,
					});
				},
				(err) => console.error(err)
			);
		}
	}

	#expand(path) {
		let container = this.#htmlDemoList;
		let arr = path.split('/');
		while (arr.length) {
			let value = arr.shift();
			for (let child of container.children) {
				if (child.firstChild.innerHTML == value) {
					show(child.lastChild);
					container = child.lastChild;
					break;
				}
			}
		}
	}

	async #loadDemos() {
		let divs = [];
		let response = await fetch('/list');
		let json = await response.json();
		let container = this.#htmlDemoList;
		divs = [container, {}];

		for (let file of json.result.files) {
			let arr = file.split('/');
			let currentLevel = divs;
			for (let i = 0; i < arr.length - 1; ++i) {
				let d = currentLevel[1][arr[i]];
				if (!d) {
					d = document.createElement('div');
					d.className = 'demos-list-dir';
					let header = document.createElement('div');
					header.className = 'demos-list-dir-title';
					header.innerHTML = arr[i];
					let content = document.createElement('div');
					content.className = 'demos-list-dir-content';
					currentLevel[0].append(d);
					d.append(header, content);
					currentLevel[1][arr[i]] = [content, {}];
					hide(content);
					header.addEventListener('click', () => toggle(content));
				}
				currentLevel = currentLevel[1][arr[i]];
			}
			let demo = document.createElement('div');
			demo.innerHTML = arr[arr.length - 1];
			demo.addEventListener('click', () => {
				let location = document.location;
				location.hash = '#' + file;
				document.location = location;
			}
			);
			currentLevel[0].append(demo);
		}
		this.#expand(new URL(document.URL).hash.substring(1));

	}
}
new Application();
