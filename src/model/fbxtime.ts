import { FBX_TC_MILLISECOND, FBX_TC_SECOND, FBX_TC_MINUTE, FBX_TC_HOUR } from '../consts/fbxtimecode.js'
import { FBX_TIME_MODE_DEFAULT, FBX_TIME_MODE_FRAMES_30, FBX_TIME_MODE_FRAMES } from '../enums/timemode.js'
import { FBX_TIME_PROTOCOL_DEFAULT, FBX_TIME_PROTOCOL_FRAME_COUNT } from '../enums/timeprotocol.js'

export class FBXTime {
	#time = 0n;
	static #globalTimeMode = FBX_TIME_MODE_FRAMES_30;
	static #globalTimeProtocol = FBX_TIME_PROTOCOL_FRAME_COUNT;
	constructor(time = 0n) {
		this.time = time;
	}

	set time(time) {
		this.#time = BigInt(time);
	}

	get time() {
		return this.#time;
	}

	copy(other) {
		this.#time = other.#time;
	}

	static setGlobalTimeMode(timeMode, frameRate = 0) {
		FBXTime.#globalTimeMode = timeMode;
	}

	static getGlobalTimeMode() {
		return FBXTime.#globalTimeMode;
	}

	static setGlobalTimeProtocol(timeProtocol) {
		FBXTime.#globalTimeProtocol = timeProtocol;
	}

	static getGlobalTimeProtocol() {
		return FBXTime.#globalTimeProtocol;
	}

	static getFrameRate(timeMode) {
		const frameRate = FBX_TIME_MODE_FRAMES[timeMode];
		if (frameRate === -1) {
			throw 'return global frame rate'
		} else {
			return frameRate;
		}
	}

	static convertFrameRateToTimeMode(frameRate, precision = 1e-8) {
		const lowRate = frameRate - precision;
		const highRate = frameRate + precision;
		for (let i = 1, l = FBX_TIME_MODE_FRAMES.length; i < l; ++i) {
			const targetFrameRate = FBX_TIME_MODE_FRAMES[i];

			if ((targetFrameRate >= lowRate) && (targetFrameRate <= highRate)) {
				return i;
			}
		}
		return FBX_TIME_MODE_DEFAULT;
	}

	static getOneFrameValue(timeMode) {
		const frameRate = FBXTime.getFrameRate(timeMode);
		return BigInt(Math.round(Number(FBX_TC_SECOND) / frameRate));
	}

	setMilliSeconds(milliSeconds) {
		this.#time = BigInt(milliSeconds) * FBX_TC_MILLISECOND;
	}

	getMilliSeconds(milliSeconds) {
		return this.#time / FBX_TC_MILLISECOND;
	}

	setSecondDouble(seconds) {
		this.#time = BigInt(Math.round(Number(FBX_TC_SECOND) * seconds));
	}

	getSecondDouble() {
		return Number(this.#time) / Number(FBX_TC_SECOND);
	}

	setTime(hour, minute, second, frame = 0, field = 0, timeMode = FBX_TIME_MODE_DEFAULT) {
		this.#time = BigInt(hour) * FBX_TC_HOUR +
					 BigInt(minute) * FBX_TC_MINUTE +
					 BigInt(second) * FBX_TC_SECOND +
					 BigInt(frame) * FBXTime.getOneFrameValue(timeMode);
	}

}
