import { FBXManager } from './fbxmanager';
import { FBXObject } from './fbxobject';
import { FBXVideo } from './fbxvideo';

export class FBXTexture extends FBXObject {
	#media?: FBXVideo;
	#type = 'TextureVideoClip';
	isFBXTexture = true;

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
