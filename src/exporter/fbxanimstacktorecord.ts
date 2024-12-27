import { createFBXRecord } from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty.js';
import { createPTime } from '../utils/createprecord.js';

export function fbxAnimStackToRecord(fbxAnimStack) {
	return createFBXRecord('AnimationStack', {
		childs: [
			createFBXRecord('Properties70', {
				childs: [
					createPTime('LocalStart', 0n),
					createPTime('LocalStop', 12345678900n),
					createPTime('ReferenceStart', 0n),
					createPTime('ReferenceStop', 12345678900n),
				]
			}),
		],
		properties: [
			createInt64Property(fbxAnimStack.id),
			createStringProperty(fbxAnimStack.name + '\x00\x01AnimStack'),
			createStringProperty('AnimationStack'),
		],
	})
}
