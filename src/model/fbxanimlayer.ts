import { FBXCollection } from './fbxcollection';
import { FBXManager } from './fbxmanager';

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
	isFBXAnimLayer = true;
}
FBXManager.registerClass('FBXAnimLayer', FBXAnimLayer);
