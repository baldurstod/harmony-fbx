import {createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleDouble} from '../utils/createfbxrecord.js';
import {createStringProperty, createInt64Property} from '../utils/createfbxproperty.js';
import {FBX_DEFORMER_SKIN_VERSION} from '../constants.js';

export function fbxSkinToRecord(fbxSkin) {
	return createFBXRecord('Deformer', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_DEFORMER_SKIN_VERSION),
			createFBXRecordSingleDouble('Link_DeformAcuracy', 50.),//TODO
		],
		properties: [
			createInt64Property(fbxSkin.id),
			createStringProperty(fbxSkin.name + '\x00\x01Deformer'),
			createStringProperty('Skin'),
		],
	});
}
