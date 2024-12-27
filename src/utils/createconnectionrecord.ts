import { createStringProperty, createInt64Property } from './createfbxproperty';
import { FBXRecord } from '../model/fbxrecord';

export function createConnectionRecord(id: bigint, parentId: bigint, target: string | undefined) {
	let fbxRecord = new FBXRecord('C');
	fbxRecord.addProperty(createStringProperty(target ? 'OP' : 'OO'));
	fbxRecord.addProperty(createInt64Property(id));
	fbxRecord.addProperty(createInt64Property(parentId));
	if (target != undefined) {
		fbxRecord.addProperty(createStringProperty(target));
	}
	return fbxRecord;
}
