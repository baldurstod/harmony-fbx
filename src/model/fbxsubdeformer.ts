import { FBXObject } from './fbxobject';
import { FBX_SUB_DEFORMER_TYPE_UNKNOWN } from '../enums/subdeformertype';

export class FBXSubDeformer extends FBXObject {
	isFBXSubDeformer = true;

	get subDeformerType() {
		return FBX_SUB_DEFORMER_TYPE_UNKNOWN;
	}
}
