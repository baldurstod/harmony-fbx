import { createFBXRecord } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { createFBXRecordSingleInt32, createFBXRecordSingleDouble, createFBXRecordFloatArray, createFBXRecordInt64Array, createFBXRecordInt32Array } from '../utils/createfbxrecord';
import { FBXAnimCurve } from '../model/fbxanimcurve';

export function fbxAnimCurveToRecord(fbxAnimCurve: FBXAnimCurve) {
	return createFBXRecord('AnimationCurve', {
		childs: [
			createFBXRecordSingleDouble('Default', 0.0),//TODO: const
			createFBXRecordSingleInt32('KeyVer', 4008),//TODO: const
			createFBXRecordInt64Array('KeyTime', [100000n, 200000n, 300000n, 400000n]),
			createFBXRecordFloatArray('KeyValueFloat', [1, 2, 3, 4]),
			createFBXRecordInt32Array('KeyAttrFlags', [8456]),
			createFBXRecordFloatArray('KeyAttrDataFloat', [0, 0, 218434821, 0]),
			createFBXRecordInt32Array('KeyAttrRefCount', [4]),
		],
		properties: [
			createInt64Property(fbxAnimCurve.id),
			createStringProperty(fbxAnimCurve.name + '\x00\x01AnimCurve'),
			createStringProperty(''),
		],
	})
}
