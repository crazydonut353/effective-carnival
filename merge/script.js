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
var money = 44;
var level = 1;

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
var shopUiData = {
    
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

const ui = [
    {
        title:"bomb",
        cost:200,
        eventFunc:function() {
            if(level<4) {
                audioAssets.playsound(3,audioContext);
                map.tiles.forEach((v,i,a)=>{
                    a[i]=(level*4)+1;
                });
                level++;
                for(let i = 0; i<20; i++){
                    let a = bombParticles.pushParticle(canvas.width/2,canvas.height/2,0,50);
                    bombParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
                    bombParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
                    bombParticles.particles[a].velocity.rotation=bombParticles.particles[a].velocity.x;
                }
            } else {
                level=0;
                map.tiles.forEach((v,i,a)=>{
                    a[i]=(level*4)+1;
                });
                level=1;
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
                for(let i = 0; i<20; i++){
                    let a = bombParticles.pushParticle(canvas.width/2,canvas.height/2,0,50);
                    bombParticles.particles[a].velocity.x=Math.floor(Math.random() * 20)-10; 
                    bombParticles.particles[a].velocity.y=Math.floor(Math.random() * 20)-10; 
                    bombParticles.particles[a].velocity.rotation=bombParticles.particles[a].velocity.x;
                }
            }
        },
        imgIndex:2,
        bg:"rgb(237, 119, 0)",
        discription:"explodes you to the next level"
    },
    {
        title:"gamble",
        cost:7000,
        eventFunc:function() {
            money += Math.floor(Math.random()*8000);
            audioAssets.playsound(4,audioContext);
        },
        imgIndex:4,
        bg:"rgb(100, 0, 74)",
        discription:"gambles"
    },
    {
        title:"chez",
        cost:40,
        eventFunc:function() {
            for(let i = 0; i<10; i++){
                let a = chezParticles.pushParticle(Math.floor(Math.random()*canvas.width),0,0,50);
                chezParticles.particles[a].velocity.x=0; 
                chezParticles.particles[a].velocity.y=Math.floor(Math.random() * 20); 
                chezParticles.particles[a].velocity.rotation=chezParticles.particles[a].velocity.x;
            }
        },
        imgIndex:5,
        bg:"rgb(62, 0, 22)",
        discription:"summons falling chez"
    },
    {
        title:"che",
        cost:4,
        eventFunc:function() {
            let a = chezParticles.pushParticle(Math.floor(Math.random()*canvas.width),10,0,50);
            chezParticles.particles[a].velocity.x=0; 
            chezParticles.particles[a].velocity.y=Math.floor(Math.random() * 20); 
            chezParticles.particles[a].velocity.rotation=chezParticles.particles[a].velocity.x;
        },
        imgIndex:5,
        bg:"rgb(62, 0, 22)",
        discription:"summons falling one chez"
    }
];
const uiData = {
    width: 100,
    height: 100,
    gap: 10,
    bottomGap:10
}

const imageAssets = new Images([
    "./images/tiles.png",
    "./images/rainbowchez.png",
    "./images/Bomb.png",
    "./images/spark.png",
    "./images/gamble.png",
    "./images/chez.png"
]);
const audioAssets = new AudioCollection([
    "./sounds/mergeSound.wav",
    "./sounds/Final.wav",
    "./sounds/01.wav",
    "./sounds/explosion.wav",
    "./sounds/gamble.wav"
]);

var winParticles = null;
var bombParticles = null;
var chezParticles = null;

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
    bombParticles = new ParticleCollection(imageAssets.files[3]);
    chezParticles = new ParticleCollection(imageAssets.files[5]);
    
    resize();
    
    map.x = (canvas.width/2)-200;
    map.y = (canvas.height/2)-200;
    
    gameloop();
}

function mouseInUi(x, y) {
    for (let i = 0; i < ui.length; i++) {
        const boxLeft = ((uiData.width+uiData.gap)*i)+((canvas.width/2)-((uiData.width+(uiData.gap/2))*(ui.length/2)));
        const boxRight = boxLeft+uiData.width;
        const boxTop = canvas.height-(uiData.height+uiData.bottomGap);
        const boxBottom = boxTop+uiData.height;
        if( x < boxRight && boxLeft < x && y > boxTop && y < boxBottom ){
            return ui[i];
        }
    }
}

function mouseDragStart(e) {
    const shopItem = mouseInUi(mouse.x,mouse.y);
    if(shopItem != undefined && money >= shopItem.cost) {
        shopItem.eventFunc();
        money -= shopItem.cost;
    }
    
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
                level++;
                break;
            case 8:
                map.tiles.forEach((v,i,a)=>{a[i]=tile+1});
                audioAssets.playsound(1,audioContext);
                level++;
                break;
            case 12:
                map.tiles.forEach((v,i,a)=>{a[i]=tile+1});
                audioAssets.playsound(1,audioContext);
                level++;
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
                level=1;
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
    bombParticles.updateEach((x,i)=>{

    });
    bombParticles.particles.forEach((x,i,a)=>{
        if(x.x>=ctx.canvas.width+100||x.x<=0-100||x.y>=ctx.canvas.height+100||x.y<=0-100){
            a.splice(i,1);
        }
    });
    chezParticles.updateEach((x,i)=>{

    });
    chezParticles.particles.forEach((x,i,a)=>{
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
    ctx.fillText("Time - " + ((Date.now()-lastWin)/1000),0,66);
    
    // Render ui
    for (let i = 0; i < ui.length; i++) {
        ctx.fillStyle = ui[i].bg;
        ctx.fillRect(((uiData.width+uiData.gap)*i)+((canvas.width/2)-((uiData.width+(uiData.gap/2))*(ui.length/2))),canvas.height-(uiData.height+uiData.bottomGap),uiData.width,uiData.height);
        ctx.fillStyle = "green"
        ctx.font = "20px arial";
        ctx.fillText(ui[i].title,((uiData.width+uiData.gap)*i)+((canvas.width/2)-((uiData.width+(uiData.gap/2))*(ui.length/2)))+(uiData.width/4),canvas.height-(uiData.height+uiData.bottomGap)+20);
        ctx.drawImage(imageAssets.files[ui[i].imgIndex],((uiData.width+uiData.gap)*i)+((canvas.width/2)-((uiData.width+(uiData.gap/2))*(ui.length/2)))+(uiData.width/4),canvas.height-(uiData.height+uiData.bottomGap)+(uiData.height/4));
        ctx.fillText(ui[i].cost + "$",((uiData.width+uiData.gap)*i)+((canvas.width/2)-((uiData.width+(uiData.gap/2))*(ui.length/2)))+(uiData.width/4),canvas.height-(uiData.height+uiData.bottomGap)+(uiData.height-6));
    }
    
    // Render discription
    let el = mouseInUi(mouse.x,mouse.y);
    if(el != undefined) { 
        ctx.fillStyle = "green";
        ctx.fillRect(mouse.x,mouse.y,ctx.measureText(el.discription).width+2,30)
        ctx.font = "20px arial";
        ctx.fillStyle = "tan";
        ctx.fillText(el.discription,mouse.x,mouse.y+20);
    }
    
    // Render particles
    
    winParticles.updateEach((element,i)=>{
        element.draw(ctx);
    });
    bombParticles.updateEach((element,i)=>{
        element.draw(ctx);
    });
    chezParticles.updateEach((element,i)=>{
        element.draw(ctx);
    });
    
    // Render dragging object
    
 
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