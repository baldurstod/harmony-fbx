import { createFBXRecord, createFBXRecordMultipleStrings } from './createfbxrecord';
import { createStringProperty, createInt32Property, createDoubleProperty, createInt64Property } from './createfbxproperty';

export function createPString(name: string, value: string) {
	return createFBXRecordMultipleStrings('P', [name, 'KString', '', '', value]);
}

export function createPStringUrl(name: string, value: string) {
	return createFBXRecordMultipleStrings('P', [name, 'KString', 'Url', '', value]);
}

export function createPInteger(name: string, value: number) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('int'),
			createStringProperty('Integer'),
			createStringProperty(''),
			createInt32Property(value),
		],
	});
}

export function createPDouble(name: string, value: number) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('double'),
			createStringProperty('Number'),
			createStringProperty(''),
			createDoubleProperty(value),
		],
	});
}

export function createPColorRGB(name: string, value: Array<number>) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('ColorRGB'),
			createStringProperty('Color'),
			createStringProperty(''),
			createDoubleProperty(value[0]),
			createDoubleProperty(value[1]),
			createDoubleProperty(value[2]),
		],
	});
}

export function createPEnum(name: string, value: number) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('enum'),
			createStringProperty(''),
			createStringProperty(''),
			createInt32Property(value),
		],
	});
}

export function createPTime(name: string, value: bigint) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('KTime'),
			createStringProperty('Time'),
			createStringProperty(''),
			createInt64Property(value),
		],
	});
}

export function createPObject(name: string) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('object'),
			createStringProperty(''),
			createStringProperty(''),
		],
	});
}

export function createPBool(name: string, value: boolean) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('bool'),
			createStringProperty(''),
			createStringProperty(''),
			createInt32Property(value ? 1 : 0),
		],
	});
}

export function createPVector3D(name: string, value: Array<number>) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('Vector3D'),
			createStringProperty('Vector'),
			createStringProperty(''),
			createDoubleProperty(value[0]),
			createDoubleProperty(value[1]),
			createDoubleProperty(value[2]),
		],
	});
}
