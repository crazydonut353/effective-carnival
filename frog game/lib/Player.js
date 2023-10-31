export { Player };

class Player {
    constructor(spritesheet, mainlayer,sounds) {
        this.spritesheet = spritesheet;
        this.middleX = 0;
        this.middleY = 0;
        this.direction = 1; //direction is either 1 or -1 ( left or right )
        this.layer = mainlayer;
        this.x = 0;
        this.y = 0;
        this.pumpkinExplodeParticles=null;
        this.w=50;
        this.h=100;
        this.vx=0;
        this.vy=0;
        this.jumpHeight=100;
        this.eggExplodeParticles=null;
        this.sounds=sounds;
        this.coins=0;
        this.action="none";
        this.actionObject = {
          "walk":[0,7],
          "run":[0,7],
          "jump":[13,13],
          "fall":[15,15],
          "idle":[0,0],
          "attack":[8,11]
        }
        this.frame=0;
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
        ctx.translate(this.middleX,this.middleY)
        ctx.scale(this.direction,1);
        
        let tile = this.frame+this.actionObject[this.action][0];
        if(this.direction==-1){
          ctx.drawImage(
            this.spritesheet,
            (tile % 2) * 32,
            Math.floor(tile/2) * 32,
            32,
            32,
            -50,
            0, 
            100,
            100
            );
        } else {
          ctx.drawImage(
            this.spritesheet,
            (tile % 2) * 32,
            Math.floor(tile/2) * 32,
            32,
            32,
            0,
            0, 
            100,
            100
            );
        }
        ctx.restore();
    }
    
    getBBB(rect) {
      let bbb = {x:0,y:0,w:0,h:0}
      if(rect.vx<0){
        bbb.x=rect.x+rect.vx;
        bbb.w=rect.w;
      } else {
        bbb.x=rect.x;
        bbb.w=rect.w+rect.vx;
      }
      if(rect.vy<0){
        bbb.y=rect.y+rect.vy;
        bbb.h=rect.h;
      } else {
        bbb.y=rect.y;
        bbb.h=rect.h+rect.vy;
      }
      return bbb;
    }
    
    getDistances(entity, platform) {
      let entryDistance = {x:0,y:0};
      let exitDistance = {x:0,y:0};
      let entryTime = {x:0,y:0};
      let exitTime = {x:0,y:0};
      if(this.vx>0) {
        entryDistance.x=platform.x-(entity.x+entity.w);
      } else {
        entryDistance.x=entity.x-(platform.x+platform.w);
      }
      if(this.vy>0) {
        entryDistance.y=platform.y-(entity.y+entity.h);
      } else {
        entryDistance.y=entity.y-(platform.y+platform.h);
      }
      
      if(this.vx>0) {
        exitDistance.x=(platform.x+platform.w)-entity.x;
      } else {
        exitDistance.x=(entity.x+entity.w)-platform.x;
      }
      if(this.vy>0) {
        exitDistance.y=(platform.y+platform.h)-entity.y;
      } else {
        exitDistance.y=(entity.y+entity.h)-platform.y;
      }
      
      entryTime.x=Math.abs(entryDistance.x/this.vx);
      entryTime.y=Math.abs(entryDistance.y/this.vy);
      exitTime.x=Math.abs(exitDistance.x/this.vx);
      exitTime.y=Math.abs(exitDistance.y/this.vy);
      
      return {
        entryTime:entryTime,
        exitTime:exitTime,
        entryDistance:entryDistance,
        exitDistance:exitDistance
      }
    }
    
    checkForColl(data){
      if(data.exitTime.x<data.entryTime.y||data.exitTime.y<data.entryTime.x){
        return false;
      } else {
        return true;
      }
    }
    
    update(GMKeys,ctx,nextmapFN,iMap,maps,spawns,audioAssets,audioContext,dt,GMPoints,tutorail,dedt) {
                    //                             collision script
      //psudo code:
      // if point y intersect (move y) else if point x intersect (move x)
      //else, repeat for next point
      if(this.vx>-2&&this.vx<2&&this.action!="attack"){
        
        this.action = "idle";
      }
      if(this.vx<-1){
        this.direction=1;
      } else if(this.vx>1) {
        this.direction=-1;
      }
      if(Math.abs(this.vx)>10){
        this.action="run"; //0-7
      } else if(Math.abs(this.vx)>10){
        this.action="walk"; //0-7
      }
      if(this.vy < 0) {
        this.action = "jump"; //13-13
      } else if(this.vy > 2) {
        this.action = "fall"; //15-15
      }
      
      GMKeys.w?this.vy-=this.jumpHeight:null;
      GMKeys.a?this.vx-=1:null;
      GMKeys.d?this.vx+=1:null;
      
      let bbb = this.getBBB(this);
      
      const startCol = Math.floor((bbb.x)/50);
      const startRow = Math.floor((bbb.y)/50);
      
      const endCol = Math.floor((bbb.x+bbb.w)/50);
      const endRow = Math.floor((bbb.y+bbb.h)/50);
      
      for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
          let tile = this.layer.map.getTile(c,r)
          console.log(tile);
          let rect = {
            x:c*50,
            y:r*50,
            w:50,
            h:50
          }
          let data = this.getDistances(this, rect);
          
          if(this.checkForColl(data)){
            if(tile!=this.layer.emptyTile){
              this.vx=0;
            }
          }
        }
      }
      
      audioContext.resume();
      
      this.x+=this.vx;
      this.y+=this.vy;
      /*
      this.y=((Math.floor((player.y)/50))*50);
      this.vy = 0;
      
      keydown["w"] ? this.vy -= this.jumpHeight : null;
      keydown["d"] ? this.vx += 4 : null;
      keydown["a"] ? this.vx -= 4 : null;
      this.vx *= 0.8;*/

      
      
      if(this.frame+1+this.actionObject[this.action][0]>this.actionObject[this.action][1]){
        if(this.action == "attack") {
          this.action = "idle";
          this.frame=0;
        } else {
          this.frame=0;
        }
      } else {
        this.frame++;
      }
      
      if(this.y>this.layer.numRows*50) {
        this.x = spawns[iMap][0];
        this.y = spawns[iMap][1];
      }
      
      GMKeys["w"] || GMKeys["a"] || GMKeys["s"] || GMKeys["d"] ? tutorail.wasd=true : null;
      
      //                            particle updating
      
      this.eggExplodeParticles.particles.forEach((x,i,a)=>{
        if(x.x>=ctx.canvas.width+100||x.x<=0-100||x.y>=ctx.canvas.height+100||x.y<=0-100){
            a.splice(i,1);
        }
    });
    }
}
