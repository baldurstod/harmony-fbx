import { FBX_PROPERTY_TYPE_DOUBLE } from '../enums/propertytype.js';
import { FBXRecord } from '../model/fbxrecord.js';
import { createPDouble } from '../utils/createprecord.js';

export function createPropertiesRecord(fbxObject) {
	const fbxRecord = new FBXRecord('Properties70');
	const objectProperties = fbxObject.getAllProperties();

	for (let property of objectProperties) {
		if (!property.isCompound()) {
			const propertyRecord = createPropertyRecord(property);
			if (propertyRecord) {
				fbxRecord.addChild(propertyRecord);
			}
		}
	}
	return fbxRecord;
}

export function createPropertyRecord(fbxProperty) {
	let fn = TYPE_PROPERTY.get(fbxProperty.type);
	if (!fn) {
		throw 'Unsupported property type';
	}

	return fn(fbxProperty.hierarchicalName, fbxProperty.value);
}

const TYPE_PROPERTY = new Map();
TYPE_PROPERTY.set(FBX_PROPERTY_TYPE_DOUBLE, createPDouble);
