import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordDoubleArray, createFBXRecordSingleInt64, createFBXRecordSingleString } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { FBX_POSE_BIND_VERSION } from '../constants';
import { FBXPose } from '../model/fbxpose';

export function fbxPoseToRecord(fbxPose: FBXPose) {
	let poseType = fbxPose.isBindPose ? 'BindPose' : 'RestPose';//TODO: not sure about this
	let poseNodes = [];
	for (let poseInfo of fbxPose.poseInfos) {
		poseNodes.push(
			createFBXRecord('PoseNode', {
				childs: [
					createFBXRecordSingleInt64('Node', poseInfo.node.id),
					createFBXRecordDoubleArray('Matrix', poseInfo.matrix as Array<number>),
				],
			}),
		);
	}

	return createFBXRecord('Pose', {
		childs: [
			createFBXRecordSingleString('Type', poseType),
			createFBXRecordSingleInt32('Version', FBX_POSE_BIND_VERSION),
			createFBXRecordSingleInt32('NbPoseNodes', poseNodes.length),
			...poseNodes,
		],
		properties: [
			createInt64Property(fbxPose.id),
			createStringProperty(fbxPose.name + '\x00\x01Pose'),
			createStringProperty(poseType),
		],
	});
}
