import { createFBXRecord, createFBXRecordSingleString, createFBXRecordSingleBytes, createFBXRecordMultipleStrings } from './createfbxrecord';
import { createStringProperty, createInt64Property } from './createfbxproperty';
import { FBXVideo } from '../model/fbxvideo';

export function createVideoRecord(fbxVideo: FBXVideo) {
	return createFBXRecord('Video', {
		childs: [
			createFBXRecordSingleString('Type', fbxVideo.type),
			createFBXRecordSingleString('RelativeFilename', `mat_${fbxVideo.id}.png`),
			/*createFBXRecordSingleString('Filename', `C:\\Users\\Guillaume\\Desktop\\fbx\\untitled.fbm\\mat_${fbxVideo.id}.png`),*/
			createFBXRecordSingleBytes('Content', fbxVideo.content),
			createFBXRecord('Properties70', {
				childs: [
					createFBXRecordMultipleStrings('P', ['Path', 'KString', 'XRefUrl', '', `C:\\fbx\\untitled.fbm\\mat_${fbxVideo.id}.png`]),
				],
			}),
		],
		properties: [
			createInt64Property(fbxVideo.id),
			createStringProperty(fbxVideo.name + '\x00\x01' + 'Video'),
			createStringProperty('Clip'),
		],
	});
}
