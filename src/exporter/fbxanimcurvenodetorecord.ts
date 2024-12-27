import { createFBXRecord } from '../utils/createfbxrecord.js';
import { createStringProperty, createInt64Property } from '../utils/createfbxproperty.js';
import { createPropertiesRecord } from '../utils/createpropertiesrecord.js';

export function fbxAnimCurveNodeToRecord(fbxAnimCurveNode) {
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
