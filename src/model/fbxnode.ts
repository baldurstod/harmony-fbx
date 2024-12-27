import { FBXManager } from './fbxmanager';
import { FBXObject } from './fbxobject';
import { FBX_INHERIT_TYPE_PARENT_SCALING_FIRST } from '../enums/inherittype';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FBX_PROPERTY_TYPE_DOUBLE_3, FBX_PROPERTY_TYPE_BOOL } from '../enums/propertytype';
import { FBXNodeAttribute } from './fbxnodeattribute';
import { FBXSurfaceMaterial } from './fbxsurfacematerial';

export class FBXNode extends FBXObject {
	#parent: FBXNode | null = null;
	#childs = new Set<FBXNode>();
	#materials: Array<FBXSurfaceMaterial> = [];
	#nodeAttribute?: FBXNodeAttribute;
	#inheritType = FBX_INHERIT_TYPE_PARENT_SCALING_FIRST;
	#show;
	#localTranslation;
	#localRotation;
	#localScaling;
	isFBXNode = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);
		this.#show = this.createProperty(FBX_PROPERTY_TYPE_BOOL, 'Show', 1.0, FBX_PROPERTY_FLAG_STATIC);
		this.#localTranslation = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'Lcl Translation', [0, 0, 0], FBX_PROPERTY_FLAG_STATIC);
		this.#localRotation = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'Lcl Rotation', [0, 0, 0], FBX_PROPERTY_FLAG_STATIC);
		this.#localScaling = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'Lcl Scaling', [1, 1, 1], FBX_PROPERTY_FLAG_STATIC);
	}

	set parent(parent: FBXNode | null) {
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

	addChild(child: FBXNode) {
		child.parent = this;
	}

	removeChild(child: FBXNode) {
		child.parent = null;
	}

	get childs() {
		return this.#childs;
	}

	get parent() {
		return this.#parent;
	}

	#checkParent(parent: FBXNode | null) {
		if (parent === null) {
			return true;
		}
		if (!parent.isFBXNode) {
			console.log('Parent is not FBXNode');
			return false;
		}

		let current: FBXNode | null = parent;
		for (; ;) {
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

	set nodeAttribute(nodeAttribute: FBXNodeAttribute) {
		this.#nodeAttribute = nodeAttribute;
	}

	get nodeAttribute(): FBXNodeAttribute | undefined {
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

	addMaterial(surfaceMaterial: FBXSurfaceMaterial) {
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
