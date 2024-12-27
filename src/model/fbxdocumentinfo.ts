import { FBXObject } from './fbxobject.js';

export class FBXDocumentInfo extends FBXObject {
	constructor(name) {
		super(name);
	}
}
FBXDocumentInfo.prototype.isFBXDocumentInfo = true;
