import { createFBXRecord, createFBXRecordSingleString } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { FBXSkeleton } from '../model/fbxskeleton';

export function fbxSkeletonToRecord(fbxSkeleton: FBXSkeleton) {
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
