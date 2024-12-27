import { FBXDocument } from './fbxdocument';
import { FBXDocumentInfo } from './fbxdocumentinfo';
import { FBXGlobalSettings } from './fbxglobalsettings';
import { FBXManager } from './fbxmanager';
import { FBXNode } from './fbxnode';
import { FBXObject } from './fbxobject';

export class FBXScene extends FBXDocument {
	#rootNode: FBXNode;
	#globalSettings: FBXGlobalSettings;
	#sceneInfo?: FBXDocumentInfo;
	#objects = new Set<FBXObject>();
	isFBXScene = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
		this.#rootNode = manager.createObject('FBXNode', 'Root node. This node is not saved') as FBXNode;
		this.#globalSettings = manager.createObject('FBXGlobalSettings', 'TODO: name me FBXScene / #globalSettings') as FBXGlobalSettings;
		this.#rootNode.id = 0n;
	}

	set sceneInfo(sceneInfo: FBXDocumentInfo) {
		this.#sceneInfo = sceneInfo;
	}

	get sceneInfo(): FBXDocumentInfo | undefined {
		return this.#sceneInfo;
	}

	get rootNode() {
		return this.#rootNode;
	}

	get globalSettings() {
		return this.#globalSettings;
	}

	addObject(object: FBXObject) {
		this.#objects.add(object);
	}

	get objects() {
		return this.#objects;
	}
}
FBXManager.registerClass('FBXScene', FBXScene);
