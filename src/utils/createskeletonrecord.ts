import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleDouble } from './createfbxrecord.js';
import { createInt64Property } from './createfbxproperty.js';
import { FBX_DEFORMER_SKIN_VERSION } from '../constants.js';

export function createSkeletonRecord(fbxSkeleton) {
	return createFBXRecord('Deformer', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_DEFORMER_SKIN_VERSION),
			createFBXRecordSingleDouble('Link_DeformAcuracy', 50.),//What is that ?
		],
		properties: [
			createInt64Property(fbxSkeleton.id),
			createStringProperty(fbxSkeleton.name + '\x00\x01Deformer'),
			createStringProperty('Skin'),
		],
	});
}
