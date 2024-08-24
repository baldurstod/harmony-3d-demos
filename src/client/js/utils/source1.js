import { GRAPHICS_EVENT_TICK, GraphicsEvents, Source1ModelManager } from "harmony-3d";

export async function AddSource1Model(repository, fileName, renderer, scene) {
	let model = await Source1ModelManager.createInstance(repository, fileName, true);
	//let model = mesh.createInstance(true);
	scene.addChild(model);
	model.frame = 0.;
	if (renderer) {
		GraphicsEvents.addEventListener(GRAPHICS_EVENT_TICK, (event) => {
		});
	}
	return model;
}
