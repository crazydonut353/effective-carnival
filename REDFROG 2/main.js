import { Images } from "./lib/BetterImage.js";
import { AudioCollection } from "./lib/BetterAudio.js";
import { Box } from "./lib/box.js";
import { Shader } from "./lib/shader.js";
import { FXFilter } from "./lib/postfx.js";

import { MapLoader } from "./lib/mapLoader.js";
import {TilesetLoader} from "./lib/TilesetLoader.js"
import { GLTiles } from "./lib/glTiles.js";
import { Player } from "./lib/player.js"

const perfectFrameTime = 1000/80;

/**
 * @type { HTMLCanvasElement }
 */
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

var RUNNING = false;

const tiles = new GLTiles(gl, canvas, 3);
const tiledLoader = new MapLoader();
const tilesetloader = new TilesetLoader();

//const fx = new FXFilter(gl, document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#framebuffer-fragment-shader-2d").text)

var mouse = {
    x:0,
    y:0,
    down:false
}

var audioContext = new AudioContext();

const mainshader = new Shader(document.querySelector("#vertex-shader-2d").text,document.querySelector("#fragment-shader-2d").text); // Custom shader class

var texCoordLocation;
var resolutionLocation;
var positionAttributeLocation;

var transUniforms = {
    scaleLocation:null,
    translationLocation:null,
    rotationLocation:null
};

var sourceUniforms = {
    scale:null,
    pos:null
};

var maps = [
    "./TILED/MAPS/map.json",
    "./TILED/MAPS/pooky-pool.json",
    "./TILED/MAPS/FANTASTIC-fall.json",
    "./TILED/MAPS/frantic-forest.json",
    "./TILED/MAPS/parkour-pass.json",
    "./TILED/MAPS/pumpkin-pop.json",
    "./TILED/MAPS/harmon-harassment.json",
    "./TILED/MAPS/halloween1.json",
    "./TILED/MAPS/pesemistic-pond.json"
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
    [(10*50),(10*50)]
];

var player = null;

var audioAssets = new AudioCollection([
    "./sounds/jump.wav",
    "./sounds/pickupCoin.wav",
    "./sounds/explosion.wav",
    "./sounds/nextmap.wav",
    "./sounds/videoplayback.m4a"
]);

var tutorial = {
    "wasd":false,
    "pumpkin":false,
    "leveled":false
}

var onMenu = false;

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
    "./images/pump-bg.png"
]);

function resize(canvas) {
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    document.body.style.overflow = "hidden";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
}

function setupMouse() {
    document.addEventListener("mousemove",(e)=>{mouse.x=e.clientX;mouse.y=e.clientY;});
    document.addEventListener("mousedown",()=>{mouse.down=true;});
    document.addEventListener("mouseup",()=>{mouse.down=false;});
}

function setupShaders() {
    // Compiles the vertex shader and fragment shader then packages them into one program ( mainshader.program ).
    mainshader.setup(gl);
    
    // Look up the attributes here.
    texCoordLocation = gl.getAttribLocation(mainshader.program, "a_texCoord");
    positionAttributeLocation = gl.getAttribLocation(mainshader.program, "a_position");
    
    // Look up the translation uniforms here.
    resolutionLocation = gl.getUniformLocation(mainshader.program, "u_resolution");
    transUniforms.translationLocation = gl.getUniformLocation(mainshader.program, "u_translation");
    transUniforms.rotationLocation = gl.getUniformLocation(mainshader.program, "u_rotation");
    transUniforms.scaleLocation = gl.getUniformLocation(mainshader.program, "u_scale");
    
    // Look up the source image translation uniforms here.
    sourceUniforms.pos = gl.getUniformLocation(mainshader.program, "u_sPos");
    sourceUniforms.scale = gl.getUniformLocation(mainshader.program, "u_sScale");
}


async function init() {
    RUNNING = true;
    
    await imageAssets.load();
    await audioAssets.getFile(audioContext)
    const map = await tiledLoader.parse(maps[0]);
    const tileset = await tilesetloader.parse("./TILED/TILESET/tiles.json");
    
    player = new Player(imageAssets.files[1], gl, transUniforms)
    
    audioContext.resume();
    audioAssets.playsound(4, audioContext);
    
    setupShaders();
    setupMouse();
    
    tiles.setup(imageAssets.files[0], transUniforms, map, tileset, gl)
    
    resize(canvas);
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(texCoordLocation);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 1);
    
    
    
    gameloop();
}

function update() {
    resize(canvas);
    
    GMKeys["d"]?tiles.camera.x+=15:null;
    GMKeys["a"]?tiles.camera.x-=15:null;
    GMKeys["w"]?tiles.camera.y-=15:null;
    GMKeys["s"]?tiles.camera.y+=15:null;
    
    //audioContext.resume();
}

function render() {
    gl.useProgram(mainshader.program);
    //gl.bindFramebuffer(gl.FRAMEBUFFER, fx.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.viewport(0,0,1024, 1024);
    tiles.render(gl, sourceUniforms, texCoordLocation, positionAttributeLocation);
    
    //fx.render(gl);
}

function renderMenu() {
    gl.useProgram(mainshader.program);
    //gl.bindFramebuffer(gl.FRAMEBUFFER, fx.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.viewport(0,0,1024, 1024);
    tiles.render(gl, sourceUniforms, texCoordLocation, positionAttributeLocation);
}

function gameloop() {
    update();
    
    render();
    
    requestAnimationFrame(gameloop);
}

document.addEventListener("mousedown",()=>{!RUNNING?init():null});
document.addEventListener("keydown", (e)=>{GMKeys[e.key]=true});
document.addEventListener("keyup", (e)=>{GMKeys[e.key]=false});