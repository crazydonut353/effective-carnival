import { Images } from "./lib/BetterImage.js";
import { MapLoader } from "./lib/mapLoader.js";
import { TilesetLoader } from "./lib/TilesetLoader.js";
import { Tiles } from "./lib/tiles.js";
import { Player } from "./lib/Player.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

/**
 * @type {Tiles}
 */

var MainLayer;

/**
 * @type {Player}
 */
var player;

var GMKeys = {}

var imageAssets = new Images(["./TILED/TILESET/tiles.png", "./images/player.png"]);

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

async function init() {
    await imageAssets.load();
    
    let map = await new MapLoader().parse("./TILED/MAPS/map.json");
    
    let tdata = await new TilesetLoader().parse("./TILED/TILESET/tiles.json")
    
    
    
    MainLayer = new Tiles(map, canvas, imageAssets.files[0],tdata,3);
    
    resize();
    
    player = new Player(imageAssets.files[1],MainLayer);
    
    player.x = (10*50);
    player.y = (30*50);
    
    player.middleX = (canvas.width/2)-50;
    player.middleY = (canvas.height/2)-50;
    
    gameloop();
}
function gameloop() {
    player.middleX = (canvas.width/2)-50; // note to self: delete on release
    player.middleY = (canvas.height/2)-50;// note to self: delete on release
    
    MainLayer.camera.x = player.x;
    MainLayer.camera.y = player.y;
    
    resize();
    
    MainLayer.render(ctx,50);
    
    player.update(GMKeys,ctx);
    
    player.draw(ctx);
    
    requestAnimationFrame(gameloop);
}
init();
document.addEventListener("keydown", (e)=>{GMKeys[e.key]=true});
document.addEventListener("keyup", (e)=>{GMKeys[e.key]=false});