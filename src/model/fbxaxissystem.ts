export class FBXAxisSystem {
	isFBXAxisSystem = true;
	#upAxis: number;
	#frontAxis: number;

	constructor(upAxis: number, frontAxis: number) {
		this.#upAxis = upAxis;
		this.#frontAxis = frontAxis;
	}

	set upAxis(upAxis) {
		this.#upAxis = upAxis;
	}

	get upAxis() {
		return this.#upAxis;
	}

	set frontAxis(frontAxis) {
		this.#frontAxis = frontAxis;
	}

	get frontAxis() {
		return this.#frontAxis;
	}

	get coordAxis() {
		return this.#frontAxis;
	}
}
