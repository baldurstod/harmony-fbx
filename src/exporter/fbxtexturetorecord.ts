import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordSingleString } from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property, createInt32Property } from '../utils/createfbxproperty.js';
import { FBX_TEXTURE_VERSION } from '../constants.js';

export function fbxTextureToRecord(fbxTexture) {
	let mediaRecord;
	let filenameRecord;
	let relativeFilenameRecord;
	let textureMedia = fbxTexture.media;
	if (textureMedia) {
		mediaRecord = createFBXRecordSingleString('Media', textureMedia.name + '\x00\x01' + 'Video');
		filenameRecord = createFBXRecordSingleString('FileName', textureMedia.name);
		relativeFilenameRecord = createFBXRecordSingleString('RelativeFilename', textureMedia.name);
	}

	return createFBXRecord('Texture', {
		childs: [
			createFBXRecordSingleString('Type', fbxTexture.type),
			createFBXRecordSingleInt32('Version', FBX_TEXTURE_VERSION),
			createFBXRecordSingleString('TextureName', fbxTexture.name + '\x00\x01' + 'Texture'),
			mediaRecord,
			filenameRecord,
			relativeFilenameRecord,
			createFBXRecord('Properties70', {
				childs: [
					createFBXRecord('P', {
						properties: [
							createStringProperty('UseMaterial'),
							createStringProperty('bool'),
							createStringProperty(''),
							createStringProperty(''),
							createInt32Property(1),
						],
					}),
					/*createFBXRecord('P', {
						properties: [
							createStringProperty('AlphaSource'),
							createStringProperty('enum'),
							createStringProperty(''),
							createStringProperty(''),
							createDoubleProperty(2),
						],
					}),*/
				],
			}),
		],
		properties: [
			createInt64Property(fbxTexture.id),
			createStringProperty(fbxTexture.name + '\x00\x01' + 'Texture'),
			createStringProperty(''),
		],
	});
}
