export { BottleParticle }

class BottleParticle {
    /**
     * 
     * @param {Number} x x of particle
     * @param {Number} y y of particle
     * @param {Number} angle angle of particle
     * @param {ImageBitmap} image 
     * @param {Number} scale 
     */
    constructor(x, y, angle, image, scale) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.image = image;
        this.scale = scale;
    }
    
    update() {
        this.y++;
        this.angle+=4;
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle * Math.PI/360);
        ctx.drawImage(this.image,0-this.scale/2,0-this.scale/2,this.scale,this.scale)
        ctx.restore();
    }
}