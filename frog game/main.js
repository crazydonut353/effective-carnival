import { Images } from "./lib/BetterImage.js";
import { MapLoader } from "./lib/mapLoader.js";
import { TilesetLoader } from "./lib/TilesetLoader.js";
import { Tiles } from "./lib/tiles.js";
import { Player } from "./lib/Player.js";
import { Particle, ParticleCollection } from "./lib/particle.js";
import { AudioCollection } from "./lib/BetterAudio.js";

const perfectFrameTime = 1000/80;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var audioContext = new AudioContext();

var dedTrans = 1;

var maps = [
    "./TILED/MAPS/map.json",
    "./TILED/MAPS/pooky-pool.json",
    "./TILED/MAPS/FANTASTIC-fall.json",
    "./TILED/MAPS/frantic-forest.json",
    "./TILED/MAPS/parkour-pass.json",
    "./TILED/MAPS/pumpkin-pop.json",
    "./TILED/MAPS/harmon-harassment.json",
    "./TILED/MAPS/halloween1.json",
    "./TILED/MAPS/pesemistic-pond.json",
    "./TILED/MAPS/boostjump.json"
];
var spawns = [
    [500,2350],
    [283.1111111083754,750],
    [299.1111111111112,700],
    [642.8888888888889,2150],
    [(10*50),(10*50)],
    [459.1111111111111,3650],
    [500,600],
    [(5*50),(5*50)],
    [(10*50),(10*50)],
    [14*50,58*50]
];

var audioAssets = new AudioCollection([
    "./sounds/jump.wav",
    "./sounds/pickupCoin.wav",
    "./sounds/explosion.wav",
    "./sounds/nextmap.wav",
    "./sounds/videoplayback.m4a"
]);

var tutorail = {
    "wasd":false,
    "pumpkin":false,
    "leveled":false
}

/**
 * @type {ParticleCollection}
 */
var eggExplodeParticles;
var pumpkinExplodeParticles;
var magicParticles1;

var iMap = 0;

var paused=false;

/**
 * @type {Tiles}
 */

var MainLayer;

/**
 * @type {Player}
 */
var player;

var mouse = {
    x : 0,
    y : 0,
    down : 0
}

var GMKeys = {};
var GMPoints = {
    pumpkins:0,
    level:0
}
var lastUpdate = Date.now();
var imageAssets = new Images([
    "./TILED/TILESET/tiles.png",
    "./images/player.png",
    "./images/egg-spark.png",
    "./images/old-pump-explode.png",
    "./images/pump-bg.png",
    "./images/inv.png",
    "./images/mag1.png"
]);

function resize() {
    
    document.body.style.overflow = "hidden"
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight+1;
    MainLayer.camera.width=canvas.width;
    MainLayer.camera.height=canvas.height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.imageSmoothingEnabled = false;
}

async function nextMap() {
    paused=true;
    iMap++;
    let map = await new MapLoader().parse(maps[iMap]);
    MainLayer.backgroundColor=map.backgroundcolor;
    MainLayer.tilemap = map.data;
    MainLayer.numRows = map.height;
    MainLayer.numColumns = map.width;
    console.log(map.data)
    player.x = spawns[iMap][0];
    player.y = spawns[iMap][1];
    paused=false;
}

async function init() {
    document.removeEventListener("click", init, true);
    document.addEventListener("mousemove", (e)=>{
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener("mousedown", () => {mouse.down=true});
    document.addEventListener("mouseup", () => {mouse.down=false});
    
    await imageAssets.load();
    
    await audioAssets.getFile(audioContext);
    
    audioAssets.playsound(1,audioContext);
    
    eggExplodeParticles=new ParticleCollection(imageAssets.files[2]);
    
    pumpkinExplodeParticles=new ParticleCollection(imageAssets.files[3]);
    
    magicParticles1=new ParticleCollection(imageAssets.files[6]);
    magicParticles1.particleLimit = 10;
    
    let map = await new MapLoader().parse(maps[iMap]);
    
    let tdata = await new TilesetLoader().parse("./TILED/TILESET/tiles.json");
    
    
    
    MainLayer = new Tiles(map, canvas, imageAssets.files[0],tdata,3);
    
    resize();
    
    player = new Player(imageAssets.files[1],MainLayer);
    
    player.pumpkinExplodeParticles=pumpkinExplodeParticles;
    
    player.eggExplodeParticles=eggExplodeParticles;
    player.magicParticles1=magicParticles1;
    
    player.x = spawns[iMap][0];
    player.y = spawns[iMap][1];
    
    player.middleX = (canvas.width/2)-50;
    player.middleY = (canvas.height/2)-50;
    
    audioAssets.playsound(4,audioContext);
    
    lastUpdate = Date.now();
    
    gameloop();
}
async function gameloop() {
    var now = Date.now();
    var dt = (now - lastUpdate) / perfectFrameTime;
    lastUpdate = Date.now();
    
    if(!paused) {
        player.middleX = (canvas.width/2); // note to self: delete on release
        player.middleY = (canvas.height/2);// note to self: delete on release
        
        MainLayer.camera.x = player.x;
        MainLayer.camera.y = player.y;
        
        resize();
        w
        MainLayer.render(ctx,50);
        
        player.update(GMKeys,ctx,nextMap,iMap,maps,spawns,audioAssets,audioContext,dt,GMPoints,tutorail,()=>{
            dedTrans=1;
        }, mouse);
        
        player.draw(ctx);
        
        eggExplodeParticles.updateEach((element,i)=>{
            element.draw(ctx);
        })
        pumpkinExplodeParticles.updateEach((element,i)=>{
            element.draw(ctx);
        });
        magicParticles1.updateEach((element,i)=>{
            element.draw(ctx);
        });
        ctx.fillStyle="black"
        ctx.drawImage(imageAssets.files[4],5,5,60,60)
        ctx.drawImage(imageAssets.files[0],32,128,32,32,10,10,50,50);
        ctx.drawImage(imageAssets.files[5],(canvas.width/2)-250,canvas.height-150,500,100)
        
        
        ctx.font = "30px Comic Sans MS";
        ctx.fillText(GMPoints.pumpkins, 75, 50);
        
        if(!tutorail.wasd) {
            ctx.fillText("u are frog, use WASD to move", (canvas.width/2)-10, (canvas.height/2)-50);
        } else if(!tutorail.pumpkin) {
            ctx.fillText("Jump on the pumpkin to gain a point!", (canvas.width/2)-10, (canvas.height/2)-50);
        } else if(!tutorail.leveled) {
            ctx.fillText("parkour to the platform and jump on the rainbow egg", (canvas.width/2)-10, (canvas.height/2)-50);
        } else {
            ctx.fillStyle=`rgba(255,0,0,${dedTrans})`;
            ctx.fillText("DEATH", (canvas.width/2)-10, (canvas.height/2)-50);
            dedTrans-=0.01;
        }
        
        if (GMKeys["n"]) {
            nextMap();
            GMKeys["n"] = false;
        }
    } else {
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="white";
        ctx.font = "50px Comic Sans MS";
        ctx.fillText("Loading Next Map...", (canvas.width/2)-10, (canvas.height/2)-50);
    }
    
    requestAnimationFrame(gameloop);
}

ctx.fillText("Click to start game!",30,50)

document.addEventListener("keydown", (e)=>{GMKeys[e.key]=true});
document.addEventListener("keyup", (e)=>{GMKeys[e.key]=false});
document.addEventListener("click", init())