import { createFBXRecord } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { FBXAnimLayer } from '../model/fbxanimlayer';

export function fbxAnimLayerToRecord(fbxAnimLayer: FBXAnimLayer) {
	return createFBXRecord('AnimationLayer', {
		properties: [
			createInt64Property(fbxAnimLayer.id),
			createStringProperty(fbxAnimLayer.name + '\x00\x01AnimLayer'),
			createStringProperty(''),
		],
	})
}
