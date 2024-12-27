import { FBXDeformer } from './fbxdeformer';
import { FBXManager } from './fbxmanager';
import { FBX_DEFORMER_TYPE_SKIN } from '../enums/deformertype';
import { FBX_SKINNING_TYPE_LINEAR } from '../enums/skinningtype';
import { FBXGeometry } from './fbxgeometry';
import { FBXCluster } from './fbxcluster';

export class FBXSkin extends FBXDeformer {
	#geometry?: FBXGeometry;
	#skinningType = FBX_SKINNING_TYPE_LINEAR;
	#clusters = new Set<FBXCluster>();
	isFBXSkin = true;

	set geometry(geometry) {
		if (geometry && !geometry.isFBXGeometry) {
			throw 'geometry must be of type FBXGeometry';
		}
		if (this.#geometry) {
			this.#geometry.removeDeformer(this);
		}
		if (geometry) {
			geometry.addDeformer(this);
		}
		this.#geometry = geometry;
	}

	get geometry() {
		return this.#geometry;
	}

	set skinningType(skinningType) {
		this.#skinningType = skinningType;
	}

	get skinningType() {
		return this.#skinningType;
	}

	addCluster(fbxCluster: FBXCluster) {
		this.#clusters.add(fbxCluster);
	}

	removeCluster(fbxCluster: FBXCluster) {
		this.#clusters.delete(fbxCluster);
	}

	get clusters() {
		return this.#clusters;
	}

	get deformerType() {
		return FBX_DEFORMER_TYPE_SKIN;
	}
}
FBXManager.registerClass('FBXSkin', FBXSkin);
