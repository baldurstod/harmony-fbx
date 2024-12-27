import {createStringProperty, createInt64Property} from './createfbxproperty.js';
import {FBXRecord} from '../model/fbxrecord.js';

export function createConnectionRecord(id, parentId, target) {
	let fbxRecord = new FBXRecord('C');
	fbxRecord.addProperty(createStringProperty(target ? 'OP' : 'OO'));
	fbxRecord.addProperty(createInt64Property(id));
	fbxRecord.addProperty(createInt64Property(parentId));
	if (target != undefined) {
		fbxRecord.addProperty(createStringProperty(target));
	}
	return fbxRecord;
}
