import { Entity, GraphicsEvent, GraphicsEvents, GraphicTickEvent, Scene, Source2ModelManager } from 'harmony-3d';

export async function addSource2Model(repository: string, fileName: string, parent: Entity) {
	let model = await Source2ModelManager.createInstance(repository, fileName, true);
	if (!model) {
		return;
	}

	console.error(model);
	parent.addChild(model);

	GraphicsEvents.addEventListener(GraphicsEvent.Tick, (event) => {
		model.mainAnimFrame += (event as CustomEvent<GraphicTickEvent>).detail.delta / 1000;
	});
	return model;
}
