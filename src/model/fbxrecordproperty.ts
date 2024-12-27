import { FbxType } from '../constants';
import { FBXObject } from './fbxobject';
import { FBXProperty } from './fbxproperty';

declare global {
	interface BigInt {
		toJSON(): string;
	}
}


if (!BigInt.prototype.toJSON) {
	BigInt.prototype.toJSON = function () { return this.toString() };
}

export class FBXRecordProperty {
	#type: FbxType;
	#value: any;
	#srcObjects = new Set<FBXObject>();
	#flags = 0;
	#parent: FBXRecordProperty | FBXObject | FBXProperty | null = null;
	isFBXProperty = true;

	constructor(parent: FBXRecordProperty | FBXObject | FBXProperty | null, type: FbxType, value: any) {
		if (parent) {
			if ((parent as FBXProperty).isFBXProperty) {
				this.#parent = parent;
			} else if ((parent as FBXObject).isFBXObject) {
				this.#parent = (parent as FBXObject).rootProperty;
			} else {
				throw 'Parent must be FBXRecordProperty or FBXObject';
			}
		}
		this.#type = type;
		this.#value = value;
		//TODO: check the value type
	}

	get type() {
		return this.#type;
	}

	set value(value) {
		this.#value = value;
	}

	get value() {
		return this.#value;
	}

	set(value: any) {
		this.#value = value;
	}

	get() {
		return this.#value;
	}

	set flags(flags) {
		this.#flags = flags;
	}

	get flags() {
		return this.#flags;
	}

	get parent() {
		return this.#parent;
	}

	connectSrcObject(fbxObject: FBXObject) {
		//TODO: add connection type ?
		this.#srcObjects.add(fbxObject);
	}

	get srcObjects() {
		return this.#srcObjects;
	}

	createProperty(type: FbxType, value: any) {
		return new FBXRecordProperty(this, type, value);
	}

	toJSON() {
		return {
			type: this.#type,
			value: this.#value,
		}
	}
}
