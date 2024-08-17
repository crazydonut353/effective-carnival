import { Box } from "./box.js";

export { GLTiles }

class GLTiles {
    constructor(gl, canvas, emptyTile) {
        this.emptyTile = emptyTile;
        this.camera = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        }
        
        this.tileBox = new Box(gl, 0, 0, 100, 100);
    }
    
    setup(atlas, transUniforms, map, tilesetData, gl) {
        this.canvas = gl.canvas;
        this.numRows = map.height;
        console.log(map.width)
        this.numColumns = map.width;
        this.tilemap = map.data;
        this.tilesetData = tilesetData;
        
        this.map = {
            getTile(c, r) {
                const index = r * this.numColumns + c;
                if(c>=this.numColumns || c<0 || r < 0 || r>=this.numRows || this.tilemap[index] == 0){
                    return -1;
                }
                  
                  
                return this.tilemap[index]-1;
            },
            getTileIndex(c, r) {
                const index = r * this.numColumns + c;
                
                return index;
            }
        };
        this.map.getTile = this.map.getTile.bind(this);
        this.map.getTileIndex = this.map.getTileIndex.bind(this);
        
        this.backgroundColor=map.backgroundcolor;
        
        this.map.tsize = tilesetData["tilewidth"];
        
        this.tileBox.setTexture(atlas, gl);
        this.tileBox.setTransforms(transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation);
    }
    
    render(gl, sourceUniforms, texCoordLocation, positionAttributeLocation) {
        
        var camera = {};
        camera.x = this.camera.x;
        camera.y = this.camera.y;
        
        const startCol = Math.floor(camera.x / 100);
        const endCol = (startCol + Math.ceil(this.camera.width / 100));
        const startRow = Math.floor(camera.y / 100);
        const endRow = (startRow + Math.ceil(this.camera.height / 100));
        const offsetX = -camera.x + startCol * 100;
        const offsetY = -camera.y + startRow * 100;
        
        for(let x = startCol; x < this.numColumns; x++) {
            for(let y = startRow; y < this.numRows; y++) {
                const tile = this.map.getTile(x,y);
                if(tile != -1) {
                    const tx = (x - startCol) * 100 + offsetX;
                    const ty = (y - startRow) * 100 + offsetY;
                    
                    this.tileBox.x = tx;
                    this.tileBox.y = ty;
                    
                    gl.uniform2f(sourceUniforms.scale, 1/this.tilesetData["columns"], 1);
                    gl.uniform2f(sourceUniforms.pos, (tile % this.tilesetData["columns"]) * (1/(this.tilesetData["columns"])), Math.floor(tile/5) * 0);
                    
                    this.tileBox.update(gl);
                    this.tileBox.render(gl, texCoordLocation, positionAttributeLocation);
                }
            }
        }
    }
}