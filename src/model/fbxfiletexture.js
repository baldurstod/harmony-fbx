import { FBXTexture } from './fbxtexture.js';

export class FBXFileTexture extends FBXTexture {
	constructor(name) {
		super(name);
	}
}
FBXFileTexture.prototype.isFBXFileTexture = true;
