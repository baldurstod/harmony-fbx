import { FBXManager } from './fbxmanager.js';
import { FBXNodeAttribute } from './fbxnodeattribute.js';
import { FBX_NODE_ATTRIBUTE_TYPE_SKELETON } from '../enums/nodeattributetype.js';

export class FBXSkeleton extends FBXNodeAttribute {
	#skeletonType;
	constructor(manager, name, skeletonType) {
		super(manager, name);
		this.isFBXSkeleton = true;
		this.skeletonType = skeletonType;
	}

	set skeletonType(skeletonType) {
		this.#skeletonType = skeletonType;
	}

	get skeletonType() {
		return this.#skeletonType;
	}

	getAttributeType() {
		return FBX_NODE_ATTRIBUTE_TYPE_SKELETON;
	}
}
FBXManager.registerClass('FBXSkeleton', FBXSkeleton);
