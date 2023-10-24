import { FBXManager } from './fbxmanager.js';
import { FBXSurfaceMaterial } from './fbxsurfacematerial.js';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags.js';
import { FBX_PROPERTY_TYPE_COLOR_3 } from '../enums/propertytype.js';

export class FBXSurfaceLambert extends FBXSurfaceMaterial {
	#diffuse;
	constructor(manager, name) {
		super(manager, name);
		this.isFBXSurfaceLambert = true;
		this.shadingModel = 'Lambert';
		this.#diffuse = this.createProperty(FBX_PROPERTY_TYPE_COLOR_3, 'DiffuseColor', [0.2, 0.2, 0.2], FBX_PROPERTY_FLAG_STATIC);
	}

	set diffuse(diffuse) {
		console.assert(diffuse.isFBXProperty && diffuse.type == FBX_PROPERTY_TYPE_COLOR_3, "diffuse is not an FBXProperty");
		this.#diffuse = diffuse;
	}

	get diffuse() {
		return this.#diffuse;
	}
}
FBXManager.registerClass('FBXSurfaceLambert', FBXSurfaceLambert);
