import { FBXManager } from './fbxmanager.js';
import { FBXObject } from './fbxobject.js';
import { FBXPoseInfo } from './fbxposeinfo.js';

export class FBXPose extends FBXObject {
	#isBindPose = true;
	#poseInfos = [];
	constructor(manager, name) {
		super(manager, name);
		this.isFBXPose = true;
	}

	set isBindPose(isBindPose) {
		this.#isBindPose = isBindPose;
	}

	get isBindPose() {
		return this.#isBindPose;
	}

	get isRestPose() {
		return !this.#isBindPose;
	}

	add(node, matrix, matrixIsLocal) {
		this.#poseInfos.push(new FBXPoseInfo(node, matrix, matrixIsLocal));
	}

	get poseInfos() {
		return this.#poseInfos;
	}
}
FBXManager.registerClass('FBXPose', FBXPose);
