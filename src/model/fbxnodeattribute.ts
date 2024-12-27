import { FBXObject } from './fbxobject';
import { FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN } from '../enums/nodeattributetype';

export class FBXNodeAttribute extends FBXObject {
	isFBXNodeAttribute = true;

	getAttributeType() {
		return FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN;
	}
}
