import { exportFBXGlobalSettings } from './exportfbxglobalsettings.js';
import { exportFBXScene } from './exportfbxscene.js';
import { fbxAnimCurveNodeToRecord } from './fbxanimcurvenodetorecord.js';
import { fbxAnimCurveToRecord } from './fbxanimcurvetorecord.js';
import { fbxAnimLayerToRecord } from './fbxanimlayertorecord.js';
import { fbxAnimStackToRecord } from './fbxanimstacktorecord.js';
import { fbxCameraToRecord } from './fbxcameratorecord.js';
import { fbxClusterToRecord } from './fbxclustertorecord.js';
import { fbxMeshToRecord } from './fbxmeshtorecord.js';
import { fbxNodeToRecord } from './fbxnodetorecord.js';
import { fbxPoseToRecord } from './fbxposetorecord.js';
import { fbxSkeletonToRecord } from './fbxskeletontorecord.js';
import { fbxSkinToRecord } from './fbxskintorecord.js';
import { fbxSurfaceMaterialToRecord } from './fbxsurfacematerialtorecord.js';
import { fbxTextureToRecord } from './fbxtexturetorecord.js';
import { FBX_RECORD_NAME_CONNECTIONS, FBX_RECORD_NAME_CREATOR, FBX_RECORD_NAME_OBJECTS, FBX_RECORD_NAME_REFERENCES, FBX_RECORD_NAME_TAKES } from '../consts/recordsname.js';

import { FBXFile } from '../model/fbxfile.js';
import { createConnectionRecord } from '../utils/createconnectionrecord.js';
import { createHeaderExtensionRecord, createDefinitionsRecord, createTakesRecord } from '../utils/createemptyfile.js';
import { createFBXRecord, createFBXRecordSingleString } from '../utils/createfbxrecord.js';
import { createVideoRecord } from '../utils/createvideorecord.js';

const FBX_RECORD_TYPE_MESH = 'Mesh';
const FBX_RECORD_TYPE_LIMB_NODE = 'LimbNode';
const FBX_RECORD_TYPE_CAMERA = 'Camera';

export function fbxSceneToFBXFile(scene, creator = 'harmony-fbx', appVendor = 'harmony-fbx', appName = 'harmony-fbx', appVersion = '1') {
	let fbxFile = new FBXFile();
	fbxFile.version = 7400;

	fbxFile.addChild(createHeaderExtensionRecord(fbxFile, creator, appVendor, appName, appVersion));
	fbxFile.addChild(createFBXRecordSingleString(FBX_RECORD_NAME_CREATOR, creator));
	fbxFile.addChild(exportFBXGlobalSettings(scene.globalSettings));
	fbxFile.addChild(exportFBXScene(scene));
	fbxFile.addChild(createFBXRecord(FBX_RECORD_NAME_REFERENCES));//TODO ?
	fbxFile.addChild(createDefinitionsRecord());
	fbxFile.addChild(createFBXRecord(FBX_RECORD_NAME_OBJECTS));
	fbxFile.addChild(createFBXRecord(FBX_RECORD_NAME_CONNECTIONS));
	fbxFile.addChild(createTakesRecord());

	exportObjects(fbxFile, scene);
	exportTakes(fbxFile, scene);

	return fbxFile;
}

function exportObjects(fbxFile, scene) {
	let nodesReferences = new Set();
	let nodesConnections = new Set();
	let alreadyExported = new Set();
	for (let child of scene.rootNode.childs) {
		exportObject(fbxFile, child, nodesReferences, nodesConnections, alreadyExported);
	}
	for (let object of scene.objects) {
		exportObject(fbxFile, object, nodesReferences, nodesConnections, alreadyExported);
	}
	for (;;) {
		let nodesReferences2 = new Set();
		for (let child of nodesReferences) {
			exportObject(fbxFile, child, nodesReferences2, nodesConnections, alreadyExported);
		}
		if (nodesReferences2.size == 0) {
			break;
		}
		nodesReferences = nodesReferences2;
	}

	createConnections(fbxFile, nodesConnections);
}

function exportObject(fbxFile, object, nodesReferences, nodesConnections, alreadyExported) {
	if (alreadyExported.has(object)) {
		return;
	}
	switch (true) {
		case object.isFBXNode:
			exportNode(fbxFile, object, nodesReferences, nodesConnections, alreadyExported);
			break;
		case object.isFBXObject:
			exportObject2(fbxFile, object, nodesReferences, nodesConnections);
			break;
		default:
			console.log(object);
			throw 'Trying to export an unknown object';
	}
	alreadyExported.add(object)
}

function exportObject2(fbxFile, object, nodesReferences, nodesConnections) {
	exportObjectPropertiesConnections(fbxFile, object, nodesReferences, nodesConnections);


	switch (true) {
		case object.isFBXSurfacePhong:
			exportSurfacePhongObject(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXTexture:
			exportFBXTexture(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXVideo:
			exportFBXVideo(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXSkin:
			exportFBXSkin(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXCluster:
			exportFBXCluster(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXPose:
			exportFBXPose(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXAnimStack:
			exportFBXAnimStack(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXAnimLayer:
			exportFBXAnimLayer(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXAnimCurveNode:
			exportFBXAnimCurveNode(fbxFile, object, nodesReferences, nodesConnections);
			break;
		case object.isFBXAnimCurve:
			exportFBXAnimCurve(fbxFile, object, nodesReferences, nodesConnections);
			break;
		default:
			console.log(object);
			throw 'Export of this object is missing';
	}
}

function exportObjectPropertiesConnections(fbxFile, fbxObject, nodesReferences, nodesConnections) {
	exportPropertiesConnections(fbxFile, fbxObject.rootProperty, nodesReferences, nodesConnections)
}

function exportPropertiesConnections(fbxFile, fbxProperty, nodesReferences, nodesConnections) {
	fbxProperty.srcObjects.forEach(object => {
		const parentObject = fbxProperty.getParentObject();
		// Ensure the parent object is exported
		nodesReferences.add(parentObject);
		nodesReferences.add(object);
		nodesConnections.add(createConnection(object, parentObject, fbxProperty.hierarchicalName));
		console.log(fbxProperty);
	});


	if (fbxProperty.isCompound()) {
		for (const [key, value] of fbxProperty.value) {
			//console.log(key, value);
			exportPropertiesConnections(fbxFile, value, nodesReferences, nodesConnections);
		}
	}
}

function exportNode(fbxFile, node, nodesReferences, nodesConnections, alreadyExported) {
	if (alreadyExported.has(node)) {
		return;
	}

	exportObjectPropertiesConnections(fbxFile, node, nodesReferences, nodesConnections);

	if (node.nodeAttribute) {
		let nodeAttribute = node.nodeAttribute;
		switch (true) {
			case nodeAttribute.isFBXMesh:
				exportMeshNode(fbxFile, node, nodesReferences, nodesConnections);
				break;
			case nodeAttribute.isFBXSkeleton:
				exportSkeletonNode(fbxFile, node, nodesReferences, nodesConnections);
				break;
			case nodeAttribute.isFBXCamera:
				exportCameraNode(fbxFile, node, nodesReferences, nodesConnections);
				break;
			default:
				console.log(nodeAttribute);
				throw 'Error in exportNode: export of this nodeAttribute is missing';
		}
	} else {
		throw 'nodeAttribute is null ' + node.id;
	}

	for (let child of node.childs) {
		exportNode(fbxFile, child, nodesReferences, nodesConnections, alreadyExported);
	}
}

function exportMeshNode(fbxFile, node, nodesReferences, nodesConnections) {
	// Add the materials for writing
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);

	node.materials.forEach(material => {
		nodesReferences.add(material);
		nodesConnections.add(createConnection(material, node));
	});
	node.nodeAttribute.deformers.forEach(deformer => {
		nodesReferences.add(deformer);
		nodesConnections.add(createConnection(deformer, node.nodeAttribute));
	});

	objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_MESH));
	objectsRecord.addChild(fbxMeshToRecord(node.nodeAttribute));

	nodesConnections.add(createConnection(node, node.parent));
	nodesConnections.add(createConnection(node.nodeAttribute, node));
}

function exportSkeletonNode(fbxFile, node, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);


	objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_LIMB_NODE));
	objectsRecord.addChild(fbxSkeletonToRecord(node.nodeAttribute));

	nodesConnections.add(createConnection(node, node.parent));
	nodesConnections.add(createConnection(node.nodeAttribute, node));
}

function exportCameraNode(fbxFile, node, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);

	objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_CAMERA));
	objectsRecord.addChild(fbxCameraToRecord(node.nodeAttribute));

	nodesConnections.add(createConnection(node, node.parent));
	nodesConnections.add(createConnection(node.nodeAttribute, node));
}

function createConnection(src, dst, target) {
	return {s: src.id, d: dst.id, t: target};
}

function exportSurfacePhongObject(fbxFile, fbxSurfacePhong, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);

	let propertyNames = ['diffuse'];
	for (let propertyName of propertyNames) {
		let fbxProperty = fbxSurfacePhong[propertyName];
		fbxProperty.srcObjects.forEach(object => {
			nodesReferences.add(object);
			nodesConnections.add(createConnection(object, fbxSurfacePhong, 'DiffuseColor'));
		});
	}
	objectsRecord.addChild(fbxSurfaceMaterialToRecord(fbxSurfacePhong));
}

function exportFBXTexture(fbxFile, fbxTexture, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);

	let textureMedia = fbxTexture.media;
	if (textureMedia) {
		nodesReferences.add(textureMedia);
		nodesConnections.add(createConnection(textureMedia, fbxTexture));
	}

	objectsRecord.addChild(fbxTextureToRecord(fbxTexture));
}

function exportFBXVideo(fbxFile, fbxVideo, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
	objectsRecord.addChild(createVideoRecord(fbxVideo));
}

function exportFBXSkin(fbxFile, fbxSkin, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);

	fbxSkin.clusters.forEach(cluster => {
		nodesReferences.add(cluster);
		nodesConnections.add(createConnection(cluster, fbxSkin));
	});

	objectsRecord.addChild(fbxSkinToRecord(fbxSkin));
}

function exportFBXCluster(fbxFile, fbxCluster, nodesReferences, nodesConnections) {
	if (fbxCluster.indexes.length == 0) {
		return;
	}
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
	if (fbxCluster.link) {
		nodesReferences.add(fbxCluster.link);
		nodesConnections.add(createConnection(fbxCluster.link, fbxCluster));
	}
	objectsRecord.addChild(fbxClusterToRecord(fbxCluster));
}

function exportFBXAnimStack(fbxFile, fbxAnimStack, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
	/*if (fbxAnimStack.link) {
		nodesReferences.add(fbxAnimStack.link);
		nodesConnections.add(createConnection(fbxAnimStack.link, fbxAnimStack));
	}*/

	fbxAnimStack.members.forEach(member => {
		nodesReferences.add(member);
		nodesConnections.add(createConnection(member, fbxAnimStack));
	});

	objectsRecord.addChild(fbxAnimStackToRecord(fbxAnimStack));
}

function exportFBXAnimLayer(fbxFile, fbxAnimLayer, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);

	fbxAnimLayer.members.forEach(member => {
		nodesReferences.add(member);
		nodesConnections.add(createConnection(member, fbxAnimLayer));
	});

	objectsRecord.addChild(fbxAnimLayerToRecord(fbxAnimLayer));
}

function exportFBXAnimCurveNode(fbxFile, fbxAnimCurveNode, nodesReferences, nodesConnections) {
	const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
	objectsRecord.addChild(fbxAnimCurveNodeToRecord(fbxAnimCurveNode));
}

function exportFBXAnimCurve(fbxFile, fbxAnimCurveNode, nodesReferences, nodesConnections) {
	const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
	objectsRecord.addChild(fbxAnimCurveToRecord(fbxAnimCurveNode));
}

function createConnections(fbxFile, connections) {
	let connectionsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_CONNECTIONS);
	for (let connection of connections) {
		connectionsRecord.addChild(createConnectionRecord(connection.s, connection.d, connection.t));
	}
}

function exportTakes(fbxFile, fbxScene) {
	let takesRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_TAKES);
	let srcObjects = fbxScene.srcObjects;
	for (let srcObject of srcObjects) {
		if (srcObject.isFBXAnimStack) {

		}
	}
}

function exportFBXPose(fbxFile, fbxPose, nodesReferences, nodesConnections) {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS);
	objectsRecord.addChild(fbxPoseToRecord(fbxPose));
}
