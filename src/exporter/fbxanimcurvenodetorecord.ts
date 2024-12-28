import { createFBXRecord } from '../utils/createfbxrecord';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty';
import { createPropertiesRecord } from '../utils/createpropertiesrecord';
import { FBXAnimCurveNode } from '../model/fbxanimcurvenode';

export function fbxAnimCurveNodeToRecord(fbxAnimCurveNode: FBXAnimCurveNode) {
	return createFBXRecord('AnimationCurveNode', {
		childs: [
			createPropertiesRecord(fbxAnimCurveNode),
		],
		properties: [
			createInt64Property(fbxAnimCurveNode.id),
			createStringProperty(fbxAnimCurveNode.name + '\x00\x01AnimCurveNode'),
			createStringProperty(''),
		],
	})
}
