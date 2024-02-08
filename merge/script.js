import { Images } from "./lib/BetterImage.js";
import { AudioCollection } from "./lib/BetterAudio.js";
import { Particle, ParticleCollection } from "./lib/particle.js";

// Get the canvas element
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

//get the 2d canvas rendering context
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

// Main game elements

var wincount = 0;
var money = 0;

var lastWin = Date.now();

var map = {
    x: (canvas.width/2)-200,
    y: (canvas.height/2)-200,
    colomns:4,
    rows:4,
    tiles:[
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1
    ],
    tsize:100
}

// Other game vars

var audioContext = new AudioContext();

var mouse = {
    x:0,
    y:0,
    dragging:false,
    itemDragging:0,
    originalIndex:0
};

const imageAssets = new Images([
    "./images/tiles.png",
    "./images/rainbowchez.png"
]);
const audioAssets = new AudioCollection([
    "./sounds/mergeSound.wav",
    "./sounds/Final.wav",
    "./sounds/01.wav"
]);

var winParticles = null;

// Game functions

async function init() {
    document.addEventListener("mousemove", (e) => {
        mouse.x=e.clientX;
        mouse.y=e.clientY;
    });
    document.addEventListener("mousedown", mouseDragStart);
    document.addEventListener("mouseup", mouseDragEnd);
    
    await imageAssets.load();
    await audioAssets.getFile(audioContext);
    
    winParticles = new ParticleCollection(imageAssets.files[1]);
    
    resize();
    
    map.x = (canvas.width/2)-200;
    map.y = (canvas.height/2)-200;
    
    gameloop();
}

function mouseDragStart(e) {
    const tileIndex = Math.floor((mouse.x-map.x)/map.tsize)+(Math.floor((mouse.y-map.y)/map.tsize)*map.colomns);
    const itemDragging = map.tiles[tileIndex];
    
    if(
            map.x<=mouse.x && mouse.x<=map.x+(map.tsize*map.colomns) &&
            map.y<=mouse.y && mouse.y<=map.y+(map.tsize*map.rows) && itemDragging != 0
      ) {
        mouse.originalIndex = tileIndex;
        map.tiles[tileIndex] = 0;
        mouse.itemDragging=itemDragging;
        mouse.dragging=true;
    }
}

function mouseDragEnd(e) {
    if(mouse.dragging) {
        const tileIndex = Math.floor((mouse.x-map.x)/map.tsize)+(Math.floor((mouse.y-map.y)/map.tsize)*map.colomns);
        if(map.x<=mouse.x && mouse.x<=map.x+(map.tsize*map.colomns) &&
        map.y<=mouse.y && mouse.y<=map.y+(map.tsize*map.rows) && (map.tiles[tileIndex] == mouse.itemDragging || map.tiles[tileIndex] == 0)) {
            placeTile(tileIndex, mouse.itemDragging);
        } else {
            placeTile(mouse.originalIndex, mouse.itemDragging);
        }
        
    }
    
    mouse.dragging=false;
}

function placeTile(index, tile) {
    // 4 8 12 16
    if(map.tiles[index]==tile) {
        
        switch (tile) {
            case 4:
                map.tiles.forEach((v,i,a)=>{a[i]=tile+1});
                audioAssets.playsound(1,audioContext);
                break;
            case 8:
                map.tiles.forEach((v,i,a)=>{a[i]=tile+1});
                audioAssets.playsound(1,audioContext);
                break;
            case 12:
                map.tiles.forEach((v,i,a)=>{a[i]=tile+1});
                audioAssets.playsound(1,audioContext);
                break;
            case 16:
                map.tiles.forEach((v,i,a)=>{a[i]=1}); // Reset tiles
                for(let i = 0; i<20; i++){
                    let a = winParticles.pushParticle(canvas.width/2,canvas.height/2,0,50);
                    winParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
                    winParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
                    winParticles.particles[a].velocity.rotation=winParticles.particles[a].velocity.x;
                }
                money += Math.floor(Math.random()*1000);
                wincount++;
                lastWin = Date.now();
                audioAssets.playsound(2,audioContext);
                break;
            default:
                map.tiles[index]++;
                audioAssets.playsound(0,audioContext);
                break;
        }
        
    } else if(map.tiles[index]==0) {
        map.tiles[index]=tile;
    }
}

function gameloop() {
    resize();
    
    winParticles.updateEach((x,i)=>{

    });
    winParticles.particles.forEach((x,i,a)=>{
        if(x.x>=ctx.canvas.width+100||x.x<=0-100||x.y>=ctx.canvas.height+100||x.y<=0-100){
            a.splice(i,1);
        }
    });
    
    render();
    
    requestAnimationFrame(gameloop);
}

function render() {
    // Set image smoothing
    
    ctx.imageSmoothingEnabled = false;
    
    // Render background
    
    ctx.fillStyle = "tan";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    
    // Render tiles
    
    for(let c = 0; c < map.colomns; c++) {
        for(let r = 0; r < map.rows; r++) {
            ctx.drawImage(imageAssets.files[0],map.tiles[c+(r*map.colomns)]*100,0,100,100,map.x+(c*map.tsize),map.y+(r*map.tsize),map.tsize,map.tsize);
        }
    }
    
    // Render text
    
    ctx.fillStyle = "#331800";
    ctx.font = "22px arial";
    ctx.fillText("Rainbow cheeses - " + wincount,0,22);
    ctx.fillText("Money - " + money + "$",0,44);
    
    // Render particles
    
    winParticles.updateEach((element,i)=>{
        element.draw(ctx);
    })
    
    // Render dragging object
    
    if(mouse.dragging==true){
        ctx.drawImage(imageAssets.files[0],mouse.itemDragging*100,0,100,100,mouse.x-(map.tsize),mouse.y-(map.tsize),map.tsize*2,map.tsize*2)
    }
}

function resize() {
    map.x = (canvas.width/2)-200;
    map.y = (canvas.height/2)-200;
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
}

// Run the game!

init();