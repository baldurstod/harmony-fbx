import { createFBXRecord } from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty.js';

export function fbxAnimLayerToRecord(fbxAnimLayer) {
	return createFBXRecord('AnimationLayer', {
		properties: [
			createInt64Property(fbxAnimLayer.id),
			createStringProperty(fbxAnimLayer.name + '\x00\x01AnimLayer'),
			createStringProperty(''),
		],
	})
}
