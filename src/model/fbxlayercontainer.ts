import { FBXNodeAttribute } from './fbxnodeattribute.js';

export class FBXLayerContainer extends FBXNodeAttribute {
	constructor(manager, name) {
		super(manager, name);
		this.isFBXLayerContainer = true;
	}
}
