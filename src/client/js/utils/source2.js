import { GraphicsEvent, GraphicsEvents, Source2ModelManager } from 'harmony-3d';

export async function AddSource2Model(repository, fileName, renderer, scene) {
	let model = await Source2ModelManager.createInstance(repository, fileName, true);
	if (!model) {
		return;
	}

	console.error(model);
	scene.addChild(model);

	GraphicsEvents.addEventListener(GraphicsEvent.Tick, (event) => {
		model.frame += event.detail.delta / 1000;
	});
	return model;
}
