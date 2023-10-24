import { getUniqueId } from './fbxids.js';
import { FBXProperty } from './fbxproperty.js';

export class FBXObject {
	#id = getUniqueId();
	#name = '';
	#srcObjects = new Set();
	#rootProperty;
	#manager;
	constructor(manager, name = '') {
		if (!manager.isFBXManager) {
			console.trace('Missing manager in FBXObject');
			throw 'Missing manager in FBXObject';
		}
		this.#manager = manager;
		this.name = name;
		this.#rootProperty = new FBXProperty(this);
	}

	set id(id) {
		this.#id = id;
	}

	get id() {
		return this.#id;
	}

	set name(name) {
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	get rootProperty() {
		return this.#rootProperty;
	}

	get manager() {
		return this.#manager;
	}

	connectSrcObject(fbxObject) {
		//TODO: add connection type ?
		if (!fbxObject.isFBXObject) {
			throw 'connectSrcObject: fbxObject must be a FBXObject';
		}
		this.#srcObjects.add(fbxObject);
	}

	get srcObjects() {
		return this.#srcObjects;
	}

	createProperty(type, name, value, flags) {
		return new FBXProperty(this.#rootProperty, type, name, value, flags);
	}

	getAllProperties() {
		return this.#rootProperty.getAllProperties(false);
	}

	findProperty(propertyName) {
		return this.#rootProperty.findProperty(propertyName);
	}
}
FBXObject.prototype.isFBXObject = true;
