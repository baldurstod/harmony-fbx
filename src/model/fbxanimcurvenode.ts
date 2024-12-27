import { FBXManager } from './fbxmanager';
import { FBXObject } from './fbxobject';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FBX_PROPERTY_TYPE_COMPOUND, FbxPropertyType } from '../enums/propertytype';

export class FBXAnimCurveNode extends FBXObject {
	#channels;
	isFBXAnimCurveNode = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
		this.#channels = this.createProperty(FBX_PROPERTY_TYPE_COMPOUND, 'd', null, FBX_PROPERTY_FLAG_STATIC);
	}

	isAnimated(recurse = false) {
		throw 'Code me';
	}

	createTypedCurveNode(/*property, scene*/) {
		throw 'Code me';
	}

	addChannel(type: FbxPropertyType, name: string, value: any, flags: number) {
		return this.#channels.createProperty(type, name, value, flags);
	}
}
FBXManager.registerClass('FBXAnimCurveNode', FBXAnimCurveNode);
