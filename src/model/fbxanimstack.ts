import { FBXCollection } from './fbxcollection';
import { FBXManager } from './fbxmanager';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FBX_PROPERTY_TYPE_STRING, FBX_PROPERTY_TYPE_TIME } from '../enums/propertytype';

export class FBXAnimStack extends FBXCollection {
	#description;
	#localStart;
	#localStop;
	#referenceStart;
	#referenceStop;
	isFBXAnimStack = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
		this.#description = this.createProperty(FBX_PROPERTY_TYPE_STRING, 'Description', '', FBX_PROPERTY_FLAG_STATIC);
		this.#localStart = this.createProperty(FBX_PROPERTY_TYPE_TIME, 'LocalStart', 0, FBX_PROPERTY_FLAG_STATIC);
		this.#localStop = this.createProperty(FBX_PROPERTY_TYPE_TIME, 'LocalStop', 0, FBX_PROPERTY_FLAG_STATIC);
		this.#referenceStart = this.createProperty(FBX_PROPERTY_TYPE_TIME, 'ReferenceStart', 0, FBX_PROPERTY_FLAG_STATIC);
		this.#referenceStop = this.createProperty(FBX_PROPERTY_TYPE_TIME, 'ReferenceStop', 0, FBX_PROPERTY_FLAG_STATIC);
	}
}
FBXManager.registerClass('FBXAnimStack', FBXAnimStack);
