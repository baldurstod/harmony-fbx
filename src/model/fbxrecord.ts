import { FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_STRING, FbxType } from '../constants';
import { FBXRecordProperty } from './fbxrecordproperty';

export class FBXRecord {
	#name = '';
	#childs = new Set<FBXRecord>();
	#properties = new Set<FBXRecordProperty>();
	isFBXRecord = true;
	constructor(name: string) {
		this.name = name;
	}

	addChild(child: FBXRecord) {
		if (!child.isFBXRecord) {
			throw 'FBXFile: trying to insert a non FBXRecord child';
		}
		this.#childs.add(child);
		return child;
	}

	addChilds(childs: Array<FBXRecord>) {
		for (let child of childs) {
			this.addChild(child);
		}
	}

	addProperty(property: FBXRecordProperty) {
		this.#properties.add(property);
	}

	addProperties(properties: Array<FBXRecordProperty>) {
		for (let property of properties) {
			this.addProperty(property);
		}
	}

	set name(name) {
		if (name.length > 255) {
			throw `Record name above 255 characters ${name}`;
		}
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	get childs() {
		return this.#childs;
	}

	get properties() {
		return this.#properties;
	}

	getRecordsByName(recordName: string) {
		let output = [];

		for (let child of this.#childs) {
			if (child.name == recordName) {
				output.push(child);
			}
		}

		return output;
	}

	getRecordByName(recordName: string) {
		for (let child of this.#childs) {
			if (child.name == recordName) {
				return child;
			}
		}
	}

	getProperty(type: FbxType) {
		for (let property of this.#properties) {
			if (property.type == type) {
				return property.value;
			}
		}
	}

	getPropertyInt32() {
		return this.getProperty(FBX_DATA_TYPE_INT_32);
	}

	getPropertyString() {
		return this.getProperty(FBX_DATA_TYPE_STRING);
	}

	toJSON() {
		return {
			name: this.#name,
			childs: this.#childs.size ? [...this.#childs] : undefined,
			properties: this.#properties.size ? [...this.#properties] : undefined,
		}
	}
}
