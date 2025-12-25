import { MeshBasicPbrMaterial, Texture, TextureManager } from 'harmony-3d';
import pbr from '../../json/materials/pbr.json';

const prefix = '/assets/textures/pbr/';

export type PbrParams = {
	'path': string,
	'color': string,
	'metalness': string,
	'roughness': string,
	'normal'?: string,
}

export function getPbrParams(name: string) {
	return (pbr as Record<string, PbrParams>)[name]!;
}

export async function createPbrMaterial(name: string) {
	const params = (pbr as Record<string, PbrParams>)[name];
	if (!params) {
		return null;
	}

	let colorTexture, normalTexture, metalnessTexture, roughnessTexture;
	if (params.color) {
		colorTexture = await createTextureFromUrl(prefix + params.path + '/' + params.color);
	}
	if (params.normal) {
		normalTexture = await createTextureFromUrl(prefix + params.path + '/' + params.normal);
	}
	if (params.metalness) {
		metalnessTexture = await createTextureFromUrl(prefix + params.path + '/' + params.metalness);
	}
	if (params.metalness) {
		roughnessTexture = await createTextureFromUrl(prefix + params.path + '/' + params.roughness);
	}

	return new MeshBasicPbrMaterial({
		colorTexture: colorTexture,
		normalTexture: normalTexture,
		metalnessTexture: metalnessTexture,
		roughnessTexture: roughnessTexture,
	})

}

const textures = new Map();
export async function createTextureFromUrl(url: string): Promise<Texture> {
	if (textures.has(url)) {
		return textures.get(url);
	}

	const image = new Image();
	//const texture = TextureManager.createTexture({ flipY: true });

	let promiseResolve: (value: Texture) => void;
	const promise = new Promise<Texture>(resolve => {
		promiseResolve = resolve;
	});

	image.onload = async () => {
		const texture = await TextureManager.createTextureFromImage({
			webgpuDescriptor: {
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			},
			image: image,
			flipY: true,
		});
		textures.set(url, texture);
		promiseResolve(texture);
	}//TextureManager.fillTextureWithImage(texture, image);
	image.src = url;
	return promise;
}
