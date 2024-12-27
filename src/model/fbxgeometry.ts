import { FBXDeformer } from './fbxdeformer';
import { FBXGeometryBase } from './fbxgeometrybase';

export class FBXGeometry extends FBXGeometryBase {
	#deformers = new Set<FBXDeformer>();
	isFBXGeometry = true;

	addDeformer(deformer: FBXDeformer) {
		this.#deformers.add(deformer);
	}

	removeDeformer(deformer: FBXDeformer) {
		this.#deformers.delete(deformer);
	}

	get deformers() {
		return this.#deformers;
	}
}
