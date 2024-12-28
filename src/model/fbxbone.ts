import { getUniqueId } from './fbxids';

export class FBXBone {
	#id = getUniqueId();
	#name: string;

	constructor(name: string) {
		this.#name = name;
	}

	set id(id) {
		this.#id = id;
	}
	get id() {
		return this.#id;
	}

	set name(name) {
		this.#name = name;
	}
	get name() {
		return this.#name;
	}

	toJSON() {
		return {
			id: this.#id,
			name: this.#name,
		}
	}
}
