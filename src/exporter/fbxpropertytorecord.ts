import { FBX_PROPERTY_TYPE_DOUBLE_3 } from '../enums/propertytype';
import { createFBXRecord } from '../utils/createfbxrecord';
import { createStringProperty, createDoubleProperty } from '../utils/createfbxproperty';
import { FBXProperty } from '../model/fbxproperty';

export function fbxPropertyToRecord(fbxProperty: FBXProperty, name = '') {
	switch (fbxProperty.type) {
		case FBX_PROPERTY_TYPE_DOUBLE_3:
			return fbxPropertyDouble3ToRecord(fbxProperty, name);

			break;
		default:
			throw 'unknown property type';
	}
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
