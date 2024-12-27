import { FBXDocument } from './fbxdocument.js';
import { FBXManager } from './fbxmanager.js';

class FBXScene extends FBXDocument {
	#rootNode;
	#globalSettings;
	#sceneInfo;
	#objects = new Set();
	constructor(manager, name) {
		super(manager, name);
		this.isFBXScene = true;
		this.#rootNode = manager.createObject('FBXNode', 'Root node. This node is not saved');
		this.#globalSettings = manager.createObject('FBXGlobalSettings', 'TODO: name me FBXScene / #globalSettings');
		this.#rootNode.id = 0;
	}

	set sceneInfo(sceneInfo) {
		if (!sceneInfo.isFBXDocumentInfo) {
			throw 'sceneInfo must be of type FBXDocumentInfo';
		}
		this.#sceneInfo = sceneInfo;
	}

	get sceneInfo() {
		return this.#sceneInfo;
	}

	get rootNode() {
		return this.#rootNode;
	}

	get globalSettings() {
		return this.#globalSettings;
	}

	addObject(object) {
		if (!object.isFBXObject) {
			throw 'object must be of type FBXObject';
		}
		this.#objects.add(object);
	}

	get objects() {
		return this.#objects;
	}
}
FBXManager.registerClass('FBXScene', FBXScene);
