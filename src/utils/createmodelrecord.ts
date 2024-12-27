import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleInt8, createFBXRecordSingleString } from './createfbxrecord.js';
import { createStringProperty, createInt64Property, createDoubleProperty, createInt32Property } from './createfbxproperty.js';
import { FBX_MODELS_VERSION } from '../constants.js';

export function createModelRecord(fbxModel, type = '') {
	return createFBXRecord('Model', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_MODELS_VERSION),
			createFBXRecord('Properties70', {
				childs: [
					createFBXRecord('P', {
						properties: [
							createStringProperty('Lcl Rotation'),
							createStringProperty('Lcl Rotation'),
							createStringProperty(''),
							createStringProperty('A'),
							createDoubleProperty(-90),
							createDoubleProperty(0),
							createDoubleProperty(0),
						],
					}),
					createFBXRecord('P', {
						properties: [
							createStringProperty('Lcl Scaling'),
							createStringProperty('Lcl Scaling'),
							createStringProperty(''),
							createStringProperty('A'),
							createDoubleProperty(100),
							createDoubleProperty(100),
							createDoubleProperty(100),
						],
					}),
					createFBXRecord('P', {
						properties: [
							createStringProperty('DefaultAttributeIndex'),
							createStringProperty('int'),
							createStringProperty('Integer'),
							createStringProperty(''),
							createInt32Property(0),//TODO :change this value ?
						],
					}),
					createFBXRecord('P', {
						properties: [
							createStringProperty('InheritType'),
							createStringProperty('enum'),
							createStringProperty(''),
							createStringProperty(''),
							createInt32Property(1),//TODO :change this value ?
						],
					}),
				],

			}),
			createFBXRecordSingleInt32('MultiLayer', 0),//What is this ?
			createFBXRecordSingleInt32('MultiTake', 0),//What is this ?
			createFBXRecordSingleInt8('Shading', 1),//What is this ?
			createFBXRecordSingleString('Culling', 'CullingOff'),
		],
		properties: [
			createInt64Property(fbxModel.id),//TODO
			createStringProperty(fbxModel.name + '\x00\x01Model'),
			createStringProperty(type),
		],
	});
}
