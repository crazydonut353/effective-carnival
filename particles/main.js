import { Particle, ParticleCollection, Images } from "./classes.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var imageAssets = new Images(["./rat.png", "./bg.jpg", "./jelly.png", "./eli.png"]);
var ratParticles;
var jellyParticles;
var timer = Date.now();
var mouse = {velocityX:0,velocityY:0,x:0,y:0,mousedown:false};


function resize() {
    document.body.style.overflow = "hidden"
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight+1;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.imageSmoothingEnabled = false;
    
}

async function init() {
    await imageAssets.load();
    
    ratParticles = new ParticleCollection(imageAssets.files[0]);
    jellyParticles = new ParticleCollection(imageAssets.files[2]);
    
    ratParticles.pushParticle(0,0,0,100);
    
    
    
    gameloop()
    
}
function gameloop() {
    resize();
    
    ctx.drawImage(imageAssets.files[1],0,0,canvas.width,canvas.height)
    
    if(Date.now()>timer+100&&(mouse.velocityX!=0||mouse.velocityY!=0)){
        if(mouse.mousedown){
            jellyParticles.pushParticle(mouse.x,mouse.y,2,200);
            jellyParticles.particles[jellyParticles.particles.length-1].velocity.x = mouse.velocityX;
            jellyParticles.particles[jellyParticles.particles.length-1].velocity.y = mouse.velocityY;
            jellyParticles.particles[jellyParticles.particles.length-1].velocity.rotation = mouse.velocityX;
        }else{
            ratParticles.pushParticle(mouse.x,mouse.y,2,400);
            ratParticles.particles[ratParticles.particles.length-1].velocity.x = mouse.velocityX;
            ratParticles.particles[ratParticles.particles.length-1].velocity.y = mouse.velocityY;
            ratParticles.particles[ratParticles.particles.length-1].velocity.rotation = mouse.velocityX;
        }
        timer = Date.now();
    }
    ratParticles.particles.forEach((x,i,a)=>{
        if(x.x>=canvas.width+400||x.x<=0-400||x.y>=canvas.height+400||x.y<=0-400){
            a.splice(i,1);
        }
    });
    jellyParticles.particles.forEach((x,i,a)=>{
        if(x.x>=canvas.width+400||x.x<=0-400||x.y>=canvas.height+400||x.y<=0-400){
            a.splice(i,1);
        }
    });
    ratParticles.updateEach((element,i)=>{
        element.draw(ctx);
    })
    jellyParticles.updateEach((element,i)=>{
        element.draw(ctx);
    })
    
    ctx.fillText(ratParticles.particles.length,50,40)
    
    requestAnimationFrame(gameloop)
}
init();
document.addEventListener("mousemove",(e)=>{
    mouse.velocityX=e.movementX;
    mouse.velocityY=e.movementY;
    mouse.x=e.clientX;
    mouse.y=e.clientY;
});
document.addEventListener("mousedown",()=>{mouse.mousedown=true});
document.addEventListener("mouseup",()=>{mouse.mousedown=false});
document.addEventListener("keyup", (e)=>{
    if(e.key=="s"){
        imageAssets.files[1]=imageAssets.files[3];
        ratParticles.particleImage=imageAssets.files[3];
        jellyParticles.particleImage=imageAssets.files[3];
    }
    if(e.key==" "){
        let x = Math.floor(Math.random() * canvas.width);
        let y = Math.floor(Math.random() * canvas.height);
        
        for(let i = 0; i<10; i++){
            let a = jellyParticles.pushParticle(x,y,0,50);
            jellyParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
            jellyParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
        }
        for(let i = 0; i<10; i++){
            let a = ratParticles.pushParticle(x,y,0,50);
            ratParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
            ratParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
        }
    }
    if(e.key=="c"){
        ratParticles.particles=[];
        jellyParticles.particles=[];
    }
})