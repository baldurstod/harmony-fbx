import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleDouble } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { FBX_DEFORMER_SKIN_VERSION } from '../constants';
import { FBXSkin } from '../model/fbxskin';

export function fbxSkinToRecord(fbxSkin: FBXSkin) {
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
