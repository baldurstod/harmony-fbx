import {FBX_DATA_TYPE_INT_32, FBX_DATA_TYPE_STRING} from '../constants.js';

export class FBXRecord {
	#name = '';
	#childs = new Set();
	#properties = new Set();
	constructor(name) {
		this.name = name;
	}

	addChild(child) {
		if (!child.isFBXRecord) {
			throw 'FBXFile: trying to insert a non FBXRecord child';
		}
		this.#childs.add(child);
		return child;
	}

	addChilds(childs) {
		for (let child of childs) {
			this.addChild(child);
		}
	}

	addProperty(property) {
		this.#properties.add(property);
	}

	addProperties(properties) {
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

	getRecordsByName(recordName) {
		let output = [];

		for (let child of this.#childs) {
			if (child.name == recordName) {
				output.push(child);
			}
		}

		return output;
	}

	getRecordByName(recordName) {
		for (let child of this.#childs) {
			if (child.name == recordName) {
				return child;
			}
		}
	}

	getProperty(type) {
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
FBXRecord.prototype.isFBXRecord = true;
