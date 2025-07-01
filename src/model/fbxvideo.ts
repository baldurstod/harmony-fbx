import { FBXManager } from './fbxmanager';
import { FBXObject } from './fbxobject';

export class FBXVideo extends FBXObject {
	#content?: Uint8Array<ArrayBuffer>;
	#type = 'Clip';
	isFBXVideo = true;

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
