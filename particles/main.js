import { Particle, ParticleCollection, Images } from "./classes.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var imageAssets = new Images(["./rat.png"]);
var ratParticles;
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
    
}

async function init() {
    await imageAssets.load();
    
    ratParticles = new ParticleCollection(imageAssets.files[0]);
    
    ratParticles.pushParticle(0,0,0,100);
    
    ratParticles.updateEach((element)=>{
        element.draw(ctx);
    })
    
    gameloop()
    
}
function gameloop() {
    resize();
    
    if(Date.now()>timer+100){
        ratParticles.pushParticle(mouse.x,mouse.y,2,100);
        ratParticles.particles[ratParticles.particles.length-1].velocity.x = mouse.velocityX;
        ratParticles.particles[ratParticles.particles.length-1].velocity.y = mouse.velocityY;
        ratParticles.particles[ratParticles.particles.length-1].velocity.rotation = mouse.velocityX;
        timer = Date.now();
    }
    ratParticles.particles.forEach((x,i,a)=>{
        if(x.x>canvas.width||x.x<0||x.y>canvas.height||x.y<0){
            a.splice(i,1);
        }
    });
    ratParticles.updateEach((element,i)=>{
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