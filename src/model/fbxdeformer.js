import { FBXObject } from './fbxobject.js';
import { FBX_DEFORMER_TYPE_UNKNOWN } from '../enums/deformertype.js';

export class FBXDeformer extends FBXObject {
	constructor(manager, name) {
		super(manager, name);
		this.isFBXDeformer = true;
	}

	get deformerType() {
		return FBX_DEFORMER_TYPE_UNKNOWN;
	}
}
