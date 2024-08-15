import { Graphics, GRAPHICS_EVENT_TICK, GraphicsEvents, Scene, SceneExplorer, WebGLStats } from 'harmony-3d';
import { themeCSS } from 'harmony-css';
import { createElement, documentStyle } from 'harmony-ui';
import 'harmony-ui/dist/define/harmony-tab-group.js';
import 'harmony-ui/dist/define/harmony-tab.js';

export * from 'gl-matrix';
export * from 'harmony-3d';
export * from 'harmony-ui';

import applicationCSS from '../css/application.css';
import htmlCSS from '../css/html.css';

documentStyle(htmlCSS);
documentStyle(themeCSS);
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
	#sceneExplorer = new SceneExplorer();
	#renderer;
	constructor() {
		window.addEventListener('hashchange', (event) =>
			this.#loadUri(event.newURL)
		);
		this.#initHTML();
		this.#initEngine();
		this.#loadUri(document.URL);
	}

	#initHTML() {
		this.#htmlElement = createElement('div', {
			parent: document.body,
			class: 'demos',
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
						this.#htmlDemoContentTab = createElement('harmony-tab', {
							'data-i18n': '#demo_content',
						}),
					],
				}),
				createElement('div', {
					class: 'demo-view',
					childs: [
						this.#htmlCanvas = createElement('canvas'),
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

		GraphicsEvents.addEventListener(GRAPHICS_EVENT_TICK, (event) => this.#animate(event));

	}

	#animate(event) {
		WebGLStats.tick();
		if (/*useDefaultRenderLoop && */this.#scene.activeCamera) {
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
					useDefaultRenderLoop = !(module.useCustomRenderLoop == true);
					module.initDemo(renderer, scene, Harmony3D, {
						demoContentTab: htmlDemoContentTab,
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
}
new Application();
