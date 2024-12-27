import { mat4 } from 'gl-matrix';
import { FBXManager } from './fbxmanager';
import { FBXNode } from './fbxnode';
import { FBXObject } from './fbxobject';
import { FBXPoseInfo } from './fbxposeinfo';

export class FBXPose extends FBXObject {
	#isBindPose = true;
	#poseInfos: Array<FBXPoseInfo> = [];
	isFBXPose = true;

	set isBindPose(isBindPose) {
		this.#isBindPose = isBindPose;
	}

	get isBindPose() {
		return this.#isBindPose;
	}

	get isRestPose() {
		return !this.#isBindPose;
	}

	add(node: FBXNode, matrix: mat4, matrixIsLocal: boolean) {
		this.#poseInfos.push(new FBXPoseInfo(node, matrix, matrixIsLocal));
	}

	get poseInfos() {
		return this.#poseInfos;
	}
}
FBXManager.registerClass('FBXPose', FBXPose);
