import { FBXManager } from './fbxmanager.js';
import { FBXSurfaceLambert } from './fbxsurfacelambert.js';

export class FBXSurfacePhong extends FBXSurfaceLambert {
	constructor(manager, name) {
		super(manager, name);
		this.isFBXSurfacePhong = true;
		this.shadingModel = 'Phong';
	}
}
FBXManager.registerClass('FBXSurfacePhong', FBXSurfacePhong);
