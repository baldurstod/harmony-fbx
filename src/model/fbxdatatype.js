export class FBXDataType {
	#name;
	#type;
	constructor(name, type) {
		this.#name = name;
		this.#type = type;
	}
}
FBXDataType.prototype.isFBXDataType = true;
