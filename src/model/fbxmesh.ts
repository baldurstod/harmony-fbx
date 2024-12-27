import { FBXGeometry } from './fbxgeometry';
import { FBXManager } from './fbxmanager';

export class FBXMesh extends FBXGeometry {
	#vertices = [];
	#normals = [];
	#polygons = [];
	#edges = [];
	#uv = [];
	#uvIndex = [];
	isFBXMesh = true;

	set vertices(vertices) {
		this.#vertices = vertices;
	}

	get vertices() {
		return this.#vertices;
	}

	set normals(normals) {
		this.#normals = normals;
	}

	get normals() {
		return this.#normals;
	}

	set polygons(polygons) {
		this.#polygons = polygons;
	}

	get polygons() {
		return this.#polygons;
	}

	set edges(edges) {
		this.#edges = edges;
	}

	get edges() {
		return this.#edges;
	}

	set uv(uv) {
		this.#uv = uv;
	}

	get uv() {
		return this.#uv;
	}

	set uvIndex(uvIndex) {
		this.#uvIndex = uvIndex;
	}

	get uvIndex() {
		return this.#uvIndex;
	}
}
FBXManager.registerClass('FBXMesh', FBXMesh);
