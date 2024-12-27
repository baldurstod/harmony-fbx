import { FBXDeformer } from './fbxdeformer.js';
import { FBXManager } from './fbxmanager.js';
import { FBX_DEFORMER_TYPE_SKIN } from '../enums/deformertype.js';
import { FBX_SKINNING_TYPE_LINEAR } from '../enums/skinningtype.js';

export class FBXSkin extends FBXDeformer {
	#geometry;
	#skinningType = FBX_SKINNING_TYPE_LINEAR;
	#clusters = new Set();
	constructor(manager, name) {
		super(manager, name);
		this.isFBXSkin = true;
	}

	set geometry(geometry) {
		if (geometry && !geometry.isFBXGeometry) {
			throw 'geometry must be of type FBXGeometry';
		}
		if (this.#geometry) {
			this.#geometry.removeDeformer(this);
		}
		if (geometry) {
			geometry.addDeformer(this);
		}
		this.#geometry = geometry;
	}

	get geometry() {
		return this.#geometry;
	}

	set skinningType(skinningType) {
		this.#skinningType = skinningType;
	}

	get skinningType() {
		return this.#skinningType;
	}

	addCluster(fbxCluster) {
		this.#clusters.add(fbxCluster);
	}

	removeCluster(fbxCluster) {
		this.#clusters.delete(fbxCluster);
	}

	get clusters() {
		return this.#clusters;
	}

	get deformerType() {
		return FBX_DEFORMER_TYPE_SKIN;
	}
}
FBXManager.registerClass('FBXSkin', FBXSkin);
