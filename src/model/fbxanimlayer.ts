import { FBXCollection } from './fbxcollection.js';
import { FBXManager } from './fbxmanager.js';

export class FBXAnimLayer extends FBXCollection {
	//TODO: add Properties

				/*P: "Weight", "Number", "", "A",100
				P: "Mute", "bool", "", "",0
				P: "Solo", "bool", "", "",0
				P: "Lock", "bool", "", "",0
				P: "Color", "ColorRGB", "Color", "",0.8,0.8,0.8
				P: "BlendMode", "enum", "", "",0
				P: "RotationAccumulationMode", "enum", "", "",0
				P: "ScaleAccumulationMode", "enum", "", "",0
				P: "BlendModeBypass", "ULongLong", "", "",0*/
	constructor(manager, name) {
		super(manager, name);
		this.isFBXAnimLayer = true;
	}
}
FBXManager.registerClass('FBXAnimLayer', FBXAnimLayer);
