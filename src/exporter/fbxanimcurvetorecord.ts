import { createFBXRecord } from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty.js';
import { createFBXRecordSingleInt32, createFBXRecordSingleDouble, createFBXRecordFloatArray, createFBXRecordInt64Array, createFBXRecordInt32Array } from '../utils/createfbxrecord.js';

export function fbxAnimCurveToRecord(fbxAnimCurve) {
	return createFBXRecord('AnimationCurve', {
		childs: [
			createFBXRecordSingleDouble('Default', 0.0),//TODO: const
			createFBXRecordSingleInt32('KeyVer', 4008),//TODO: const
			createFBXRecordInt64Array('KeyTime', [100000, 200000, 300000, 400000]),
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
