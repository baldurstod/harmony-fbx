import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FBX_PROPERTY_TYPE_COLOR_3 } from '../enums/propertytype';
import { FBXManager } from './fbxmanager';
import { FBXProperty } from './fbxproperty';
import { FBXSurfaceMaterial } from './fbxsurfacematerial';

export class FBXSurfaceLambert extends FBXSurfaceMaterial {
	#diffuse: FBXProperty;
	#normalMap?: FBXProperty;
	isFBXSurfaceLambert = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
		this.shadingModel = 'Lambert';
		this.#diffuse = this.createProperty(FBX_PROPERTY_TYPE_COLOR_3, 'DiffuseColor', [0.2, 0.2, 0.2], FBX_PROPERTY_FLAG_STATIC);
	}

	set diffuse(diffuse: FBXProperty) {
		console.assert(diffuse.isFBXProperty && diffuse.type == FBX_PROPERTY_TYPE_COLOR_3, "diffuse is not an FBXProperty");
		this.#diffuse = diffuse;
	}

	get diffuse(): FBXProperty {
		return this.#diffuse;
	}

	set normalMap(normalMap: FBXProperty | undefined) {
		if (normalMap) {
			console.assert(normalMap.isFBXProperty && normalMap.type == FBX_PROPERTY_TYPE_COLOR_3, "normalMap is not an FBXProperty");
		}
		this.#normalMap = normalMap;
	}

	get normalMap(): FBXProperty | undefined {
		return this.#normalMap;
	}
}
FBXManager.registerClass('FBXSurfaceLambert', FBXSurfaceLambert);
