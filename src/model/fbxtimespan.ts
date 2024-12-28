import { FBXTime } from './fbxtime';

export class FBXTimeSpan {
	#start = new FBXTime();
	#stop = new FBXTime();
	constructor() {
	}

	set start(start) {
		this.#start = start;
	}

	get start() {
		return this.#start;
	}

	set stop(stop) {
		this.#stop = stop;
	}

	get stop() {
		return this.#stop;
	}
}
