export { TileLayer, TiledLayer }

class TileSet {
    constructor(tilesetData, tilesetRoot) {
        this.data = tilesetData;
        this.imgUrl = tilesetRoot + this.data.image;
        this.imageBitmap = null;
    }
    async loadImage() {
        const response = await fetch(this.imgUrl);
        const imageBlob = await response.blob();
        this.imageBitmap = await createImageBitmap(imageBlob);
    }
}

class TileLayer {
    constructor(layerData, tileset, gl) {
        this.layerData = layerData;
        
        // idfk
        this.camera = {
            x : 0,
            y : 0,
            width : gl.canvas.width,
            height : gl.canvas.height
        }
        
        // Vertex buffer
        this.vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        
        var x1 = 0;
        var x2 = gl.canvas.width;
        var y1 = 0;
        var y2 = gl.canvas.height;
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2,
            ]),
            gl.STATIC_DRAW);
            
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tileset.imageBitmap);
        
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    
}

class ObjectLayer {
    
}

class TiledLayer {
    constructor(mapUrl) {
        this.mapUrl = mapUrl;
        this.layers = [];
        this.tilesets = [];
    }
    async setup(gl) {
        this.mapData = await fetch(url).then(response => 
            response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            return res.data;
        }));
        
        this.mapData.tilesets.forEach((v, i, a) => {
            this.tilesets.push()
        })
        
        this.mapData.layers.forEach((v, i, a) => {
            switch (v.type) {
                case "tilelayer":
                    this.layers.push(new TileLayer(v,gl));
                    break;
            
                default:
                    break;
            }
        });
    }
}