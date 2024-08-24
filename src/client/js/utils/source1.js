import { Harmony3D } from './application.js';

export async function AddSource1Model(repository, fileName, renderer, scene) {
	let model = await Harmony3D.Source1ModelManager.createInstance(repository, fileName, true);
	//let model = mesh.createInstance(true);
	scene.addChild(model);
	model.frame = 0.;
	if (renderer) {
		Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GRAPHICS_EVENT_TICK, (event) => {
		});
	}
	return model;
}
