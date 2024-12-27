import { FBXManager } from './fbxmanager';
import { FBXSurfaceLambert } from './fbxsurfacelambert';

export class FBXSurfacePhong extends FBXSurfaceLambert {
	isFBXSurfacePhong = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
		this.shadingModel = 'Phong';
	}
}
FBXManager.registerClass('FBXSurfacePhong', FBXSurfacePhong);
