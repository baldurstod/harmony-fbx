import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleString } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property, createDoubleProperty } from '../utils/createfbxproperty';
import { FBX_MATERIAL_VERSION } from '../constants';
import { FBXSurfaceMaterial } from '../model/fbxsurfacematerial';

export function fbxSurfaceMaterialToRecord(fbxSurfaceMaterial: FBXSurfaceMaterial) {
	return createFBXRecord('Material', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_MATERIAL_VERSION),
			createFBXRecordSingleString('ShadingModel', 'Phong'),
			createFBXRecordSingleInt32('MultiLayer', 0),//What is this ?
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
