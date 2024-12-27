export class FBXManager {
	#objects = new Set();
	#documents = new Set();
	static #registry = new Map();

	constructor() {
		this.isFBXManager = true;
	}

	destroy() {
		this.#objects.clear();
		this.#documents.clear();
	}

	static registerClass(className, classConstructor) {
		FBXManager.#registry.set(className, classConstructor);
	}

	createObject(className, objectName, ...args) {
		const classConstructor = FBXManager.#registry.get(className);
		if (!classConstructor) {
			throw 'Unknown constructor in FBXManager.createObject(): ' + className;
		}

		const createdObject = new classConstructor(this, objectName, ...args);
		if (createdObject) {
			if (createdObject.isFBXDocument) {
				this.#documents.add(createdObject);
			} else {
				this.#objects.add(createdObject);
			}
		}
		return createdObject;
	}

}
