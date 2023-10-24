import { FBXManager } from './fbxmanager.js';
import { FBXObject } from './fbxobject.js';

export class FBXVideo extends FBXObject {
	#content;
	#type = 'Clip';
	constructor(manager, name) {
		super(manager, name);
		this.isFBXVideo = true;
	}

	set content(content) {
		this.#content = content;
	}

	get content() {
		return this.#content;
	}

	set type(type) {
		throw 'We might want to check the exporter if we change the type';
		this.#type = type;
	}

	get type() {
		return this.#type;
	}
}
FBXManager.registerClass('FBXVideo', FBXVideo);
