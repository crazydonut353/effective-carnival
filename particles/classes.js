export { Particle, ParticleCollection, Images }

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
        this.particles.push(new Particle(x,y,angle,this.particleImage,scale));
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
class Images {
    constructor(urls) {
        this.urls = urls;
        this.files = null;
    }
    async load() {
        let urls = this.urls;
        let results = await Promise.all(urls.map((url) => fetch(url).then((r) => r.blob())));
        results = await Promise.all(results.map((file) => createImageBitmap(file)));
        this.files=results;
    }
}