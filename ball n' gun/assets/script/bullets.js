export { Bullet, BulletSystem }

class Bullet {
    constructor(gl, bulletImg) {
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.height = 15;
        this.rotation = 0;
        
        this.vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        
        var x1 = 0;
        var x2 = 1;
        var y1 = 0;
        var y2 = 1;
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
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bulletImg);
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
    
    update(gl) {
        var angleInDegrees = 360 - this.rotation+90;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        this.x += Math.sin(angleInRadians)*20;
        this.y += Math.cos(angleInRadians)*20;
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

class BulletSystem {
    constructor(bulletImg,transLocation,rotLocation,scaleLocation,gl) {
        this.bullets = [];
        this.bulletImg = bulletImg;
        this.transLocation = transLocation;
        this.rotLocation = rotLocation;
        this.scaleLocation = scaleLocation;
        this.x = 100;
        this.y = 100;
        this.angle = 0;
        this.gl = gl;
    }
    
    spawn() {
        var angleInDegrees = 360 - this.angle;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        var tipX = 50;
        var tipY = -50;
        
        
        this.bullets[this.bullets.push(new Bullet(this.gl, this.bulletImg))-1].setTransforms(this.transLocation,this.rotLocation,this.scaleLocation);
        this.bullets[this.bullets.length - 1].x = this.x+(tipX*Math.cos(angleInRadians) + tipY*Math.sin(angleInRadians));
        this.bullets[this.bullets.length - 1].y = this.y+(tipY*Math.cos(angleInRadians) - tipX*Math.sin(angleInRadians));
        this.bullets[this.bullets.length - 1].rotation = this.angle;
    }
    
    
    update(canvas) {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(this.gl);
            if (this.bullets[i].x <= 0 ||         // right of the left edge AND
                this.bullets[i].x >= canvas.width ||    // left of the right edge AND
                this.bullets[i].y <= 0 ||         // below the top AND
                this.bullets[i].y >= canvas.height) {
                    this.bullets[i].delete(this.gl);
                    this.bullets.splice(i, 1);
                    i--;
            }
        }
    }
    
    render(tcl, pal) {
        this.bullets.forEach((v,i,a) => {
            v.render(this.gl, tcl, pal);
        });
    }
}