import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordMultipleStrings, createFBXRecordDoubleArray, createFBXRecordInt32Array } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { FBX_DEFORMER_CLUSTER_VERSION } from '../constants';
import { FBXCluster } from '../model/fbxcluster';

export function fbxClusterToRecord(fbxCluster: FBXCluster) {
	return createFBXRecord('Deformer', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_DEFORMER_CLUSTER_VERSION),
			createFBXRecordMultipleStrings('UserData', ['', '']),
			createFBXRecordInt32Array('Indexes', fbxCluster.indexes),
			createFBXRecordDoubleArray('Weights', fbxCluster.weights),
			createFBXRecordDoubleArray('Transform', fbxCluster.transformMatrix as Array<number>),
			createFBXRecordDoubleArray('TransformLink', fbxCluster.transformLinkMatrix as Array<number>),

		],
		properties: [
			createInt64Property(fbxCluster.id),
			createStringProperty(fbxCluster.name + '\x00\x01SubDeformer'),
			createStringProperty('Cluster'),
		],
	});
}
