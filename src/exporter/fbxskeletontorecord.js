import { createFBXRecord, createFBXRecordSingleString } from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty.js';

export function fbxSkeletonToRecord(fbxSkeleton) {
	return createFBXRecord('NodeAttribute', {
		childs: [
			createFBXRecordSingleString('TypeFlags', 'Skeleton'),
		],
		properties: [
			createInt64Property(fbxSkeleton.id),
			createStringProperty(fbxSkeleton.name + '\x00\x01NodeAttribute'),
			createStringProperty('LimbNode'),
		],
	});
}
