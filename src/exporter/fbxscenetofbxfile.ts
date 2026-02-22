import { FBX_RECORD_NAME_CONNECTIONS, FBX_RECORD_NAME_CREATOR, FBX_RECORD_NAME_OBJECTS, FBX_RECORD_NAME_REFERENCES, FBX_RECORD_NAME_TAKES } from '../consts/recordsname';
import { FBXAnimCurve } from '../model/fbxanimcurve';
import { FBXAnimCurveNode } from '../model/fbxanimcurvenode';
import { FBXAnimLayer } from '../model/fbxanimlayer';
import { FBXAnimStack } from '../model/fbxanimstack';
import { FBXCamera } from '../model/fbxcamera';
import { FBXCluster } from '../model/fbxcluster';
import { FBXFile } from '../model/fbxfile';
import { FBXMesh } from '../model/fbxmesh';
import { FBXNode } from '../model/fbxnode';
import { FBXObject } from '../model/fbxobject';
import { FBXPose } from '../model/fbxpose';
import { FBXProperty } from '../model/fbxproperty';
import { FBXRecord } from '../model/fbxrecord';
import { FBXScene } from '../model/fbxscene';
import { FBXSkeleton } from '../model/fbxskeleton';
import { FBXSkin } from '../model/fbxskin';
import { FBXSurfacePhong } from '../model/fbxsurfacephong';
import { FBXTexture } from '../model/fbxtexture';
import { FBXVideo } from '../model/fbxvideo';
import { createConnectionRecord } from '../utils/createconnectionrecord';
import { createDefinitionsRecord, createHeaderExtensionRecord, createTakesRecord } from '../utils/createemptyfile';
import { createFBXRecord, createFBXRecordSingleString } from '../utils/createfbxrecord';
import { createVideoRecord } from '../utils/createvideorecord';
import { exportFBXGlobalSettings } from './exportfbxglobalsettings';
import { exportFBXScene } from './exportfbxscene';
import { fbxAnimCurveNodeToRecord } from './fbxanimcurvenodetorecord';
import { fbxAnimCurveToRecord } from './fbxanimcurvetorecord';
import { fbxAnimLayerToRecord } from './fbxanimlayertorecord';
import { fbxAnimStackToRecord } from './fbxanimstacktorecord';
import { fbxCameraToRecord } from './fbxcameratorecord';
import { fbxClusterToRecord } from './fbxclustertorecord';
import { fbxMeshToRecord } from './fbxmeshtorecord';
import { fbxNodeToRecord } from './fbxnodetorecord';
import { fbxPoseToRecord } from './fbxposetorecord';
import { fbxSkeletonToRecord } from './fbxskeletontorecord';
import { fbxSkinToRecord } from './fbxskintorecord';
import { fbxSurfaceMaterialToRecord } from './fbxsurfacematerialtorecord';
import { fbxTextureToRecord } from './fbxtexturetorecord';

const FBX_RECORD_TYPE_MESH = 'Mesh';
const FBX_RECORD_TYPE_LIMB_NODE = 'LimbNode';
const FBX_RECORD_TYPE_CAMERA = 'Camera';

export function fbxSceneToFBXFile(scene: FBXScene, creator = 'harmony-fbx', appVendor = 'harmony-fbx', appName = 'harmony-fbx', appVersion = '1'): FBXFile {
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

type ExportContext = {
	nodesReferences: Set<FBXObject>,
	nodesConnections: Set<Connection>,
	alreadyExported: Set<FBXObject>,
}

function exportObjects(fbxFile: FBXFile, scene: FBXScene): void {
	/*
	let nodesReferences = new Set();
	let nodesConnections = new Set();
	let alreadyExported = new Set<FBXObject>();
	*/

	const context: ExportContext = {
		nodesReferences: new Set<FBXObject>(),
		nodesConnections: new Set<Connection>(),
		alreadyExported: new Set<FBXObject>(),
	}

	for (let child of scene.rootNode.childs) {
		exportObject(fbxFile, child, context);
	}
	for (let object of scene.objects) {
		exportObject(fbxFile, object, context);
	}
	for (; ;) {
		const context2: ExportContext = {
			nodesReferences: new Set(),
			nodesConnections: context.nodesConnections,
			alreadyExported: context.alreadyExported,
		}
		for (let child of context.nodesReferences) {
			exportObject(fbxFile, child, context2);
		}
		if (context2.nodesReferences.size == 0) {
			break;
		}
		context.nodesReferences = context2.nodesReferences;
	}

	createConnections(fbxFile, context.nodesConnections);
}

function exportObject(fbxFile: FBXFile, object: FBXObject, context: ExportContext): void {
	if (context.alreadyExported.has(object)) {
		return;
	}
	switch (true) {
		case (object as FBXNode).isFBXNode:
			exportNode(fbxFile, (object as FBXNode), context);
			break;
		case object.isFBXObject:
			exportObject2(fbxFile, object, context);
			break;
		default:
			console.log(object);
			throw 'Trying to export an unknown object';
	}
}

function exportObject2(fbxFile: FBXFile, object: FBXObject, context: ExportContext): void {
	exportObjectPropertiesConnections(fbxFile, object, context);

	switch (true) {
		case (object as FBXSurfacePhong).isFBXSurfacePhong:
			exportSurfacePhongObject(fbxFile, object as FBXSurfacePhong, context);
			break;
		case (object as FBXTexture).isFBXTexture:
			exportFBXTexture(fbxFile, object as FBXTexture, context);
			break;
		case (object as FBXVideo).isFBXVideo:
			exportFBXVideo(fbxFile, object as FBXVideo);
			break;
		case (object as FBXSkin).isFBXSkin:
			exportFBXSkin(fbxFile, object as FBXSkin, context);
			break;
		case (object as FBXCluster).isFBXCluster:
			exportFBXCluster(fbxFile, object as FBXCluster, context);
			break;
		case (object as FBXPose).isFBXPose:
			exportFBXPose(fbxFile, object as FBXPose);
			break;
		case (object as FBXAnimStack).isFBXAnimStack:
			exportFBXAnimStack(fbxFile, object as FBXAnimStack, context);
			break;
		case (object as FBXAnimLayer).isFBXAnimLayer:
			exportFBXAnimLayer(fbxFile, object as FBXAnimLayer, context);
			break;
		case (object as FBXAnimCurveNode).isFBXAnimCurveNode:
			exportFBXAnimCurveNode(fbxFile, object as FBXAnimCurveNode);
			break;
		case (object as FBXAnimCurve).isFBXAnimCurve:
			exportFBXAnimCurve(fbxFile, object as FBXAnimCurve);
			break;
		default:
			console.log(object);
			throw 'Export of this object is missing';
	}

	context.alreadyExported.add(object);
}

function exportObjectPropertiesConnections(fbxFile: FBXFile, fbxObject: FBXObject, context: ExportContext): void {
	exportPropertiesConnections(fbxFile, fbxObject.rootProperty, context)
}

function exportPropertiesConnections(fbxFile: FBXFile, fbxProperty: FBXProperty, context: ExportContext): void {
	fbxProperty.srcObjects.forEach(object => {
		const parentObject = fbxProperty.getParentObject();

		if (!parentObject) {
			return;
		}
		// Ensure the parent object is exported
		context.nodesReferences.add(parentObject);
		context.nodesReferences.add(object);
		context.nodesConnections.add(createConnection(object, parentObject, fbxProperty.hierarchicalName));
		console.log(fbxProperty);
	});


	if (fbxProperty.isCompound()) {
		for (const [key, value] of fbxProperty.value) {
			//console.log(key, value);
			exportPropertiesConnections(fbxFile, value, context);
		}
	}
}

function exportNode(fbxFile: FBXFile, node: FBXNode, context: ExportContext): void {
	if (context.alreadyExported.has(node)) {
		return;
	}

	exportObjectPropertiesConnections(fbxFile, node, context);

	if (node.nodeAttribute) {
		let nodeAttribute = node.nodeAttribute;
		switch (true) {
			case (nodeAttribute as FBXMesh).isFBXMesh:
				exportMeshNode(fbxFile, node, context);
				break;
			case (nodeAttribute as FBXSkeleton).isFBXSkeleton:
				exportSkeletonNode(fbxFile, node, context);
				break;
			case (nodeAttribute as FBXCamera).isFBXCamera:
				exportCameraNode(fbxFile, node, context);
				break;
			default:
				console.log(nodeAttribute);
				throw 'Error in exportNode: export of this nodeAttribute is missing';
		}
	} else {
		throw 'nodeAttribute is null ' + node.id;
	}

	for (let child of node.childs) {
		exportNode(fbxFile, child, context);
	}

	context.alreadyExported.add(node);
}

function exportMeshNode(fbxFile: FBXFile, node: FBXNode, context: ExportContext): void {
	// Add the materials for writing
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;

	node.materials.forEach(material => {
		context.nodesReferences.add(material);
		context.nodesConnections.add(createConnection(material, node));
	});
	(node.nodeAttribute as FBXMesh).deformers.forEach(deformer => {
		context.nodesReferences.add(deformer);
		context.nodesConnections.add(createConnection(deformer, (node.nodeAttribute as FBXMesh)));
	});

	objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_MESH));
	objectsRecord.addChild(fbxMeshToRecord(node.nodeAttribute as FBXMesh));

	context.nodesConnections.add(createConnection(node, node.parent as FBXNode));
	context.nodesConnections.add(createConnection(node.nodeAttribute as FBXMesh, node));
}

function exportSkeletonNode(fbxFile: FBXFile, node: FBXNode, context: ExportContext): void {
	const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;

	objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_LIMB_NODE));
	objectsRecord.addChild(fbxSkeletonToRecord(node.nodeAttribute as FBXSkeleton));

	context.nodesConnections.add(createConnection(node, node.parent as FBXNode));
	context.nodesConnections.add(createConnection(node.nodeAttribute as FBXSkeleton, node));
}

function exportCameraNode(fbxFile: FBXFile, node: FBXNode, context: ExportContext): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;

	objectsRecord.addChild(fbxNodeToRecord(node, FBX_RECORD_TYPE_CAMERA));
	objectsRecord.addChild(fbxCameraToRecord(node.nodeAttribute as FBXCamera));

	context.nodesConnections.add(createConnection(node, node.parent as FBXNode));
	context.nodesConnections.add(createConnection(node.nodeAttribute as FBXCamera, node));
}

type Connection = {
	source: bigint,
	destination: bigint,
	target?: string
}

function createConnection(src: FBXObject, dst: FBXObject, target?: string): Connection {
	return { source: src.id, destination: dst.id, target: target };
}

function exportSurfacePhongObject(fbxFile: FBXFile, fbxSurfacePhong: FBXSurfacePhong, context: ExportContext): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;

	let propertyNames = ['diffuse'];
	for (let propertyName of propertyNames) {
		const fbxProperty = fbxSurfacePhong.findProperty(propertyName);
		if (!fbxProperty) {
			continue;
		}
		fbxProperty.srcObjects.forEach(object => {
			context.nodesReferences.add(object);
			context.nodesConnections.add(createConnection(object, fbxSurfacePhong, 'DiffuseColor'));
		});
	}
	objectsRecord.addChild(fbxSurfaceMaterialToRecord(fbxSurfacePhong));
}

function exportFBXTexture(fbxFile: FBXFile, fbxTexture: FBXTexture, context: ExportContext): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;

	let textureMedia = fbxTexture.media;
	if (textureMedia) {
		context.nodesReferences.add(textureMedia);
		context.nodesConnections.add(createConnection(textureMedia, fbxTexture));
	}

	objectsRecord.addChild(fbxTextureToRecord(fbxTexture));
}

function exportFBXVideo(fbxFile: FBXFile, fbxVideo: FBXVideo): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;
	objectsRecord.addChild(createVideoRecord(fbxVideo));
}

function exportFBXSkin(fbxFile: FBXFile, fbxSkin: FBXSkin, context: ExportContext): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;

	fbxSkin.clusters.forEach(cluster => {
		context.nodesReferences.add(cluster);
		context.nodesConnections.add(createConnection(cluster, fbxSkin));
	});

	objectsRecord.addChild(fbxSkinToRecord(fbxSkin));
}

function exportFBXCluster(fbxFile: FBXFile, fbxCluster: FBXCluster, context: ExportContext): void {
	/*
	if (fbxCluster.indexes.length == 0) {
		return;
	}
	*/
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;
	if (fbxCluster.link) {
		context.nodesReferences.add(fbxCluster.link);
		context.nodesConnections.add(createConnection(fbxCluster.link, fbxCluster));
	}
	objectsRecord.addChild(fbxClusterToRecord(fbxCluster));
}

function exportFBXAnimStack(fbxFile: FBXFile, fbxAnimStack: FBXAnimStack, context: ExportContext): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;
	/*if (fbxAnimStack.link) {
		nodesReferences.add(fbxAnimStack.link);
		nodesConnections.add(createConnection(fbxAnimStack.link, fbxAnimStack));
	}*/

	fbxAnimStack.members.forEach(member => {
		context.nodesReferences.add(member);
		context.nodesConnections.add(createConnection(member, fbxAnimStack));
	});

	objectsRecord.addChild(fbxAnimStackToRecord(fbxAnimStack));
}

function exportFBXAnimLayer(fbxFile: FBXFile, fbxAnimLayer: FBXAnimLayer, context: ExportContext): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;

	fbxAnimLayer.members.forEach(member => {
		context.nodesReferences.add(member);
		context.nodesConnections.add(createConnection(member, fbxAnimLayer));
	});

	objectsRecord.addChild(fbxAnimLayerToRecord(fbxAnimLayer));
}

function exportFBXAnimCurveNode(fbxFile: FBXFile, fbxAnimCurveNode: FBXAnimCurveNode): void {
	const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;
	objectsRecord.addChild(fbxAnimCurveNodeToRecord(fbxAnimCurveNode));
}

function exportFBXAnimCurve(fbxFile: FBXFile, fbxAnimCurve: FBXAnimCurve): void {
	const objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;
	objectsRecord.addChild(fbxAnimCurveToRecord(fbxAnimCurve));
}

function createConnections(fbxFile: FBXFile, connections: Set<Connection>): void {
	let connectionsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_CONNECTIONS) as FBXRecord;
	for (let connection of connections) {
		connectionsRecord.addChild(createConnectionRecord(connection.source, connection.destination, connection.target));
	}
}

function exportTakes(fbxFile: FBXFile, fbxScene: FBXScene): void {
	let takesRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_TAKES);
	let srcObjects = fbxScene.srcObjects;
	for (let srcObject of srcObjects) {
		if ((srcObject as FBXAnimStack).isFBXAnimStack) {

		}
	}
}

function exportFBXPose(fbxFile: FBXFile, fbxPose: FBXPose): void {
	let objectsRecord = fbxFile.getRecordByName(FBX_RECORD_NAME_OBJECTS) as FBXRecord;
	objectsRecord.addChild(fbxPoseToRecord(fbxPose));
}
