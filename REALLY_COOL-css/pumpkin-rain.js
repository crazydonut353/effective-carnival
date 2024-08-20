import { Images } from "./lib/BetterImage.js";
import { Particle, ParticleCollection_RAND } from "./lib/particle.js";
import { AudioCollection } from "./lib/BetterAudio.js";

//          CFY Homepage v1.0 REL
//
//  This is the full version with no WebGL.

// Get the canvas element
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');

canvas.height = window.screen.height;
canvas.width = window.screen.width;

const imageAssets = new Images(['./images/mozcheese.png', './images/pumpkin.png', './images/chedcheese.png', './images/provcheese.png', './images/amercheese.png']);

var particles = null;

var lastTime = Date.now();

async function init() {
  await imageAssets.load();
  
  particles = new ParticleCollection_RAND(imageAssets.files);
  
  gameloop();
}

function gameloop() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  
  if(lastTime + 100 < Date.now()) {
    let gh = particles.pushParticle(Math.random() * canvas.width, -60, 0, 100);
    
    particles.particles[gh].velocity.y = 0;
    
    lastTime = Date.now();
  }
  
  particles.particles.forEach((x,i,a)=>{
    if(x.x>=ctx.canvas.width||x.x<=0-100||x.y>=ctx.canvas.height+100||x.y<=0-100){
        a.splice(i,1);
    }
  });
  
  particles.updateEach((v, i, a) => {
    v.velocity.y += .1;
    
    v.draw(ctx);
  })
  
  requestAnimationFrame(gameloop);
}

init();