import { FBXManager } from './fbxmanager.js';
import { FBXObject } from './fbxobject.js';
import { FBX_INHERIT_TYPE_PARENT_SCALING_FIRST } from '../enums/inherittype.js';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags.js';
import { FBX_PROPERTY_TYPE_DOUBLE_3, FBX_PROPERTY_TYPE_BOOL } from '../enums/propertytype.js';

export class FBXNode extends FBXObject {
	#parent;
	#childs = new Set();
	#materials = [];
	#nodeAttribute;
	#inheritType = FBX_INHERIT_TYPE_PARENT_SCALING_FIRST;

	#show;
	#localTranslation;
	#localRotation;
	#localScaling;

	constructor(manager, name) {
		super(manager, name);
		this.isFBXNode = true;
		this.#show = this.createProperty(FBX_PROPERTY_TYPE_BOOL, 'Show', 1.0, FBX_PROPERTY_FLAG_STATIC);
		this.#localTranslation = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'Lcl Translation', [0, 0, 0], FBX_PROPERTY_FLAG_STATIC);
		this.#localRotation = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'Lcl Rotation', [0, 0, 0], FBX_PROPERTY_FLAG_STATIC);
		this.#localScaling = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'Lcl Scaling', [1, 1, 1], FBX_PROPERTY_FLAG_STATIC);
	}

	set parent(parent) {
		if (this.#checkParent(parent)) {
			if (this.#parent) {
				this.#parent.#childs.delete(this);
			}
			this.#parent = parent;
			if (parent) {
				parent.#childs.add(this);
			}
		} else {
			console.log(this, parent);
			throw 'Invalid parent';
		}
	}

	addChild(child) {
		if (!child.isFBXNode) {
			throw 'Child is not FBXNode';
		}
		child.parent = this;
	}

	removeChild(child) {
		if (!child.isFBXNode) {
			throw 'Child is not FBXNode';
		}
		child.parent = null;
	}

	get childs() {
		return this.#childs;
	}

	get parent() {
		return this.#parent;
	}

	#checkParent(parent) {
		if (parent === null) {
			return true;
		}
		if (!parent.isFBXNode) {
			console.log('Parent is not FBXNode');
			return false;
		}

		let current = parent;
		for (;;) {
			if (current == this) {
				console.log('Parent hierarchy contains self');
				return false;
			}
			if (!(current = current.parent)) {
				break;
			}
		}
		return true;
	}

	set nodeAttribute(nodeAttribute) {
		if (!nodeAttribute.isFBXNodeAttribute) {
			throw 'nodeAttribute must be of type FBXNodeAttribute';
		}
		this.#nodeAttribute = nodeAttribute;
	}

	get nodeAttribute() {
		return this.#nodeAttribute;
	}

	set inheritType(inheritType) {
		this.#inheritType = inheritType;
	}

	get inheritType() {
		return this.#inheritType;
	}

	set show(show) {
		this.#show.value = show;
	}

	get show() {
		return this.#show.value;
	}

	set localTranslation(localTranslation) {
		this.#localTranslation = localTranslation;
	}

	get localTranslation() {
		return this.#localTranslation;
	}

	set localRotation(localRotation) {
		this.#localRotation = localRotation;
	}

	get localRotation() {
		return this.#localRotation;
	}

	set localScaling(localScaling) {
		this.#localScaling = localScaling;
	}

	get localScaling() {
		return this.#localScaling;
	}

	addMaterial(surfaceMaterial) {
		if (!surfaceMaterial.isFBXSurfaceMaterial ) {
			throw 'surfaceMaterial must be of type FBXSurfaceMaterial';
		}
		this.#materials.push(surfaceMaterial);
	}

	get materials() {
		return this.#materials;
	}

	toJSON() {
		return {
		}
	}
}
FBXManager.registerClass('FBXNode', FBXNode);
