import { mat4 } from 'gl-matrix';
import { BinaryReader } from 'harmony-binary-reader';
import { inflate } from 'pako';

class FBXManager {
    #objects = new Set();
    #documents = new Set();
    isFBXManager = true;
    static #registry = new Map();
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
        const createdObject = new classConstructor(this, objectName, args);
        if (createdObject) {
            if (createdObject.isFBXDocument) {
                this.#documents.add(createdObject);
            }
            else {
                this.#objects.add(createdObject);
            }
        }
        return createdObject;
    }
}

// I'm not sure there is reserved ids, let's start big
let uniqueId = 1000000n;
function getUniqueId() {
    return ++uniqueId;
}

var FbxPropertyType;
(function (FbxPropertyType) {
    FbxPropertyType[FbxPropertyType["Double"] = 50] = "Double";
    FbxPropertyType[FbxPropertyType["Double3"] = 100] = "Double3";
    FbxPropertyType[FbxPropertyType["String"] = 200] = "String";
    FbxPropertyType[FbxPropertyType["Time"] = 300] = "Time";
    FbxPropertyType[FbxPropertyType["Enum"] = 1000] = "Enum";
    FbxPropertyType[FbxPropertyType["Compound"] = 2000] = "Compound";
    FbxPropertyType[FbxPropertyType["Color3"] = 3000] = "Color3";
    FbxPropertyType[FbxPropertyType["Bool"] = 5000] = "Bool";
})(FbxPropertyType || (FbxPropertyType = {}));
const FBX_PROPERTY_TYPE_DOUBLE = 50;
const FBX_PROPERTY_TYPE_DOUBLE_3 = 100;
const FBX_PROPERTY_TYPE_STRING = 200;
const FBX_PROPERTY_TYPE_TIME = 300;
const FBX_PROPERTY_TYPE_ENUM = 1000;
const FBX_PROPERTY_TYPE_COMPOUND = 2000;
const FBX_PROPERTY_TYPE_COLOR_3 = 3000;
const FBX_PROPERTY_TYPE_BOOL = 5000;
const FBX_TYPE_UNDEFINED = 0;
const FBX_TYPE_CHAR = 1;
const FBX_TYPE_U_CHAR = 2;
const FBX_TYPE_SHORT = 3;
const FBX_TYPE_U_SHORT = 4;
const FBX_TYPE_U_INT = 5;
const FBX_TYPE_LONG_LONG = 6;
const FBX_TYPE_U_LONG_LONG = 7;
const FBX_TYPE_HALF_FLOAT = 8;
const FBX_TYPE_BOOL = 9;
const FBX_TYPE_INT = 10;
const FBX_TYPE_FLOAT = 11;
const FBX_TYPE_DOUBLE = 12;
const FBX_TYPE_DOUBLE2 = 13;
const FBX_TYPE_DOUBLE3 = 14;
const FBX_TYPE_DOUBLE4 = 15;
const FBX_TYPE_DOUBLE4x4 = 16;
const FBX_TYPE_ENUM = 17;
const FBX_TYPE_ENUM_M = -17;
const FBX_TYPE_STRING = 18;
const FBX_TYPE_TIME = 19;
const FBX_TYPE_REFERENCE = 20;
const FBX_TYPE_BLOB = 21;
const FBX_TYPE_DISTANCE = 22;
const FBX_TYPE_DATE_TIME = 23;
const FBX_TYPE_COUNT = 24;

if (!BigInt.prototype.toJSON) {
    BigInt.prototype.toJSON = function () { return this.toString(); };
}
const FBX_PROPERTY_HIERARCHICAL_SEPARATOR = '|';
class FBXProperty {
    #type;
    #name;
    #value;
    #srcObjects = new Set();
    #flags = 0;
    #parent = null;
    isFBXProperty = true;
    constructor(parent, type = FbxPropertyType.Compound, name = '', value = undefined, flags = 0) {
        if (type != FbxPropertyType.Compound && value === undefined) {
            throw 'name is null';
        }
        if (parent) {
            if (parent.isFBXProperty) {
                if (parent.#type === FbxPropertyType.Compound) {
                    this.#parent = parent;
                    parent.#value.set(name, this);
                }
                else {
                    throw 'Parent must be of type compound';
                }
            }
            else if (parent.isFBXObject) {
                this.#parent = parent;
            }
            else {
                throw 'Parent must be FBXProperty or FBXObject';
            }
        }
        this.#type = type;
        this.#name = name;
        if (type === FbxPropertyType.Compound) {
            this.#value = new Map();
        }
        else {
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
            }
            else {
                return this.#name;
            }
        }
        else {
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
        return this.#parent?.isFBXObject;
    }
    connectSrcObject(object) {
        //TODO: add connection type ?
        this.#srcObjects.add(object);
    }
    get srcObjects() {
        return this.#srcObjects;
    }
    createProperty(type, name, value, flags) {
        if (this.#type === FbxPropertyType.Compound) {
            if (this.#value.has(name)) {
                return false;
            }
            const newProperty = new FBXProperty(this, type, name, value, flags);
            this.#value.set(name, newProperty);
            return newProperty;
        }
        else {
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
    getParentObject() {
        const parent = this.#parent;
        if (parent.isFBXObject) {
            return parent;
        }
        if (parent.isFBXProperty) {
            // TODO: remove recursion
            return parent.getParentObject();
        }
        return null;
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
        return null;
    }
    toJSON() {
        return {
            type: this.#type,
            value: this.#value,
        };
    }
}

class FBXObject {
    #id = getUniqueId();
    #name = '';
    #srcObjects = new Set();
    #rootProperty;
    #manager;
    isFBXObject = true;
    constructor(manager, name = '', ...args) {
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
    connectSrcObject(object) {
        //TODO: add connection type ?
        this.#srcObjects.add(object);
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

const FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN = 0;
const FBX_NODE_ATTRIBUTE_TYPE_NULL = 1;
const FBX_NODE_ATTRIBUTE_TYPE_MARKER = 2;
const FBX_NODE_ATTRIBUTE_TYPE_SKELETON = 3;
const FBX_NODE_ATTRIBUTE_TYPE_MESH = 4;
const FBX_NODE_ATTRIBUTE_TYPE_NURBS = 5;
const FBX_NODE_ATTRIBUTE_TYPE_PATCH = 6;
const FBX_NODE_ATTRIBUTE_TYPE_CAMERA = 7;
const FBX_NODE_ATTRIBUTE_TYPE_CAMERA_STEREO = 8;
const FBX_NODE_ATTRIBUTE_TYPE_CAMERA_SWITCHER = 9;
const FBX_NODE_ATTRIBUTE_TYPE_LIGHT = 10;
const FBX_NODE_ATTRIBUTE_TYPE_OPTICAL_REFERENCE = 11;
const FBX_NODE_ATTRIBUTE_TYPE_OPTICAL_MARKER = 12;
const FBX_NODE_ATTRIBUTE_TYPE_NURBS_CURVE = 13;
const FBX_NODE_ATTRIBUTE_TYPE_TRIM_NURBS_SURFACE = 14;
const FBX_NODE_ATTRIBUTE_TYPE_BOUNDARY = 15;
const FBX_NODE_ATTRIBUTE_TYPE_NURBS_SURFACE = 16;
const FBX_NODE_ATTRIBUTE_TYPE_SHAPE = 17;
const FBX_NODE_ATTRIBUTE_TYPE_LOD_GROUP = 18;
const FBX_NODE_ATTRIBUTE_TYPE_SUB_DIV = 19;
const FBX_NODE_ATTRIBUTE_TYPE_CACHED_EFFECT = 20;

class FBXNodeAttribute extends FBXObject {
    isFBXNodeAttribute = true;
    getAttributeType() {
        return FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN;
    }
}

const FBX_PROPERTY_FLAG_NONE = 0;
const FBX_PROPERTY_FLAG_STATIC = 1 << 0;
const FBX_PROPERTY_FLAG_ANIMATABLE = 1 << 1;
const FBX_PROPERTY_FLAG_ANIMATED = 1 << 2;
const FBX_PROPERTY_FLAG_IMPORTED = 1 << 3;
const FBX_PROPERTY_FLAG_USER_DEFINED = 1 << 4;
const FBX_PROPERTY_FLAG_HIDDEN = 1 << 5;
const FBX_PROPERTY_FLAG_NOT_SAVABLE = 1 << 6;
const FBX_PROPERTY_FLAG_LOCKED_MEMBER_0 = 1 << 7;
const FBX_PROPERTY_FLAG_LOCKED_MEMBER_1 = 1 << 8;
const FBX_PROPERTY_FLAG_LOCKED_MEMBER_2 = 1 << 9;
const FBX_PROPERTY_FLAG_LOCKED_MEMBER_3 = 1 << 10;
const FBX_PROPERTY_FLAG_LOCKED_ALL = FBX_PROPERTY_FLAG_LOCKED_MEMBER_0 | FBX_PROPERTY_FLAG_LOCKED_MEMBER_1 | FBX_PROPERTY_FLAG_LOCKED_MEMBER_2 | FBX_PROPERTY_FLAG_LOCKED_MEMBER_3;
const FBX_PROPERTY_FLAG_MUTED_MEMBER_0 = 1 << 11;
const FBX_PROPERTY_FLAG_MUTED_MEMBER_1 = 1 << 12;
const FBX_PROPERTY_FLAG_MUTED_MEMBER_2 = 1 << 13;
const FBX_PROPERTY_FLAG_MUTED_MEMBER_3 = 1 << 14;
const FBX_PROPERTY_FLAG_MUTED_ALL = FBX_PROPERTY_FLAG_MUTED_MEMBER_0 | FBX_PROPERTY_FLAG_MUTED_MEMBER_1 | FBX_PROPERTY_FLAG_MUTED_MEMBER_2 | FBX_PROPERTY_FLAG_MUTED_MEMBER_3;

class FBXCamera extends FBXNodeAttribute {
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
    constructor(manager, name) {
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

const FBX_SUB_DEFORMER_TYPE_UNKNOWN = 0;
const FBX_SUB_DEFORMER_TYPE_CLUSTER = 1;

class FBXSubDeformer extends FBXObject {
    isFBXSubDeformer = true;
    get subDeformerType() {
        return FBX_SUB_DEFORMER_TYPE_UNKNOWN;
    }
}

const FBX_LINK_MODE_NORMALIZE = 0;

class FBXCluster extends FBXSubDeformer {
    #linkMode = FBX_LINK_MODE_NORMALIZE;
    #link;
    #indexes = [];
    #weights = [];
    #transformMatrix = mat4.create();
    #transformLinkMatrix = mat4.create();
    //#transformParentMatrix;
    isFBXCluster = true;
    set linkMode(linkMode) {
        this.#linkMode = linkMode;
    }
    get linkMode() {
        return this.#linkMode;
    }
    set link(link) {
        this.#link = link;
    }
    get link() {
        return this.#link;
    }
    addVertexIndex(index, weight) {
        this.#indexes.push(index);
        this.#weights.push(weight);
    }
    get indexes() {
        return this.#indexes;
    }
    get weights() {
        return this.#weights;
    }
    get subDeformerType() {
        return FBX_SUB_DEFORMER_TYPE_CLUSTER;
    }
    set transformMatrix(transformMatrix) {
        mat4.copy(this.#transformMatrix, transformMatrix);
    }
    get transformMatrix() {
        return mat4.clone(this.#transformMatrix);
    }
    set transformLinkMatrix(transformLinkMatrix) {
        mat4.copy(this.#transformLinkMatrix, transformLinkMatrix);
    }
    get transformLinkMatrix() {
        return mat4.clone(this.#transformLinkMatrix);
    }
}
FBXManager.registerClass('FBXCluster', FBXCluster);

class FBXColor {
    #red;
    #green;
    #blue;
    #alpha;
    isFBXColor = true;
    constructor(red = 0.0, green = 0.0, blue = 0.0, alpha = 1.0) {
        this.#red = red;
        this.#green = green;
        this.#blue = blue;
        this.#alpha = alpha;
    }
    set red(red) {
        this.#red = red;
    }
    get red() {
        return this.#red;
    }
    set green(green) {
        this.#green = green;
    }
    get green() {
        return this.#green;
    }
    set blue(blue) {
        this.#blue = blue;
    }
    get blue() {
        return this.#blue;
    }
    set alpha(alpha) {
        this.#alpha = alpha;
    }
    get alpha() {
        return this.#alpha;
    }
}

class FBXAxisSystem {
    isFBXAxisSystem = true;
    #upAxis;
    #frontAxis;
    constructor(upAxis, frontAxis) {
        this.#upAxis = upAxis;
        this.#frontAxis = frontAxis;
    }
    set upAxis(upAxis) {
        this.#upAxis = upAxis;
    }
    get upAxis() {
        return this.#upAxis;
    }
    set frontAxis(frontAxis) {
        this.#frontAxis = frontAxis;
    }
    get frontAxis() {
        return this.#frontAxis;
    }
    get coordAxis() {
        return this.#frontAxis;
    }
}

class FBXGlobalSettings extends FBXObject {
    #ambientColor = new FBXColor();
    #defaultCamera = '';
    #axisSystem = new FBXAxisSystem(2, 1);
    isFBXGlobalSettings = true;
    set ambientColor(ambientColor) {
        this.#ambientColor = ambientColor;
    }
    get ambientColor() {
        return this.#ambientColor;
    }
    set defaultCamera(defaultCamera) {
        this.#defaultCamera = defaultCamera;
    }
    get defaultCamera() {
        return this.#defaultCamera;
    }
}
FBXManager.registerClass('FBXGlobalSettings', FBXGlobalSettings);

class FBXLayerContainer extends FBXNodeAttribute {
    isFBXLayerContainer = true;
}

class FBXGeometryBase extends FBXLayerContainer {
    isFBXGeometryBase = true;
}

class FBXGeometry extends FBXGeometryBase {
    #deformers = new Set();
    isFBXGeometry = true;
    addDeformer(deformer) {
        this.#deformers.add(deformer);
    }
    removeDeformer(deformer) {
        this.#deformers.delete(deformer);
    }
    get deformers() {
        return this.#deformers;
    }
}

class FBXMesh extends FBXGeometry {
    #vertices = [];
    #normals = [];
    #polygons = [];
    #edges = [];
    #uv = [];
    #uvIndex = [];
    isFBXMesh = true;
    set vertices(vertices) {
        this.#vertices = vertices;
    }
    get vertices() {
        return this.#vertices;
    }
    set normals(normals) {
        this.#normals = normals;
    }
    get normals() {
        return this.#normals;
    }
    set polygons(polygons) {
        this.#polygons = polygons;
    }
    get polygons() {
        return this.#polygons;
    }
    set edges(edges) {
        this.#edges = edges;
    }
    get edges() {
        return this.#edges;
    }
    set uv(uv) {
        this.#uv = uv;
    }
    get uv() {
        return this.#uv;
    }
    set uvIndex(uvIndex) {
        this.#uvIndex = uvIndex;
    }
    get uvIndex() {
        return this.#uvIndex;
    }
}
FBXManager.registerClass('FBXMesh', FBXMesh);

//Rotation of child is applied before parent's scaling
const FBX_INHERIT_TYPE_CHILD_ROTATION_FIRST = 0;
//Scaling of parent is applied before rotation of child
const FBX_INHERIT_TYPE_PARENT_SCALING_FIRST = 1;
//Scaling of parent do not affect children
const FBX_INHERIT_TYPE_PARENT_SCALING_IGNORED = 1;

class FBXNode extends FBXObject {
    #parent = null;
    #childs = new Set();
    #materials = [];
    #nodeAttribute;
    #inheritType = FBX_INHERIT_TYPE_PARENT_SCALING_FIRST;
    #show;
    #localTranslation;
    #localRotation;
    #localScaling;
    isFBXNode = true;
    constructor(manager, name) {
        super(manager, name);
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
        }
        else {
            console.log(this, parent);
            throw 'Invalid parent';
        }
    }
    addChild(child) {
        child.parent = this;
    }
    removeChild(child) {
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
        this.#materials.push(surfaceMaterial);
    }
    get materials() {
        return this.#materials;
    }
    toJSON() {
        return {};
    }
}
FBXManager.registerClass('FBXNode', FBXNode);

class FBXPoseInfo {
    #matrix = mat4.create();
    #matrixIsLocal = false;
    #node;
    constructor(node, matrix, matrixIsLocal) {
        this.#node = node;
        mat4.copy(this.#matrix, matrix);
        this.#matrixIsLocal = matrixIsLocal;
    }
    set matrix(matrix) {
        this.#matrix = matrix;
    }
    get matrix() {
        return this.#matrix;
    }
    set matrixIsLocal(matrixIsLocal) {
        this.#matrixIsLocal = matrixIsLocal;
    }
    get matrixIsLocal() {
        return this.#matrixIsLocal;
    }
    set node(node) {
        this.#node = node;
    }
    get node() {
        return this.#node;
    }
}

class FBXPose extends FBXObject {
    #isBindPose = true;
    #poseInfos = [];
    isFBXPose = true;
    set isBindPose(isBindPose) {
        this.#isBindPose = isBindPose;
    }
    get isBindPose() {
        return this.#isBindPose;
    }
    get isRestPose() {
        return !this.#isBindPose;
    }
    add(node, matrix, matrixIsLocal) {
        this.#poseInfos.push(new FBXPoseInfo(node, matrix, matrixIsLocal));
    }
    get poseInfos() {
        return this.#poseInfos;
    }
}
FBXManager.registerClass('FBXPose', FBXPose);

class FBXCollection extends FBXObject {
    #members = new Set();
    isFBXCollection = true;
    add(member) {
        this.#members.add(member);
    }
    remove(member) {
        this.#members.delete(member);
    }
    get count() {
        return this.#members.size;
    }
    get members() {
        return this.#members;
    }
}

class FBXDocument extends FBXCollection {
    #documentInfo;
    isFBXDocument = true;
    constructor(manager, name) {
        super(manager, name);
    }
    set documentInfo(documentInfo) {
        this.#documentInfo = documentInfo;
    }
    get documentInfo() {
        return this.#documentInfo;
    }
}

class FBXScene extends FBXDocument {
    #rootNode;
    #globalSettings;
    #sceneInfo;
    #objects = new Set();
    isFBXScene = true;
    constructor(manager, name) {
        super(manager, name);
        this.#rootNode = manager.createObject('FBXNode', 'Root node. This node is not saved');
        this.#globalSettings = manager.createObject('FBXGlobalSettings', 'TODO: name me FBXScene / #globalSettings');
        this.#rootNode.id = 0n;
    }
    set sceneInfo(sceneInfo) {
        this.#sceneInfo = sceneInfo;
    }
    get sceneInfo() {
        return this.#sceneInfo;
    }
    get rootNode() {
        return this.#rootNode;
    }
    get globalSettings() {
        return this.#globalSettings;
    }
    addObject(object) {
        this.#objects.add(object);
    }
    get objects() {
        return this.#objects;
    }
}
FBXManager.registerClass('FBXScene', FBXScene);

class FBXSkeleton extends FBXNodeAttribute {
    skeletonType;
    isFBXSkeleton = true;
    constructor(manager, name, skeletonType) {
        super(manager, name);
        this.skeletonType = skeletonType;
    }
    getAttributeType() {
        return FBX_NODE_ATTRIBUTE_TYPE_SKELETON;
    }
}
FBXManager.registerClass('FBXSkeleton', FBXSkeleton);

const FBX_DEFORMER_TYPE_UNKNOWN = 0;
const FBX_DEFORMER_TYPE_SKIN = 1;

class FBXDeformer extends FBXObject {
    isFBXDeformer = true;
    get deformerType() {
        return FBX_DEFORMER_TYPE_UNKNOWN;
    }
}

const FBX_SKINNING_TYPE_RIGID = 0;
const FBX_SKINNING_TYPE_LINEAR = 1;
const FBX_SKINNING_TYPE_DUAL_QUATERNION = 2;
const FBX_SKINNING_TYPE_BLEND = 3;

class FBXSkin extends FBXDeformer {
    #geometry;
    #skinningType = FBX_SKINNING_TYPE_LINEAR;
    #clusters = new Set();
    isFBXSkin = true;
    set geometry(geometry) {
        if (geometry && !geometry.isFBXGeometry) {
            throw 'geometry must be of type FBXGeometry';
        }
        if (this.#geometry) {
            this.#geometry.removeDeformer(this);
        }
        if (geometry) {
            geometry.addDeformer(this);
        }
        this.#geometry = geometry;
    }
    get geometry() {
        return this.#geometry;
    }
    set skinningType(skinningType) {
        this.#skinningType = skinningType;
    }
    get skinningType() {
        return this.#skinningType;
    }
    addCluster(fbxCluster) {
        this.#clusters.add(fbxCluster);
    }
    removeCluster(fbxCluster) {
        this.#clusters.delete(fbxCluster);
    }
    get clusters() {
        return this.#clusters;
    }
    get deformerType() {
        return FBX_DEFORMER_TYPE_SKIN;
    }
}
FBXManager.registerClass('FBXSkin', FBXSkin);

class FBXSurfaceMaterial extends FBXObject {
    #shadingModel;
    #multiLayer;
    isFBXSurfaceMaterial = true;
    constructor(manager, name) {
        super(manager, name);
        this.#shadingModel = this.createProperty(FBX_PROPERTY_TYPE_STRING, 'ShadingModel', 'Unknown', FBX_PROPERTY_FLAG_STATIC);
        this.#multiLayer = this.createProperty(FBX_PROPERTY_TYPE_BOOL, 'MultiLayer', false, FBX_PROPERTY_FLAG_STATIC);
    }
    set shadingModel(shadingModel) {
        this.#shadingModel.value = shadingModel;
    }
    get shadingModel() {
        return this.#shadingModel.value;
    }
    set multiLayer(multiLayer) {
        this.#multiLayer.value = multiLayer;
    }
    get multiLayer() {
        return this.#multiLayer.value;
    }
}
FBXManager.registerClass('FBXSurfaceMaterial', FBXSurfaceMaterial);

class FBXSurfaceLambert extends FBXSurfaceMaterial {
    #diffuse;
    isFBXSurfaceLambert = true;
    constructor(manager, name) {
        super(manager, name);
        this.shadingModel = 'Lambert';
        this.#diffuse = this.createProperty(FBX_PROPERTY_TYPE_COLOR_3, 'DiffuseColor', [0.2, 0.2, 0.2], FBX_PROPERTY_FLAG_STATIC);
    }
    set diffuse(diffuse) {
        console.assert(diffuse.isFBXProperty && diffuse.type == FBX_PROPERTY_TYPE_COLOR_3, "diffuse is not an FBXProperty");
        this.#diffuse = diffuse;
    }
    get diffuse() {
        return this.#diffuse;
    }
}
FBXManager.registerClass('FBXSurfaceLambert', FBXSurfaceLambert);

class FBXSurfacePhong extends FBXSurfaceLambert {
    isFBXSurfacePhong = true;
    constructor(manager, name) {
        super(manager, name);
        this.shadingModel = 'Phong';
    }
}
FBXManager.registerClass('FBXSurfacePhong', FBXSurfacePhong);

class FBXTexture extends FBXObject {
    #media;
    #type = 'TextureVideoClip';
    isFBXTexture = true;
    set type(type) {
        throw 'We might want to check the exporter if we change the type';
    }
    get type() {
        return this.#type;
    }
    set media(media) {
        this.#media = media;
    }
    get media() {
        return this.#media;
    }
}
FBXManager.registerClass('FBXTexture', FBXTexture);

class FBXVideo extends FBXObject {
    #content;
    #type = 'Clip';
    isFBXVideo = true;
    set content(content) {
        this.#content = content;
    }
    get content() {
        return this.#content;
    }
    set type(type) {
        throw 'We might want to check the exporter if we change the type';
    }
    get type() {
        return this.#type;
    }
}
FBXManager.registerClass('FBXVideo', FBXVideo);

var FbxType;
(function (FbxType) {
    FbxType[FbxType["Int8"] = 67] = "Int8";
    FbxType[FbxType["Double"] = 68] = "Double";
    FbxType[FbxType["Float"] = 70] = "Float";
    FbxType[FbxType["Int32"] = 73] = "Int32";
    FbxType[FbxType["Int64"] = 76] = "Int64";
    FbxType[FbxType["Raw"] = 82] = "Raw";
    FbxType[FbxType["String"] = 83] = "String";
    FbxType[FbxType["Int16"] = 89] = "Int16";
    FbxType[FbxType["Int8Array"] = 98] = "Int8Array";
    FbxType[FbxType["DoubleArray"] = 100] = "DoubleArray";
    FbxType[FbxType["FloatArray"] = 102] = "FloatArray";
    FbxType[FbxType["Int32Array"] = 105] = "Int32Array";
    FbxType[FbxType["Int64Array"] = 108] = "Int64Array";
})(FbxType || (FbxType = {}));
const FBX_DATA_TYPE_INT_8 = 67;
const FBX_DATA_TYPE_DOUBLE = 68;
const FBX_DATA_TYPE_FLOAT = 70;
const FBX_DATA_TYPE_INT_32 = 73;
const FBX_DATA_TYPE_INT_64 = 76;
const FBX_DATA_TYPE_RAW = 82;
const FBX_DATA_TYPE_STRING = 83;
const FBX_DATA_TYPE_INT_16 = 89;
const FBX_DATA_TYPE_ARRAY_INT_8 = 98;
const FBX_DATA_TYPE_ARRAY_DOUBLE = 100;
const FBX_DATA_TYPE_ARRAY_FLOAT = 102;
const FBX_DATA_TYPE_ARRAY_INT_32 = 105;
const FBX_DATA_TYPE_ARRAY_INT_64 = 108;
const FBX_DATA_LEN = new Map();
FBX_DATA_LEN.set(FBX_DATA_TYPE_INT_8, 1);
FBX_DATA_LEN.set(FBX_DATA_TYPE_DOUBLE, 8);
FBX_DATA_LEN.set(FBX_DATA_TYPE_FLOAT, 4);
FBX_DATA_LEN.set(FBX_DATA_TYPE_INT_32, 4);
FBX_DATA_LEN.set(FBX_DATA_TYPE_INT_64, 8);
FBX_DATA_LEN.set(FBX_DATA_TYPE_INT_16, 2);
FBX_DATA_LEN.set(FBX_DATA_TYPE_ARRAY_INT_8, 1);
FBX_DATA_LEN.set(FBX_DATA_TYPE_ARRAY_DOUBLE, 8);
FBX_DATA_LEN.set(FBX_DATA_TYPE_ARRAY_FLOAT, 4);
FBX_DATA_LEN.set(FBX_DATA_TYPE_ARRAY_INT_32, 4);
FBX_DATA_LEN.set(FBX_DATA_TYPE_ARRAY_INT_64, 8);
const FBX_BINARY_MAGIC = 'Kaydara FBX Binary  \0';
const FBX_HEADER_VERSION = 1003;
const FBX_SCENEINFO_VERSION = 100;
const FBX_TEMPLATES_VERSION = 100;
const FBX_KTIME = 46186158000n;
const FBX_GEOMETRY_VERSION = 124;
const FBX_GEOMETRY_NORMAL_VERSION = 101;
const FBX_GEOMETRY_BINORMAL_VERSION = 101;
const FBX_GEOMETRY_TANGENT_VERSION = 101;
const FBX_GEOMETRY_UV_VERSION = 101;
const FBX_GEOMETRY_MATERIAL_VERSION = 101;
const FBX_GEOMETRY_LAYER_VERSION = 100;
const FBX_MATERIAL_VERSION = 102;
const FBX_TEXTURE_VERSION = 202;
const FBX_DEFORMER_SKIN_VERSION = 101;
const FBX_DEFORMER_CLUSTER_VERSION = 100;
const FBX_POSE_BIND_VERSION = 100;
const FBX_MODELS_VERSION = 232;

if (!BigInt.prototype.toJSON) {
    BigInt.prototype.toJSON = function () { return this.toString(); };
}
class FBXRecordProperty {
    #type;
    #value;
    #srcObjects = new Set();
    #flags = 0;
    #parent = null;
    isFBXProperty = true;
    constructor(parent, type, value) {
        if (parent) {
            if (parent.isFBXProperty) {
                this.#parent = parent;
            }
            else if (parent.isFBXObject) {
                this.#parent = parent.rootProperty;
            }
            else {
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
        };
    }
}

function createInt16Property(value) {
    return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_16, value);
}
function createInt32Property(value) {
    return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_32, value);
}
function createInt64Property(value) {
    return new FBXRecordProperty(null, FBX_DATA_TYPE_INT_64, value);
}
function createDoubleProperty(value) {
    return new FBXRecordProperty(null, FBX_DATA_TYPE_DOUBLE, value);
}
function createRawProperty(value /*TODO: better type*/) {
    return new FBXRecordProperty(null, FBX_DATA_TYPE_RAW, value);
}
function createStringProperty(value) {
    return new FBXRecordProperty(null, FBX_DATA_TYPE_STRING, value);
}

class FBXRecord {
    #name = '';
    #childs = new Set();
    #properties = new Set();
    isFBXRecord = true;
    constructor(name) {
        this.name = name;
    }
    addChild(child) {
        if (!child.isFBXRecord) {
            throw 'FBXFile: trying to insert a non FBXRecord child';
        }
        this.#childs.add(child);
        return child;
    }
    addChilds(childs) {
        for (let child of childs) {
            this.addChild(child);
        }
    }
    addProperty(property) {
        this.#properties.add(property);
    }
    addProperties(properties) {
        for (let property of properties) {
            this.addProperty(property);
        }
    }
    set name(name) {
        if (name.length > 255) {
            throw `Record name above 255 characters ${name}`;
        }
        this.#name = name;
    }
    get name() {
        return this.#name;
    }
    get childs() {
        return this.#childs;
    }
    get properties() {
        return this.#properties;
    }
    getRecordsByName(recordName) {
        let output = [];
        for (let child of this.#childs) {
            if (child.name == recordName) {
                output.push(child);
            }
        }
        return output;
    }
    getRecordByName(recordName) {
        for (let child of this.#childs) {
            if (child.name == recordName) {
                return child;
            }
        }
    }
    getProperty(type) {
        for (let property of this.#properties) {
            if (property.type == type) {
                return property.value;
            }
        }
    }
    getPropertyInt32() {
        return this.getProperty(FBX_DATA_TYPE_INT_32);
    }
    getPropertyString() {
        return this.getProperty(FBX_DATA_TYPE_STRING);
    }
    toJSON() {
        return {
            name: this.#name,
            childs: this.#childs.size ? [...this.#childs] : undefined,
            properties: this.#properties.size ? [...this.#properties] : undefined,
        };
    }
}

const _TIME_ID = '1970-01-01 10:00:00:000';
const _FILE_ID = new Uint8Array([0x28, 0xb3, 0x2a, 0xeb, 0xb6, 0x24, 0xcc, 0xc2, 0xbf, 0xc8, 0xb0, 0x2a, 0xa9, 0x2b, 0xfc, 0xf1]);
const _FOOT_ID = new Uint8Array([0xfa, 0xbc, 0xab, 0x09, 0xd0, 0xc8, 0xd4, 0x66, 0xb1, 0x76, 0xfb, 0x83, 0x1c, 0xf7, 0x26, 0x7e]);
const FBX_FOOTER2 = '\xf8\x5a\x8c\x6a\xde\xf5\xd9\x7e\xec\xe9\x0c\xe3\x75\x8f\x29\x0b';
class FBXExporter {
    exportBinary(fbxFile) {
        checkFile(fbxFile);
        let version = fbxFile.version;
        let size = getFileSize(fbxFile, version);
        //console.log('File Size: ', size);
        let writer = new BinaryReader(new Uint8Array(size));
        return exportBinaryFile(writer, fbxFile);
    }
}
function checkFile(fbxFile) {
    for (let child of fbxFile.childs) {
        if (child.name == 'CreationTime' || child.name == 'FileId') {
            fbxFile.childs.delete(child);
        }
    }
    formatCreationTimeRecord(fbxFile);
    formatFileIdRecord(fbxFile);
}
function exportBinaryFile(writer, fbxFile) {
    let version = fbxFile.version;
    writer.seek(0);
    writer.setString(FBX_BINARY_MAGIC);
    writer.setUint8(0x1A);
    writer.setUint8(0x00);
    writer.setUint32(version);
    for (let child of fbxFile.childs) {
        exportBinaryRecord(writer, child, version);
    }
    writer.skip((version >= 7500) ? 25 : 13); //Null record
    writer.setBytes(generateFooterCode(fbxFile.dateCreated));
    writer.skip(align16(writer.tell()));
    if (version != 7400) {
        writer.skip(4);
    }
    writer.setUint32(version);
    writer.skip(120);
    writer.setString(FBX_FOOTER2);
    return writer.buffer;
}
function formatFileIdRecord(fbxFile) {
    let fbxRecord = fbxFile.addChild(new FBXRecord('FileId'));
    fbxRecord.properties.clear();
    let fbxProperty = createRawProperty(_FILE_ID);
    fbxRecord.addProperty(fbxProperty);
}
function formatCreationTimeRecord(fbxFile) {
    let fbxRecord = fbxFile.addChild(new FBXRecord('CreationTime'));
    fbxRecord.properties.clear();
    let dateCreated = fbxFile.dateCreated;
    `${dateCreated.getFullYear()}-${padNumber(dateCreated.getMonth() + 1, 2)}-${padNumber(dateCreated.getDate(), 2)} ${padNumber(dateCreated.getHours(), 2)}:${padNumber(dateCreated.getMinutes(), 2)}:${padNumber(dateCreated.getSeconds(), 2)}:${padNumber(dateCreated.getMilliseconds(), 3)}`;
    //console.log(creationTime);
    //let fbxProperty = createStringProperty(creationTime);
    let fbxProperty = createStringProperty(_TIME_ID);
    fbxRecord.addProperty(fbxProperty);
}
function align16(offset) {
    let pad = ((offset + 15) & ~15) - offset;
    if (pad == 0) {
        pad = 16;
    }
    return pad;
}
function exportBinaryRecord(writer, fbxRecord, version) {
    let startOffset = writer.tell();
    let recordLen = getRecordSize(fbxRecord, version);
    //console.log(startOffset);
    if (version >= 7500) {
        writer.setBigUint64(BigInt(startOffset + recordLen));
        writer.setBigUint64(BigInt(fbxRecord.properties.size));
        writer.setBigUint64(BigInt(getRecordPropertiesSize(fbxRecord)));
    }
    else {
        writer.setUint32(startOffset + recordLen);
        writer.setUint32(fbxRecord.properties.size);
        writer.setUint32(getRecordPropertiesSize(fbxRecord));
    }
    writer.setUint8(fbxRecord.name.length);
    writer.setString(fbxRecord.name);
    exportProperties(writer, fbxRecord);
    for (let child of fbxRecord.childs) {
        exportBinaryRecord(writer, child, version);
    }
    writer.skip((version >= 7500) ? 25 : 13); //Null record
}
function exportProperties(writer, fbxRecord) {
    for (let property of fbxRecord.properties) {
        exportRecordProperty(writer, property);
    }
}
function exportRecordProperty(writer, fbxProperty) {
    //console.log(fbxProperty);
    writer.setUint8(fbxProperty.type);
    switch (fbxProperty.type) {
        case FBX_DATA_TYPE_INT_16:
            writer.setInt16(fbxProperty.value);
            break;
        case FBX_DATA_TYPE_INT_8:
            writer.setInt8(fbxProperty.value);
            break;
        case FBX_DATA_TYPE_INT_32:
            writer.setInt32(fbxProperty.value);
            break;
        case FBX_DATA_TYPE_FLOAT:
            writer.setFloat32(fbxProperty.value);
            break;
        case FBX_DATA_TYPE_DOUBLE:
            writer.setFloat64(fbxProperty.value);
            break;
        case FBX_DATA_TYPE_INT_64:
            writer.setBigInt64(BigInt(fbxProperty.value));
            break;
        case FBX_DATA_TYPE_RAW:
            writer.setUint32(fbxProperty.value.length);
            writer.setBytes(fbxProperty.value);
            break;
        case FBX_DATA_TYPE_STRING:
            writer.setUint32(fbxProperty.value.length);
            writer.setString(fbxProperty.value);
            break;
        case FBX_DATA_TYPE_ARRAY_INT_8:
        case FBX_DATA_TYPE_ARRAY_DOUBLE:
        case FBX_DATA_TYPE_ARRAY_FLOAT:
        case FBX_DATA_TYPE_ARRAY_INT_32:
        case FBX_DATA_TYPE_ARRAY_INT_64:
            exportRecordPropertyArray(writer, fbxProperty);
            break;
        default:
            throw 'Unknown property type ' + fbxProperty.type;
    }
}
function exportRecordPropertyArray(writer, fbxProperty) {
    writer.setUint32(fbxProperty.value.length);
    writer.setUint32(0); //Encoding
    writer.setUint32(FBX_DATA_LEN.get(fbxProperty.type) * fbxProperty.value.length);
    let functionName;
    switch (fbxProperty.type) {
        case FBX_DATA_TYPE_ARRAY_INT_8:
            functionName = 'setInt8';
            break;
        case FBX_DATA_TYPE_ARRAY_DOUBLE:
            functionName = 'setFloat64';
            break;
        case FBX_DATA_TYPE_ARRAY_FLOAT:
            functionName = 'setFloat32';
            break;
        case FBX_DATA_TYPE_ARRAY_INT_32:
            functionName = 'setInt32';
            break;
        case FBX_DATA_TYPE_ARRAY_INT_64:
            functionName = 'setBigInt64';
            for (let value of fbxProperty.value) {
                writer.setBigInt64(value);
            }
            return;
        default:
            throw 'Unknown array property type ' + fbxProperty.type;
    }
    for (let value of fbxProperty.value) {
        writer[functionName](value);
    }
}
function getFileSize(fbxFile, version) {
    let size = 27; //header
    for (let child of fbxFile.childs) {
        size += getRecordSize(child, version);
    }
    size += (version >= 7500) ? 25 : 13; //Null record
    size += 16; // footer1
    //size += 4 // padding
    size += align16(size); //alignment
    if (version != 7400) {
        size += 4; // padding
    }
    size += 140; //version + padding + footer2
    return size;
}
function getRecordSize(fbxRecord, version) {
    let size;
    if (version >= 7500) {
        size = 8 + 8 + 8 + 1;
    }
    else {
        size = 4 + 4 + 4 + 1;
    }
    size += fbxRecord.name.length;
    size += getRecordPropertiesSize(fbxRecord);
    for (let child of fbxRecord.childs) {
        size += getRecordSize(child, version);
    }
    size += (version >= 7500) ? 25 : 13; //Null record
    return size;
}
function getRecordPropertiesSize(fbxRecord) {
    let size = 0;
    for (let property of fbxRecord.properties) {
        switch (property.type) {
            case FBX_DATA_TYPE_INT_8:
            case FBX_DATA_TYPE_DOUBLE:
            case FBX_DATA_TYPE_FLOAT:
            case FBX_DATA_TYPE_INT_32:
            case FBX_DATA_TYPE_INT_64:
            case FBX_DATA_TYPE_INT_16:
                ++size; //Typecode
                size += FBX_DATA_LEN.get(property.type);
                break;
            case FBX_DATA_TYPE_RAW:
            case FBX_DATA_TYPE_STRING:
                ++size; //Typecode
                size += 4; //string len
                size += property.value.length;
                break;
            case FBX_DATA_TYPE_ARRAY_INT_8:
            case FBX_DATA_TYPE_ARRAY_DOUBLE:
            case FBX_DATA_TYPE_ARRAY_FLOAT:
            case FBX_DATA_TYPE_ARRAY_INT_32:
            case FBX_DATA_TYPE_ARRAY_INT_64:
                size += 13; //Typecode + array header
                size += FBX_DATA_LEN.get(property.type) * property.value.length;
                break;
            default:
                throw 'Unknown property type ' + property.type;
        }
    }
    return size;
}
//const extension = new Uint8Array([0xF8, 0x5A, 0x8C, 0x6A, 0xDE, 0xF5, 0xD9, 0x7E, 0xEC, 0xE9, 0x0C, 0xE3, 0x75, 0x8F, 0x29, 0x0B]);
function padNumber(number, targetLength) {
    return number.toString().padStart(targetLength, '0');
}
function generateFooterCode(date) {
    return _FOOT_ID;
}

class FBXFile {
    #version = 7500;
    #childs = new Set();
    #dateCreated = new Date();
    set version(version) {
        this.#version = version;
    }
    get version() {
        return this.#version;
    }
    addChild(child) {
        this.#childs.add(child);
        return child;
    }
    get childs() {
        return this.#childs;
    }
    getRecordsByName(recordName) {
        let output = [];
        for (let child of this.#childs) {
            if (child.name == recordName) {
                output.push(child);
            }
        }
        return output;
    }
    getRecordByName(recordName) {
        for (let child of this.#childs) {
            if (child.name == recordName) {
                return child;
            }
        }
    }
    set dateCreated(dateCreated) {
        this.#dateCreated = dateCreated;
    }
    get dateCreated() {
        return this.#dateCreated;
    }
    toJSON() {
        return {
            version: this.#version,
            childs: this.#childs.size ? [...this.#childs] : undefined,
        };
    }
}

class FBXImporter extends EventTarget {
    //#reader;
    constructor() {
        super();
    }
    parse(buffer) {
        let reader = new BinaryReader(buffer);
        if (FBXImporter.#isBinary(reader)) {
            return FBXImporter.#parseBinary(reader);
        }
        else {
            return FBXImporter.#parseText(reader);
        }
    }
    static #isBinary(reader) {
        if (reader.getString(FBX_BINARY_MAGIC.length, 0) == FBX_BINARY_MAGIC) {
            return true;
        }
        else {
            return false;
        }
    }
    static #parseBinary(reader) {
        let file = new FBXFile();
        file.version = reader.getUint32(23);
        reader.seek(27);
        for (;;) {
            let record = parseBinaryRecord(reader, file.version >= 7500);
            if (record) {
                file.addChild(record);
            }
            else {
                break;
            }
        }
        return file;
    }
    static #parseText(reader) {
        throw 'Code parseText';
    }
}
function parseBinaryRecord(reader, version7500, tabLevel) {
    reader.tell();
    let endOffset = version7500 ? Number(reader.getBigUint64()) : reader.getUint32();
    if (endOffset == 0) {
        return null;
    }
    let numProperties = version7500 ? Number(reader.getBigUint64()) : reader.getUint32();
    let propertyListLen = version7500 ? Number(reader.getBigUint64()) : reader.getUint32();
    let nameLen = reader.getUint8();
    let name = reader.getString(nameLen);
    //console.log(startOffset, endOffset, name);
    let record = new FBXRecord(name);
    let start = reader.tell();
    for (let i = 0; i < numProperties; ++i) {
        let property = parseProperty(reader);
        record.addProperty(property);
    }
    //reader.skip(propertyListLen);
    reader.seek(start + propertyListLen);
    while (reader.tell() < endOffset) {
        let child = parseBinaryRecord(reader, version7500);
        if (child) {
            record.addChild(child);
        }
        else {
            break;
        }
    }
    reader.seek(endOffset);
    return record;
}
function parseProperty(reader, tabLevel) {
    reader.tell();
    //console.log('>>>>>>>>' + startOffset);
    let typeCode = reader.getUint8();
    let len;
    switch (typeCode) {
        case FBX_DATA_TYPE_INT_16:
            reader.getInt16();
            break;
        case FBX_DATA_TYPE_INT_8:
            reader.getInt8();
            break;
        case FBX_DATA_TYPE_INT_32:
            reader.getInt32();
            break;
        case FBX_DATA_TYPE_FLOAT:
            reader.getFloat32();
            break;
        case FBX_DATA_TYPE_DOUBLE:
            reader.getFloat64();
            break;
        case FBX_DATA_TYPE_INT_64:
            reader.getBigInt64();
            break;
        case FBX_DATA_TYPE_RAW:
            len = reader.getUint32();
            reader.getBytes(len);
            break;
        case FBX_DATA_TYPE_STRING:
            len = reader.getUint32();
            reader.getString(len);
            break;
        case FBX_DATA_TYPE_ARRAY_INT_8:
        case FBX_DATA_TYPE_ARRAY_DOUBLE:
        case FBX_DATA_TYPE_ARRAY_FLOAT:
        case FBX_DATA_TYPE_ARRAY_INT_32:
        case FBX_DATA_TYPE_ARRAY_INT_64:
            parseArray(reader, typeCode);
            break;
        default:
            console.log('Unknown typeCode: ', typeCode);
    }
    //console.log(tab + property);
    throw 'fix property constructor below';
}
function parseArray(reader, arrayType) {
    let arrayLen = reader.getUint32();
    let encoding = reader.getUint32();
    let compressedLength = reader.getUint32();
    let decompressedLength = compressedLength;
    let dataLen = FBX_DATA_LEN.get(arrayType);
    if (dataLen === undefined) {
        throw 'wrong array type';
    }
    //console.log(reader.tell(), arrayLen, encoding, compressedLength, arrayType);
    let dataReader = reader;
    if (encoding == 1) {
        const output = inflate(reader.getBytes(compressedLength));
        dataReader = new BinaryReader(output);
        decompressedLength = dataReader.byteLength;
    }
    else if (encoding != 0) {
        throw 'Unknown encoding ' + encoding;
    }
    if (decompressedLength != arrayLen * dataLen) {
        throw `Unmached length: ${arrayType} ${decompressedLength} ${arrayLen} ${dataLen}`;
    }
    let output = [];
    let value;
    for (let i = 0; i < arrayLen; ++i) {
        switch (arrayType) {
            case FBX_DATA_TYPE_ARRAY_INT_8:
                value = dataReader.getInt8();
                break;
            case FBX_DATA_TYPE_ARRAY_DOUBLE:
                value = dataReader.getFloat64();
                break;
            case FBX_DATA_TYPE_ARRAY_FLOAT:
                value = dataReader.getFloat32();
                break;
            case FBX_DATA_TYPE_ARRAY_INT_32:
                value = dataReader.getInt32();
                break;
            case FBX_DATA_TYPE_ARRAY_INT_64:
                value = dataReader.getBigInt64();
                break;
            default:
                throw 'Unknown array type: arrayType ' + arrayType;
        }
        output.push(value);
    }
    return output;
}

function createFBXRecord(name, options /*TODO: improve type*/) {
    let fbxRecord = new FBXRecord(name);
    if (options) {
        for (let optionName in options) {
            let optionValue = options[optionName];
            switch (optionName) {
                case 'parent':
                    optionValue.addChild(fbxRecord);
                    break;
                case 'child':
                    fbxRecord.addChild(optionValue);
                    break;
                case 'childs':
                    fbxRecord.addChilds(optionValue);
                    break;
                case 'property':
                    fbxRecord.addProperty(optionValue);
                    break;
                case 'properties':
                    fbxRecord.addProperties(optionValue);
                    break;
                default:
                    console.log(`Unknown property: ${optionName}`);
            }
        }
    }
    return fbxRecord;
}
function fbxNameClass(name, className) {
    return name + '\x00\x01' + className;
}
function createFBXRecordSingle(name, type, value) {
    let fbxRecord = new FBXRecord(name);
    fbxRecord.addProperty(new FBXRecordProperty(null, type, value));
    return fbxRecord;
}
function createFBXRecordMultiple(name, type, values) {
    let fbxRecord = new FBXRecord(name);
    for (let value of values) {
        fbxRecord.addProperty(new FBXRecordProperty(null, type, value));
    }
    return fbxRecord;
}
function createFBXRecordSingleInt8(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_8, value);
}
function createFBXRecordSingleInt32(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_32, value);
}
function createFBXRecordSingleInt64(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_INT_64, value);
}
function createFBXRecordMultipleInt64(name, value) {
    return createFBXRecordMultiple(name, FBX_DATA_TYPE_INT_64, value);
}
function createFBXRecordSingleFloat(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_FLOAT, value);
}
function createFBXRecordMultipleFloat(name, value) {
    return createFBXRecordMultiple(name, FBX_DATA_TYPE_FLOAT, value);
}
function createFBXRecordSingleDouble(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_DOUBLE, value);
}
function createFBXRecordMultipleDouble(name, value) {
    return createFBXRecordMultiple(name, FBX_DATA_TYPE_DOUBLE, value);
}
function createFBXRecordSingleString(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_STRING, value);
}
function createFBXRecordMultipleStrings(name, values) {
    return createFBXRecordMultiple(name, FBX_DATA_TYPE_STRING, values);
}
function createFBXRecordSingleBytes(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_RAW, value);
}
function createFBXRecordMultipleBytes(name, value) {
    return createFBXRecordMultiple(name, FBX_DATA_TYPE_RAW, value);
}
function createFBXRecordFloatArray(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_FLOAT, value);
}
function createFBXRecordDoubleArray(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_DOUBLE, value);
}
function createFBXRecordInt32Array(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_INT_32, value);
}
function createFBXRecordInt64Array(name, value) {
    return createFBXRecordSingle(name, FBX_DATA_TYPE_ARRAY_INT_64, value);
}

function createPString(name, value) {
    return createFBXRecordMultipleStrings('P', [name, 'KString', '', '', value]);
}
function createPInteger(name, value) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('int'),
            createStringProperty('Integer'),
            createStringProperty(''),
            createInt32Property(value),
        ],
    });
}
function createPDouble(name, value) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('double'),
            createStringProperty('Number'),
            createStringProperty(''),
            createDoubleProperty(value),
        ],
    });
}
function createPColorRGB(name, value) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('ColorRGB'),
            createStringProperty('Color'),
            createStringProperty(''),
            createDoubleProperty(value[0]),
            createDoubleProperty(value[1]),
            createDoubleProperty(value[2]),
        ],
    });
}
function createPEnum(name, value) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('enum'),
            createStringProperty(''),
            createStringProperty(''),
            createInt32Property(value),
        ],
    });
}
function createPTime(name, value) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('KTime'),
            createStringProperty('Time'),
            createStringProperty(''),
            createInt64Property(value),
        ],
    });
}
function createPObject(name) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('object'),
            createStringProperty(''),
            createStringProperty(''),
        ],
    });
}
function createPBool(name, value) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('bool'),
            createStringProperty(''),
            createStringProperty(''),
            createInt32Property(value ? 1 : 0),
        ],
    });
}
function createPVector3D(name, value) {
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('Vector3D'),
            createStringProperty('Vector'),
            createStringProperty(''),
            createDoubleProperty(value[0]),
            createDoubleProperty(value[1]),
            createDoubleProperty(value[2]),
        ],
    });
}

function exportFBXGlobalSettings(fbxGlobalSettings) {
    let globalSettings = createFBXRecord('GlobalSettings', {
        childs: [
            createFBXRecordSingleInt32('Version', 1000),
            createFBXRecord('Properties70', {
                childs: [
                    createPInteger('UpAxis', 1), //TODO
                    createPInteger('UpAxisSign', 1), //TODO
                    createPInteger('FrontAxis', 2), //TODO
                    createPInteger('FrontAxisSign', 1), //TODO
                    createPInteger('CoordAxis', 0), //TODO
                    createPInteger('CoordAxisSign', 1), //TODO
                    createPInteger('OriginalUpAxis', 1), //TODO
                    createPInteger('OriginalUpAxisSign', 1), //TODO
                    createPDouble('UnitScaleFactor', 1), //TODO
                    createPDouble('OriginalUnitScaleFactor', 1), //TODO
                    createPColorRGB('AmbientColor', [0, 0, 0]), //TODO
                    createPString('DefaultCamera', 'Producer Perspective'), //TODO
                    createPEnum('TimeMode', 17), //TODO
                    createPTime('TimeSpanStart', 0n), //TODO
                    createPTime('TimeSpanStop', FBX_KTIME), //TODO
                    createPDouble('CustomFrameRate', -1), //TODO
                    createPEnum('TimeProtocol', 2), //TODO
                    createPEnum('SnapOnFrameMode', 0), //TODO
                    createFBXRecordMultipleStrings('P', ['TimeMarker', 'Compound', '', '']),
                    createPInteger('CurrentTimeMarker', -1), //TODO
                ]
            }),
        ]
    });
    return globalSettings;
}
/*
export function exportFBXGlobalSettings(fbxGlobalSettings) {
    let upVector = fbxGlobalSettings.axisSystem.upVector;
    let frontVector = fbxGlobalSettings.axisSystem.frontVector;
    let coordVector = fbxGlobalSettings.axisSystem.coordVector;

    let globalSettings = createFBXRecord('GlobalSettings', {
        childs: [
            createFBXRecordSingleInt32('Version', 1000),
            createFBXRecord('Properties70', {
                childs: [
                    createPInteger('UpAxis', upVector),//TODO
                    createPInteger('UpAxisSign', Math.sign(upVector)),//TODO
                    createPInteger('FrontAxis', frontVector),//TODO
                    createPInteger('FrontAxisSign', Math.sign(frontVector)),//TODO
                    createPInteger('CoordAxis', coordVector),//TODO
                    createPInteger('CoordAxisSign', Math.sign(coordVector)),//TODO
                    createPInteger('OriginalUpAxis', 1),//TODO
                    createPInteger('OriginalUpAxisSign', 1),//TODO
                    createPDouble('UnitScaleFactor', 1),//TODO
                    createPDouble('OriginalUnitScaleFactor', 1),//TODO
                    createPColorRGB('AmbientColor', [0, 0, 0]),//TODO
                    createPString('DefaultCamera', 'Producer Perspective'),//TODO
                    createPEnum('TimeMode', 17),//TODO
                    createPTime('TimeSpanStart', 0n),//TODO
                    createPTime('TimeSpanStop', FBX_KTIME),//TODO
                    createPDouble('CustomFrameRate', -1),//TODO
                    createPEnum('TimeProtocol', 2),//TODO
                    createPEnum('SnapOnFrameMode', 0),//TODO
                    createFBXRecordMultipleStrings('P', ['TimeMarker', 'Compound', '', '']),
                    createPInteger('CurrentTimeMarker', -1),//TODO
                ]
            }),
        ]
    });
    return globalSettings;
}

*/

function exportFBXScene(fbxScene) {
    let documents = createFBXRecord('Documents', {
        childs: [
            createFBXRecordSingleInt32('Count', 1),
            createFBXRecord('Document', {
                childs: [
                    createFBXRecord('Properties70', {
                        childs: [
                            createPObject('SourceObject'),
                            createPString('ActiveAnimStackName', ''), //TODO
                        ]
                    }),
                    createFBXRecordSingleInt64('RootNode', 0n),
                ],
                properties: [
                    createInt64Property(fbxScene.id),
                    createStringProperty(''),
                    createStringProperty('Scene'),
                ]
            }),
        ],
    });
    return documents;
}

function createPropertiesRecord(fbxObject) {
    const fbxRecord = new FBXRecord('Properties70');
    const objectProperties = fbxObject.getAllProperties();
    for (let property of objectProperties) {
        if (!property.isCompound()) {
            const propertyRecord = createPropertyRecord(property);
            if (propertyRecord) {
                fbxRecord.addChild(propertyRecord);
            }
        }
    }
    return fbxRecord;
}
function createPropertyRecord(fbxProperty) {
    let fn = TYPE_PROPERTY.get(fbxProperty.type);
    if (!fn) {
        throw 'Unsupported property type';
    }
    return fn(fbxProperty.hierarchicalName, fbxProperty.value);
}
const TYPE_PROPERTY = new Map();
TYPE_PROPERTY.set(FBX_PROPERTY_TYPE_DOUBLE, createPDouble);

function fbxAnimCurveNodeToRecord(fbxAnimCurveNode) {
    return createFBXRecord('AnimationCurveNode', {
        childs: [
            createPropertiesRecord(fbxAnimCurveNode),
        ],
        properties: [
            createInt64Property(fbxAnimCurveNode.id),
            createStringProperty(fbxAnimCurveNode.name + '\x00\x01AnimCurveNode'),
            createStringProperty(''),
        ],
    });
}

function fbxAnimCurveToRecord(fbxAnimCurve) {
    return createFBXRecord('AnimationCurve', {
        childs: [
            createFBXRecordSingleDouble('Default', 0.0), //TODO: const
            createFBXRecordSingleInt32('KeyVer', 4008), //TODO: const
            createFBXRecordInt64Array('KeyTime', [100000n, 200000n, 300000n, 400000n]),
            createFBXRecordFloatArray('KeyValueFloat', [1, 2, 3, 4]),
            createFBXRecordInt32Array('KeyAttrFlags', [8456]),
            createFBXRecordFloatArray('KeyAttrDataFloat', [0, 0, 218434821, 0]),
            createFBXRecordInt32Array('KeyAttrRefCount', [4]),
        ],
        properties: [
            createInt64Property(fbxAnimCurve.id),
            createStringProperty(fbxAnimCurve.name + '\x00\x01AnimCurve'),
            createStringProperty(''),
        ],
    });
}

function fbxAnimLayerToRecord(fbxAnimLayer) {
    return createFBXRecord('AnimationLayer', {
        properties: [
            createInt64Property(fbxAnimLayer.id),
            createStringProperty(fbxAnimLayer.name + '\x00\x01AnimLayer'),
            createStringProperty(''),
        ],
    });
}

function fbxAnimStackToRecord(fbxAnimStack) {
    return createFBXRecord('AnimationStack', {
        childs: [
            createFBXRecord('Properties70', {
                childs: [
                    createPTime('LocalStart', 0n),
                    createPTime('LocalStop', 12345678900n),
                    createPTime('ReferenceStart', 0n),
                    createPTime('ReferenceStop', 12345678900n),
                ]
            }),
        ],
        properties: [
            createInt64Property(fbxAnimStack.id),
            createStringProperty(fbxAnimStack.name + '\x00\x01AnimStack'),
            createStringProperty('AnimationStack'),
        ],
    });
}

function fbxPropertyToRecord(fbxProperty, name = '') {
    switch (fbxProperty.type) {
        case FBX_PROPERTY_TYPE_DOUBLE_3:
            return fbxPropertyDouble3ToRecord(fbxProperty, name);
        default:
            throw 'unknown property type';
    }
}
function fbxPropertyDouble3ToRecord(fbxProperty, name) {
    let value = fbxProperty.value;
    return createFBXRecord('P', {
        properties: [
            createStringProperty(name),
            createStringProperty('Vector'),
            createStringProperty(''),
            createStringProperty('A'), //TODO: property flag
            createDoubleProperty(value[0]),
            createDoubleProperty(value[1]),
            createDoubleProperty(value[2]),
        ],
    });
}

function fbxCameraToRecord(fbxCamera) {
    return createFBXRecord('NodeAttribute', {
        childs: [
            createFBXRecordSingleString('TypeFlags', 'Camera'),
            createFBXRecordSingleInt32('GeometryVersion', FBX_GEOMETRY_VERSION),
            createFBXRecord('Properties70', {
                childs: [
                    fbxPropertyToRecord(fbxCamera.position, 'Position'),
                    fbxPropertyToRecord(fbxCamera.upVector, 'UpVector'),
                ],
            }),
        ],
        properties: [
            createInt64Property(fbxCamera.id),
            createStringProperty(fbxCamera.name + '\x00\x01NodeAttribute'),
            createStringProperty('Camera'),
        ],
    });
}

function fbxClusterToRecord(fbxCluster) {
    return createFBXRecord('Deformer', {
        childs: [
            createFBXRecordSingleInt32('Version', FBX_DEFORMER_CLUSTER_VERSION),
            createFBXRecordMultipleStrings('UserData', ['', '']),
            createFBXRecordInt32Array('Indexes', fbxCluster.indexes),
            createFBXRecordDoubleArray('Weights', fbxCluster.weights),
            createFBXRecordDoubleArray('Transform', fbxCluster.transformMatrix),
            createFBXRecordDoubleArray('TransformLink', fbxCluster.transformLinkMatrix),
        ],
        properties: [
            createInt64Property(fbxCluster.id),
            createStringProperty(fbxCluster.name + '\x00\x01SubDeformer'),
            createStringProperty('Cluster'),
        ],
    });
}

function fbxMeshToRecord(fbxMesh) {
    return createFBXRecord('Geometry', {
        childs: [
            createFBXRecord('Properties70'),
            createFBXRecordSingleInt32('GeometryVersion', FBX_GEOMETRY_VERSION),
            createFBXRecordDoubleArray('Vertices', fbxMesh.vertices),
            createFBXRecordInt32Array('PolygonVertexIndex', fbxMesh.polygons),
            createFBXRecordInt32Array('Edges', fbxMesh.edges),
            /*createFBXRecord('LayerElementNormal', {
                childs: [
                    createFBXRecordSingleInt32('Version', FBX_GEOMETRY_NORMAL_VERSION),
                    createFBXRecordSingleString('Name', ''),
                    createFBXRecordSingleString('MappingInformationType', 'ByPolygonVertex'),
                    createFBXRecordSingleString('ReferenceInformationType', 'Direct'),
                    createFBXRecordDoubleArray('Normals', fbxMesh.normals),//[0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, -1, 0, 0, -1, 0, 0, -1, 0,  0, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]),//TODO
                ],
                properties: [
                    createInt32Property(0),//What is this ?
                ],
            }),*/
            createFBXRecord('LayerElementUV', {
                childs: [
                    createFBXRecordSingleInt32('Version', FBX_GEOMETRY_UV_VERSION),
                    createFBXRecordSingleString('Name', 'UVMap'), //TODO: change name
                    createFBXRecordSingleString('MappingInformationType', 'ByPolygonVertex'),
                    createFBXRecordSingleString('ReferenceInformationType', 'IndexToDirect'),
                    createFBXRecordDoubleArray('UV', fbxMesh.uv), //[0.625, 1, 0.625, 0.25, 0.375, 0.5, 0.875, 0.5, 0.625, 0.75, 0.375, 1, 0.375, 0.75, 0.625, 0, 0.375, 0, 0.375, 0.25, 0.125, 0.5, 0.875, 0.75, 0.125, 0.75, 0.625, 0.5]),//TODO
                    createFBXRecordInt32Array('UVIndex', fbxMesh.uvIndex), //[13, 3, 11, 4, 6, 4, 0, 5, 8, 7, 1, 9, 10, 2, 6, 12, 2, 13, 4, 6, 9, 1, 13, 2]),//TODO
                ],
                properties: [
                    createInt32Property(0), //What is this ?
                ],
            }),
            createFBXRecord('LayerElementMaterial', {
                childs: [
                    createFBXRecordSingleInt32('Version', FBX_GEOMETRY_MATERIAL_VERSION),
                    createFBXRecordSingleString('Name', ''),
                    createFBXRecordSingleString('MappingInformationType', 'AllSame'),
                    createFBXRecordSingleString('ReferenceInformationType', 'IndexToDirect'),
                    createFBXRecordInt32Array('Materials', [0]), //TODO
                ],
                properties: [
                    createInt32Property(0), //What is this ?
                ],
            }),
            createFBXRecord('Layer', {
                childs: [
                    createFBXRecordSingleInt32('Version', FBX_GEOMETRY_LAYER_VERSION),
                    createFBXRecord('LayerElement', {
                        childs: [
                            createFBXRecordSingleString('Type', 'LayerElementNormal'),
                            createFBXRecordSingleInt32('TypedIndex', 0),
                        ],
                    }),
                    createFBXRecord('LayerElement', {
                        childs: [
                            createFBXRecordSingleString('Type', 'LayerElementUV'),
                            createFBXRecordSingleInt32('TypedIndex', 0),
                        ],
                    }),
                    createFBXRecord('LayerElement', {
                        childs: [
                            createFBXRecordSingleString('Type', 'LayerElementMaterial'),
                            createFBXRecordSingleInt32('TypedIndex', 0),
                        ],
                    }),
                ],
                properties: [
                    createInt32Property(0), //What is this ?
                ],
            }),
        ],
        properties: [
            createInt64Property(fbxMesh.id),
            createStringProperty(fbxMesh.name + '\x00\x01Geometry'),
            createStringProperty('Mesh'),
        ],
    });
}

function fbxNodeToRecord(fbxNode, type = '') {
    return createFBXRecord('Model', {
        childs: [
            createFBXRecordSingleInt32('Version', FBX_MODELS_VERSION),
            createFBXRecord('Properties70', {
                childs: [
                    fbxPropertyToRecord(fbxNode.localTranslation, 'Lcl Translation'),
                    /*createFBXRecord('P', {
                        properties: [
                            createStringProperty('Lcl Translation'),
                            createStringProperty('Lcl Translation'),
                            createStringProperty(''),
                            createStringProperty('A+'),
                            createDoubleProperty(0),
                            createDoubleProperty(0),
                            createDoubleProperty(0),
                        ],
                    }),*/
                    fbxPropertyToRecord(fbxNode.localRotation, 'Lcl Rotation'),
                    /*createFBXRecord('P', {
                        properties: [
                            createStringProperty('Lcl Rotation'),
                            createStringProperty('Lcl Rotation'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0),
                            createDoubleProperty(0),
                            createDoubleProperty(0),
                        ],
                    }),*/
                    fbxPropertyToRecord(fbxNode.localScaling, 'Lcl Scaling'),
                    /*createFBXRecord('P', {
                        properties: [
                            createStringProperty('Lcl Scaling'),
                            createStringProperty('Lcl Scaling'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(1),
                            createDoubleProperty(1),
                            createDoubleProperty(1),
                        ],
                    }),*/
                    createPInteger('DefaultAttributeIndex', 0),
                    createPEnum('InheritType', fbxNode.inheritType),
                    createPBool('RotationActive', true),
                    createPVector3D('ScalingMax', [0, 0, 0]),
                    createPDouble('PreferedAngleX', 0),
                    createPDouble('PreferedAngleY', 0),
                    createPDouble('PreferedAngleZ', 0),
                    createPBool('lockInfluenceWeights', false),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('filmboxTypeID'),
                            createStringProperty('Short'),
                            createStringProperty(''),
                            createStringProperty('A+UH'),
                            createInt16Property(5),
                            createInt16Property(5),
                            createInt16Property(5),
                        ],
                    }),
                ],
            }),
            createFBXRecordSingleInt32('MultiLayer', 0), //What is this ?
            createFBXRecordSingleInt32('MultiTake', 0), //What is this ?
            createFBXRecordSingleInt8('Shading', 89), //89 = Y
            createFBXRecordSingleString('Culling', 'CullingOff'),
        ],
        properties: [
            createInt64Property(fbxNode.id), //TODO
            createStringProperty(fbxNode.name + '\x00\x01Model'),
            createStringProperty(type),
        ],
    });
}

function fbxPoseToRecord(fbxPose) {
    let poseType = fbxPose.isBindPose ? 'BindPose' : 'RestPose'; //TODO: not sure about this
    let poseNodes = [];
    for (let poseInfo of fbxPose.poseInfos) {
        poseNodes.push(createFBXRecord('PoseNode', {
            childs: [
                createFBXRecordSingleInt64('Node', poseInfo.node.id),
                createFBXRecordDoubleArray('Matrix', poseInfo.matrix),
            ],
        }));
    }
    return createFBXRecord('Pose', {
        childs: [
            createFBXRecordSingleString('Type', poseType),
            createFBXRecordSingleInt32('Version', FBX_POSE_BIND_VERSION),
            createFBXRecordSingleInt32('NbPoseNodes', poseNodes.length),
            ...poseNodes,
        ],
        properties: [
            createInt64Property(fbxPose.id),
            createStringProperty(fbxPose.name + '\x00\x01Pose'),
            createStringProperty(poseType),
        ],
    });
}

function fbxSkeletonToRecord(fbxSkeleton) {
    return createFBXRecord('NodeAttribute', {
        childs: [
            createFBXRecordSingleString('TypeFlags', 'Skeleton'),
        ],
        properties: [
            createInt64Property(fbxSkeleton.id),
            createStringProperty(fbxSkeleton.name + '\x00\x01NodeAttribute'),
            createStringProperty('LimbNode'),
        ],
    });
}

function fbxSkinToRecord(fbxSkin) {
    return createFBXRecord('Deformer', {
        childs: [
            createFBXRecordSingleInt32('Version', FBX_DEFORMER_SKIN_VERSION),
            createFBXRecordSingleDouble('Link_DeformAcuracy', 50.), //TODO
        ],
        properties: [
            createInt64Property(fbxSkin.id),
            createStringProperty(fbxSkin.name + '\x00\x01Deformer'),
            createStringProperty('Skin'),
        ],
    });
}

function fbxSurfaceMaterialToRecord(fbxSurfaceMaterial) {
    return createFBXRecord('Material', {
        childs: [
            createFBXRecordSingleInt32('Version', FBX_MATERIAL_VERSION),
            createFBXRecordSingleString('ShadingModel', 'Phong'),
            createFBXRecordSingleInt32('MultiLayer', 0), //What is this ?
            createFBXRecord('Properties70', {
                childs: [
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('DiffuseColor'),
                            createStringProperty('Color'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0.8),
                            createDoubleProperty(0.8),
                            createDoubleProperty(0.8),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('AmbientColor'),
                            createStringProperty('Color'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0.05),
                            createDoubleProperty(0.05),
                            createDoubleProperty(0.05),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('AmbientFactor'),
                            createStringProperty('Number'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('BumpFactor'),
                            createStringProperty('double'),
                            createStringProperty('Number'),
                            createStringProperty(''),
                            createDoubleProperty(0),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('SpecularColor'),
                            createStringProperty('Color'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0.8),
                            createDoubleProperty(0.8),
                            createDoubleProperty(0.8),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('SpecularFactor'),
                            createStringProperty('Number'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0.25),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('Shininess'),
                            createStringProperty('Number'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(25),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('ShininessExponent'),
                            createStringProperty('Number'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(25),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('ReflectionColor'),
                            createStringProperty('Color'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0.8),
                            createDoubleProperty(0.8),
                            createDoubleProperty(0.8),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('ReflectionFactor'),
                            createStringProperty('Number'),
                            createStringProperty(''),
                            createStringProperty('A'),
                            createDoubleProperty(0),
                        ],
                    }),
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('TransparencyFactor'),
                            createStringProperty('double'),
                            createStringProperty('Number'),
                            createStringProperty(''),
                            createDoubleProperty(0.0),
                        ],
                    }),
                ],
            }),
        ],
        properties: [
            createInt64Property(fbxSurfaceMaterial.id),
            createStringProperty(fbxSurfaceMaterial.name + '\x00\x01Material'),
            createStringProperty(''),
        ],
    });
}

function fbxTextureToRecord(fbxTexture) {
    let mediaRecord;
    let filenameRecord;
    let relativeFilenameRecord;
    let textureMedia = fbxTexture.media;
    if (textureMedia) {
        mediaRecord = createFBXRecordSingleString('Media', textureMedia.name + '\x00\x01' + 'Video');
        filenameRecord = createFBXRecordSingleString('FileName', textureMedia.name);
        relativeFilenameRecord = createFBXRecordSingleString('RelativeFilename', textureMedia.name);
    }
    return createFBXRecord('Texture', {
        childs: [
            createFBXRecordSingleString('Type', fbxTexture.type),
            createFBXRecordSingleInt32('Version', FBX_TEXTURE_VERSION),
            createFBXRecordSingleString('TextureName', fbxTexture.name + '\x00\x01' + 'Texture'),
            mediaRecord,
            filenameRecord,
            relativeFilenameRecord,
            createFBXRecord('Properties70', {
                childs: [
                    createFBXRecord('P', {
                        properties: [
                            createStringProperty('UseMaterial'),
                            createStringProperty('bool'),
                            createStringProperty(''),
                            createStringProperty(''),
                            createInt32Property(1),
                        ],
                    }),
                    /*createFBXRecord('P', {
                        properties: [
                            createStringProperty('AlphaSource'),
                            createStringProperty('enum'),
                            createStringProperty(''),
                            createStringProperty(''),
                            createDoubleProperty(2),
                        ],
                    }),*/
                ],
            }),
        ],
        properties: [
            createInt64Property(fbxTexture.id),
            createStringProperty(fbxTexture.name + '\x00\x01' + 'Texture'),
            createStringProperty(''),
        ],
    });
}

const FBX_RECORD_NAME_CONNECTIONS = 'Connections';
const FBX_RECORD_NAME_CREATOR = 'Creator';
const FBX_RECORD_NAME_OBJECTS = 'Objects';
const FBX_RECORD_NAME_REFERENCES = 'References';
const FBX_RECORD_NAME_TAKES = 'Takes';

function createConnectionRecord(id, parentId, target) {
    let fbxRecord = new FBXRecord('C');
    fbxRecord.addProperty(createStringProperty(target ? 'OP' : 'OO'));
    fbxRecord.addProperty(createInt64Property(id));
    fbxRecord.addProperty(createInt64Property(parentId));
    if (target != undefined) {
        fbxRecord.addProperty(createStringProperty(target));
    }
    return fbxRecord;
}

function createEmptyFile(creator = 'harmony-fbx', appVendor = 'harmony-fbx', appName = 'harmony-fbx', appVersion = '1') {
    let fbxFile = new FBXFile();
    //let date = new Date();
    fbxFile.addChild(createHeaderExtensionRecord(fbxFile, creator, appVendor, appName, appVersion));
    fbxFile.addChild(createFBXRecordSingleString('Creator', creator));
    fbxFile.addChild(createGlobalSettingsRecord());
    fbxFile.addChild(createDocumentsRecord());
    fbxFile.addChild(createFBXRecord('References'));
    fbxFile.addChild(createDefinitionsRecord());
    fbxFile.addChild(createFBXRecord('Objects'));
    fbxFile.addChild(createFBXRecord('Connections'));
    fbxFile.addChild(createTakesRecord());
    return fbxFile;
}
function createHeaderExtensionRecord(fbxFile, creator, appVendor, appName, appVersion) {
    let date = new Date();
    let fbxHeaderExtension = createFBXRecord('FBXHeaderExtension', {
        childs: [
            createFBXRecordSingleInt32('FBXHeaderVersion', FBX_HEADER_VERSION),
            createFBXRecordSingleInt32('FBXVersion', fbxFile.version),
            createFBXRecordSingleInt32('EncryptionType', 0),
            createFBXRecord('CreationTimeStamp', {
                childs: [
                    createFBXRecordSingleInt32('Version', 1000),
                    createFBXRecordSingleInt32('Year', date.getFullYear()),
                    createFBXRecordSingleInt32('Month', date.getMonth() + 1),
                    createFBXRecordSingleInt32('Day', date.getDate()),
                    createFBXRecordSingleInt32('Hour', date.getHours()),
                    createFBXRecordSingleInt32('Minute', date.getMinutes()),
                    createFBXRecordSingleInt32('Second', date.getSeconds()),
                    createFBXRecordSingleInt32('Millisecond', date.getMilliseconds()),
                ]
            }),
            createFBXRecordSingleString('Creator', creator),
            createFBXRecord('SceneInfo', {
                properties: [
                    createStringProperty(fbxNameClass('GlobalInfo', 'SceneInfo')),
                    createStringProperty('UserData'),
                ],
                childs: [
                    createFBXRecordSingleString('Type', 'UserData'),
                    createFBXRecordSingleInt32('Version', FBX_SCENEINFO_VERSION),
                    createFBXRecord('MetaData', {
                        childs: [
                            createFBXRecordSingleInt32('Version', FBX_SCENEINFO_VERSION),
                            createFBXRecordSingleString('Title', ''), //TODO
                            createFBXRecordSingleString('Subject', ''), //TODO
                            createFBXRecordSingleString('Author', ''), //TODO
                            createFBXRecordSingleString('Keywords', ''), //TODO
                            createFBXRecordSingleString('Revision', ''), //TODO
                            createFBXRecordSingleString('Comment', ''), //TODO
                        ]
                    }),
                    createFBXRecord('Properties70', {
                        childs: [
                            createFBXRecordMultipleStrings('P', ['DocumentUrl', 'KString', 'Url', '', './test.fbx']), //TODO
                            createFBXRecordMultipleStrings('P', ['SrcDocumentUrl', 'KString', 'Url', '', './test.fbx']), //TODO
                            createFBXRecordMultipleStrings('P', ['Original', 'Compound', '', '']),
                            createFBXRecordMultipleStrings('P', ['Original|ApplicationVendor', 'KString', '', '', appVendor]),
                            createFBXRecordMultipleStrings('P', ['Original|ApplicationName', 'KString', '', '', appName]),
                            createFBXRecordMultipleStrings('P', ['Original|ApplicationVersion', 'KString', '', '', appVersion]),
                            createFBXRecordMultipleStrings('P', ['Original|DateTime_GMT', 'DateTime', '', '', '01/01/1970 00:00:00.000']),
                            createFBXRecordMultipleStrings('P', ['Original|FileName', 'KString', '', '', './test.fbx']), //TODO
                            createFBXRecordMultipleStrings('P', ['LastSaved', 'Compound', '', '']),
                            createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationVendor', 'KString', '', '', appVersion]),
                            createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationName', 'KString', '', '', appName]),
                            createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationVersion', 'KString', '', '', appVersion]),
                            createFBXRecordMultipleStrings('P', ['LastSaved|DateTime_GMT', 'DateTime', '', '', '01/01/1970 00:00:00.000']),
                            createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationActiveProject', 'KString', '', '', './test.fbx']), //TODO
                        ]
                    }),
                ]
            }),
        ]
    });
    return fbxHeaderExtension;
}
function createGlobalSettingsRecord() {
    let globalSettings = createFBXRecord('GlobalSettings', {
        childs: [
            createFBXRecordSingleInt32('Version', 1000),
            createFBXRecord('Properties70', {
                childs: [
                    createPInteger('UpAxis', 1), //TODO
                    createPInteger('UpAxisSign', 1), //TODO
                    createPInteger('FrontAxis', 2), //TODO
                    createPInteger('FrontAxisSign', 1), //TODO
                    createPInteger('CoordAxis', 0), //TODO
                    createPInteger('CoordAxisSign', 1), //TODO
                    createPInteger('OriginalUpAxis', 1), //TODO
                    createPInteger('OriginalUpAxisSign', 1), //TODO
                    createPDouble('UnitScaleFactor', 1), //TODO
                    createPDouble('OriginalUnitScaleFactor', 1), //TODO
                    createPColorRGB('AmbientColor', [0, 0, 0]), //TODO
                    createPString('DefaultCamera', 'Producer Perspective'), //TODO
                    createPEnum('TimeMode', 17), //TODO
                    createPTime('TimeSpanStart', 0n), //TODO
                    createPTime('TimeSpanStop', FBX_KTIME), //TODO
                    createPDouble('CustomFrameRate', -1), //TODO
                    createPEnum('TimeProtocol', 2), //TODO
                    createPEnum('SnapOnFrameMode', 0), //TODO
                    createFBXRecordMultipleStrings('P', ['TimeMarker', 'Compound', '', '']),
                    createPInteger('CurrentTimeMarker', -1), //TODO
                ]
            }),
        ]
    });
    return globalSettings;
}
function createDocumentsRecord() {
    let documents = createFBXRecord('Documents', {
        childs: [
            createFBXRecordSingleInt32('Count', 1),
            createFBXRecord('Document', {
                childs: [
                    createFBXRecord('Properties70', {
                        childs: [
                            createPObject('SourceObject'),
                            createPString('ActiveAnimStackName', ''), //TODO
                        ]
                    }),
                    createFBXRecordSingleInt64('RootNode', 0n),
                ],
                properties: [
                    createInt64Property(9876n), //TODO: what is this ?
                    createStringProperty('Scene'),
                    createStringProperty('Scene'),
                ]
            }),
        ],
    });
    return documents;
}
function createDefinitionsRecord() {
    let definitions = createFBXRecord('Definitions', {
        childs: [
            createFBXRecordSingleInt32('Version', FBX_TEMPLATES_VERSION),
            createFBXRecordSingleInt32('Count', 4), //TODO: Sum of every template below
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                ],
                properties: [
                    createStringProperty('GlobalSettings'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                    createFBXRecord('PropertyTemplate', {
                        properties: [
                            createStringProperty('FbxMesh'),
                        ],
                    }),
                ],
                properties: [
                    createStringProperty('Geometry'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                    createFBXRecord('PropertyTemplate', {
                        childs: [],
                        properties: [
                            createStringProperty('FbxNode'),
                        ],
                    }),
                ],
                properties: [
                    createStringProperty('Model'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                    createFBXRecord('PropertyTemplate', {
                        childs: [],
                        properties: [
                            createStringProperty('FbxSurfacePhong'),
                        ],
                    }),
                ],
                properties: [
                    createStringProperty('Material'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                    createFBXRecord('PropertyTemplate', {
                        childs: [],
                        properties: [
                            createStringProperty('FbxFileTexture'),
                        ],
                    }),
                ],
                properties: [
                    createStringProperty('Texture'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                    createFBXRecord('PropertyTemplate', {
                        childs: [],
                        properties: [
                            createStringProperty('FbxVideo'),
                        ],
                    }),
                ],
                properties: [
                    createStringProperty('Video'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                ],
                properties: [
                    createStringProperty('Deformer'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                    createFBXRecord('PropertyTemplate', {
                        childs: [
                            createFBXRecord('Properties70', {
                                childs: [
                                    createPColorRGB('Color', [0.8, 0.8, 0.8]),
                                    createPDouble('Size', 100),
                                    createPDouble('LimbLength', 1), //TODO: P: "LimbLength", "double", "Number", "H",1
                                ]
                            }),
                        ],
                        properties: [
                            createStringProperty('FbxSkeleton'),
                        ]
                    }),
                ],
                properties: [
                    createStringProperty('NodeAttribute'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                ],
                properties: [
                    createStringProperty('Pose'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                ],
                properties: [
                    createStringProperty('AnimationStack'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                ],
                properties: [
                    createStringProperty('AnimationLayer'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                ],
                properties: [
                    createStringProperty('AnimationCurveNode'),
                ],
            }),
            createFBXRecord('ObjectType', {
                childs: [
                    createFBXRecordSingleInt32('Count', 1),
                ],
                properties: [
                    createStringProperty('AnimationCurve'),
                ],
            }),
        ],
    });
    return definitions;
}
function createTakesRecord() {
    let takes = createFBXRecord(FBX_RECORD_NAME_TAKES, {
        childs: [
            createFBXRecordSingleString('Current', ''),
        ],
    });
    return takes;
}

function createVideoRecord(fbxVideo) {
    return createFBXRecord('Video', {
        childs: [
            createFBXRecordSingleString('Type', fbxVideo.type),
            createFBXRecordSingleString('RelativeFilename', `mat_${fbxVideo.id}.png`),
            /*createFBXRecordSingleString('Filename', `C:\\Users\\Guillaume\\Desktop\\fbx\\untitled.fbm\\mat_${fbxVideo.id}.png`),*/
            createFBXRecordSingleBytes('Content', fbxVideo.content),
            createFBXRecord('Properties70', {
                childs: [
                    createFBXRecordMultipleStrings('P', ['Path', 'KString', 'XRefUrl', '', `C:\\fbx\\untitled.fbm\\mat_${fbxVideo.id}.png`]),
                ],
            }),
        ],
        properties: [
            createInt64Property(fbxVideo.id),
            createStringProperty(fbxVideo.name + '\x00\x01' + 'Video'),
            createStringProperty('Clip'),
        ],
    });
}

const FBX_RECORD_TYPE_MESH = 'Mesh';
const FBX_RECORD_TYPE_LIMB_NODE = 'LimbNode';
const FBX_RECORD_TYPE_CAMERA = 'Camera';
function fbxSceneToFBXFile(scene, creator = 'harmony-fbx', appVendor = 'harmony-fbx', appName = 'harmony-fbx', appVersion = '1') {
    let fbxFile = new FBXFile();
    fbxFile.version = 7400;
    fbxFile.addChild(createHeaderExtensionRecord(fbxFile, creator, appVendor, appName, appVersion));
    fbxFile.addChild(createFBXRecordSingleString(FBX_RECORD_NAME_CREATOR, creator));
    fbxFile.addChild(exportFBXGlobalSettings(scene.globalSettings));
    fbxFile.addChild(exportFBXScene(scene));
    fbxFile.addChild(createFBXRecord(FBX_RECORD_NAME_REFERENCES)); //TODO ?
    fbxFile.addChild(createDefinitionsRecord());
    fbxFile.addChild(createFBXRecord(FBX_RECORD_NAME_OBJECTS));
    fbxFile.addChild(createFBXRecord(FBX_RECORD_NAME_CONNECTIONS));
    fbxFile.addChild(createTakesRecord());
    exportObjects(fbxFile, scene);
    exportTakes(fbxFile, scene);
    return fbxFile;
}
function exportObjects(fbxFile, scene) {
    /*
    let nodesReferences = new Set();
    let nodesConnections = new Set();
    let alreadyExported = new Set<FBXObject>();
    */
    const context = {
        nodesReferences: new Set(),
        nodesConnections: new Set(),
        alreadyExported: new Set(),
    };
    for (let child of scene.rootNode.childs) {
        exportObject(fbxFile, child, context /*nodesReferences, nodesConnections, alreadyExported*/);
    }
    for (let object of scene.objects) {
        exportObject(fbxFile, object, context /*nodesReferences, nodesConnections, alreadyExported*/);
    }
    for (;;) {
        //let nodesReferences2 = new Set();
        const context2 = {
            nodesReferences: new Set(),
            nodesConnections: context.nodesConnections,
            alreadyExported: context.alreadyExported,
        };
        for (let child of context.nodesReferences) {
            exportObject(fbxFile, child, context2 /*nodesReferences2, nodesConnections, alreadyExported*/);
        }
        if (context2.nodesReferences.size == 0) {
            break;
        }
        context.nodesReferences = context2.nodesReferences;
    }
    createConnections(fbxFile, context.nodesConnections);
}
function exportObject(fbxFile, object, context /*nodesReferences, nodesConnections, alreadyExported*/) {
    if (context.alreadyExported.has(object)) {
        return;
    }
    switch (true) {
        case object.isFBXNode:
            exportNode(fbxFile, object, context /*nodesReferences, nodesConnections, alreadyExported*/);
            break;
        case object.isFBXObject:
            exportObject2(fbxFile, object, context /*nodesReferences, nodesConnections*/);
            break;
        default:
            console.log(object);
            throw 'Trying to export an unknown object';
    }
    context.alreadyExported.add(object);
}
function exportObject2(fbxFile, object, context) {
    exportObjectPropertiesConnections(fbxFile, object, context);
    switch (true) {
        case object.isFBXSurfacePhong:
            exportSurfacePhongObject(fbxFile, object, context);
            break;
        case object.isFBXTexture:
            exportFBXTexture(fbxFile, object, context);
            break;
        case object.isFBXVideo:
            exportFBXVideo(fbxFile, object);
            break;
        case object.isFBXSkin:
            exportFBXSkin(fbxFile, object, context);
            break;
        case object.isFBXCluster:
            exportFBXCluster(fbxFile, object, context);
            break;
        case object.isFBXPose:
            exportFBXPose(fbxFile, object);
            break;
        case object.isFBXAnimStack:
            exportFBXAnimStack(fbxFile, object, context);
            break;
        case object.isFBXAnimLayer:
            exportFBXAnimLayer(fbxFile, object, context);
            break;
        case object.isFBXAnimCurveNode:
            exportFBXAnimCurveNode(fbxFile, object);
            break;
        case object.isFBXAnimCurve:
            exportFBXAnimCurve(fbxFile, object);
            break;
        default:
            console.log(object);
            throw 'Export of this object is missing';
    }
}
function exportObjectPropertiesConnections(fbxFile, fbxObject, context) {
    exportPropertiesConnections(fbxFile, fbxObject.rootProperty, context);
}
function exportPropertiesConnections(fbxFile, fbxProperty, context /*nodesReferences, nodesConnections*/) {
    fbxProperty.srcObjects.forEach(object => {
        const parentObject = fbxProperty.getParentObject();
        if (!parentObject) {
            return;
        }
        // Ensure the parent object is exported
        context.nodesReferences.add(parentObject);
        context.nodesReferences.add(object);
        context.nodesConnections.add(createConnection(object, parentObject, fbxProperty.hierarchicalName));
        console.log(fbxProperty);
    });
    if (fbxProperty.isCompound()) {
        for (const [key, value] of fbxProperty.value) {
            //console.log(key, value);
            exportPropertiesConnections(fbxFile, value, context /*nodesReferences, nodesConnections*/);
        }
    }
}
function exportNode(fbxFile, node, context /*nodesReferences, nodesConnections, alreadyExported*/) {
    if (context.alreadyExported.has(node)) {
        return;
    }
    exportObjectPropertiesConnections(fbxFile, node, context /*nodesReferences, nodesConnections*/);
    if (node.nodeAttribute) {
        let nodeAttribute = node.nodeAttribute;
        switch (true) {
            case nodeAttribute.isFBXMesh:
                exportMeshNode(fbxFile, node, context);
                break;
            case nodeAttribute.isFBXSkeleton:
                exportSkeletonNode(fbxFile, node, context);
                break;
            case nodeAttribute.isFBXCamera:
                exportCameraNode(fbxFile, node, context);
                break;
            default:
                console.log(nodeAttribute);
                throw 'Error in exportNode: export of this nodeAttribute is missing';
        }
    }
    else {
        throw 'nodeAttribute is null ' + node.id;
    }
    for (let child of node.childs) {
        exportNode(fbxFile, child, context /*nodesReferences, nodesConnections, alreadyExported*/);
    }
}
function exportMeshNode(fbxFile, node, context) {
    // Add the materials for writing
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    node.materials.forEach(material => {
        context.nodesReferences.add(material);
        context.nodesConnections.add(createConnection(material, node));
    });
    node.nodeAttribute.deformers.forEach(deformer => {
        context.nodesReferences.add(deformer);
        context.nodesConnections.add(createConnection(deformer, node.nodeAttribute));
    });
    objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_MESH));
    objectsRecord.addChild(fbxMeshToRecord(node.nodeAttribute));
    context.nodesConnections.add(createConnection(node, node.parent));
    context.nodesConnections.add(createConnection(node.nodeAttribute, node));
}
function exportSkeletonNode(fbxFile, node, context) {
    const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_LIMB_NODE));
    objectsRecord.addChild(fbxSkeletonToRecord(node.nodeAttribute));
    context.nodesConnections.add(createConnection(node, node.parent));
    context.nodesConnections.add(createConnection(node.nodeAttribute, node));
}
function exportCameraNode(fbxFile, node, context) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_CAMERA));
    objectsRecord.addChild(fbxCameraToRecord(node.nodeAttribute));
    context.nodesConnections.add(createConnection(node, node.parent));
    context.nodesConnections.add(createConnection(node.nodeAttribute, node));
}
function createConnection(src, dst, target) {
    return { source: src.id, destination: dst.id, target: target };
}
function exportSurfacePhongObject(fbxFile, fbxSurfacePhong, context /*, nodesReferences, nodesConnections*/) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    let propertyNames = ['diffuse'];
    for (let propertyName of propertyNames) {
        const fbxProperty = fbxSurfacePhong.findProperty(propertyName);
        if (!fbxProperty) {
            continue;
        }
        fbxProperty.srcObjects.forEach(object => {
            context.nodesReferences.add(object);
            context.nodesConnections.add(createConnection(object, fbxSurfacePhong, 'DiffuseColor'));
        });
    }
    objectsRecord.addChild(fbxSurfaceMaterialToRecord(fbxSurfacePhong));
}
function exportFBXTexture(fbxFile, fbxTexture, context /*, nodesReferences, nodesConnections*/) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    let textureMedia = fbxTexture.media;
    if (textureMedia) {
        context.nodesReferences.add(textureMedia);
        context.nodesConnections.add(createConnection(textureMedia, fbxTexture));
    }
    objectsRecord.addChild(fbxTextureToRecord(fbxTexture));
}
function exportFBXVideo(fbxFile, fbxVideo) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    objectsRecord.addChild(createVideoRecord(fbxVideo));
}
function exportFBXSkin(fbxFile, fbxSkin, context /*, nodesReferences, nodesConnections*/) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    fbxSkin.clusters.forEach(cluster => {
        context.nodesReferences.add(cluster);
        context.nodesConnections.add(createConnection(cluster, fbxSkin));
    });
    objectsRecord.addChild(fbxSkinToRecord(fbxSkin));
}
function exportFBXCluster(fbxFile, fbxCluster, context /*, nodesReferences, nodesConnections*/) {
    if (fbxCluster.indexes.length == 0) {
        return;
    }
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    if (fbxCluster.link) {
        context.nodesReferences.add(fbxCluster.link);
        context.nodesConnections.add(createConnection(fbxCluster.link, fbxCluster));
    }
    objectsRecord.addChild(fbxClusterToRecord(fbxCluster));
}
function exportFBXAnimStack(fbxFile, fbxAnimStack, context) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    /*if (fbxAnimStack.link) {
        nodesReferences.add(fbxAnimStack.link);
        nodesConnections.add(createConnection(fbxAnimStack.link, fbxAnimStack));
    }*/
    fbxAnimStack.members.forEach(member => {
        context.nodesReferences.add(member);
        context.nodesConnections.add(createConnection(member, fbxAnimStack));
    });
    objectsRecord.addChild(fbxAnimStackToRecord(fbxAnimStack));
}
function exportFBXAnimLayer(fbxFile, fbxAnimLayer, context) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    fbxAnimLayer.members.forEach(member => {
        context.nodesReferences.add(member);
        context.nodesConnections.add(createConnection(member, fbxAnimLayer));
    });
    objectsRecord.addChild(fbxAnimLayerToRecord(fbxAnimLayer));
}
function exportFBXAnimCurveNode(fbxFile, fbxAnimCurveNode) {
    const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    objectsRecord.addChild(fbxAnimCurveNodeToRecord(fbxAnimCurveNode));
}
function exportFBXAnimCurve(fbxFile, fbxAnimCurve) {
    const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    objectsRecord.addChild(fbxAnimCurveToRecord(fbxAnimCurve));
}
function createConnections(fbxFile, connections) {
    let connectionsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_CONNECTIONS);
    for (let connection of connections) {
        connectionsRecord.addChild(createConnectionRecord(connection.source, connection.destination, connection.target));
    }
}
function exportTakes(fbxFile, fbxScene) {
    fbxFile.getRecordByName(FBX_RECORD_NAME_TAKES);
    let srcObjects = fbxScene.srcObjects;
    for (let srcObject of srcObjects) {
        if (srcObject.isFBXAnimStack) ;
    }
}
function exportFBXPose(fbxFile, fbxPose) {
    let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
    objectsRecord.addChild(fbxPoseToRecord(fbxPose));
}

const FBX_TC_LEGACY_MILLISECOND = 46186158n;
const FBX_TC_LEGACY_SECOND = FBX_TC_LEGACY_MILLISECOND * 1000n;
const FBX_TC_MILLISECOND = 141120n;
const FBX_TC_SECOND = FBX_TC_MILLISECOND * 1000n;
const FBX_TC_MINUTE = FBX_TC_SECOND * 60n;
const FBX_TC_HOUR = FBX_TC_MINUTE * 60n;
const FBX_TC_DAY = FBX_TC_MINUTE * 24n;

var MappingMode;
(function (MappingMode) {
    MappingMode[MappingMode["None"] = 0] = "None";
    MappingMode[MappingMode["ControlPoint"] = 1] = "ControlPoint";
    MappingMode[MappingMode["PolygonVertex"] = 2] = "PolygonVertex";
    MappingMode[MappingMode["Polygon"] = 3] = "Polygon";
    MappingMode[MappingMode["Edge"] = 4] = "Edge";
    MappingMode[MappingMode["AllSame"] = 5] = "AllSame";
})(MappingMode || (MappingMode = {}));
const FBX_MAPPING_MODE_NONE = 0;
const FBX_MAPPING_MODE_CONTROL_POINT = 1;
const FBX_MAPPING_MODE_POLYGON_VERTEX = 2;
const FBX_MAPPING_MODE_POLYGON = 3;
const FBX_MAPPING_MODE_EDGE = 4;
const FBX_MAPPING_MODE_ALL_SAME = 5;

const FBX_PROJECTION_TYPE_PERSPECTIVE = 0;
const FBX_PROJECTION_TYPE_ORTHOGONAL = 1;

var ReferenceMode;
(function (ReferenceMode) {
    ReferenceMode[ReferenceMode["Direct"] = 0] = "Direct";
    ReferenceMode[ReferenceMode["Index"] = 1] = "Index";
    ReferenceMode[ReferenceMode["IndexToDirect"] = 2] = "IndexToDirect";
})(ReferenceMode || (ReferenceMode = {}));
// TODO: remove
const FBX_REFERENCE_MODE_DIRECT = 0;
const FBX_REFERENCE_MODE_INDEX = 1;
const FBX_REFERENCE_MODE_INDEX_TO_DIRECT = 2;

var SkeletonType;
(function (SkeletonType) {
    SkeletonType[SkeletonType["Root"] = 0] = "Root";
    SkeletonType[SkeletonType["Limb"] = 1] = "Limb";
    SkeletonType[SkeletonType["LimbNode"] = 2] = "LimbNode";
    SkeletonType[SkeletonType["Effector"] = 3] = "Effector";
})(SkeletonType || (SkeletonType = {}));
// TODO: remove these
const FBX_SKELETON_TYPE_ROOT = 0;
const FBX_SKELETON_TYPE_LIMB = 1;
const FBX_SKELETON_TYPE_LIMB_NODE = 2;
const FBX_SKELETON_TYPE_EFFECTOR = 3;

var TimeMode;
(function (TimeMode) {
    TimeMode[TimeMode["Default"] = 0] = "Default";
    TimeMode[TimeMode["Frames120"] = 1] = "Frames120";
    TimeMode[TimeMode["Frames100"] = 2] = "Frames100";
    TimeMode[TimeMode["Frames60"] = 3] = "Frames60";
    TimeMode[TimeMode["Frames50"] = 4] = "Frames50";
    TimeMode[TimeMode["Frames48"] = 5] = "Frames48";
    TimeMode[TimeMode["Frames30"] = 6] = "Frames30";
    TimeMode[TimeMode["Frames30Drop"] = 7] = "Frames30Drop";
    TimeMode[TimeMode["NtscDropFrame"] = 8] = "NtscDropFrame";
    TimeMode[TimeMode["NtscFullFrame"] = 9] = "NtscFullFrame";
    TimeMode[TimeMode["Pal"] = 10] = "Pal";
    TimeMode[TimeMode["Frames24"] = 11] = "Frames24";
    TimeMode[TimeMode["Frames1000"] = 12] = "Frames1000";
    TimeMode[TimeMode["FilmFullFrame"] = 13] = "FilmFullFrame";
    TimeMode[TimeMode["Custom"] = 14] = "Custom";
    TimeMode[TimeMode["Frames96"] = 15] = "Frames96";
    TimeMode[TimeMode["Frames72"] = 16] = "Frames72";
    TimeMode[TimeMode["Frames59_94"] = 17] = "Frames59_94";
    TimeMode[TimeMode["Frames119_88"] = 18] = "Frames119_88";
})(TimeMode || (TimeMode = {}));
// TODO: remove those
const FBX_TIME_MODE_DEFAULT = 0;
const FBX_TIME_MODE_FRAMES_120 = 1;
const FBX_TIME_MODE_FRAMES_100 = 2;
const FBX_TIME_MODE_FRAMES_60 = 3;
const FBX_TIME_MODE_FRAMES_50 = 4;
const FBX_TIME_MODE_FRAMES_48 = 5;
const FBX_TIME_MODE_FRAMES_30 = 6;
const FBX_TIME_MODE_FRAMES_30_DROP = 7;
const FBX_TIME_MODE_NTSC_DROP_FRAME = 8;
const FBX_TIME_MODE_NTSC_FULL_FRAME = 9;
const FBX_TIME_MODE_PAL = 10;
const FBX_TIME_MODE_FRAMES_24 = 11;
const FBX_TIME_MODE_FRAMES_1000 = 12;
const FBX_TIME_MODE_FILM_FULL_FRAME = 13;
const FBX_TIME_MODE_CUSTOM = 14;
const FBX_TIME_MODE_FRAMES_96 = 15;
const FBX_TIME_MODE_FRAMES_72 = 16;
const FBX_TIME_MODE_FRAMES_59_94 = 17;
const FBX_TIME_MODE_FRAMES_119_88 = 18;
const FBX_TIME_MODE_FRAMES = [
    30,
    120,
    100,
    60,
    50,
    48,
    30,
    30,
    29.97,
    29.97,
    25,
    24,
    1000,
    23.976,
    -1,
    96,
    72,
    59.94,
    119.88,
];

var TimeProtocol;
(function (TimeProtocol) {
    TimeProtocol[TimeProtocol["Smpte"] = 0] = "Smpte";
    TimeProtocol[TimeProtocol["FrameCount"] = 1] = "FrameCount";
    TimeProtocol[TimeProtocol["Default"] = 2] = "Default";
})(TimeProtocol || (TimeProtocol = {}));
// TODO: remove those
const FBX_TIME_PROTOCOL_SMPTE = 0;
const FBX_TIME_PROTOCOL_FRAME_COUNT = 1;
const FBX_TIME_PROTOCOL_DEFAULT = 2;

class FBXTime {
    static #globalTimeMode = TimeMode.Frames30;
    static #globalTimeProtocol = TimeProtocol.FrameCount;
    #time = 0n;
    constructor(time = 0n) {
        this.time = time;
    }
    set time(time) {
        this.#time = time;
    }
    get time() {
        return this.#time;
    }
    copy(other) {
        this.#time = other.#time;
    }
    static setGlobalTimeMode(timeMode, frameRate = 0) {
        FBXTime.#globalTimeMode = timeMode;
    }
    static getGlobalTimeMode() {
        return FBXTime.#globalTimeMode;
    }
    static setGlobalTimeProtocol(timeProtocol) {
        FBXTime.#globalTimeProtocol = timeProtocol;
    }
    static getGlobalTimeProtocol() {
        return FBXTime.#globalTimeProtocol;
    }
    static getFrameRate(timeMode) {
        const frameRate = FBX_TIME_MODE_FRAMES[timeMode];
        if (frameRate === -1) {
            throw 'return global frame rate';
        }
        else {
            return frameRate;
        }
    }
    static convertFrameRateToTimeMode(frameRate, precision = 1e-8) {
        const lowRate = frameRate - precision;
        const highRate = frameRate + precision;
        for (let i = 1, l = FBX_TIME_MODE_FRAMES.length; i < l; ++i) {
            const targetFrameRate = FBX_TIME_MODE_FRAMES[i];
            if ((targetFrameRate >= lowRate) && (targetFrameRate <= highRate)) {
                return i;
            }
        }
        return FBX_TIME_MODE_DEFAULT;
    }
    static getOneFrameValue(timeMode) {
        const frameRate = FBXTime.getFrameRate(timeMode);
        return BigInt(Math.round(Number(FBX_TC_SECOND) / frameRate));
    }
    setMilliSeconds(milliSeconds) {
        this.#time = BigInt(milliSeconds) * FBX_TC_MILLISECOND;
    }
    getMilliSeconds() {
        return this.#time / FBX_TC_MILLISECOND;
    }
    setSecondDouble(seconds) {
        this.#time = BigInt(Math.round(Number(FBX_TC_SECOND) * seconds));
    }
    getSecondDouble() {
        return Number(this.#time) / Number(FBX_TC_SECOND);
    }
    setTime(hour, minute, second, frame = 0, field = 0, timeMode = FBX_TIME_MODE_DEFAULT) {
        this.#time = BigInt(hour) * FBX_TC_HOUR +
            BigInt(minute) * FBX_TC_MINUTE +
            BigInt(second) * FBX_TC_SECOND +
            BigInt(frame) * FBXTime.getOneFrameValue(timeMode);
    }
}

class FBXAnimCurveKey {
    #time = new FBXTime();
    #value = 0;
    isFBXAnimCurveKey = true;
    constructor(time, value) {
        this.#set(time, value);
    }
    set(time, value) {
        this.#set(time, value);
    }
    #set(time, value) {
        if (time) {
            this.#time.copy(time);
        }
        if (value !== undefined) {
            this.#value = value;
        }
    }
    get time() {
        return this.#time;
    }
}

class FBXBone {
    #id = getUniqueId();
    #name;
    constructor(name) {
        this.#name = name;
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
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
        };
    }
}

class FBXLayer {
    isFBXLayer = true;
}

class FBXLayerElement {
    #mappingMode = MappingMode.AllSame;
    #referenceMode = ReferenceMode.Direct;
    #name = '';
    isFBXLayerElement = true;
    constructor(name = '') {
        this.name = name;
    }
    set mappingMode(mappingMode) {
        this.#mappingMode = mappingMode;
    }
    get mappingMode() {
        return this.#mappingMode;
    }
    set referenceMode(referenceMode) {
        this.#referenceMode = referenceMode;
    }
    get referenceMode() {
        return this.#referenceMode;
    }
    set name(name) {
        this.#name = name;
    }
    get name() {
        return this.#name;
    }
}

class FBXLayerElementTemplate extends FBXLayerElement {
    #directArray = [];
    #indexArray = [];
    isFBXLayerElementTemplate = true;
    get directArray() {
        return this.#directArray;
    }
    get indexArray() {
        return this.#indexArray;
    }
}

class FBXLayerElementMaterial extends FBXLayerElementTemplate {
    isFBXLayerElementMaterial = true;
}

class FBXTimeSpan {
    #start = new FBXTime();
    #stop = new FBXTime();
    constructor() {
    }
    set start(start) {
        this.#start = start;
    }
    get start() {
        return this.#start;
    }
    set stop(stop) {
        this.#stop = stop;
    }
    get stop() {
        return this.#stop;
    }
}

class FBXTakeInfo {
    #name = '';
    #localTimeSpan = new FBXTimeSpan();
    #referenceTimeSpan = new FBXTimeSpan();
    constructor() {
    }
    set name(name) {
        this.#name = name;
    }
    get name() {
        return this.#name;
    }
    set localTimeSpan(localTimeSpan) {
        this.#localTimeSpan = localTimeSpan;
    }
    get localTimeSpan() {
        return this.#localTimeSpan;
    }
    set referenceTimeSpan(referenceTimeSpan) {
        this.#referenceTimeSpan = referenceTimeSpan;
    }
    get referenceTimeSpan() {
        return this.#referenceTimeSpan;
    }
}

export { FBXAnimCurveKey, FBXAxisSystem, FBXBone, FBXCamera, FBXCluster, FBXExporter, FBXFile, FBXGlobalSettings, FBXImporter, FBXLayer, FBXLayerElementMaterial, FBXManager, FBXMesh, FBXNode, FBXPose, FBXScene, FBXSkeleton, FBXSkin, FBXSurfacePhong, FBXTakeInfo, FBXTexture, FBXTime, FBXTimeSpan, FBXVideo, FBX_BINARY_MAGIC, FBX_DATA_LEN, FBX_DATA_TYPE_ARRAY_DOUBLE, FBX_DATA_TYPE_ARRAY_FLOAT, FBX_DATA_TYPE_ARRAY_INT_32, FBX_DATA_TYPE_ARRAY_INT_64, FBX_DATA_TYPE_ARRAY_INT_8, FBX_DATA_TYPE_DOUBLE, FBX_DATA_TYPE_FLOAT, FBX_DATA_TYPE_INT_16, FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_INT_64, FBX_DATA_TYPE_INT_8, FBX_DATA_TYPE_RAW, FBX_DATA_TYPE_STRING, FBX_DEFORMER_CLUSTER_VERSION, FBX_DEFORMER_SKIN_VERSION, FBX_GEOMETRY_BINORMAL_VERSION, FBX_GEOMETRY_LAYER_VERSION, FBX_GEOMETRY_MATERIAL_VERSION, FBX_GEOMETRY_NORMAL_VERSION, FBX_GEOMETRY_TANGENT_VERSION, FBX_GEOMETRY_UV_VERSION, FBX_GEOMETRY_VERSION, FBX_HEADER_VERSION, FBX_INHERIT_TYPE_CHILD_ROTATION_FIRST, FBX_INHERIT_TYPE_PARENT_SCALING_FIRST, FBX_INHERIT_TYPE_PARENT_SCALING_IGNORED, FBX_KTIME, FBX_MAPPING_MODE_ALL_SAME, FBX_MAPPING_MODE_CONTROL_POINT, FBX_MAPPING_MODE_EDGE, FBX_MAPPING_MODE_NONE, FBX_MAPPING_MODE_POLYGON, FBX_MAPPING_MODE_POLYGON_VERTEX, FBX_MATERIAL_VERSION, FBX_MODELS_VERSION, FBX_NODE_ATTRIBUTE_TYPE_BOUNDARY, FBX_NODE_ATTRIBUTE_TYPE_CACHED_EFFECT, FBX_NODE_ATTRIBUTE_TYPE_CAMERA, FBX_NODE_ATTRIBUTE_TYPE_CAMERA_STEREO, FBX_NODE_ATTRIBUTE_TYPE_CAMERA_SWITCHER, FBX_NODE_ATTRIBUTE_TYPE_LIGHT, FBX_NODE_ATTRIBUTE_TYPE_LOD_GROUP, FBX_NODE_ATTRIBUTE_TYPE_MARKER, FBX_NODE_ATTRIBUTE_TYPE_MESH, FBX_NODE_ATTRIBUTE_TYPE_NULL, FBX_NODE_ATTRIBUTE_TYPE_NURBS, FBX_NODE_ATTRIBUTE_TYPE_NURBS_CURVE, FBX_NODE_ATTRIBUTE_TYPE_NURBS_SURFACE, FBX_NODE_ATTRIBUTE_TYPE_OPTICAL_MARKER, FBX_NODE_ATTRIBUTE_TYPE_OPTICAL_REFERENCE, FBX_NODE_ATTRIBUTE_TYPE_PATCH, FBX_NODE_ATTRIBUTE_TYPE_SHAPE, FBX_NODE_ATTRIBUTE_TYPE_SKELETON, FBX_NODE_ATTRIBUTE_TYPE_SUB_DIV, FBX_NODE_ATTRIBUTE_TYPE_TRIM_NURBS_SURFACE, FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN, FBX_POSE_BIND_VERSION, FBX_PROJECTION_TYPE_ORTHOGONAL, FBX_PROJECTION_TYPE_PERSPECTIVE, FBX_PROPERTY_FLAG_ANIMATABLE, FBX_PROPERTY_FLAG_ANIMATED, FBX_PROPERTY_FLAG_HIDDEN, FBX_PROPERTY_FLAG_IMPORTED, FBX_PROPERTY_FLAG_LOCKED_ALL, FBX_PROPERTY_FLAG_LOCKED_MEMBER_0, FBX_PROPERTY_FLAG_LOCKED_MEMBER_1, FBX_PROPERTY_FLAG_LOCKED_MEMBER_2, FBX_PROPERTY_FLAG_LOCKED_MEMBER_3, FBX_PROPERTY_FLAG_MUTED_ALL, FBX_PROPERTY_FLAG_MUTED_MEMBER_0, FBX_PROPERTY_FLAG_MUTED_MEMBER_1, FBX_PROPERTY_FLAG_MUTED_MEMBER_2, FBX_PROPERTY_FLAG_MUTED_MEMBER_3, FBX_PROPERTY_FLAG_NONE, FBX_PROPERTY_FLAG_NOT_SAVABLE, FBX_PROPERTY_FLAG_STATIC, FBX_PROPERTY_FLAG_USER_DEFINED, FBX_PROPERTY_TYPE_BOOL, FBX_PROPERTY_TYPE_COLOR_3, FBX_PROPERTY_TYPE_COMPOUND, FBX_PROPERTY_TYPE_DOUBLE, FBX_PROPERTY_TYPE_DOUBLE_3, FBX_PROPERTY_TYPE_ENUM, FBX_PROPERTY_TYPE_STRING, FBX_PROPERTY_TYPE_TIME, FBX_RECORD_NAME_CONNECTIONS, FBX_RECORD_NAME_CREATOR, FBX_RECORD_NAME_OBJECTS, FBX_RECORD_NAME_REFERENCES, FBX_RECORD_NAME_TAKES, FBX_REFERENCE_MODE_DIRECT, FBX_REFERENCE_MODE_INDEX, FBX_REFERENCE_MODE_INDEX_TO_DIRECT, FBX_SCENEINFO_VERSION, FBX_SKELETON_TYPE_EFFECTOR, FBX_SKELETON_TYPE_LIMB, FBX_SKELETON_TYPE_LIMB_NODE, FBX_SKELETON_TYPE_ROOT, FBX_SKINNING_TYPE_BLEND, FBX_SKINNING_TYPE_DUAL_QUATERNION, FBX_SKINNING_TYPE_LINEAR, FBX_SKINNING_TYPE_RIGID, FBX_TC_DAY, FBX_TC_HOUR, FBX_TC_LEGACY_MILLISECOND, FBX_TC_LEGACY_SECOND, FBX_TC_MILLISECOND, FBX_TC_MINUTE, FBX_TC_SECOND, FBX_TEMPLATES_VERSION, FBX_TEXTURE_VERSION, FBX_TIME_MODE_CUSTOM, FBX_TIME_MODE_DEFAULT, FBX_TIME_MODE_FILM_FULL_FRAME, FBX_TIME_MODE_FRAMES, FBX_TIME_MODE_FRAMES_100, FBX_TIME_MODE_FRAMES_1000, FBX_TIME_MODE_FRAMES_119_88, FBX_TIME_MODE_FRAMES_120, FBX_TIME_MODE_FRAMES_24, FBX_TIME_MODE_FRAMES_30, FBX_TIME_MODE_FRAMES_30_DROP, FBX_TIME_MODE_FRAMES_48, FBX_TIME_MODE_FRAMES_50, FBX_TIME_MODE_FRAMES_59_94, FBX_TIME_MODE_FRAMES_60, FBX_TIME_MODE_FRAMES_72, FBX_TIME_MODE_FRAMES_96, FBX_TIME_MODE_NTSC_DROP_FRAME, FBX_TIME_MODE_NTSC_FULL_FRAME, FBX_TIME_MODE_PAL, FBX_TIME_PROTOCOL_DEFAULT, FBX_TIME_PROTOCOL_FRAME_COUNT, FBX_TIME_PROTOCOL_SMPTE, FBX_TYPE_BLOB, FBX_TYPE_BOOL, FBX_TYPE_CHAR, FBX_TYPE_COUNT, FBX_TYPE_DATE_TIME, FBX_TYPE_DISTANCE, FBX_TYPE_DOUBLE, FBX_TYPE_DOUBLE2, FBX_TYPE_DOUBLE3, FBX_TYPE_DOUBLE4, FBX_TYPE_DOUBLE4x4, FBX_TYPE_ENUM, FBX_TYPE_ENUM_M, FBX_TYPE_FLOAT, FBX_TYPE_HALF_FLOAT, FBX_TYPE_INT, FBX_TYPE_LONG_LONG, FBX_TYPE_REFERENCE, FBX_TYPE_SHORT, FBX_TYPE_STRING, FBX_TYPE_TIME, FBX_TYPE_UNDEFINED, FBX_TYPE_U_CHAR, FBX_TYPE_U_INT, FBX_TYPE_U_LONG_LONG, FBX_TYPE_U_SHORT, FbxPropertyType, FbxType, MappingMode, ReferenceMode, SkeletonType, TimeMode, TimeProtocol, createDefinitionsRecord, createEmptyFile, createFBXRecord, createFBXRecordDoubleArray, createFBXRecordFloatArray, createFBXRecordInt32Array, createFBXRecordInt64Array, createFBXRecordMultipleBytes, createFBXRecordMultipleDouble, createFBXRecordMultipleFloat, createFBXRecordMultipleInt64, createFBXRecordMultipleStrings, createFBXRecordSingle, createFBXRecordSingleBytes, createFBXRecordSingleDouble, createFBXRecordSingleFloat, createFBXRecordSingleInt32, createFBXRecordSingleInt64, createFBXRecordSingleInt8, createFBXRecordSingleString, createHeaderExtensionRecord, createTakesRecord, fbxNameClass, fbxSceneToFBXFile };
