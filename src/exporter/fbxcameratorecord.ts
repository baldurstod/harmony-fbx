import { fbxPropertyToRecord } from './fbxpropertytorecord.js';
import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleString} from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty.js';
import { FBX_GEOMETRY_VERSION } from '../constants.js';

export function fbxCameraToRecord(fbxCamera) {
	return createFBXRecord('NodeAttribute', {
		childs: [
			createFBXRecordSingleString('TypeFlags', 'Camera'),
			createFBXRecordSingleInt32('GeometryVersion', FBX_GEOMETRY_VERSION),
			createFBXRecord('Properties70', {
				childs: [
					fbxPropertyToRecord(fbxCamera.position, 'Position'),
					fbxPropertyToRecord(fbxCamera.upVector, 'UpVector'),
				],
			}),
		],
		properties: [
			createInt64Property(fbxCamera.id),
			createStringProperty(fbxCamera.name + '\x00\x01NodeAttribute'),
			createStringProperty('Camera'),
		],
	});
}
