import { FBX_MAPPING_MODE_ALL_SAME, MappingMode } from '../enums/mappingmode';
import { FBX_REFERENCE_MODE_DIRECT, ReferenceMode } from '../enums/referencemode';

export class FBXLayerElement {
	#mappingMode: MappingMode = MappingMode.AllSame;
	#referenceMode: ReferenceMode = ReferenceMode.Direct;
	#name = '';
	isFBXLayerElement = true;

	constructor(name = '') {
		this.name = name;
	}

	set mappingMode(mappingMode) {
		this.#mappingMode = mappingMode;
	}

	get mappingMode() {
		return this.#mappingMode;
	}

	set referenceMode(referenceMode: ReferenceMode) {
		this.#referenceMode = referenceMode;
	}

	get referenceMode() {
		return this.#referenceMode;
	}

	set name(name) {
		this.#name = name;
	}

	get name() {
		return this.#name;
	}
}
