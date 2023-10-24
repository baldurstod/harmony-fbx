import { FBXLayerElement } from './fbxlayerelement.js';

export class FBXLayerElementTemplate extends FBXLayerElement {
	#directArray = [];
	#indexArray = [];
	constructor(name) {
		super(name);
	}

	get directArray() {
		return this.#directArray;
	}

	get indexArray() {
		return this.#indexArray;
	}
}
FBXLayerElementTemplate.prototype.isFBXLayerElementTemplate = true;
