import { FBXObject } from './fbxobject';

export class FBXCollection extends FBXObject {
	#members = new Set<FBXObject>();
	isFBXCollection = true;

	add(member: FBXObject) {
		this.#members.add(member);
	}

	remove(member: FBXObject) {
		this.#members.delete(member);
	}

	get count() {
		return this.#members.size;
	}

	get members() {
		return this.#members;
	}
}
