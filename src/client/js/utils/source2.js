import { Harmony3D } from './application.js';

export async function AddSource2Model(repository, fileName, renderer, scene) {
	let model = await Harmony3D.Source2ModelManager.createInstance(repository, fileName, true);
	if (!model) {
		return;
	}

	console.error(model);
	scene.addChild(model);

	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GRAPHICS_EVENT_TICK, (event) => {
		model.frame += event.detail.delta / 1000;
	});
	return model;
}
