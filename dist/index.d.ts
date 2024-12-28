export declare function createDefinitionsRecord(): FBXRecord;

export declare function createEmptyFile(creator?: string, appVendor?: string, appName?: string, appVersion?: string): FBXFile;

export declare function createFBXRecord(name: string, options?: {
    [key: string]: any;
}): FBXRecord;

export declare function createFBXRecordDoubleArray(name: string, value: Array<number>): FBXRecord;

export declare function createFBXRecordFloatArray(name: string, value: Array<number>): FBXRecord;

export declare function createFBXRecordInt32Array(name: string, value: Array<number>): FBXRecord;

export declare function createFBXRecordInt64Array(name: string, value: Array<bigint>): FBXRecord;

export declare function createFBXRecordMultipleBytes(name: string, value: Array<Blob>): FBXRecord;

export declare function createFBXRecordMultipleDouble(name: string, value: Array<number>): FBXRecord;

export declare function createFBXRecordMultipleFloat(name: string, value: Array<number>): FBXRecord;

export declare function createFBXRecordMultipleInt64(name: string, value: Array<bigint>): FBXRecord;

export declare function createFBXRecordMultipleStrings(name: string, values: Array<string>): FBXRecord;

export declare function createFBXRecordSingle(name: string, type: FbxType, value: any): FBXRecord;

export declare function createFBXRecordSingleBytes(name: string, value: Blob | undefined): FBXRecord;

export declare function createFBXRecordSingleDouble(name: string, value: number): FBXRecord;

export declare function createFBXRecordSingleFloat(name: string, value: number): FBXRecord;

export declare function createFBXRecordSingleInt32(name: string, value: number): FBXRecord;

export declare function createFBXRecordSingleInt64(name: string, value: bigint): FBXRecord;

export declare function createFBXRecordSingleInt8(name: string, value: number): FBXRecord;

export declare function createFBXRecordSingleString(name: string, value: string): FBXRecord;

export declare function createHeaderExtensionRecord(fbxFile: FBXFile, creator: string, appVendor: string, appName: string, appVersion: string): FBXRecord;

export declare function createTakesRecord(): FBXRecord;

export declare const FBX_BINARY_MAGIC = "Kaydara FBX Binary  \0";

export declare const FBX_DATA_LEN: Map<FbxType, number>;

export declare const FBX_DATA_TYPE_ARRAY_DOUBLE = 100;

export declare const FBX_DATA_TYPE_ARRAY_FLOAT = 102;

export declare const FBX_DATA_TYPE_ARRAY_INT_32 = 105;

export declare const FBX_DATA_TYPE_ARRAY_INT_64 = 108;

export declare const FBX_DATA_TYPE_ARRAY_INT_8 = 98;

export declare const FBX_DATA_TYPE_DOUBLE = 68;

export declare const FBX_DATA_TYPE_FLOAT = 70;

export declare const FBX_DATA_TYPE_INT_16 = 89;

export declare const FBX_DATA_TYPE_INT_32 = 73;

export declare const FBX_DATA_TYPE_INT_64 = 76;

export declare const FBX_DATA_TYPE_INT_8 = 67;

export declare const FBX_DATA_TYPE_RAW = 82;

export declare const FBX_DATA_TYPE_STRING = 83;

export declare const FBX_DEFORMER_CLUSTER_VERSION = 100;

export declare const FBX_DEFORMER_SKIN_VERSION = 101;

export declare const FBX_GEOMETRY_BINORMAL_VERSION = 101;

export declare const FBX_GEOMETRY_LAYER_VERSION = 100;

export declare const FBX_GEOMETRY_MATERIAL_VERSION = 101;

export declare const FBX_GEOMETRY_NORMAL_VERSION = 101;

export declare const FBX_GEOMETRY_TANGENT_VERSION = 101;

export declare const FBX_GEOMETRY_UV_VERSION = 101;

export declare const FBX_GEOMETRY_VERSION = 124;

export declare const FBX_HEADER_VERSION = 1003;

export declare const FBX_INHERIT_TYPE_CHILD_ROTATION_FIRST = 0;

export declare const FBX_INHERIT_TYPE_PARENT_SCALING_FIRST = 1;

export declare const FBX_INHERIT_TYPE_PARENT_SCALING_IGNORED = 1;

export declare const FBX_KTIME = 46186158000n;

export declare const FBX_MAPPING_MODE_ALL_SAME = 5;

export declare const FBX_MAPPING_MODE_CONTROL_POINT = 1;

export declare const FBX_MAPPING_MODE_EDGE = 4;

export declare const FBX_MAPPING_MODE_NONE = 0;

export declare const FBX_MAPPING_MODE_POLYGON = 3;

export declare const FBX_MAPPING_MODE_POLYGON_VERTEX = 2;

export declare const FBX_MATERIAL_VERSION = 102;

export declare const FBX_MODELS_VERSION = 232;

export declare const FBX_NODE_ATTRIBUTE_TYPE_BOUNDARY = 15;

export declare const FBX_NODE_ATTRIBUTE_TYPE_CACHED_EFFECT = 20;

export declare const FBX_NODE_ATTRIBUTE_TYPE_CAMERA = 7;

export declare const FBX_NODE_ATTRIBUTE_TYPE_CAMERA_STEREO = 8;

export declare const FBX_NODE_ATTRIBUTE_TYPE_CAMERA_SWITCHER = 9;

export declare const FBX_NODE_ATTRIBUTE_TYPE_LIGHT = 10;

export declare const FBX_NODE_ATTRIBUTE_TYPE_LOD_GROUP = 18;

export declare const FBX_NODE_ATTRIBUTE_TYPE_MARKER = 2;

export declare const FBX_NODE_ATTRIBUTE_TYPE_MESH = 4;

export declare const FBX_NODE_ATTRIBUTE_TYPE_NULL = 1;

export declare const FBX_NODE_ATTRIBUTE_TYPE_NURBS = 5;

export declare const FBX_NODE_ATTRIBUTE_TYPE_NURBS_CURVE = 13;

export declare const FBX_NODE_ATTRIBUTE_TYPE_NURBS_SURFACE = 16;

export declare const FBX_NODE_ATTRIBUTE_TYPE_OPTICAL_MARKER = 12;

export declare const FBX_NODE_ATTRIBUTE_TYPE_OPTICAL_REFERENCE = 11;

export declare const FBX_NODE_ATTRIBUTE_TYPE_PATCH = 6;

export declare const FBX_NODE_ATTRIBUTE_TYPE_SHAPE = 17;

export declare const FBX_NODE_ATTRIBUTE_TYPE_SKELETON = 3;

export declare const FBX_NODE_ATTRIBUTE_TYPE_SUB_DIV = 19;

export declare const FBX_NODE_ATTRIBUTE_TYPE_TRIM_NURBS_SURFACE = 14;

export declare const FBX_NODE_ATTRIBUTE_TYPE_UNKNOWN = 0;

export declare const FBX_POSE_BIND_VERSION = 100;

export declare const FBX_PROJECTION_TYPE_ORTHOGONAL = 1;

export declare const FBX_PROJECTION_TYPE_PERSPECTIVE = 0;

export declare const FBX_PROPERTY_FLAG_ANIMATABLE: number;

export declare const FBX_PROPERTY_FLAG_ANIMATED: number;

export declare const FBX_PROPERTY_FLAG_HIDDEN: number;

export declare const FBX_PROPERTY_FLAG_IMPORTED: number;

export declare const FBX_PROPERTY_FLAG_LOCKED_ALL: number;

export declare const FBX_PROPERTY_FLAG_LOCKED_MEMBER_0: number;

export declare const FBX_PROPERTY_FLAG_LOCKED_MEMBER_1: number;

export declare const FBX_PROPERTY_FLAG_LOCKED_MEMBER_2: number;

export declare const FBX_PROPERTY_FLAG_LOCKED_MEMBER_3: number;

export declare const FBX_PROPERTY_FLAG_MUTED_ALL: number;

export declare const FBX_PROPERTY_FLAG_MUTED_MEMBER_0: number;

export declare const FBX_PROPERTY_FLAG_MUTED_MEMBER_1: number;

export declare const FBX_PROPERTY_FLAG_MUTED_MEMBER_2: number;

export declare const FBX_PROPERTY_FLAG_MUTED_MEMBER_3: number;

export declare const FBX_PROPERTY_FLAG_NONE = 0;

export declare const FBX_PROPERTY_FLAG_NOT_SAVABLE: number;

export declare const FBX_PROPERTY_FLAG_STATIC: number;

export declare const FBX_PROPERTY_FLAG_USER_DEFINED: number;

export declare const FBX_PROPERTY_TYPE_BOOL = 5000;

export declare const FBX_PROPERTY_TYPE_COLOR_3 = 3000;

export declare const FBX_PROPERTY_TYPE_COMPOUND = 2000;

export declare const FBX_PROPERTY_TYPE_DOUBLE = 50;

export declare const FBX_PROPERTY_TYPE_DOUBLE_3 = 100;

export declare const FBX_PROPERTY_TYPE_ENUM = 1000;

export declare const FBX_PROPERTY_TYPE_STRING = 200;

export declare const FBX_PROPERTY_TYPE_TIME = 300;

export declare const FBX_RECORD_NAME_CONNECTIONS = "Connections";

export declare const FBX_RECORD_NAME_CREATOR = "Creator";

export declare const FBX_RECORD_NAME_OBJECTS = "Objects";

export declare const FBX_RECORD_NAME_REFERENCES = "References";

export declare const FBX_RECORD_NAME_TAKES = "Takes";

export declare const FBX_REFERENCE_MODE_DIRECT = 0;

export declare const FBX_REFERENCE_MODE_INDEX = 1;

export declare const FBX_REFERENCE_MODE_INDEX_TO_DIRECT = 2;

export declare const FBX_SCENEINFO_VERSION = 100;

export declare const FBX_SKELETON_TYPE_EFFECTOR = 3;

export declare const FBX_SKELETON_TYPE_LIMB = 1;

export declare const FBX_SKELETON_TYPE_LIMB_NODE = 2;

export declare const FBX_SKELETON_TYPE_ROOT = 0;

export declare const FBX_SKINNING_TYPE_BLEND = 3;

export declare const FBX_SKINNING_TYPE_DUAL_QUATERNION = 2;

export declare const FBX_SKINNING_TYPE_LINEAR = 1;

export declare const FBX_SKINNING_TYPE_RIGID = 0;

export declare const FBX_TC_DAY: bigint;

export declare const FBX_TC_HOUR: bigint;

export declare const FBX_TC_LEGACY_MILLISECOND = 46186158n;

export declare const FBX_TC_LEGACY_SECOND: bigint;

export declare const FBX_TC_MILLISECOND = 141120n;

export declare const FBX_TC_MINUTE: bigint;

export declare const FBX_TC_SECOND: bigint;

export declare const FBX_TEMPLATES_VERSION = 100;

export declare const FBX_TEXTURE_VERSION = 202;

export declare const FBX_TIME_MODE_CUSTOM = 14;

export declare const FBX_TIME_MODE_DEFAULT = 0;

export declare const FBX_TIME_MODE_FILM_FULL_FRAME = 13;

export declare const FBX_TIME_MODE_FRAMES: number[];

export declare const FBX_TIME_MODE_FRAMES_100 = 2;

export declare const FBX_TIME_MODE_FRAMES_1000 = 12;

export declare const FBX_TIME_MODE_FRAMES_119_88 = 18;

export declare const FBX_TIME_MODE_FRAMES_120 = 1;

export declare const FBX_TIME_MODE_FRAMES_24 = 11;

export declare const FBX_TIME_MODE_FRAMES_30 = 6;

export declare const FBX_TIME_MODE_FRAMES_30_DROP = 7;

export declare const FBX_TIME_MODE_FRAMES_48 = 5;

export declare const FBX_TIME_MODE_FRAMES_50 = 4;

export declare const FBX_TIME_MODE_FRAMES_59_94 = 17;

export declare const FBX_TIME_MODE_FRAMES_60 = 3;

export declare const FBX_TIME_MODE_FRAMES_72 = 16;

export declare const FBX_TIME_MODE_FRAMES_96 = 15;

export declare const FBX_TIME_MODE_NTSC_DROP_FRAME = 8;

export declare const FBX_TIME_MODE_NTSC_FULL_FRAME = 9;

export declare const FBX_TIME_MODE_PAL = 10;

export declare const FBX_TIME_PROTOCOL_DEFAULT = 2;

export declare const FBX_TIME_PROTOCOL_FRAME_COUNT = 1;

export declare const FBX_TIME_PROTOCOL_SMPTE = 0;

export declare const FBX_TYPE_BLOB = 21;

export declare const FBX_TYPE_BOOL = 9;

export declare const FBX_TYPE_CHAR = 1;

export declare const FBX_TYPE_COUNT = 24;

export declare const FBX_TYPE_DATE_TIME = 23;

export declare const FBX_TYPE_DISTANCE = 22;

export declare const FBX_TYPE_DOUBLE = 12;

export declare const FBX_TYPE_DOUBLE2 = 13;

export declare const FBX_TYPE_DOUBLE3 = 14;

export declare const FBX_TYPE_DOUBLE4 = 15;

export declare const FBX_TYPE_DOUBLE4x4 = 16;

export declare const FBX_TYPE_ENUM = 17;

export declare const FBX_TYPE_ENUM_M = -17;

export declare const FBX_TYPE_FLOAT = 11;

export declare const FBX_TYPE_HALF_FLOAT = 8;

export declare const FBX_TYPE_INT = 10;

export declare const FBX_TYPE_LONG_LONG = 6;

export declare const FBX_TYPE_REFERENCE = 20;

export declare const FBX_TYPE_SHORT = 3;

export declare const FBX_TYPE_STRING = 18;

export declare const FBX_TYPE_TIME = 19;

export declare const FBX_TYPE_U_CHAR = 2;

export declare const FBX_TYPE_U_INT = 5;

export declare const FBX_TYPE_U_LONG_LONG = 7;

export declare const FBX_TYPE_U_SHORT = 4;

export declare const FBX_TYPE_UNDEFINED = 0;

export declare class FBXAnimCurveKey {
    #private;
    isFBXAnimCurveKey: boolean;
    constructor(time: FBXTime, value: number);
    set(time: FBXTime, value: number): void;
    get time(): FBXTime;
}

export declare class FBXAxisSystem {
    #private;
    isFBXAxisSystem: boolean;
    constructor(upAxis: number, frontAxis: number);
    set upAxis(upAxis: number);
    get upAxis(): number;
    set frontAxis(frontAxis: number);
    get frontAxis(): number;
    get coordAxis(): number;
}

export declare class FBXBone {
    #private;
    constructor(name: string);
    set id(id: bigint);
    get id(): bigint;
    set name(name: string);
    get name(): string;
    toJSON(): {
        id: bigint;
        name: string;
    };
}

declare class FBXCollection extends FBXObject {
    #private;
    isFBXCollection: boolean;
    add(member: FBXObject): void;
    remove(member: FBXObject): void;
    get count(): number;
    get members(): Set<FBXObject>;
}

declare class FBXColor {
    #private;
    isFBXColor: boolean;
    constructor(red?: number, green?: number, blue?: number, alpha?: number);
    set red(red: number);
    get red(): number;
    set green(green: number);
    get green(): number;
    set blue(blue: number);
    get blue(): number;
    set alpha(alpha: number);
    get alpha(): number;
}

declare class FBXDocument extends FBXCollection {
    #private;
    isFBXDocument: boolean;
    constructor(manager: FBXManager, name: string);
    set documentInfo(documentInfo: FBXDocumentInfo);
    get documentInfo(): FBXDocumentInfo | undefined;
}

declare class FBXDocumentInfo extends FBXObject {
    isFBXDocumentInfo: boolean;
}

export declare class FBXExporter {
    exportBinary(fbxFile: FBXFile): ArrayBufferLike;
}

export declare class FBXFile {
    #private;
    set version(version: number);
    get version(): number;
    addChild(child: FBXRecord): FBXRecord;
    get childs(): Set<FBXRecord>;
    getRecordsByName(recordName: string): FBXRecord[];
    getRecordByName(recordName: string): FBXRecord | undefined;
    set dateCreated(dateCreated: Date);
    get dateCreated(): Date;
    toJSON(): {
        version: number;
        childs: FBXRecord[] | undefined;
    };
}

declare class FBXGlobalSettings extends FBXObject {
    #private;
    isFBXGlobalSettings: boolean;
    set ambientColor(ambientColor: FBXColor);
    get ambientColor(): FBXColor;
    set defaultCamera(defaultCamera: string);
    get defaultCamera(): string;
}

export declare class FBXImporter extends EventTarget {
    #private;
    constructor();
    parse(buffer: Uint8Array): void | FBXFile;
}

export declare class FBXLayer {
    isFBXLayer: boolean;
}

declare class FBXLayerElement {
    #private;
    isFBXLayerElement: boolean;
    constructor(name?: string);
    set mappingMode(mappingMode: MappingMode);
    get mappingMode(): MappingMode;
    set referenceMode(referenceMode: ReferenceMode);
    get referenceMode(): ReferenceMode;
    set name(name: string);
    get name(): string;
}

export declare class FBXLayerElementMaterial extends FBXLayerElementTemplate {
    isFBXLayerElementMaterial: boolean;
}

declare class FBXLayerElementTemplate extends FBXLayerElement {
    #private;
    isFBXLayerElementTemplate: boolean;
    get directArray(): never[];
    get indexArray(): never[];
}

export declare class FBXManager {
    #private;
    isFBXManager: boolean;
    destroy(): void;
    static registerClass(className: string, classConstructor: typeof FBXObject): void;
    createObject(className: string, objectName: string, ...args: Array<any>): FBXObject;
}

export declare function fbxNameClass(name: string, className: string): string;

declare class FBXNode extends FBXObject {
    #private;
    isFBXNode: boolean;
    constructor(manager: FBXManager, name: string);
    set parent(parent: FBXNode | null);
    addChild(child: FBXNode): void;
    removeChild(child: FBXNode): void;
    get childs(): Set<FBXNode>;
    get parent(): FBXNode | null;
    set nodeAttribute(nodeAttribute: FBXNodeAttribute);
    get nodeAttribute(): FBXNodeAttribute | undefined;
    set inheritType(inheritType: number);
    get inheritType(): number;
    set show(show: any);
    get show(): any;
    set localTranslation(localTranslation: FBXProperty);
    get localTranslation(): FBXProperty;
    set localRotation(localRotation: FBXProperty);
    get localRotation(): FBXProperty;
    set localScaling(localScaling: FBXProperty);
    get localScaling(): FBXProperty;
    addMaterial(surfaceMaterial: FBXSurfaceMaterial): void;
    get materials(): FBXSurfaceMaterial[];
    toJSON(): {};
}

declare class FBXNodeAttribute extends FBXObject {
    isFBXNodeAttribute: boolean;
    getAttributeType(): number;
}

declare class FBXObject {
    #private;
    isFBXObject: boolean;
    constructor(manager: FBXManager, name?: string, ...args: Array<any>);
    set id(id: bigint);
    get id(): bigint;
    set name(name: string);
    get name(): string;
    get rootProperty(): FBXProperty;
    get manager(): FBXManager;
    connectSrcObject(object: FBXObject): void;
    get srcObjects(): Set<FBXObject>;
    createProperty(type: FbxPropertyType, name: string, value: any, flags: number): FBXProperty;
    getAllProperties(): Set<FBXProperty>;
    findProperty(propertyName: string): FBXProperty | null;
}

declare class FBXProperty {
    #private;
    isFBXProperty: boolean;
    constructor(parent: FBXObject | FBXProperty | null, type?: FbxPropertyType, name?: string, value?: any, flags?: number);
    get type(): FbxPropertyType;
    set value(value: any);
    get value(): any;
    set(value: any): void;
    get(): any;
    set flags(flags: number);
    get flags(): number;
    set name(name: string);
    get name(): string;
    get hierarchicalName(): string;
    get parent(): FBXObject | FBXProperty | null;
    isCompound(): boolean;
    isRootProperty(): boolean;
    connectSrcObject(object: FBXObject): void;
    get srcObjects(): Set<FBXObject>;
    createProperty(type: FbxPropertyType, name: string, value: any, flags: number): false | FBXProperty;
    getAllProperties(includeSelf?: boolean): Set<FBXProperty>;
    getParentObject(): FBXObject | null;
    findProperty(propertyName: string): FBXProperty | null;
    toJSON(): {
        type: FbxPropertyType;
        value: any;
    };
}

export declare enum FbxPropertyType {
    Double = 50,
    Double3 = 100,
    String = 200,
    Time = 300,
    Enum = 1000,
    Compound = 2000,
    Color3 = 3000,
    Bool = 5000
}

declare class FBXRecord {
    #private;
    isFBXRecord: boolean;
    constructor(name: string);
    addChild(child: FBXRecord): FBXRecord;
    addChilds(childs: Array<FBXRecord>): void;
    addProperty(property: FBXRecordProperty): void;
    addProperties(properties: Array<FBXRecordProperty>): void;
    set name(name: string);
    get name(): string;
    get childs(): Set<FBXRecord>;
    get properties(): Set<FBXRecordProperty>;
    getRecordsByName(recordName: string): FBXRecord[];
    getRecordByName(recordName: string): FBXRecord | undefined;
    getProperty(type: FbxType): any;
    getPropertyInt32(): any;
    getPropertyString(): any;
    toJSON(): {
        name: string;
        childs: FBXRecord[] | undefined;
        properties: FBXRecordProperty[] | undefined;
    };
}

declare class FBXRecordProperty {
    #private;
    isFBXProperty: boolean;
    constructor(parent: FBXRecordProperty | FBXObject | FBXProperty | null, type: FbxType, value: any);
    get type(): FbxType;
    set value(value: any);
    get value(): any;
    set(value: any): void;
    get(): any;
    set flags(flags: number);
    get flags(): number;
    get parent(): FBXObject | FBXProperty | FBXRecordProperty | null;
    connectSrcObject(fbxObject: FBXObject): void;
    get srcObjects(): Set<FBXObject>;
    createProperty(type: FbxType, value: any): FBXRecordProperty;
    toJSON(): {
        type: FbxType;
        value: any;
    };
}

declare class FBXScene extends FBXDocument {
    #private;
    isFBXScene: boolean;
    constructor(manager: FBXManager, name: string);
    set sceneInfo(sceneInfo: FBXDocumentInfo);
    get sceneInfo(): FBXDocumentInfo | undefined;
    get rootNode(): FBXNode;
    get globalSettings(): FBXGlobalSettings;
    addObject(object: FBXObject): void;
    get objects(): Set<FBXObject>;
}

export declare function fbxSceneToFBXFile(scene: FBXScene, creator?: string, appVendor?: string, appName?: string, appVersion?: string): FBXFile;

declare class FBXSurfaceMaterial extends FBXObject {
    #private;
    isFBXSurfaceMaterial: boolean;
    constructor(manager: FBXManager, name: string);
    set shadingModel(shadingModel: any);
    get shadingModel(): any;
    set multiLayer(multiLayer: any);
    get multiLayer(): any;
}

export declare class FBXTakeInfo {
    #private;
    constructor();
    set name(name: string);
    get name(): string;
    set localTimeSpan(localTimeSpan: FBXTimeSpan);
    get localTimeSpan(): FBXTimeSpan;
    set referenceTimeSpan(referenceTimeSpan: FBXTimeSpan);
    get referenceTimeSpan(): FBXTimeSpan;
}

export declare class FBXTime {
    #private;
    constructor(time?: bigint);
    set time(time: bigint);
    get time(): bigint;
    copy(other: FBXTime): void;
    static setGlobalTimeMode(timeMode: TimeMode, frameRate?: number): void;
    static getGlobalTimeMode(): TimeMode;
    static setGlobalTimeProtocol(timeProtocol: TimeProtocol): void;
    static getGlobalTimeProtocol(): TimeProtocol;
    static getFrameRate(timeMode: TimeMode): number;
    static convertFrameRateToTimeMode(frameRate: number, precision?: number): number;
    static getOneFrameValue(timeMode: TimeMode): bigint;
    setMilliSeconds(milliSeconds: number): void;
    getMilliSeconds(): bigint;
    setSecondDouble(seconds: number): void;
    getSecondDouble(): number;
    setTime(hour: number, minute: number, second: number, frame?: number, field?: number, timeMode?: number): void;
}

export declare class FBXTimeSpan {
    #private;
    constructor();
    set start(start: FBXTime);
    get start(): FBXTime;
    set stop(stop: FBXTime);
    get stop(): FBXTime;
}

export declare enum FbxType {
    Int8 = 67,
    Double = 68,
    Float = 70,
    Int32 = 73,
    Int64 = 76,
    Raw = 82,
    String = 83,
    Int16 = 89,
    Int8Array = 98,
    DoubleArray = 100,
    FloatArray = 102,
    Int32Array = 105,
    Int64Array = 108
}

export declare enum MappingMode {
    None = 0,
    ControlPoint = 1,
    PolygonVertex = 2,
    Polygon = 3,
    Edge = 4,
    AllSame = 5
}

export declare enum ReferenceMode {
    Direct = 0,
    Index = 1,
    IndexToDirect = 2
}

export declare enum SkeletonType {
    Root = 0,
    Limb = 1,
    LimbNode = 2,
    Effector = 3
}

export declare enum TimeMode {
    Default = 0,
    Frames120 = 1,
    Frames100 = 2,
    Frames60 = 3,
    Frames50 = 4,
    Frames48 = 5,
    Frames30 = 6,
    Frames30Drop = 7,
    NtscDropFrame = 8,
    NtscFullFrame = 9,
    Pal = 10,
    Frames24 = 11,
    Frames1000 = 12,
    FilmFullFrame = 13,
    Custom = 14,
    Frames96 = 15,
    Frames72 = 16,
    Frames59_94 = 17,
    Frames119_88 = 18
}

export declare enum TimeProtocol {
    Smpte = 0,
    FrameCount = 1,
    Default = 2
}

export { }
