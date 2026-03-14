import { Scene } from 'harmony-3d';
import { HTMLHarmonyTabElement } from 'harmony-ui';
import { Application } from '../application';

export type InitDemoParams = {
	htmlDemoContentTab: HTMLHarmonyTabElement,
	htmlDemoContent: HTMLElement,
	application: Application,
}

export class Demo {
	static readonly path: string;
	static readonly name: string;
	/** Use custom render loop. Defaults to false */
	readonly useCustomRenderLoop?: boolean;
	async initDemo(scene: Scene, params: InitDemoParams): Promise<void> { };
}

const demos = new Map<string, typeof Demo>();

export function registerDemo(demo: typeof Demo): void {
	if (demos.has(demo.path)) {
		throw new Error(`${demo.path} already exists`);
	}
	demos.set(demo.path, demo);
}

export function getDemo(path: string): Demo | null {
	const demo = demos.get(path);
	if (demo) {
		return new demo();
	}
	return null;
}

export function getDemoList(): Set<string> {
	return new Set(demos.keys());
}
