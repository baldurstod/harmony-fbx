import { FBXManager } from './fbxmanager';
import { FBXNodeAttribute } from './fbxnodeattribute';
import { FBX_NODE_ATTRIBUTE_TYPE_SKELETON } from '../enums/nodeattributetype';
import { SkeletonType } from '../enums/skeletontype';

export class FBXSkeleton extends FBXNodeAttribute {
	skeletonType: SkeletonType;
	isFBXSkeleton = true;

	constructor(manager: FBXManager, name: string, skeletonType: SkeletonType) {
		super(manager, name);
		this.skeletonType = skeletonType;
	}

	getAttributeType() {
		return FBX_NODE_ATTRIBUTE_TYPE_SKELETON;
	}
}
FBXManager.registerClass('FBXSkeleton', FBXSkeleton);
