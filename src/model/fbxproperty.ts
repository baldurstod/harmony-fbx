import { FbxPropertyType } from '../enums/propertytype';
import { FBXObject } from './fbxobject';

if (!BigInt.prototype.toJSON) {
	BigInt.prototype.toJSON = function () { return this.toString() };
}

export const FBX_PROPERTY_HIERARCHICAL_SEPARATOR = '|';

export class FBXProperty {
	#type: FbxPropertyType;
	#name: string;
	#value: any;
	#srcObjects = new Set<FBXObject>();
	#flags = 0;
	#parent: FBXObject | FBXProperty | null = null;
	isFBXProperty = true;

	constructor(parent: FBXObject | FBXProperty | null, type: FbxPropertyType = FbxPropertyType.Compound, name: string = '', value: any = undefined, flags: number = 0) {
		if (type != FbxPropertyType.Compound && value === undefined) {
			throw 'name is null';
		}
		if (parent) {
			if ((parent as FBXProperty).isFBXProperty) {
				if ((parent as FBXProperty).#type === FbxPropertyType.Compound) {
					this.#parent = parent;
					(parent as FBXProperty).#value.set(name, this);
				} else {
					throw 'Parent must be of type compound';
				}
			} else if ((parent as FBXObject).isFBXObject) {
				this.#parent = parent;
			} else {
				throw 'Parent must be FBXProperty or FBXObject';
			}
		}
		this.#type = type;
		this.#name = name;
		if (type === FbxPropertyType.Compound) {
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

	set name(name) {
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	get hierarchicalName(): string {
		//TODO: remove recursion
		if ((this.#parent as FBXProperty)?.isFBXProperty) {
			const parentHierarchicalName = (this.#parent as FBXProperty).hierarchicalName;
			if (parentHierarchicalName) {
				return parentHierarchicalName + FBX_PROPERTY_HIERARCHICAL_SEPARATOR + this.#name;
			} else {
				return this.#name;
			}
		} else {
			return this.#name;
		}
	}

	get parent() {
		return this.#parent;
	}

	isCompound() {
		return this.#type === FbxPropertyType.Compound;
	}

	isRootProperty() {
		return (this.#parent as FBXObject)?.isFBXObject;
	}

	connectSrcObject(object: FBXObject) {
		//TODO: add connection type ?
		this.#srcObjects.add(object);
	}

	get srcObjects() {
		return this.#srcObjects;
	}

	createProperty(type: FbxPropertyType, name: string, value: any, flags: number) {
		if (this.#type === FbxPropertyType.Compound) {
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
		if (this.#type === FbxPropertyType.Compound) {
			for (let [childName, child] of this.#value) {
				child.#getAllProperties(childs);
			}
		}

		return childs;
	}

	getParentObject(): FBXObject | null {
		const parent = this.#parent;
		if ((parent as FBXObject).isFBXObject) {
			return (parent as FBXObject);
		}
		if ((parent as FBXProperty).isFBXProperty) {
			// TODO: remove recursion
			return (parent as FBXProperty).getParentObject();
		}
		return null;
	}

	findProperty(propertyName: string) {
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
