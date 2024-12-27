import { FBXTimeSpan } from './fbxtimespan.js';

export class FBXTakeInfo {
	#name = '';
	#localTimeSpan = new FBXTimeSpan();
	#referenceTimeSpan = new FBXTimeSpan();
	constructor() {
	}

	set name(name) {
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	set localTimeSpan(localTimeSpan) {
		this.#localTimeSpan = localTimeSpan;
	}

	get localTimeSpan() {
		return this.#localTimeSpan;
	}

	set referenceTimeSpan(referenceTimeSpan) {
		this.#referenceTimeSpan = referenceTimeSpan;
	}

	get referenceTimeSpan() {
		return this.#referenceTimeSpan;
	}
}
