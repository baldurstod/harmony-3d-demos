import { GraphicsEvent, GraphicsEvents, Scene, Source1ModelManager } from 'harmony-3d';

export async function AddSource1Model(repository: string, fileName: string, scene: Scene) {
	let model = await Source1ModelManager.createInstance(repository, fileName, true);
	//let model = mesh.createInstance(true);
	scene.addChild(model);
	//model.frame = 0.;
	return model;
}
