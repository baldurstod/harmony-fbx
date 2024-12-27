import { FBXCollection } from './fbxcollection';
import { FBXDocumentInfo } from './fbxdocumentinfo';
import { FBXManager } from './fbxmanager';

export class FBXDocument extends FBXCollection {
	#documentInfo?: FBXDocumentInfo;
	isFBXDocument = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
	}

	set documentInfo(documentInfo: FBXDocumentInfo) {
		this.#documentInfo = documentInfo;
	}

	get documentInfo(): FBXDocumentInfo | undefined {
		return this.#documentInfo;
	}
}
