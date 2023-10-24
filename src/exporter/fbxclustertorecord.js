import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordMultipleStrings, createFBXRecordDoubleArray, createFBXRecordInt32Array } from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty.js';
import { FBX_DEFORMER_CLUSTER_VERSION } from '../constants.js';

export function fbxClusterToRecord(fbxCluster) {
	return createFBXRecord('Deformer', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_DEFORMER_CLUSTER_VERSION),
			createFBXRecordMultipleStrings('UserData', ['', '']),
			createFBXRecordInt32Array('Indexes', fbxCluster.indexes),
			createFBXRecordDoubleArray('Weights', fbxCluster.weights),
			createFBXRecordDoubleArray('Transform', fbxCluster.transformMatrix),
			createFBXRecordDoubleArray('TransformLink', fbxCluster.transformLinkMatrix),

		],
		properties: [
			createInt64Property(fbxCluster.id),
			createStringProperty(fbxCluster.name + '\x00\x01SubDeformer'),
			createStringProperty('Cluster'),
		],
	});
}
