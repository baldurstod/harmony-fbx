import { getUniqueId } from './fbxids.js';

export class FBXModel {
	#id = getUniqueId();
	#name = '';
	#geometry;
	#material;
	#skeleton;
	constructor(geometry, material) {
		this.geometry = geometry;
		this.material = material;
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

	set geometry(geometry) {
		this.#geometry = geometry;
	}

	get geometry() {
		return this.#geometry;
	}

	set material(material) {
		this.#material = material;
	}

	get material() {
		return this.#material;
	}

	set skeleton(skeleton) {
		this.#skeleton = skeleton;
	}

	get skeleton() {
		return this.#skeleton;
	}

	toJSON() {
		return {
			id: this.#id,
			name: this.#name,
			geometry: this.#geometry,
			material: this.#material,
		}
	}
}
