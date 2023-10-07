export { Player };

class Player {
    constructor(spritesheet, mainlayer) {
        this.spritesheet = spritesheet;
        this.middleX = 0;
        this.middleY = 0;
        this.direction = 1; //direction is either 1 or -1 ( left or right )
        this.layer = mainlayer;
        this.x = 0;
        this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;
    }
    ahh(){
        this.layer.tilemap[0] = 3; //test for thing
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(0,0)
        ctx.scale(this.direction,1);
        
        ctx.strokeRect(this.middleX,this.middleY,100,100);
        ctx.drawImage(this.spritesheet,0,0,32,32,this.middleX,this.middleY,100,100);
        ctx.restore();
    }
    checkCollisionBox(callbackFn){
        const startCol = Math.floor(this.x / 50);
        const endCol = (startCol + 1);
        const startRow = Math.floor(this.y / 50);
        const endRow = (startRow + 1);
        const offsetX = -this.x + startCol * 50;
        const offsetY = -this.y + startRow * 50;
        
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                var coll=false;
                const tile = this.layer.map.getTile(c, r);
                const screenx = (c - startCol) * 50 + offsetX;
                const screeny = (r - startRow) * 50 + offsetY;
                const x = c*50;
                const y = r*50;
                
                if(tile!=3){coll=true}
                
                if(coll){callbackFn(x,y,coll);}
                
            }
        }
    }
    
    update(GMKeys,ctx) {
        this.velocityX = this.velocityX*0.8;
        this.velocityY = 7;
        
        this.checkCollisionBox((x,y,coll)=>{
            console.log(y)
            ctx.strokeRect(x,y,50,50);
            this.y=y;
            this.velocityY = 0;
        });
        
        this.x+=this.velocityX;
        this.y+=this.velocityY;
    }
}