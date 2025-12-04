import { BinaryReader } from 'harmony-binary-reader';
import { FBX_BINARY_MAGIC, FBX_DATA_LEN, FBX_DATA_TYPE_ARRAY_DOUBLE, FBX_DATA_TYPE_ARRAY_FLOAT, FBX_DATA_TYPE_ARRAY_INT_32, FBX_DATA_TYPE_ARRAY_INT_64, FBX_DATA_TYPE_ARRAY_INT_8, FBX_DATA_TYPE_DOUBLE, FBX_DATA_TYPE_FLOAT, FBX_DATA_TYPE_INT_16, FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_INT_64, FBX_DATA_TYPE_INT_8, FBX_DATA_TYPE_RAW, FBX_DATA_TYPE_STRING } from './constants';
import { FBXFile } from './model/fbxfile';
import { FBXRecord } from './model/fbxrecord';
import { FBXRecordProperty } from './model/fbxrecordproperty';
import { createRawProperty, createStringProperty } from './utils/createfbxproperty';


const _TIME_ID = '1970-01-01 10:00:00:000';
const _FILE_ID = new Uint8Array([0x28, 0xb3, 0x2a, 0xeb, 0xb6, 0x24, 0xcc, 0xc2, 0xbf, 0xc8, 0xb0, 0x2a, 0xa9, 0x2b, 0xfc, 0xf1]);
const _FOOT_ID = new Uint8Array([0xfa, 0xbc, 0xab, 0x09, 0xd0, 0xc8, 0xd4, 0x66, 0xb1, 0x76, 0xfb, 0x83, 0x1c, 0xf7, 0x26, 0x7e]);

const FBX_FOOTER2 = '\xf8\x5a\x8c\x6a\xde\xf5\xd9\x7e\xec\xe9\x0c\xe3\x75\x8f\x29\x0b';

export class FBXExporter {
	exportBinary(fbxFile: FBXFile): ArrayBuffer {
		checkFile(fbxFile);
		let version = fbxFile.version;
		let size = getFileSize(fbxFile, version);
		//console.log('File Size: ', size);

		let writer = new BinaryReader(new Uint8Array(size));

		return exportBinaryFile(writer, fbxFile);

	}
}

function checkFile(fbxFile: FBXFile) {
	for (let child of fbxFile.childs) {
		if (child.name == 'CreationTime' || child.name == 'FileId') {
			fbxFile.childs.delete(child);
		}
	}

	formatCreationTimeRecord(fbxFile);
	formatFileIdRecord(fbxFile);
}

function exportBinaryFile(writer: BinaryReader, fbxFile: FBXFile): ArrayBuffer {
	let version = fbxFile.version;
	writer.seek(0);
	writer.setString(FBX_BINARY_MAGIC);
	writer.setUint8(0x1A);
	writer.setUint8(0x00);
	writer.setUint32(version);
	for (let child of fbxFile.childs) {
		exportBinaryRecord(writer, child, version);
	}

	writer.skip((version >= 7500) ? 25 : 13);//Null record
	writer.setBytes(generateFooterCode(fbxFile.dateCreated));
	writer.skip(align16(writer.tell()));
	if (version != 7400) {
		writer.skip(4);
	}
	writer.setUint32(version);
	writer.skip(120);
	writer.setString(FBX_FOOTER2);

	return writer.buffer as ArrayBuffer;
}

function formatFileIdRecord(fbxFile: FBXFile) {
	let fbxRecord = fbxFile.addChild(new FBXRecord('FileId'));
	fbxRecord.properties.clear();
	let fbxProperty = createRawProperty(_FILE_ID);
	fbxRecord.addProperty(fbxProperty);
}

function formatCreationTimeRecord(fbxFile: FBXFile) {
	let fbxRecord = fbxFile.addChild(new FBXRecord('CreationTime'));
	fbxRecord.properties.clear();
	let dateCreated = fbxFile.dateCreated;
	let creationTime = `${dateCreated.getFullYear()}-${padNumber(dateCreated.getMonth() + 1, 2)}-${padNumber(dateCreated.getDate(), 2)} ${padNumber(dateCreated.getHours(), 2)}:${padNumber(dateCreated.getMinutes(), 2)}:${padNumber(dateCreated.getSeconds(), 2)}:${padNumber(dateCreated.getMilliseconds(), 3)}`;

	//console.log(creationTime);
	//let fbxProperty = createStringProperty(creationTime);
	let fbxProperty = createStringProperty(_TIME_ID);
	fbxRecord.addProperty(fbxProperty);
}

function align16(offset: number) {
	let pad = ((offset + 15) & ~15) - offset;
	if (pad == 0) {
		pad = 16;
	}
	return pad;
}

function exportBinaryRecord(writer: BinaryReader, fbxRecord: FBXRecord, version: number) {
	let startOffset = writer.tell();
	let recordLen = getRecordSize(fbxRecord, version);
	//console.log(startOffset);
	if (version >= 7500) {
		writer.setBigUint64(BigInt(startOffset + recordLen));
		writer.setBigUint64(BigInt(fbxRecord.properties.size));
		writer.setBigUint64(BigInt(getRecordPropertiesSize(fbxRecord)));
	} else {
		writer.setUint32(startOffset + recordLen);
		writer.setUint32(fbxRecord.properties.size);
		writer.setUint32(getRecordPropertiesSize(fbxRecord));
	}
	writer.setUint8(fbxRecord.name.length);
	writer.setString(fbxRecord.name);
	exportProperties(writer, fbxRecord);
	for (let child of fbxRecord.childs) {
		exportBinaryRecord(writer, child, version);
	}

	writer.skip((version >= 7500) ? 25 : 13);//Null record
}

function exportProperties(writer: BinaryReader, fbxRecord: FBXRecord) {
	for (let property of fbxRecord.properties) {
		exportRecordProperty(writer, property);
	}
}

function exportRecordProperty(writer: BinaryReader, fbxProperty: FBXRecordProperty) {
	//console.log(fbxProperty);

	writer.setUint8(fbxProperty.type);
	switch (fbxProperty.type) {
		case FBX_DATA_TYPE_INT_16:
			writer.setInt16(fbxProperty.value);
			break;
		case FBX_DATA_TYPE_INT_8:
			writer.setInt8(fbxProperty.value);
			break;
		case FBX_DATA_TYPE_INT_32:
			writer.setInt32(fbxProperty.value);
			break;
		case FBX_DATA_TYPE_FLOAT:
			writer.setFloat32(fbxProperty.value);
			break;
		case FBX_DATA_TYPE_DOUBLE:
			writer.setFloat64(fbxProperty.value);
			break;
		case FBX_DATA_TYPE_INT_64:
			writer.setBigInt64(BigInt(fbxProperty.value));
			break;
		case FBX_DATA_TYPE_RAW:
			writer.setUint32(fbxProperty.value.length);
			writer.setBytes(fbxProperty.value);
			break;
		case FBX_DATA_TYPE_STRING:
			writer.setUint32(fbxProperty.value.length);
			writer.setString(fbxProperty.value);
			break;
		case FBX_DATA_TYPE_ARRAY_INT_8:
		case FBX_DATA_TYPE_ARRAY_DOUBLE:
		case FBX_DATA_TYPE_ARRAY_FLOAT:
		case FBX_DATA_TYPE_ARRAY_INT_32:
		case FBX_DATA_TYPE_ARRAY_INT_64:
			exportRecordPropertyArray(writer, fbxProperty);
			break;
		default:
			throw 'Unknown property type ' + fbxProperty.type;
	}
}

function exportRecordPropertyArray(writer: BinaryReader, fbxProperty: FBXRecordProperty) {
	writer.setUint32(fbxProperty.value.length);
	writer.setUint32(0);//Encoding
	writer.setUint32((FBX_DATA_LEN.get(fbxProperty.type) as number) * fbxProperty.value.length);

	let functionName;
	switch (fbxProperty.type) {
		case FBX_DATA_TYPE_ARRAY_INT_8:
			functionName = 'setInt8';
			break;
		case FBX_DATA_TYPE_ARRAY_DOUBLE:
			functionName = 'setFloat64';
			break;
		case FBX_DATA_TYPE_ARRAY_FLOAT:
			functionName = 'setFloat32';
			break;
		case FBX_DATA_TYPE_ARRAY_INT_32:
			functionName = 'setInt32';
			break;
		case FBX_DATA_TYPE_ARRAY_INT_64:
			functionName = 'setBigInt64';
			for (let value of fbxProperty.value) {
				writer.setBigInt64(value);
			}
			return;
			break;
		default:
			throw 'Unknown array property type ' + fbxProperty.type;
	}

	for (let value of fbxProperty.value) {
		(writer as any)[functionName](value);
	}
}

function getFileSize(fbxFile: FBXFile, version: number) {
	let size = 27;//header
	for (let child of fbxFile.childs) {
		size += getRecordSize(child, version);
	}
	size += (version >= 7500) ? 25 : 13;//Null record

	size += 16 // footer1
	//size += 4 // padding
	size += align16(size);//alignment
	if (version != 7400) {
		size += 4 // padding
	}

	size += 140;//version + padding + footer2

	return size;
}

function getRecordSize(fbxRecord: FBXRecord, version: number) {
	let size;
	if (version >= 7500) {
		size = 8 + 8 + 8 + 1;
	} else {
		size = 4 + 4 + 4 + 1;
	}

	size += fbxRecord.name.length;

	size += getRecordPropertiesSize(fbxRecord);

	for (let child of fbxRecord.childs) {
		size += getRecordSize(child, version);
	}

	size += (version >= 7500) ? 25 : 13;//Null record

	return size;
}

function getRecordPropertiesSize(fbxRecord: FBXRecord) {
	let size = 0;
	for (let property of fbxRecord.properties) {
		switch (property.type) {
			case FBX_DATA_TYPE_INT_8:
			case FBX_DATA_TYPE_DOUBLE:
			case FBX_DATA_TYPE_FLOAT:
			case FBX_DATA_TYPE_INT_32:
			case FBX_DATA_TYPE_INT_64:
			case FBX_DATA_TYPE_INT_16:
				++size//Typecode
				size += FBX_DATA_LEN.get(property.type) as number;
				break;
			case FBX_DATA_TYPE_RAW:
			case FBX_DATA_TYPE_STRING:
				++size//Typecode
				size += 4;//string len
				size += property.value.length;
				break;
			case FBX_DATA_TYPE_ARRAY_INT_8:
			case FBX_DATA_TYPE_ARRAY_DOUBLE:
			case FBX_DATA_TYPE_ARRAY_FLOAT:
			case FBX_DATA_TYPE_ARRAY_INT_32:
			case FBX_DATA_TYPE_ARRAY_INT_64:
				size += 13;//Typecode + array header
				size += FBX_DATA_LEN.get(property.type) as number * property.value.length;
				break;
			default:
				throw 'Unknown property type ' + property.type;
		}
	}
	return size;
}

// https://github.com/hamish-milne/FbxWriter


const sourceId = new Uint8Array([0x58, 0xAB, 0xA9, 0xF0, 0x6C, 0xA2, 0xD8, 0x3F, 0x4D, 0x47, 0x49, 0xA3, 0xB4, 0xB2, 0xE7, 0x3D]);
const key = new Uint8Array([0xE2, 0x4F, 0x7B, 0x5F, 0xCD, 0xE4, 0xC8, 0x6D, 0xDB, 0xD8, 0xFB, 0xD7, 0x40, 0x58, 0xC6, 0x78]);
//const extension = new Uint8Array([0xF8, 0x5A, 0x8C, 0x6A, 0xDE, 0xF5, 0xD9, 0x7E, 0xEC, 0xE9, 0x0C, 0xE3, 0x75, 0x8F, 0x29, 0x0B]);

function padNumber(number: number, targetLength: number) {//TODO: move
	return number.toString().padStart(targetLength, '0');
}

const footerCodeSize = 16;

function encrypt(a: Uint8Array, b: Uint8Array) {
	let c = 64;
	for (let i = 0; i < footerCodeSize; i++) {
		a[i] = (a[i] ^ (c ^ b[i]));
		c = a[i];
	}
}

function generateFooterCode(date: Date) {
	return _FOOT_ID;
	let output = new Uint8Array(sourceId);

	let mangledTime = `${padNumber(date.getSeconds(), 2)}${padNumber(date.getMonth() + 1, 2)}${padNumber(date.getHours(), 2)}${padNumber(date.getDate(), 2)}${padNumber(Number((date.getMilliseconds() / 10).toFixed(0)), 2)}${padNumber(date.getFullYear(), 4)}${padNumber(date.getMinutes(), 2)}`;

	//05/03/2018 09:48:57.083
	//5311221301202252
	//3910181575202215 //05/03/2018 09:48:57.083  //2022-10-15 18:15:39.753 bunny

	//0001000100197000
	//const mangledTime = '3910181575202215';
	//const mangledTime = '0000000000197000';
	//mangledTime = '0001000100197000';
	//mangledTime = '0001000100197000';
	//mangledTime = '0001100100197000';

	console.log(mangledTime);

	let mangledBytes = new Uint8Array(footerCodeSize);
	for (let i = 0; i < footerCodeSize; i++) {
		mangledBytes[i] = mangledTime.charCodeAt(i) & 0xff;
	}
	console.log(mangledBytes);

	encrypt(output, mangledBytes);
	encrypt(output, key);
	encrypt(output, mangledBytes);
	console.log(output);
	return output;
}
