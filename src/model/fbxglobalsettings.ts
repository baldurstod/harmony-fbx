import { FBXColor } from './fbxcolor';
import { FBXManager } from './fbxmanager';
import { FBXObject } from './fbxobject';
import { FBXAxisSystem } from './fbxaxissystem';

export class FBXGlobalSettings extends FBXObject {
	#ambientColor = new FBXColor();
	#defaultCamera = '';
	#axisSystem = new FBXAxisSystem(2, 1);
	isFBXGlobalSettings = true;

	set ambientColor(ambientColor: FBXColor) {
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
