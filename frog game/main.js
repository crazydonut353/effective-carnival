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

var imageAssets = new Images(["./TILED/TILESET/tiles.png", "./images/player.png"]);

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
    
    let map = await new MapLoader().parse("./TILED/MAPS/map.json");
    
    let tdata = await new TilesetLoader().parse("./TILED/TILESET/tiles.json")
    
    resize();
    
    MainLayer = new Tiles(map, canvas, imageAssets.files[0],tdata,3);
    
    player = new Player(imageAssets.files[1]);
    
    //MainLayer.camera.x = 10*50;
    //MainLayer.camera.y = 30*50;
    
    
    gameloop();
}
function gameloop() {
    player.ahh()
    
    resize();
    
    MainLayer.render(ctx,50);
    
    player.draw(ctx);
    
    requestAnimationFrame(gameloop);
}
init();