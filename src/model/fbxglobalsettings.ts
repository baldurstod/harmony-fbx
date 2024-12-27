import { FBXColor } from './fbxcolor.js';
import { FBXManager } from './fbxmanager.js';
import { FBXObject } from './fbxobject.js';
import { FBXAxisSystem } from './fbxaxissystem.js';

export class FBXGlobalSettings extends FBXObject {
	#ambientColor = new FBXColor();
	#defaultCamera = '';
	#axisSystem = new FBXAxisSystem(2, 1);
	constructor(manager, name) {
		super(manager, name);
		this.isFBXGlobalSettings = true;
	}

	set ambientColor(ambientColor) {
		if (!ambientColor.isFBXColor) {
			throw 'ambientColor must be a FBXColor';
		}
		this.#ambientColor = ambientColor;
	}

	get ambientColor() {
		return this.#ambientColor;
	}

	set defaultCamera(defaultCamera) {
		this.#defaultCamera = defaultCamera;
	}

	get defaultCamera() {
		return this.#defaultCamera;
	}
}
FBXManager.registerClass('FBXGlobalSettings', FBXGlobalSettings);
