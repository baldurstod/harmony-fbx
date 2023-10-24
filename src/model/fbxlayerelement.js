import { FBX_MAPPING_MODE_ALL_SAME } from '../enums/mappingmode.js';
import { FBX_REFERENCE_MODE_DIRECT } from '../enums/referencemode.js';

export class FBXLayerElement {
	#mappingMode = FBX_MAPPING_MODE_ALL_SAME;
	#referenceMode = FBX_REFERENCE_MODE_DIRECT;
	#name = '';
	constructor(name = '') {
		this.name = name;
	}

	set mappingMode(mappingMode) {
		this.#mappingMode = mappingMode;
	}

	get mappingMode() {
		return mappingMode;
	}

	set referenceMode(referenceMode) {
		this.#referenceMode = referenceMode;
	}

	get referenceMode() {
		return referenceMode;
	}

	set name(name) {
		this.#name = name;
	}

	get name() {
		return name;
	}
}
FBXLayerElement.prototype.isFBXLayerElement = true;
