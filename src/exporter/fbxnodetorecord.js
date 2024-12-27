import {fbxPropertyToRecord} from './fbxpropertytorecord.js';
import {createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleInt8, createFBXRecordSingleString} from '../utils/createfbxrecord.js';
import {createStringProperty, createInt64Property, createInt16Property} from '../utils/createfbxproperty.js';
import {createPBool, createPEnum, createPVector3D, createPInteger, createPDouble} from '../utils/createprecord.js';
import { FBX_MODELS_VERSION } from '../constants.js';

export function fbxNodeToRecord(fbxNode, type = '') {
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

					createPBool('RotationActive', 1),
					createPVector3D('ScalingMax', [0, 0, 0]),
					createPDouble('PreferedAngleX', 0),
					createPDouble('PreferedAngleY', 0),
					createPDouble('PreferedAngleZ', 0),
					createPBool('lockInfluenceWeights', 0),
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
			createFBXRecordSingleInt32('MultiLayer', 0),//What is this ?
			createFBXRecordSingleInt32('MultiTake', 0),//What is this ?
			createFBXRecordSingleInt8('Shading', 89),//89 = Y
			createFBXRecordSingleString('Culling', 'CullingOff'),
		],
		properties: [
			createInt64Property(fbxNode.id),//TODO
			createStringProperty(fbxNode.name + '\x00\x01Model'),
			createStringProperty(type),
		],
	});
}
