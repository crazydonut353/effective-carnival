export { Box }

class Box {
    constructor(gl, offsetx, offsety, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        
        this.vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        
        var x1 = offsetx;
        var x2 = offsetx + 1;
        var y1 = offsety;
        var y2 = offsety + 1;
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
        this.transLocation = null;
        this.rotLocation = null;
        
         // provide texture coordinates for the rectangle.
        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0]), gl.STATIC_DRAW);
        
        // Create a texture.
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    
    delete(gl) {
        gl.deleteBuffer(this.vertBuffer);
        gl.deleteBuffer(this.texCoordBuffer);
        gl.deleteTexture(this.texture)
    }
    
    setTransforms(transLocation,rotLocation,scaleLocation) {
        this.transLocation = transLocation;
        this.rotLocation = rotLocation;
        this.scaleLocation = scaleLocation;
    }
    
    
    setTexture(img, gl) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    }
    
    update(gl) {
        var angleInDegrees = 360 - this.rotation;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        
        
        
        gl.uniform2f(this.transLocation, this.x, this.y);
        gl.uniform2f(this.rotLocation, Math.sin(angleInRadians), Math.cos(angleInRadians));
        gl.uniform2fv(this.scaleLocation, [this.width,this.height]);
    }
    
    render(gl, texCoordLocation, positionAttributeLocation) {
        var angleInDegrees = 360 - this.rotation;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        gl.uniform2f(this.transLocation, this.x, this.y);
        gl.uniform2f(this.rotLocation, Math.sin(angleInRadians), Math.cos(angleInRadians));
        gl.uniform2fv(this.scaleLocation, [this.width,this.height]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}