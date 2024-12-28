import { createFBXRecord, createFBXRecordSingleInt32, createFBXRecordMultipleStrings } from '../utils/createfbxrecord';
import { createPInteger, createPDouble, createPColorRGB, createPEnum, createPString, createPTime } from '../utils/createprecord';
import { FBX_KTIME } from '../constants';
import { FBXGlobalSettings } from '../model/fbxglobalsettings';

export function exportFBXGlobalSettings(fbxGlobalSettings: FBXGlobalSettings) {
	let globalSettings = createFBXRecord('GlobalSettings', {
		childs: [
			createFBXRecordSingleInt32('Version', 1000),
			createFBXRecord('Properties70', {
				childs: [
					createPInteger('UpAxis', 1),//TODO
					createPInteger('UpAxisSign', 1),//TODO
					createPInteger('FrontAxis', 2),//TODO
					createPInteger('FrontAxisSign', 1),//TODO
					createPInteger('CoordAxis', 0),//TODO
					createPInteger('CoordAxisSign', 1),//TODO
					createPInteger('OriginalUpAxis', 1),//TODO
					createPInteger('OriginalUpAxisSign', 1),//TODO
					createPDouble('UnitScaleFactor', 1),//TODO
					createPDouble('OriginalUnitScaleFactor', 1),//TODO
					createPColorRGB('AmbientColor', [0, 0, 0]),//TODO
					createPString('DefaultCamera', 'Producer Perspective'),//TODO
					createPEnum('TimeMode', 17),//TODO
					createPTime('TimeSpanStart', 0n),//TODO
					createPTime('TimeSpanStop', FBX_KTIME),//TODO
					createPDouble('CustomFrameRate', -1),//TODO
					createPEnum('TimeProtocol', 2),//TODO
					createPEnum('SnapOnFrameMode', 0),//TODO
					createFBXRecordMultipleStrings('P', ['TimeMarker', 'Compound', '', '']),
					createPInteger('CurrentTimeMarker', -1),//TODO
				]
			}),
		]
	});
	return globalSettings;
}

/*
export function exportFBXGlobalSettings(fbxGlobalSettings) {
	let upVector = fbxGlobalSettings.axisSystem.upVector;
	let frontVector = fbxGlobalSettings.axisSystem.frontVector;
	let coordVector = fbxGlobalSettings.axisSystem.coordVector;

	let globalSettings = createFBXRecord('GlobalSettings', {
		childs: [
			createFBXRecordSingleInt32('Version', 1000),
			createFBXRecord('Properties70', {
				childs: [
					createPInteger('UpAxis', upVector),//TODO
					createPInteger('UpAxisSign', Math.sign(upVector)),//TODO
					createPInteger('FrontAxis', frontVector),//TODO
					createPInteger('FrontAxisSign', Math.sign(frontVector)),//TODO
					createPInteger('CoordAxis', coordVector),//TODO
					createPInteger('CoordAxisSign', Math.sign(coordVector)),//TODO
					createPInteger('OriginalUpAxis', 1),//TODO
					createPInteger('OriginalUpAxisSign', 1),//TODO
					createPDouble('UnitScaleFactor', 1),//TODO
					createPDouble('OriginalUnitScaleFactor', 1),//TODO
					createPColorRGB('AmbientColor', [0, 0, 0]),//TODO
					createPString('DefaultCamera', 'Producer Perspective'),//TODO
					createPEnum('TimeMode', 17),//TODO
					createPTime('TimeSpanStart', 0n),//TODO
					createPTime('TimeSpanStop', FBX_KTIME),//TODO
					createPDouble('CustomFrameRate', -1),//TODO
					createPEnum('TimeProtocol', 2),//TODO
					createPEnum('SnapOnFrameMode', 0),//TODO
					createFBXRecordMultipleStrings('P', ['TimeMarker', 'Compound', '', '']),
					createPInteger('CurrentTimeMarker', -1),//TODO
				]
			}),
		]
	});
	return globalSettings;
}

*/
