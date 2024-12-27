import { FBXObject } from './fbxobject';
import { FBX_DEFORMER_TYPE_UNKNOWN } from '../enums/deformertype';

export class FBXDeformer extends FBXObject {
	isFBXDeformer = true;

	get deformerType() {
		return FBX_DEFORMER_TYPE_UNKNOWN;
	}
}
