import { FBXLayerElementTemplate } from './fbxlayerelementtemplate.js';

export class FBXLayerElementMaterial extends FBXLayerElementTemplate {
	constructor(name) {
		super(name);
	}
}
FBXLayerElementMaterial.prototype.isFBXLayerElementMaterial = true;
