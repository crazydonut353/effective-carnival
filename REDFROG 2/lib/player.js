export { Player }

import { Box } from "./box.js";

class Player {
    constructor(img, gl, transUniforms) {
        this.x = 0;
        this.y = 0;
        
        this.box = new Box(gl, 0, 0, 100, 100);
        this.box.setTexture(img, gl);
        this.box.setTransforms(transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation);
    }
}