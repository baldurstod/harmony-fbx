import { FBXObject } from './fbxobject.js';

export class FBXCollection extends FBXObject {
	#members = new Set();
	constructor(manager, name) {
		super(manager, name);
		this.isFBXCollection = true;
	}

	add(member) {
		if (!member.isFBXObject) {
			throw 'member must be an FBXObject';
		}
		this.#members.add(member);
	}

	remove(member) {
		this.#members.delete(member);
	}

	get count() {
		return this.#members.size;
	}

	get members() {
		return this.#members;
	}
}
