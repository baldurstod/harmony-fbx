import { FbxPropertyType } from '../enums/propertytype';
import { getUniqueId } from './fbxids';
import { FBXManager } from './fbxmanager';
import { FBXProperty } from './fbxproperty';

export class FBXObject {
	#id = getUniqueId();
	#name = '';
	#srcObjects = new Set();
	#rootProperty;
	#manager;
	isFBXObject = true;

	constructor(manager: FBXManager, name = '', ...args: Array<any>) {
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

	connectSrcObject(object: FBXObject) {
		//TODO: add connection type ?
		this.#srcObjects.add(object);
	}

	get srcObjects() {
		return this.#srcObjects;
	}

	createProperty(type: FbxPropertyType, name: string, value: any, flags: number) {
		return new FBXProperty(this.#rootProperty, type, name, value, flags);
	}

	getAllProperties() {
		return this.#rootProperty.getAllProperties(false);
	}

	findProperty(propertyName: string) {
		return this.#rootProperty.findProperty(propertyName);
	}
}
