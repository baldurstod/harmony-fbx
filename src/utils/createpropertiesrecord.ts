import { FBX_PROPERTY_TYPE_DOUBLE, FbxPropertyType } from '../enums/propertytype';
import { FBXObject } from '../model/fbxobject';
import { FBXProperty } from '../model/fbxproperty';
import { FBXRecord } from '../model/fbxrecord';
import { createPDouble } from '../utils/createprecord';

export function createPropertiesRecord(fbxObject: FBXObject) {
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

export function createPropertyRecord(fbxProperty: FBXProperty) {
	let fn = TYPE_PROPERTY.get(fbxProperty.type);
	if (!fn) {
		throw 'Unsupported property type';
	}

	return fn(fbxProperty.hierarchicalName, fbxProperty.value);
}

const TYPE_PROPERTY = new Map<FbxPropertyType, (arg1: string, arg2: any) => FBXRecord>();
TYPE_PROPERTY.set(FBX_PROPERTY_TYPE_DOUBLE, createPDouble);
