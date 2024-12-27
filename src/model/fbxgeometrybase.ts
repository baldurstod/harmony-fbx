import { FBXLayerContainer } from './fbxlayercontainer.js';

export class FBXGeometryBase extends FBXLayerContainer {
	constructor(manager, name) {
		super(manager, name);
		this.isFBXGeometryBase = true;
	}
}
