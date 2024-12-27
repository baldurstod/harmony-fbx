import { FBXRecord } from './fbxrecord';

export class FBXFile {
	#version = 7500;
	#childs = new Set<FBXRecord>();
	#dateCreated = new Date();

	set version(version) {
		this.#version = version;
	}

	get version() {
		return this.#version;
	}

	addChild(child: FBXRecord) {
		this.#childs.add(child);
		return child;
	}

	get childs() {
		return this.#childs;
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

	set dateCreated(dateCreated) {
		this.#dateCreated = dateCreated;
	}

	get dateCreated() {
		return this.#dateCreated;
	}

	toJSON() {
		return {
			version: this.#version,
			childs: this.#childs.size ? [...this.#childs] : undefined,
		}
	}
}
