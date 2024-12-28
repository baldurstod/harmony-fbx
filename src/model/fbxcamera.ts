import { FBXManager } from './fbxmanager';
import { FBXNodeAttribute } from './fbxnodeattribute';
import { FBX_NODE_ATTRIBUTE_TYPE_CAMERA } from '../enums/nodeattributetype';
import { FBX_PROPERTY_FLAG_STATIC } from '../enums/propertyflags';
import { FBX_PROPERTY_TYPE_DOUBLE_3, FBX_PROPERTY_TYPE_DOUBLE, FBX_PROPERTY_TYPE_ENUM } from '../enums/propertytype';

export class FBXCamera extends FBXNodeAttribute {
	#position;
	#upVector;
	#interestPosition;
	#roll;
	//#opticalCenterX;
	//#opticalCenterY;
	#nearPlane;
	#farPlane;
	#projectionType;
	#orthoZoom;
	isFBXCamera = true;

	constructor(manager: FBXManager, name: string) {
		super(manager, name);

		this.#position = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'Position', [0, 0, 0], FBX_PROPERTY_FLAG_STATIC);
		this.#upVector = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'UpVector', [0, 0, 0], FBX_PROPERTY_FLAG_STATIC);
		this.#interestPosition = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE_3, 'InterestPosition', [0, 0, 0], FBX_PROPERTY_FLAG_STATIC);
		this.#roll = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE, 'Roll', 0, FBX_PROPERTY_FLAG_STATIC);
		//this.#opticalCenterX = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE, 'OpticalCenterX', 0, FBX_PROPERTY_FLAG_STATIC);
		//this.#opticalCenterY = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE, 'OpticalCenterY', 0, FBX_PROPERTY_FLAG_STATIC);
		this.#nearPlane = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE, 'NearPlane', 0, FBX_PROPERTY_FLAG_STATIC);
		this.#farPlane = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE, 'FarPlane', 0, FBX_PROPERTY_FLAG_STATIC);
		this.#projectionType = this.createProperty(FBX_PROPERTY_TYPE_ENUM, 'CameraProjectionType', 0, FBX_PROPERTY_FLAG_STATIC);
		this.#orthoZoom = this.createProperty(FBX_PROPERTY_TYPE_DOUBLE, 'OrthoZoom', 1, FBX_PROPERTY_FLAG_STATIC);
	}

	set position(position) {
		this.#position = position;
	}

	get position() {
		return this.#position;
	}

	set upVector(upVector) {
		this.#upVector = upVector;
	}

	get upVector() {
		return this.#upVector;
	}

	set interestPosition(interestPosition) {
		this.#interestPosition = interestPosition;
	}

	get interestPosition() {
		return this.#interestPosition;
	}

	set roll(roll) {
		this.#roll = roll;
	}

	get roll() {
		return this.#roll;
	}

	set nearPlane(nearPlane) {
		this.#nearPlane = nearPlane;
	}

	get nearPlane() {
		return this.#nearPlane;
	}

	set farPlane(farPlane) {
		this.#farPlane = farPlane;
	}

	get farPlane() {
		return this.#farPlane;
	}

	set projectionType(projectionType) {
		this.#projectionType = projectionType;
	}

	get projectionType() {
		return this.#projectionType;
	}

	set orthoZoom(orthoZoom) {
		this.#orthoZoom = orthoZoom;
	}

	get orthoZoom() {
		return this.#orthoZoom;
	}

	getAttributeType() {
		return FBX_NODE_ATTRIBUTE_TYPE_CAMERA;
	}
}
FBXManager.registerClass('FBXCamera', FBXCamera);
