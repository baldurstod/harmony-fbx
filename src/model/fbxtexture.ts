import { FBXManager } from './fbxmanager.js';
import { FBXObject } from './fbxobject.js';

export class FBXTexture extends FBXObject {
	#media;
	#type = 'TextureVideoClip';
	constructor(manager, name) {
		super(manager, name);
		this.isFBXTexture = true;
	}

	set type(type) {
		throw 'We might want to check the exporter if we change the type';
		this.#type = type;
	}

	get type() {
		return this.#type;
	}

	set media(media) {
		this.#media = media;
	}

	get media() {
		return this.#media;
	}

}
FBXManager.registerClass('FBXTexture', FBXTexture);
