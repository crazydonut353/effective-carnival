export { Tiles }

class Tiles {
    constructor(map, canvas, tileAtlas, tilesetData, emptyTile) {
        this.canvas = canvas;
        this.numRows = map.height;
        console.log(map.width)
        this.numColumns = map.width;
        this.tilemap = map.data;
        this.tileAtlas = tileAtlas;
        this.tilesetData = tilesetData;
        this.emptyTile = emptyTile;
        this.backgroundColor=map.backgroundcolor;
        this.map = {
            tsize: tilesetData["tilewidth"],
            getTile(c, r) {
                const index = r * this.numColumns + c;
                if(c>=this.numColumns || c<0 || r < 0 || r>=this.numRows || this.tilemap[index] == 0){
                    
                    return this.emptyTile;
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
        this.camera = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        }
    }
    render(ctx, scaledTileSize) {
        
        ctx.fillStyle=this.backgroundColor;
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
        
        var camera = {};
        camera.x = this.camera.x-(this.camera.width/2);
        camera.y = this.camera.y-(this.camera.height/2);
        
        const startCol = Math.floor(camera.x / scaledTileSize);
        const endCol = (startCol + Math.ceil(this.camera.width / scaledTileSize));
        const startRow = Math.floor(camera.y / scaledTileSize);
        const endRow = (startRow + Math.ceil(this.camera.height / scaledTileSize));
        const offsetX = -camera.x + startCol * scaledTileSize;
        const offsetY = -camera.y + startRow * scaledTileSize;

        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                const tile = this.map.getTile(c, r);
                const x = (c - startCol) * scaledTileSize + offsetX;
                const y = (r - startRow) * scaledTileSize + offsetY;
                ctx.drawImage(
                this.tileAtlas,
                (tile % this.tilesetData["columns"]) * this.map.tsize,
                Math.floor(tile/this.tilesetData["columns"]) * this.map.tsize,
                this.map.tsize,
                this.map.tsize,
                Math.round(x),
                Math.round(y), 
                scaledTileSize,
                scaledTileSize
                );

            }
        }
    }
}