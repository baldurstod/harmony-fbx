import { FBXAnimCurveKey } from './fbxanimcurvekey';
import { FBXManager } from './fbxmanager';
import { FBXObject } from './fbxobject';

export class FBXAnimCurve extends FBXObject {
	#keys = new Map<bigint, FBXAnimCurveKey>();
	isFBXAnimCurve = true;

	addKey(animCurveKey: FBXAnimCurveKey) {
		this.#keys.set(animCurveKey.time.time, animCurveKey);
	}
}
FBXManager.registerClass('FBXAnimCurve', FBXAnimCurve);
