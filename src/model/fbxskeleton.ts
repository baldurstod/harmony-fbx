import { FBX_NODE_ATTRIBUTE_TYPE_SKELETON } from '../enums/nodeattributetype';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FbxPropertyType } from '../enums/propertytype';
import { SkeletonType } from '../enums/skeletontype';
import { FBXManager } from './fbxmanager';
import { FBXNodeAttribute } from './fbxnodeattribute';
import { FBXProperty } from './fbxproperty';

export class FBXSkeleton extends FBXNodeAttribute {
	skeletonType: SkeletonType;
	isFBXSkeleton = true;
	readonly size: FBXProperty = this.createProperty(FbxPropertyType.Double, 'Size', 10, FBX_PROPERTY_FLAG_STATIC);

	constructor(manager: FBXManager, name: string, skeletonType: SkeletonType) {
		super(manager, name);
		this.skeletonType = skeletonType;
	}

	getAttributeType() {
		return FBX_NODE_ATTRIBUTE_TYPE_SKELETON;
	}
}
FBXManager.registerClass('FBXSkeleton', FBXSkeleton);
