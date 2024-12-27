import {createFBXRecord, createFBXRecordSingleInt32, createFBXRecordDoubleArray, createFBXRecordInt32Array, createFBXRecordSingleString} from '../utils/createfbxrecord.js';
import {createStringProperty, createInt64Property, createInt32Property} from '../utils/createfbxproperty.js';
import {FBX_GEOMETRY_VERSION, FBX_GEOMETRY_MATERIAL_VERSION, FBX_GEOMETRY_LAYER_VERSION, FBX_GEOMETRY_UV_VERSION} from '../constants.js';

export function fbxMeshToRecord(fbxMesh) {
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
					createFBXRecordSingleString('Name', 'UVMap'),//TODO: change name
					createFBXRecordSingleString('MappingInformationType', 'ByPolygonVertex'),
					createFBXRecordSingleString('ReferenceInformationType', 'IndexToDirect'),
					createFBXRecordDoubleArray('UV', fbxMesh.uv),//[0.625, 1, 0.625, 0.25, 0.375, 0.5, 0.875, 0.5, 0.625, 0.75, 0.375, 1, 0.375, 0.75, 0.625, 0, 0.375, 0, 0.375, 0.25, 0.125, 0.5, 0.875, 0.75, 0.125, 0.75, 0.625, 0.5]),//TODO
					createFBXRecordInt32Array('UVIndex', fbxMesh.uvIndex),//[13, 3, 11, 4, 6, 4, 0, 5, 8, 7, 1, 9, 10, 2, 6, 12, 2, 13, 4, 6, 9, 1, 13, 2]),//TODO
				],
				properties: [
					createInt32Property(0),//What is this ?
				],
			}),
			createFBXRecord('LayerElementMaterial', {
				childs: [
					createFBXRecordSingleInt32('Version', FBX_GEOMETRY_MATERIAL_VERSION),
					createFBXRecordSingleString('Name', ''),
					createFBXRecordSingleString('MappingInformationType', 'AllSame'),
					createFBXRecordSingleString('ReferenceInformationType', 'IndexToDirect'),
					createFBXRecordInt32Array('Materials', [0]),//TODO
				],
				properties: [
					createInt32Property(0),//What is this ?
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
					createInt32Property(0),//What is this ?
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
