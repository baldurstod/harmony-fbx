import { FBXObject } from './fbxobject.js';
import { FBX_SUB_DEFORMER_TYPE_UNKNOWN } from '../enums/subdeformertype.js';

export class FBXSubDeformer extends FBXObject {
	constructor(manager, name) {
		super(manager, name);
		this.isFBXSubDeformer = true;
	}

	get subDeformerType() {
		return FBX_SUB_DEFORMER_TYPE_UNKNOWN;
	}
}
