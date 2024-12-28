import { FBXLayerElement } from './fbxlayerelement';

export class FBXLayerElementTemplate extends FBXLayerElement {
	#directArray = [];
	#indexArray = [];
	isFBXLayerElementTemplate = true;

	get directArray() {
		return this.#directArray;
	}

	get indexArray() {
		return this.#indexArray;
	}
}
