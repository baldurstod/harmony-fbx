import { mat4 } from 'gl-matrix';
import { FBXNode } from './fbxnode';

export class FBXPoseInfo {
	#matrix= mat4.create();
	#matrixIsLocal = false;
	#node: FBXNode;

	constructor(node: FBXNode, matrix: mat4, matrixIsLocal: boolean) {
		this.#node = node;
		mat4.copy(this.#matrix, matrix);
		this.#matrixIsLocal = matrixIsLocal;
	}

	set matrix(matrix) {
		this.#matrix = matrix;
	}

	get matrix() {
		return this.#matrix;
	}

	set matrixIsLocal(matrixIsLocal) {
		this.#matrixIsLocal = matrixIsLocal;
	}

	get matrixIsLocal() {
		return this.#matrixIsLocal;
	}

	set node(node) {
		this.#node = node;
	}

	get node() {
		return this.#node;
	}
}
