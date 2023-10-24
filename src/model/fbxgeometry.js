import { FBXGeometryBase } from './fbxgeometrybase.js';

export class FBXGeometry extends FBXGeometryBase {
	#deformers = new Set();
	constructor(manager, name) {
		super(manager, name);
		this.isFBXGeometry = true;
	}

	addDeformer(deformer) {
		if (!deformer.isFBXDeformer) {
			throw 'deformer must be of type FBXDeformer';
		}

		this.#deformers.add(deformer);
	}

	removeDeformer(deformer) {
		if (!deformer.isFBXDeformer) {
			throw 'deformer must be of type FBXDeformer';
		}

		this.#deformers.delete(deformer);
	}

	get deformers() {
		return this.#deformers;
	}
}
