export enum FbxType {
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
	Int64Array = 108,
}

export const FBX_DATA_TYPE_INT_8 = 67;
export const FBX_DATA_TYPE_DOUBLE = 68;
export const FBX_DATA_TYPE_FLOAT = 70;
export const FBX_DATA_TYPE_INT_32 = 73;
export const FBX_DATA_TYPE_INT_64 = 76;
export const FBX_DATA_TYPE_RAW = 82;
export const FBX_DATA_TYPE_STRING = 83;
export const FBX_DATA_TYPE_INT_16 = 89;

export const FBX_DATA_TYPE_ARRAY_INT_8 = 98;
export const FBX_DATA_TYPE_ARRAY_DOUBLE = 100;
export const FBX_DATA_TYPE_ARRAY_FLOAT = 102;
export const FBX_DATA_TYPE_ARRAY_INT_32 = 105;
export const FBX_DATA_TYPE_ARRAY_INT_64 = 108;

export const FBX_DATA_LEN = new Map<FbxType, number>();
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

export const FBX_BINARY_MAGIC = 'Kaydara FBX Binary  \0';

export const FBX_HEADER_VERSION = 1003;
export const FBX_SCENEINFO_VERSION = 100;
export const FBX_TEMPLATES_VERSION = 100;

export const FBX_KTIME = 46186158000n;

export const FBX_GEOMETRY_VERSION = 124;
export const FBX_GEOMETRY_NORMAL_VERSION = 101;
export const FBX_GEOMETRY_BINORMAL_VERSION = 101;
export const FBX_GEOMETRY_TANGENT_VERSION = 101;
export const FBX_GEOMETRY_UV_VERSION = 101;
export const FBX_GEOMETRY_MATERIAL_VERSION = 101;
export const FBX_GEOMETRY_LAYER_VERSION = 100;
export const FBX_MATERIAL_VERSION = 102
export const FBX_TEXTURE_VERSION = 202
export const FBX_DEFORMER_SKIN_VERSION = 101
export const FBX_DEFORMER_CLUSTER_VERSION = 100
export const FBX_POSE_BIND_VERSION = 100

export const FBX_MODELS_VERSION = 232
