export { Tiles }

class Tiles {
    constructor(map, canvas, tileAtlas, tilesetData) {
        this.canvas = canvas;
        this.numRows = map.width;
        this.numColumns = map.height;
        this.tilemap = map.data;
        this.tileAtlas = tileAtlas;
        this.tilesetData = tilesetData;
        this.map = {
            tsize: 32,
            getTile: function(c, r) {
                if(c>=map.width || c<0 || r < 0){return 2}
                  const index = r * map.width + c;
                  return map.data[index]-1;
            }
        };
        this.camera = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        }
    }
    render(ctx) {
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        const startCol = Math.floor(this.camera.x / this.map.tsize);
        const endCol = (startCol + (this.camera.width+32) / this.map.tsize);
        const startRow = Math.floor(this.camera.y / this.map.tsize);
        const endRow = (startRow + this.camera.height / this.map.tsize);
        const offsetX = -this.camera.x + startCol * this.map.tsize;
        const offsetY = -this.camera.y + startRow * this.map.tsize;

        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                const tile = this.map.getTile(c, r);
                const x = (c - startCol) * this.map.tsize + offsetX;
                const y = (r - startRow) * this.map.tsize + offsetY;
                ctx.drawImage(
                this.tileAtlas,
                (tile % this.tilesetData["columns"]) * this.map.tsize,
                Math.floor(tile/this.tilesetData["columns"]) * this.map.tsize,
                this.map.tsize,
                this.map.tsize,
                Math.round(x),
                Math.round(y), 
                this.map.tsize,
                this.map.tsize
                );

            }
        }
        this.camera.x++;
        this.camera.y++;
    }
}