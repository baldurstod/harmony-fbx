import { FBXManager } from './fbxmanager.js';
import { FBXObject } from './fbxobject.js';

export class FBXAnimCurve extends FBXObject {
	#keys = new Map();
	constructor(manager, name) {
		super(manager, name);
		this.isFBXAnimCurve = true;
	}

	addKey(animCurveKey) {
		this.#keys.set(animCurveKey.time.time, animCurveKey);
	}
}
FBXManager.registerClass('FBXAnimCurve', FBXAnimCurve);
