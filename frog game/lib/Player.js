export { Player };

class Player {
    constructor(spritesheet, mainlayer) {
        this.spritesheet = spritesheet;
        this.middleX = 0;
        this.middleY = 0;
        this.direction = 1; //direction is either 1 or -1 ( left or right )
        this.layer = mainlayer;
    }
    ahh(){
        this.layer.tileset[0] = 3;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(100-Math.max(this.direction,0)*100,0)
        ctx.scale(this.direction,1);
        ctx.drawImage(this.spritesheet,0,0,32,32,this.middleX,this.middleY,100,100);
        ctx.restore();
    }
}