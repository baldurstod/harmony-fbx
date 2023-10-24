import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleString } from './createfbxrecord.js';
import { createStringProperty, createInt64Property } from './createfbxproperty.js';
import { FBX_TEXTURE_VERSION } from '../constants.js';

export function createTextureRecord(fbxTexture) {
	return createFBXRecord('Texture', {
		childs: [
			createFBXRecordSingleString('Type', fbxTexture.type),
			createFBXRecordSingleInt32('Version', FBX_TEXTURE_VERSION),
			createFBXRecordSingleString('TextureName', fbxTexture.name + '\x00\x01' + 'Texture'),
		],
		properties: [
			createInt64Property(fbxTexture.id),
			createStringProperty(fbxTexture.name + '\x00\x01' + 'Texture'),
			createStringProperty(''),
		],
	});
}
