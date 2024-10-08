export { Particle, ParticleCollection_RAND }

class Particle {
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
        this.velocity={x:0,y:0,rotation:0}
        this.angle = angle;
        this.image = image;
        this.scale = scale;
    }
    
    update() {
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        this.angle+=this.velocity.rotation;
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

class ParticleCollection {
    constructor(image) {
        this.particleImage=image;
        this.particleLimit = 100;
        this.particles=[];
    }
    pushParticle(x, y, angle, scale){
        let a = this.particles.push(new Particle(x,y,angle,this.particleImage,scale));
        return a-1;
    }
    /**
     * 
     * @param {Function} callbackFn 
     */
    updateEach(callbackFn){
        this.particles.forEach((x,i,a)=>{
            callbackFn(a[i],i);
            a[i].update();
            if(i>this.particleLimit){this.particles.splice(0,1);}
        });
    }
}

class ParticleCollection_RAND {
    constructor(images) {
        this.particleImages=images;
        this.particleLimit = 100;
        this.particles=[];
    }
    pushParticle(x, y, angle, scale){
        let a = this.particles.push(new Particle(x,y,angle,this.particleImages[Math.floor(Math.random() * this.particleImages.length)],scale));
        return a-1;
    }
    /**
     * 
     * @param {Function} callbackFn 
     */
    updateEach(callbackFn){
        this.particles.forEach((x,i,a)=>{
            callbackFn(a[i],i);
            a[i].update();
            if(i>this.particleLimit){this.particles.splice(0,1);}
        });
    }
}