import { FBXSkeleton } from '../model/fbxskeleton';
import { createDoubleProperty, createInt64Property, createStringProperty } from '../utils/createfbxproperty';
import { createFBXRecord, createFBXRecordSingleString } from '../utils/createfbxrecord';
import { fbxPropertyToRecord } from './fbxpropertytorecord';

export function fbxSkeletonToRecord(fbxSkeleton: FBXSkeleton) {
	return createFBXRecord('NodeAttribute', {
		childs: [
			createFBXRecordSingleString('TypeFlags', 'Skeleton'),
			createFBXRecord('Properties70', {
				childs: [
					fbxPropertyToRecord(fbxSkeleton.size, 'Size'),
				],
			}),
		],
		properties: [
			createInt64Property(fbxSkeleton.id),
			createStringProperty(fbxSkeleton.name + '\x00\x01NodeAttribute'),
			createStringProperty('LimbNode'),
		],
	});
}
