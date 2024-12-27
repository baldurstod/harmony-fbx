export class FBXPoseInfo {
	#matrix;
	#matrixIsLocal = false;
	#node;
	constructor(node, matrix, matrixIsLocal) {
		this.node = node;
		this.matrix = matrix;
		this.matrixIsLocal = matrixIsLocal;
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
