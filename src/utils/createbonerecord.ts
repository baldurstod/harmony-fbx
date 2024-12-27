import { createFBXRecord, createFBXRecordSingleInt32 } from './createfbxrecord';
import { createInt64Property } from './createfbxproperty';
import { FBX_DEFORMER_CLUSTER_VERSION } from '../constants';

export function createBoneRecord(fbxBone) {
	return createFBXRecord('Deformer', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_DEFORMER_CLUSTER_VERSION),
		],
		properties: [
			createInt64Property(fbxBone.id),//TODO
			createStringProperty(fbxBone.name + '\x00\x01SubDeformer'),
			createStringProperty('LimbNode'),
		],
	});
}
/*
export function createBoneRecord(fbxBone) {
	return createFBXRecord('NodeAttribute', {
		childs: [
		],
		properties: [
			createInt64Property(fbxBone.id),//TODO
			createStringProperty(fbxBone.name + '\x00\x01NodeAttribute'),
			createStringProperty('LimbNode'),
		],
	});
}
*/
