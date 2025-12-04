import { exportToBinaryFBX, Scene } from 'harmony-3d';
import { saveFile } from 'harmony-browser-utils';

export async function exportFBX(scene: Scene) {
	//let fbxFile = await entitytoFBXFile(scene);

	let binaryFBX = await exportToBinaryFBX(scene);//new FBXExporter().exportBinary(fbxFile);
	saveFile(new File([binaryFBX], 'test.fbx'));
}
