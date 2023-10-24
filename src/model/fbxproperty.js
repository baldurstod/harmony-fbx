import { FBX_PROPERTY_TYPE_COMPOUND } from '../enums/propertytype.js';

if (!BigInt.prototype.toJSON) {
	BigInt.prototype.toJSON = function() { return this.toString() };
}

export const FBX_PROPERTY_HIERARCHICAL_SEPARATOR = '|';

export class FBXProperty {
	#type;
	#name;
	#label;
	#value;
	#srcObjects = new Set();
	#flags = 0;
	#parent;
	constructor(parent, type = FBX_PROPERTY_TYPE_COMPOUND, name, value, flags = 0) {
		if (type != FBX_PROPERTY_TYPE_COMPOUND && value === undefined) {
			throw 'name is null';
		}
		if (parent) {
			if (parent.isFBXProperty) {
				if (parent.#type === FBX_PROPERTY_TYPE_COMPOUND) {
					this.#parent = parent;
					parent.#value.set(name, this);
				} else {
					throw 'Parent must be of type compound';
				}
			} else if (parent.isFBXObject) {
				this.#parent = parent;
			} else {
				throw 'Parent must be FBXProperty or FBXObject';
			}
		}
		this.#type = type;
		this.#name = name;
		if (type === FBX_PROPERTY_TYPE_COMPOUND) {
			this.#value = new Map();
		} else {
			this.#value = value;
		}
		this.#flags = flags;
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

	set name(name) {
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	get hierarchicalName() {
		//TODO: remove recursion
		if (this.#parent?.isFBXProperty) {
			const parentHierarchicalName = this.#parent.hierarchicalName;
			if (parentHierarchicalName) {
				return parentHierarchicalName + FBX_PROPERTY_HIERARCHICAL_SEPARATOR + this.#name;
			} else {
				return this.#name;
			}
		} else {
			return this.#name;
		}
	}

	set label(label) {
		this.#label = label;
	}

	get label() {
		return this.#label;
	}

	get parent() {
		return this.#parent;
	}

	isCompound() {
		return this.#type === FBX_PROPERTY_TYPE_COMPOUND;
	}

	isRootProperty() {
		return this.#parent.isFBXObject;
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
		if (this.#type === FBX_PROPERTY_TYPE_COMPOUND) {
			if (this.#value.has(name)) {
				return false;
			}
			const newProperty = new FBXProperty(this, type, name, value, flags);
			this.#value.set(name, newProperty);
			return newProperty;
		} else {
			throw 'Trying to create a child property on a non coumpound property';
		}
	}

	getAllProperties(includeSelf = true) {
		return this.#getAllProperties(new Set(), includeSelf);
	}

	#getAllProperties(childs = new Set(), includeSelf = true) {
		if (includeSelf) {
			childs.add(this);
		}
		if (this.#type === FBX_PROPERTY_TYPE_COMPOUND) {
			for (let [childName, child] of this.#value) {
				child.#getAllProperties(childs);
			}
		}

		return childs;
	}

	getParentObject() {
		const parent = this.#parent;
		if (parent.isFBXObject) {
			return parent;
		}
		if (parent.isFBXProperty) {
			// TODO: remove recursion
			return parent.getParentObject();
		}
	}

	findProperty(propertyName) {
		if (this.#name === propertyName) {
			return this;
		}

		if (this.isCompound()) {
			for (const [key, subProperty] of this.#value) {
				const found = subProperty.findProperty(propertyName);
				if (found) {
					return found;
				}
			}
		}
	}

	toJSON() {
		return {
			type: this.#type,
			value: this.#value,
		}
	}
}
FBXProperty.prototype.isFBXProperty = true;
