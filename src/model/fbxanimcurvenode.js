import { FBXManager } from './fbxmanager.js';
import { FBXObject } from './fbxobject.js';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags.js';
import { FBX_PROPERTY_TYPE_COMPOUND } from '../enums/propertytype.js';

export class FBXAnimCurveNode extends FBXObject {
	#channels;
	constructor(manager, name) {
		super(manager, name);
		this.isFBXAnimCurveNode = true;
		this.#channels = this.createProperty(FBX_PROPERTY_TYPE_COMPOUND, 'd', null, FBX_PROPERTY_FLAG_STATIC);
	}

	isAnimated(recurse = false) {
		throw 'Code me';
	}

	createTypedCurveNode(property, scene) {
		throw 'Code me';
	}

	addChannel(type, name, value, flags) {
		return this.#channels.createProperty(type, name, value, flags);
	}
}
FBXManager.registerClass('FBXAnimCurveNode', FBXAnimCurveNode);
