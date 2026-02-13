import { FBX_PROPERTY_TYPE_DOUBLE_3, FbxPropertyType } from '../enums/propertytype';
import { createFBXRecord } from '../utils/createfbxrecord';
import { createStringProperty, createDoubleProperty } from '../utils/createfbxproperty';
import { FBXProperty } from '../model/fbxproperty';

export function fbxPropertyToRecord(fbxProperty: FBXProperty, name = ''/*TODO: use the property name instead ?*/) {
	switch (fbxProperty.type) {
		case FbxPropertyType.Double:
			return fbxPropertyDoubleToRecord(fbxProperty, name);
		case FbxPropertyType.Double3:
			return fbxPropertyDouble3ToRecord(fbxProperty, name);
		default:
			throw 'unknown property type';
	}
}

export function fbxPropertyDoubleToRecord(fbxProperty: FBXProperty, name: string) {
	let value = fbxProperty.value;
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

export function fbxPropertyDouble3ToRecord(fbxProperty: FBXProperty, name: string) {
	let value = fbxProperty.value;
	return createFBXRecord('P', {
		properties: [
			createStringProperty(name),
			createStringProperty('Vector'),
			createStringProperty(''),
			createStringProperty('A'),//TODO: property flag
			createDoubleProperty(value[0]),
			createDoubleProperty(value[1]),
			createDoubleProperty(value[2]),
		],
	});
}
