import { FBXTime } from './fbxtime';

export class FBXAnimCurveKey {
	#time = new FBXTime();
	#value = 0;
	isFBXAnimCurveKey = true;

	constructor(time: FBXTime, value: number) {
		this.#set(time, value);
	}

	set(time: FBXTime, value: number) {
		this.#set(time, value);
	}

	#set(time: FBXTime, value: number) {
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
