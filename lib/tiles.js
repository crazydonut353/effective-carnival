export { Tiles }

class Tiles {
    constructor(map, canvas, tileAtlas, tilesetData, emptyTile) {
        this.canvas = canvas;
        this.numRows = map.width;
        this.numColumns = map.height;
        this.tilemap = map.data;
        this.tileAtlas = tileAtlas;
        this.tilesetData = tilesetData;
        this.emptyTile = emptyTile;
        this.map = {
            tsize: tilesetData["tilewidth"],
            getTile(c, r) {
                if(c>=this.numRows || c<0 || r < 0 || r>=this.numRows){return this.emptyTile}
                  const index = r * this.numRows + c;
                  
                  return this.tilemap[index]-1;
            },
            getTileIndex(c, r) {
                if(c>=this.numRows || c<0 || r < 0 || r>=this.numRows){return this.emptyTile}
                  const index = r * this.numRows + c;
                  
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
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        const startCol = Math.floor(this.camera.x / scaledTileSize);
        const endCol = (startCol + (this.camera.width+32) / scaledTileSize);
        const startRow = Math.floor(this.camera.y / scaledTileSize);
        const endRow = (startRow + Math.ceil(this.camera.height / scaledTileSize));
        const offsetX = -this.camera.x + startCol * scaledTileSize;
        const offsetY = -this.camera.y + startRow * scaledTileSize;

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