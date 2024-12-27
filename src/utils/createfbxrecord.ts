import { FBX_DATA_TYPE_INT_8, FBX_DATA_TYPE_DOUBLE, FBX_DATA_TYPE_FLOAT, FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_INT_64, FBX_DATA_TYPE_RAW, FBX_DATA_TYPE_STRING, FBX_DATA_TYPE_INT_16, FBX_DATA_TYPE_ARRAY_INT_8, FBX_DATA_TYPE_ARRAY_DOUBLE, FBX_DATA_TYPE_ARRAY_FLOAT, FBX_DATA_TYPE_ARRAY_INT_32, FBX_DATA_TYPE_ARRAY_INT_64, FbxType } from '../constants';
import { FBXRecordProperty } from '../model/fbxrecordproperty';
import { FBXRecord } from '../model/fbxrecord';

export function createFBXRecord(name: string, options: { [key: string]: any } /*TODO: improve type*/) {
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

export function fbxNameClass(name: string, className: string) {
	return name + '\x00\x01' + className;
}

export function createFBXRecordSingle(name: string, type: FbxType, value: any) {
	let fbxRecord = new FBXRecord(name);
	fbxRecord.addProperty(new FBXRecordProperty(null, type, value));
	return fbxRecord;
}

function createFBXRecordMultiple(name: string, type: FbxType, values: Array<any>) {
	let fbxRecord = new FBXRecord(name);
	for (let value of values) {
		fbxRecord.addProperty(new FBXRecordProperty(null, type, value));
	}
	return fbxRecord;
}

export function createFBXRecordSingleInt8(name: string, value: number) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_8, value);
}

export function createFBXRecordSingleInt32(name: string, value: number) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_32, value);
}

export function createFBXRecordSingleInt64(name: string, value: BigInt) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_64, value);
}

export function createFBXRecordMultipleInt64(name: string, value: Array<BigInt>) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_INT_64, value);
}

export function createFBXRecordSingleFloat(name: string, value: number) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_FLOAT, value);
}

export function createFBXRecordMultipleFloat(name: string, value: Array<number>) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_FLOAT, value);
}

export function createFBXRecordSingleDouble(name: string, value: number) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_DOUBLE, value);
}

export function createFBXRecordMultipleDouble(name: string, value: Array<number>) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_DOUBLE, value);
}

export function createFBXRecordSingleString(name: string, value: string) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_STRING, value);
}

export function createFBXRecordMultipleStrings(name: string, values: Array<string>) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_STRING, values);
}

export function createFBXRecordSingleBytes(name: string, value: Blob) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_RAW, value);
}

export function createFBXRecordMultipleBytes(name: string, value: Array<Blob>) {
	return createFBXRecordMultiple(name, FBX_DATA_TYPE_RAW, value);
}



export function createFBXRecordFloatArray(name: string, value: Array<number>) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_FLOAT, value);
}
export function createFBXRecordDoubleArray(name: string, value: Array<number>) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_DOUBLE, value);
}
export function createFBXRecordInt32Array(name: string, value: Array<number>) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_INT_32, value);
}
export function createFBXRecordInt64Array(name: string, value: Array<BigInt>) {
	return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_INT_64, value);
}
