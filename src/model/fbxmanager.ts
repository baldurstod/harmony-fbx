import { FBXDocument } from './fbxdocument';
import { FBXObject } from './fbxobject';

export class FBXManager {
	#objects = new Set<FBXObject>();
	#documents = new Set<FBXDocument>();
	isFBXManager = true;
	static #registry = new Map<string, typeof FBXObject>();

	destroy() {
		this.#objects.clear();
		this.#documents.clear();
	}

	static registerClass(className: string, classConstructor: typeof FBXObject) {
		FBXManager.#registry.set(className, classConstructor);
	}

	createObject(className: string, objectName: string, ...args: Array<any>) {
		const classConstructor = FBXManager.#registry.get(className);
		if (!classConstructor) {
			throw 'Unknown constructor in FBXManager.createObject(): ' + className;
		}

		const createdObject = new classConstructor(this, objectName, args);
		if (createdObject) {
			if ((createdObject as FBXDocument).isFBXDocument) {
				this.#documents.add(createdObject as FBXDocument);
			} else {
				this.#objects.add(createdObject);
			}
		}
		return createdObject;
	}

}
