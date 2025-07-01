import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FBX_PROPERTY_TYPE_COLOR_3 } from '../enums/propertytype';
import { FBXManager } from './fbxmanager';
import { FBXProperty } from './fbxproperty';
import { FBXSurfaceMaterial } from './fbxsurfacematerial';

export class FBXSurfaceLambert extends FBXSurfaceMaterial {
	#diffuse: FBXProperty;
	isFBXSurfaceLambert = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
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
