export class FBXColor {
	#red: number;
	#green: number;
	#blue: number;
	#alpha: number;
	isFBXColor = true;

	constructor(red = 0.0, green = 0.0, blue = 0.0, alpha = 1.0) {
		this.#red = red;
		this.#green = green;
		this.#blue = blue;
		this.#alpha = alpha;
	}

	set red(red) {
		this.#red = red;
	}

	get red() {
		return this.#red;
	}

	set green(green) {
		this.#green = green;
	}

	get green() {
		return this.#green;
	}

	set blue(blue) {
		this.#blue = blue;
	}

	get blue() {
		return this.#blue;
	}

	set alpha(alpha) {
		this.#alpha = alpha;
	}

	get alpha() {
		return this.#alpha;
	}
}
