if (!BigInt.prototype.toJSON) {
	BigInt.prototype.toJSON = function() { return this.toString() };
}

export class FBXRecordProperty {
	#type;
	#value;
	#srcObjects = new Set();
	#flags = 0;
	#parent;
	constructor(parent, type, value) {
		if (parent) {
			if (parent.isFBXProperty) {
				this.#parent = parent;
			} else if (parent.isFBXObject) {
				this.#parent = parent.rootProperty;
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

	set(value) {
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

	createProperty(type, value) {
		return new FBXRecordProperty(this, type, value);
	}

	toJSON() {
		return {
			type: this.#type,
			value: this.#value,
		}
	}
}
FBXRecordProperty.prototype.isFBXProperty = true;
