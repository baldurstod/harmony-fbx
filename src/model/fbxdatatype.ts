export class FBXDataType {
	isFBXDataType = true;
	#name;
	#type;
	constructor(name, type) {
		this.#name = name;
		this.#type = type;
	}
}
