import { Box } from "./box";


class Player {
    constructor(img, gl) {
        this.x = 0;
        this.y = 0;
        
        this.box = new Box(gl, 0, 0, 100, 100);
        this.box.setTransforms()
    }
}