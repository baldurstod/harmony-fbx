import { createFBXRecord } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { createPTime } from '../utils/createprecord';
import { FBXAnimStack } from '../model/fbxanimstack';

export function fbxAnimStackToRecord(fbxAnimStack: FBXAnimStack) {
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
