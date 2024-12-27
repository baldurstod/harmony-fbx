import { FBX_DATA_TYPE_DOUBLE, FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_INT_64, FBX_DATA_TYPE_RAW, FBX_DATA_TYPE_STRING, FBX_DATA_TYPE_INT_16, FBX_DATA_TYPE_ARRAY_INT_8, FBX_DATA_TYPE_ARRAY_DOUBLE, FBX_DATA_TYPE_ARRAY_FLOAT } from '../constants.js';

import {FBXRecordProperty} from '../model/fbxrecordproperty.js';

export function createInt16Property(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_16, value);
}
export function createInt32Property(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_32, value);
}
export function createInt64Property(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_64, BigInt(value));
}
export function createDoubleProperty(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_DOUBLE, value);
}
export function createRawProperty(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_RAW, value);
}
export function createStringProperty(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_STRING, value);
}



export function createDoubleArrayProperty(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_ARRAY_DOUBLE, value);
}
export function createFloatArrayProperty(value) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_ARRAY_FLOAT, value);
}
