import { getUniqueId } from './fbxids.js';

export class FBXMaterial {
	#id = getUniqueId();
	#textures = new Set();

	constructor() {
	}

	set id(id) {
		this.#id = id;
	}
	get id() {
		return this.#id;
	}

	addTexture(texture) {
		this.#textures.add(texture);
	}

	deleteTexture(texture) {
		this.#textures.delete(texture);
	}

	get textures() {
		return this.#textures;
	}

	toJSON() {
		return {
			id: this.#id,
		}
	}
}
