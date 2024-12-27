import { mat4 } from 'gl-matrix';

import {FBXManager} from './fbxmanager.js';
import {FBXSubDeformer} from './fbxsubdeformer.js';
import {FBX_LINK_MODE_NORMALIZE} from '../enums/linkmode.js';
import {FBX_SUB_DEFORMER_TYPE_CLUSTER} from '../enums/subdeformertype.js';

export class FBXCluster extends FBXSubDeformer {
	#linkMode = FBX_LINK_MODE_NORMALIZE;
	#link;
	#indexes = [];
	#weights = [];
	#transformMatrix = mat4.create();
	#transformLinkMatrix = mat4.create();
	#transformParentMatrix;
	constructor(manager, name) {
		super(manager, name);
		this.isFBXCluster = true;
	}

	set linkMode(linkMode) {
		this.#linkMode = linkMode;
	}

	get linkMode() {
		return this.#linkMode;
	}

	set link(link) {
		this.#link = link;
	}

	get link() {
		return this.#link;
	}

	addVertexIndex(index, weight) {
		this.#indexes.push(index);
		this.#weights.push(weight);
	}

	get indexes() {
		return this.#indexes;
	}

	get weights() {
		return this.#weights;
	}

	get subDeformerType() {
		return FBX_SUB_DEFORMER_TYPE_CLUSTER;
	}

	set transformMatrix(transformMatrix) {
		mat4.copy(this.#transformMatrix, transformMatrix);
	}

	get transformMatrix() {
		return mat4.clone(this.#transformMatrix);
	}

	set transformLinkMatrix(transformLinkMatrix) {
		mat4.copy(this.#transformLinkMatrix, transformLinkMatrix);
	}

	get transformLinkMatrix() {
		return mat4.clone(this.#transformLinkMatrix);
	}

	set transformParentMatrix(transformParentMatrix) {
		this.#transformParentMatrix = transformParentMatrix;
	}

	get transformParentMatrix() {
		return this.#transformParentMatrix;
	}
}
FBXManager.registerClass('FBXCluster', FBXCluster);
