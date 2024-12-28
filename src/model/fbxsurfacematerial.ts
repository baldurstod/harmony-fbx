import { FBXManager } from './fbxmanager';
import { FBXObject } from './fbxobject';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FBX_PROPERTY_TYPE_STRING, FBX_PROPERTY_TYPE_BOOL } from '../enums/propertytype';

export class FBXSurfaceMaterial extends FBXObject {
	#shadingModel;
	#multiLayer;
	isFBXSurfaceMaterial = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);

		this.#shadingModel = this.createProperty(FBX_PROPERTY_TYPE_STRING, 'ShadingModel', 'Unknown', FBX_PROPERTY_FLAG_STATIC);
		this.#multiLayer = this.createProperty(FBX_PROPERTY_TYPE_BOOL, 'MultiLayer', false, FBX_PROPERTY_FLAG_STATIC);
	}

	set shadingModel(shadingModel) {
		this.#shadingModel.value = shadingModel;
	}

	get shadingModel() {
		return this.#shadingModel.value;
	}

	set multiLayer(multiLayer) {
		this.#multiLayer.value = multiLayer;
	}

	get multiLayer() {
		return this.#multiLayer.value;
	}
}
FBXManager.registerClass('FBXSurfaceMaterial', FBXSurfaceMaterial);
