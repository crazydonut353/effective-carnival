import { BottleParticle } from "./classes.js";
import { Images } from "./BetterImage.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var imageAssets = new Images(["./bottle.png"]);

var particles = [];

var lastspawn = 0;

var spawnDelay = 1000;

var mouse = {x:0,y:0,down:false};

var points = 0;

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
    
    particles.push(new BottleParticle(0,0,12,imageAssets.files[0],100));
    
    lastspawn=Date.now();
    
    resize()
    
    gameloop()
}

function gameloop() {
    resize();
    
    
    
    
    
    
    
    for (let index = 0; index < particles.length; index++) {
        particles[index].update();
        particles[index].draw(ctx);
        
        particles[index].y>canvas.height ? particles.splice(index,1) : null;
        
        if(mouse.down==true){
            var distance = Math.sqrt(Math.pow(particles[index].x-mouse.x,2) + Math.pow(particles[index].y-mouse.y,2));
            distance<=50||distance<=-50 ? particles.splice(index,1) : null;
        }
    }
    mouse.down=false;
    
    if(lastspawn+spawnDelay<=Date.now()) {
        particles.push(new BottleParticle(Math.floor(Math.random()*canvas.width),0,12,imageAssets.files[0],100));
        lastspawn=Date.now();
    }
    requestAnimationFrame(gameloop)
    
}
init();
document.addEventListener("click", (e)=>{
    mouse.down=true;
    mouse.x = e.clientX;
    mouse.y=e.clientY;
})