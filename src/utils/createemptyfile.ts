import { FBX_HEADER_VERSION, FBX_KTIME, FBX_SCENEINFO_VERSION, FBX_TEMPLATES_VERSION } from '../constants';
import { FBX_RECORD_NAME_TAKES } from '../consts/recordsname';
import { FBXFile } from '../model/fbxfile';
import { FBXRecord } from '../model/fbxrecord';
import { createInt64Property, createStringProperty } from './createfbxproperty';
import { createFBXRecord, createFBXRecordMultipleStrings, createFBXRecordSingleInt32, createFBXRecordSingleInt64, createFBXRecordSingleString, fbxNameClass } from './createfbxrecord';
import { createPColorRGB, createPDouble, createPEnum, createPInteger, createPObject, createPString, createPTime } from './createprecord';


export function createEmptyFile(creator = 'harmony-fbx', appVendor = 'harmony-fbx', appName = 'harmony-fbx', appVersion = '1') {
	let fbxFile = new FBXFile();

	//let date = new Date();
	fbxFile.addChild(createHeaderExtensionRecord(fbxFile, creator, appVendor, appName, appVersion));
	fbxFile.addChild(createFBXRecordSingleString('Creator', creator));
	fbxFile.addChild(createGlobalSettingsRecord());
	fbxFile.addChild(createDocumentsRecord());
	fbxFile.addChild(createFBXRecord('References'));
	fbxFile.addChild(createDefinitionsRecord());
	fbxFile.addChild(createFBXRecord('Objects'));
	fbxFile.addChild(createFBXRecord('Connections'));
	fbxFile.addChild(createTakesRecord());

	return fbxFile;
}

export function createHeaderExtensionRecord(fbxFile: FBXFile, creator: string, appVendor: string, appName: string, appVersion: string): FBXRecord {
	let date = new Date();
	let fbxHeaderExtension = createFBXRecord('FBXHeaderExtension', {
		childs: [
			createFBXRecordSingleInt32('FBXHeaderVersion', FBX_HEADER_VERSION),
			createFBXRecordSingleInt32('FBXVersion', fbxFile.version),
			createFBXRecordSingleInt32('EncryptionType', 0),
			createFBXRecord('CreationTimeStamp', {
				childs: [
					createFBXRecordSingleInt32('Version', 1000),
					createFBXRecordSingleInt32('Year', date.getFullYear()),
					createFBXRecordSingleInt32('Month', date.getMonth() + 1),
					createFBXRecordSingleInt32('Day', date.getDate()),
					createFBXRecordSingleInt32('Hour', date.getHours()),
					createFBXRecordSingleInt32('Minute', date.getMinutes()),
					createFBXRecordSingleInt32('Second', date.getSeconds()),
					createFBXRecordSingleInt32('Millisecond', date.getMilliseconds()),

				]
			}),
			createFBXRecordSingleString('Creator', creator),
			createFBXRecord('SceneInfo', {
				properties: [
					createStringProperty(fbxNameClass('GlobalInfo', 'SceneInfo')),
					createStringProperty('UserData'),
				],
				childs: [
					createFBXRecordSingleString('Type', 'UserData'),
					createFBXRecordSingleInt32('Version', FBX_SCENEINFO_VERSION),
					createFBXRecord('MetaData', {
						childs: [
							createFBXRecordSingleInt32('Version', FBX_SCENEINFO_VERSION),
							createFBXRecordSingleString('Title', ''),//TODO
							createFBXRecordSingleString('Subject', ''),//TODO
							createFBXRecordSingleString('Author', ''),//TODO
							createFBXRecordSingleString('Keywords', ''),//TODO
							createFBXRecordSingleString('Revision', ''),//TODO
							createFBXRecordSingleString('Comment', ''),//TODO
						]
					}),
					createFBXRecord('Properties70', {
						childs: [
							createFBXRecordMultipleStrings('P', ['DocumentUrl', 'KString', 'Url', '', './test.fbx']),//TODO
							createFBXRecordMultipleStrings('P', ['SrcDocumentUrl', 'KString', 'Url', '', './test.fbx']),//TODO
							createFBXRecordMultipleStrings('P', ['Original', 'Compound', '', '']),
							createFBXRecordMultipleStrings('P', ['Original|ApplicationVendor', 'KString', '', '', appVendor]),
							createFBXRecordMultipleStrings('P', ['Original|ApplicationName', 'KString', '', '', appName]),
							createFBXRecordMultipleStrings('P', ['Original|ApplicationVersion', 'KString', '', '', appVersion]),
							createFBXRecordMultipleStrings('P', ['Original|DateTime_GMT', 'DateTime', '', '', '01/01/1970 00:00:00.000']),
							createFBXRecordMultipleStrings('P', ['Original|FileName', 'KString', '', '', './test.fbx']),//TODO
							createFBXRecordMultipleStrings('P', ['LastSaved', 'Compound', '', '']),
							createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationVendor', 'KString', '', '', appVersion]),
							createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationName', 'KString', '', '', appName]),
							createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationVersion', 'KString', '', '', appVersion]),
							createFBXRecordMultipleStrings('P', ['LastSaved|DateTime_GMT', 'DateTime', '', '', '01/01/1970 00:00:00.000']),
							createFBXRecordMultipleStrings('P', ['LastSaved|ApplicationActiveProject', 'KString', '', '', './test.fbx']),//TODO
						]
					}),

				]
			}),
		]
	});

	return fbxHeaderExtension;
}

function createGlobalSettingsRecord() {
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

function createDocumentsRecord() {
	let documents = createFBXRecord('Documents', {
		childs: [
			createFBXRecordSingleInt32('Count', 1),
			createFBXRecord('Document', {
				childs: [
					createFBXRecord('Properties70', {
						childs: [
							createPObject('SourceObject'),
							createPString('ActiveAnimStackName', ''),//TODO
						]
					}),
					createFBXRecordSingleInt64('RootNode', 0n),
				],
				properties: [
					createInt64Property(9876n),//TODO: what is this ?
					createStringProperty('Scene'),
					createStringProperty('Scene'),
				]
			}),
		],
	});
	return documents;
}

export function createDefinitionsRecord() {
	let definitions = createFBXRecord('Definitions', {
		childs: [
			createFBXRecordSingleInt32('Version', FBX_TEMPLATES_VERSION),
			createFBXRecordSingleInt32('Count', 4),//TODO: Sum of every template below
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
				],
				properties: [
					createStringProperty('GlobalSettings'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
					createFBXRecord('PropertyTemplate', {
						properties: [
							createStringProperty('FbxMesh'),
						],
					}),
				],
				properties: [
					createStringProperty('Geometry'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
					createFBXRecord('PropertyTemplate', {
						childs: [

						],
						properties: [
							createStringProperty('FbxNode'),
						],
					}),
				],
				properties: [
					createStringProperty('Model'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
					createFBXRecord('PropertyTemplate', {
						childs: [

						],
						properties: [
							createStringProperty('FbxSurfacePhong'),
						],
					}),
				],
				properties: [
					createStringProperty('Material'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
					createFBXRecord('PropertyTemplate', {
						childs: [
						],
						properties: [
							createStringProperty('FbxFileTexture'),
						],
					}),
				],
				properties: [
					createStringProperty('Texture'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
					createFBXRecord('PropertyTemplate', {
						childs: [
						],
						properties: [
							createStringProperty('FbxVideo'),
						],
					}),
				],
				properties: [
					createStringProperty('Video'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
				],
				properties: [
					createStringProperty('Deformer'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
					createFBXRecord('PropertyTemplate', {
						childs: [
							createFBXRecord('Properties70', {
								childs: [
									createPColorRGB('Color', [0.8, 0.8, 0.8]),
									createPDouble('Size', 100),
									createPDouble('LimbLength', 1),//TODO: P: "LimbLength", "double", "Number", "H",1
								]
							}),
						],
						properties: [
							createStringProperty('FbxSkeleton'),
						]
					}),
				],
				properties: [
					createStringProperty('NodeAttribute'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
				],
				properties: [
					createStringProperty('Pose'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
				],
				properties: [
					createStringProperty('AnimationStack'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
				],
				properties: [
					createStringProperty('AnimationLayer'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
				],
				properties: [
					createStringProperty('AnimationCurveNode'),
				],
			}),
			createFBXRecord('ObjectType', {
				childs: [
					createFBXRecordSingleInt32('Count', 1),
				],
				properties: [
					createStringProperty('AnimationCurve'),
				],
			}),
		],
	});
	return definitions;
}

export function createTakesRecord() {
	let takes = createFBXRecord(FBX_RECORD_NAME_TAKES, {
		childs: [
			createFBXRecordSingleString('Current', ''),
		],
	});
	return takes;
}
