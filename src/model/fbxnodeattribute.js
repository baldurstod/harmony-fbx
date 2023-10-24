import { FBXObject } from './fbxobject.js';
import { FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN } from '../enums/nodeattributetype.js';

export class FBXNodeAttribute extends FBXObject {
	constructor(manager, name) {
		super(manager, name);
		this.isFBXNodeAttribute = true;
	}

	getAttributeType() {
		return FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN;
	}
}
