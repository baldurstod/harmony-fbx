import { FBXTime } from './fbxtime.js';

export class FBXAnimCurveKey {
	#time = new FBXTime();
	#value = 0;
	constructor(time, value) {
		this.isFBXAnimCurveKey = true;
		this.#set(time, value);
	}

	set(time, value) {
		this.#set(time, value);
	}

	#set(time, value) {
		if (time) {
			this.#time.copy(time);
		}
		if (value !== undefined) {
			this.#value = value;
		}
	}

	get time() {
		return this.#time;
	}
}
