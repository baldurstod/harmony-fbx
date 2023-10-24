import {createInt64Property, createStringProperty} from '../utils/createfbxproperty.js';
import {createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleInt64} from '../utils/createfbxrecord.js';
import {createPString, createPObject} from '../utils/createprecord.js';

export function exportFBXScene(fbxScene) {
	let documents = createFBXRecord('Documents', {
		childs: [
			createFBXRecordSingleInt32('Count', 1),
			createFBXRecord('Document', {
				childs: [
					createFBXRecord('Properties70', {
						childs: [
							createPObject('SourceObject'),
							createPString('ActiveAnimStackName', ''),//TODO
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
