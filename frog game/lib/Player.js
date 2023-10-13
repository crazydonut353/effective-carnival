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
        this.width=100;
        this.height=100;
        this.velocity={x:0,y:0};
        this.jumpHeight=30;
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
    
    
    update(GMKeys,ctx,nextmapFN) {
              //                             collision script
      //psudo code:
      // if point y intersect (move y) else if point x intersect (move x)
      //else, repeat for next point
      var canJump = false;
      var waterPower = false;
      this.x+=this.velocity.x;
      this.y+=this.velocity.y;
      let startCol = Math.floor((this.x)/50);
      let endCol = Math.ceil((this.x+this.width)/50);
      for(let i = startCol; i < endCol; i++) {
        let t = this.layer.map.getTile(i, Math.floor((this.y+this.height)/50));
        if(t==4||t==5){
            waterPower = true;
          }
        if(t!=this.layer.emptyTile&&t!=4&&t!=5) {
          
          
          this.y=((Math.floor((this.y)/50))*50);
          this.velocity.y = 0;
          
          canJump=true;
          GMKeys["d"] ? this.velocity.x += 4 : null;
          GMKeys["a"] ? this.velocity.x -= 4 : null;
          
          this.velocity.x *= 0.8;
        } else {
            if(this.layer.map.getTile(i, Math.floor((this.y+this.height)/50))==13){
                console.log("a")
            }
          GMKeys["d"] ? this.velocity.x += 4 : null;
          GMKeys["a"] ? this.velocity.x -= 4 : null;
          this.velocity.x *= 0.8;
          this.velocity.y+=0.5;
        }
      }
      let startRow = Math.floor(this.y/50);
      let endRow = Math.floor((this.y+this.height)/50);
      //console.log(startRow + "  :  " + endRow)
      for(let i = startRow; i < endRow; i++) {
        let t = this.layer.map.getTile(Math.floor((this.x)/50), i);
        if(t==4||t==5){
            waterPower = true;
          }
        if(t!=this.layer.emptyTile&&t!=4&&t!=5) {
            canJump=false;
          this.x=((Math.ceil((this.x)/50))*50);
          this.velocity.x = 0;
        }
      }
      
      startCol = Math.floor((this.x)/50);
      endCol = Math.floor((this.x+this.width)/50);
      
      for(let i = startCol; i < endCol; i++) {
        let t = this.layer.map.getTile(i, Math.floor((this.y)/50));
        if(t==4||t==5){
            waterPower = true;
          }
        if(t!=this.layer.emptyTile&&t!=4&&t!=5){
          this.y=((Math.ceil((this.y)/50))*50);
          this.velocity.y = 0;
        }
      }
      
      startRow = Math.floor(this.y/50);
      endRow = Math.floor((this.y+this.height)/50);
      
      for(let i = startRow; i < endRow; i++){
        let t = this.layer.map.getTile(Math.floor((this.x+this.width)/50), i);
        if(t==4||t==5){
            waterPower = true;
          }
        if(t!=this.layer.emptyTile&&t!=4&&t!=5) {
          if(this.velocity.y<0||this.velocity.y>0){
            canJump=false;
          }
          this.x=((Math.floor((this.x)/50))*50);
          this.velocity.x = 0;
          GMKeys["a"] ? this.velocity.x -= 4 : null;
        }
      }
      if(waterPower){
        this.jumpHeight=40;
      }else{
        this.jumpHeight=30;
      }
      canJump && GMKeys["w"] ? this.velocity.y -= this.jumpHeight : null;
      /*
      this.y=((Math.floor((player.y)/50))*50);
      this.velocity.y = 0;
      
      keydown["w"] ? this.velocity.y -= this.jumpHeight : null;
      keydown["d"] ? this.velocity.x += 4 : null;
      keydown["a"] ? this.velocity.x -= 4 : null;
      this.velocity.x *= 0.8;*/
    }
}