import { FBXCollection } from './fbxcollection.js';

export class FBXDocument extends FBXCollection {
	#documentInfo;
	constructor(manager, name) {
		super(manager, name);
		this.isFBXDocument = true;
	}

	set documentInfo(documentInfo) {
		if (!documentInfo.isFBXDocumentInfo) {
			throw 'documentInfo must be of type FBXDocumentInfo';
		}
		this.#documentInfo = documentInfo;
	}

	get documentInfo() {
		return this.#documentInfo;
	}
}
