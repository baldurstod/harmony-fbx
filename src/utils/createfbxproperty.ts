import { FBX_DATA_TYPE_DOUBLE, FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_INT_64, FBX_DATA_TYPE_RAW, FBX_DATA_TYPE_STRING, FBX_DATA_TYPE_INT_16, FBX_DATA_TYPE_ARRAY_INT_8, FBX_DATA_TYPE_ARRAY_DOUBLE, FBX_DATA_TYPE_ARRAY_FLOAT } from '../constants';
import { FBXRecordProperty } from '../model/fbxrecordproperty';

export function createInt16Property(value: number) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_16, value);
}
export function createInt32Property(value: number) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_32, value);
}
export function createInt64Property(value: bigint) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_64, value);
}
export function createDoubleProperty(value: number) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_DOUBLE, value);
}
export function createRawProperty(value: any/*TODO: better type*/) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_RAW, value);
}
export function createStringProperty(value: string) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_STRING, value);
}



export function createDoubleArrayProperty(value:Array<number>) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_ARRAY_DOUBLE, value);
}
export function createFloatArrayProperty(value:Array<number>) {
	return new FBXRecordProperty(null, FBX_DATA_TYPE_ARRAY_FLOAT, value);
}
