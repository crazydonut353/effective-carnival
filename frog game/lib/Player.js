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
        this.width=50;
        this.height=100;
        this.velocity={x:0,y:0};
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
    
    
    update(GMKeys,ctx,nextmapFN,iMap,maps,spawns,audioAssets,audioContext,dt,GMPoints,tutorail,dedt) {
                    //                             collision script
      //psudo code:
      // if point y intersect (move y) else if point x intersect (move x)
      //else, repeat for next point
      if(this.velocity.x>-2&&this.velocity.x<2&&this.action!="attack"){
        
        this.action = "idle";
      }
      if(this.velocity.x<-1){
        this.direction=1;
      } else if(this.velocity.x>1) {
        this.direction=-1;
      }
      if(Math.abs(this.velocity.x)>10){
        this.action="run"; //0-7
      } else if(Math.abs(this.velocity.x)>10){
        this.action="walk"; //0-7
      }
      if(this.velocity.y < 0) {
        this.action = "jump"; //13-13
      } else if(this.velocity.y > 2) {
        this.action = "fall"; //15-15
      }
      var canJump = false;
      var waterPower = false;
      this.x+=this.velocity.x*dt;
      this.y+=this.velocity.y*dt;
      let startCol = Math.floor((this.x)/50);
      let endCol = Math.ceil((this.x+(this.width))/50);
      for(let i = startCol; i < endCol; i++) {
        let t = this.layer.map.getTile(i, Math.floor((this.y+this.height)/50));
        if(t==4||t==5){
            waterPower = true;
          }
        if(t!=this.layer.emptyTile&&t!=4&&t!=5) {
          
          
          this.y=((Math.floor((this.y)/50))*50);
          this.velocity.y = 0;
          ((i)*50)>=Math.floor((this.x+(this.width-1))/50)*50&&((i)*50)+50<=Math.floor((this.x+(this.width-1))/50)*50?null:canJump=true;
          
          GMKeys["d"] ? this.velocity.x += 4 : null;
          GMKeys["a"] ? this.velocity.x -= 4 : null;
          
          this.velocity.x *= 0.8;
          if(t==12){
            if(iMap<maps.length-1) {
              audioAssets.playsound(3,audioContext);
              
              tutorail.leveled = true;
              
              let x = this.middleX;
              let y = this.middleY+this.height;
                
              for(let i = 0; i<20; i++){
                  let a = this.eggExplodeParticles.pushParticle(x,y,0,50);
                  this.eggExplodeParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
                  this.eggExplodeParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
                  this.eggExplodeParticles.particles[a].velocity.rotation=this.eggExplodeParticles.particles[a].velocity.x;
              }
              nextmapFN()
            }else{
              var x = this.middleX;
              var y = this.middleY+this.height;
                
              for(let s = 0; s<20; s++){
                  let a = this.eggExplodeParticles.pushParticle(x,y,0,50);
                  this.eggExplodeParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
                  this.eggExplodeParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
                  this.eggExplodeParticles.particles[a].velocity.rotation=this.eggExplodeParticles.particles[a].velocity.x;
              }
              for (let b = 0; b < 30; b++) {
                var x = Math.floor(Math.random() * canvas.width);
                var y = Math.floor(Math.random() * canvas.height);
                
                for(let r = 0; r<20; r++){
                  let a = this.eggExplodeParticles.pushParticle(x,y,0,50);
                  this.eggExplodeParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
                  this.eggExplodeParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
                  this.eggExplodeParticles.particles[a].velocity.rotation=this.eggExplodeParticles.particles[a].velocity.x;
                }
                this.layer.tilemap[this.layer.map.getTileIndex(i, Math.floor((this.y+this.height)/50))] = 4;
              }
              
              
            }
        }
        if(t==21){
            GMPoints.pumpkins++;
            
            tutorail.pumpkin=true
            
          audioAssets.playsound(2,audioContext);
          
          var x = this.middleX;
          var y = this.middleY+this.height;
            
          for(let s = 0; s<20; s++){
              let a = this.pumpkinExplodeParticles.pushParticle(x,y,0,30);
              this.pumpkinExplodeParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
              this.pumpkinExplodeParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
              this.pumpkinExplodeParticles.particles[a].velocity.rotation=this.pumpkinExplodeParticles.particles[a].velocity.x;
              this.layer.tilemap[this.layer.map.getTileIndex(i, Math.floor((this.y+this.height)/50))] = 4;
          }
        }
        if(t==2){
            audioAssets.playsound(2,audioContext);
            
            dedt();
            
          this.x = spawns[iMap][0];
          this.y = spawns[iMap][1];
        }
        } else {
            
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
          
          this.x=((Math.ceil((this.x)/50))*50);
          this.velocity.x = 0;
        }
      }
      
      startCol = Math.floor((this.x)/50);
      endCol = Math.floor((this.x+(this.width))/50);
      
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
          
          this.x=((Math.floor((this.x)/50))*50);
          this.velocity.x = 0;
          GMKeys["a"] ? this.velocity.x -= 4 : null;
        }
      }
      if(waterPower){
        this.jumpHeight=70;
      }else{
        this.jumpHeight=35;
      }
      
      if(this.velocity.y<0||this.velocity.y>1){
        canJump=false;
      }
      canJump && GMKeys["w"] ? this.velocity.y -= this.jumpHeight : null;
      canJump && GMKeys["w"] ? audioAssets.playsound(0,audioContext) : null;
      /*
      this.y=((Math.floor((player.y)/50))*50);
      this.velocity.y = 0;
      
      keydown["w"] ? this.velocity.y -= this.jumpHeight : null;
      keydown["d"] ? this.velocity.x += 4 : null;
      keydown["a"] ? this.velocity.x -= 4 : null;
      this.velocity.x *= 0.8;*/

      
      
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
