import { inflate } from 'pako';
import { BinaryReader } from 'harmony-binary-reader';
import { FBX_DATA_TYPE_INT_8, FBX_DATA_TYPE_DOUBLE, FBX_DATA_TYPE_FLOAT, FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_INT_64, FBX_DATA_TYPE_RAW, FBX_DATA_TYPE_STRING, FBX_DATA_TYPE_INT_16, FBX_DATA_TYPE_ARRAY_INT_8, FBX_DATA_TYPE_ARRAY_DOUBLE, FBX_DATA_TYPE_ARRAY_FLOAT, FBX_DATA_TYPE_ARRAY_INT_32, FBX_DATA_TYPE_ARRAY_INT_64, FBX_DATA_LEN, FBX_BINARY_MAGIC, FbxType } from './constants';
import { FBXFile } from './model/fbxfile';
import { FBXProperty } from './model/fbxproperty';
import { FBXRecord } from './model/fbxrecord';
import { FBXRecordProperty } from './model/fbxrecordproperty';

export class FBXImporter extends EventTarget {
	//#reader;
	constructor() {
		super();
	}

	parse(buffer: Uint8Array) {
		let reader = new BinaryReader(buffer);
		if (FBXImporter.#isBinary(reader)) {
			return FBXImporter.#parseBinary(reader);
		} else {
			return FBXImporter.#parseText(reader);
		}
	}

	static #isBinary(reader: BinaryReader) {
		if (reader.getString(FBX_BINARY_MAGIC.length, 0) == FBX_BINARY_MAGIC) {
			return true;
		} else {
			return false;
		}
	}

	static #parseBinary(reader: BinaryReader) {
		let file = new FBXFile();
		file.version = reader.getUint32(23);
		reader.seek(27);

		for (; ;) {
			let record = parseBinaryRecord(reader, file.version >= 7500, 0);
			if (record) {
				file.addChild(record);
			} else {
				break;
			}
		}

		return file;
	}

	static #parseText(reader: BinaryReader) {
		throw 'Code parseText';
	}
}

function parseBinaryRecord(reader: BinaryReader, version7500: boolean, tabLevel: number) {
	let startOffset = reader.tell();

	let endOffset = version7500 ? Number(reader.getBigUint64()) : reader.getUint32();

	if (endOffset == 0) {
		return null;
	}

	let numProperties = version7500 ? Number(reader.getBigUint64()) : reader.getUint32();
	let propertyListLen = version7500 ? Number(reader.getBigUint64()) : reader.getUint32();
	let nameLen = reader.getUint8();
	let name = reader.getString(nameLen);

	//console.log(startOffset, endOffset, name);
	let record = new FBXRecord(name);

	let start = reader.tell()
	for (let i = 0; i < numProperties; ++i) {
		let property = parseProperty(reader, tabLevel);
		record.addProperty(property);
	}
	//reader.skip(propertyListLen);
	reader.seek(start + propertyListLen);

	let tab = '';
	for (let i = 0; i < tabLevel; ++i) {
		tab += '\t';
	}

	if (tabLevel) {
		//console.log(tab, startOffset, endOffset, numProperties, propertyListLen, nameLen, name);
	} else {
		//console.log(startOffset, endOffset, numProperties, propertyListLen, nameLen, name);
	}

	while (reader.tell() < endOffset) {
		let child = parseBinaryRecord(reader, version7500, tabLevel + 1);
		if (child) {
			record.addChild(child);
		} else {
			break;
		}
	}

	reader.seek(endOffset);
	return record;
}

function parseProperty(reader: BinaryReader, tabLevel: number) {
	let startOffset = reader.tell();
	//console.log('>>>>>>>>' + startOffset);
	let typeCode = reader.getUint8();
	let property;
	let len;
	switch (typeCode) {
		case FBX_DATA_TYPE_INT_16:
			property = reader.getInt16();
			break;
		case FBX_DATA_TYPE_INT_8:
			property = reader.getInt8();
			break;
		case FBX_DATA_TYPE_INT_32:
			property = reader.getInt32();
			break;
		case FBX_DATA_TYPE_FLOAT:
			property = reader.getFloat32();
			break;
		case FBX_DATA_TYPE_DOUBLE:
			property = reader.getFloat64();
			break;
		case FBX_DATA_TYPE_INT_64:
			property = reader.getBigInt64();
			break;
		case FBX_DATA_TYPE_RAW:
			len = reader.getUint32();
			property = reader.getBytes(len);
			break;
		case FBX_DATA_TYPE_STRING:
			len = reader.getUint32();
			property = reader.getString(len);
			break;
		case FBX_DATA_TYPE_ARRAY_INT_8:
		case FBX_DATA_TYPE_ARRAY_DOUBLE:
		case FBX_DATA_TYPE_ARRAY_FLOAT:
		case FBX_DATA_TYPE_ARRAY_INT_32:
		case FBX_DATA_TYPE_ARRAY_INT_64:
			property = parseArray(reader, typeCode);
			break;
		default:
			console.log('Unknown typeCode: ', typeCode);

	}
	//console.log(startOffset, typeCode, '------------------------>', property);	let tab = '';
	let tab = '';
	for (let i = 0; i < tabLevel; ++i) {
		tab += '\t';
	}
	//console.log(tab + property);

	throw 'fix property constructor below';
	return new FBXRecordProperty(null, typeCode, property);
}

function parseArray(reader: BinaryReader, arrayType: FbxType) {
	let arrayLen = reader.getUint32();
	let encoding = reader.getUint32();
	let compressedLength = reader.getUint32();
	let decompressedLength = compressedLength;

	let dataLen = FBX_DATA_LEN.get(arrayType);

	if (dataLen === undefined) {
		throw 'wrong array type';
	}
	//console.log(reader.tell(), arrayLen, encoding, compressedLength, arrayType);

	let dataReader = reader;
	if (encoding == 1) {
		const output = inflate(reader.getBytes(compressedLength));
		dataReader = new BinaryReader(output);
		decompressedLength = dataReader.byteLength
	} else if (encoding != 0) {
		throw 'Unknown encoding ' + encoding;
	}

	if (decompressedLength != arrayLen * dataLen) {
		throw `Unmached length: ${arrayType} ${decompressedLength} ${arrayLen} ${dataLen}`;
	}

	let output = [];
	let value;
	for (let i = 0; i < arrayLen; ++i) {
		switch (arrayType) {
			case FBX_DATA_TYPE_ARRAY_INT_8:
				value = dataReader.getInt8();
				break;
			case FBX_DATA_TYPE_ARRAY_DOUBLE:
				value = dataReader.getFloat64();
				break;
			case FBX_DATA_TYPE_ARRAY_FLOAT:
				value = dataReader.getFloat32();
				break;
			case FBX_DATA_TYPE_ARRAY_INT_32:
				value = dataReader.getInt32();
				break;
			case FBX_DATA_TYPE_ARRAY_INT_64:
				value = dataReader.getBigInt64();
				break;
			default:
				throw 'Unknown array type: arrayType ' + arrayType;
		}
		output.push(value);
	}
	return output;
}
