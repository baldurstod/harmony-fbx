import { createFBXRecord, createFBXRecordMultipleStrings } from './createfbxrecord.js';
import { createStringProperty, createInt32Property, createDoubleProperty, createInt64Property } from './createfbxproperty.js';

export function createPString(name, value) {
	return createFBXRecordMultipleStrings('P', [name, 'KString', '', '', value]);
}
export function createPStringUrl(name, value) {
	return createFBXRecordMultipleStrings('P', [name, 'KString', 'Url', '', value]);
}
export function createPInteger(name, value) {
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
export function createPDouble(name, value) {
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
export function createPColorRGB(name, value) {
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
export function createPEnum(name, value) {
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
export function createPTime(name, value) {
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
export function createPObject(name) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('object'),
			createStringProperty(''),
			createStringProperty(''),
		],
	});
}
export function createPBool(name, value) {
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('bool'),
			createStringProperty(''),
			createStringProperty(''),
			createInt32Property(value),
		],
	});
}
export function createPVector3D(name, value) {
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
