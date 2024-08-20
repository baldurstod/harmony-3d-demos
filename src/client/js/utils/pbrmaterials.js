import { MeshBasicPbrMaterial, TextureManager } from 'harmony-3d';
import pbr from '../../json/materials/pbr.json';

const prefix = '/assets/textures/pbr/';

export function createPbrMaterial(name) {
	const params = pbr[name];
	if (!params) {
		return null;
	}

	let colorTexture, metalnessTexture, roughnessTexture;
	if (params.color) {
		colorTexture = createTextureFromUrl(prefix + params.path + '/' + params.color);
	}
	if (params.metalness) {
		metalnessTexture = createTextureFromUrl(prefix + params.path + '/' + params.metalness);
	}
	if (params.metalness) {
		roughnessTexture = createTextureFromUrl(prefix + params.path + '/' + params.roughness);
	}

	return new MeshBasicPbrMaterial({
		colorTexture: colorTexture,
		metalnessTexture: metalnessTexture,
		roughnessTexture: roughnessTexture,
	})

}

const textures = new Map();
function createTextureFromUrl(url) {
	if (textures.has(url)) {
		return textures.get(url);
	}

	const texture = TextureManager.createTexture();
	textures.set(url, texture);
	const image = new Image();
	image.onload = () => TextureManager.fillTextureWithImage(texture, image);
	image.src = url;
	return texture;
}
