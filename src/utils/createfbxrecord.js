import {FBX_DATA_TYPE_INT_8, FBX_DATA_TYPE_DOUBLE, FBX_DATA_TYPE_FLOAT, FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_INT_64, FBX_DATA_TYPE_RAW, FBX_DATA_TYPE_STRING, FBX_DATA_TYPE_INT_16, FBX_DATA_TYPE_ARRAY_INT_8, FBX_DATA_TYPE_ARRAY_DOUBLE, FBX_DATA_TYPE_ARRAY_FLOAT, FBX_DATA_TYPE_ARRAY_INT_32, FBX_DATA_TYPE_ARRAY_INT_64} from '../constants.js';
import {FBXRecordProperty} from '../model/fbxrecordproperty.js';
import {FBXRecord} from '../model/fbxrecord.js';

export function createFBXRecord(name, options) {
	let fbxRecord = new FBXRecord(name);
	if (options) {
		for (let optionName in options) {
			let optionValue = options[optionName];
			switch (optionName) {
				case 'parent':
					optionValue.addChild(fbxRecord);
					break;
				case 'child':
					fbxRecord.addChild(optionValue);
					break;
				case 'childs':
					fbxRecord.addChilds(optionValue);
					break;
				case 'property':
					fbxRecord.addProperty(optionValue);
					break;
				case 'properties':
					fbxRecord.addProperties(optionValue);
					break;
				default:
					console.log(`Unknown property: ${optionName}`);
			}
		}
	}
	return fbxRecord;
}

export function fbxNameClass(name, className) {
	return name + '\x00\x01' + className;
}

export function createFBXRecordSingle(name, type, value) {
	let fbxRecord = new FBXRecord(name);
	fbxRecord.addProperty(new FBXRecordProperty(null, type, value));
	return fbxRecord;
}
export function createFBXRecordMultiple(name, type, values) {
	let fbxRecord = new FBXRecord(name);
	for (let value of values) {
		fbxRecord.addProperty(new FBXRecordProperty(null, type, value));
	}
	return fbxRecord;
}
export function createFBXRecordSingleInt8(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_8, value);
}
export function createFBXRecordSingleInt32(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_32, value);
}
export function createFBXRecordSingleInt64(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_64, value);
}
export function createFBXRecordMultipleInt64(name, value) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_INT_64, value);
}

export function createFBXRecordSingleFloat(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_FLOAT, value);
}
export function createFBXRecordMultipleFloat(name, value) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_FLOAT, value);
}

export function createFBXRecordSingleDouble(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_DOUBLE, value);
}
export function createFBXRecordMultipleDouble(name, value) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_DOUBLE, value);
}

export function createFBXRecordSingleString(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_STRING, value);
}
export function createFBXRecordMultipleStrings(name, values) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_STRING, values);
}

export function createFBXRecordSingleBytes(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_RAW, value);
}
export function createFBXRecordMultipleBytes(name, value) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_RAW, value);
}



export function createFBXRecordFloatArray(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_FLOAT, value);
}
export function createFBXRecordDoubleArray(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_DOUBLE, value);
}
export function createFBXRecordInt32Array(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_INT_32, value);
}
export function createFBXRecordInt64Array(name, value) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_INT_64, value);
}
