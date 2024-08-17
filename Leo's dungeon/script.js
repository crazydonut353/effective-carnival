import { Images } from "./lib/BetterImage.js";
import { AudioCollection } from "./lib/BetterAudio.js";
import { Box } from "./lib/box.js";
import { Shader } from "./lib/shader.js";
import { FXFilter } from "./lib/postfx.js";

import { MapLoader } from "./lib/mapLoader.js";
import {TilesetLoader} from "./lib/TilesetLoader.js"
import { GLTiles } from "./lib/glTiles.js";

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

const background = new GLTiles(gl, canvas, 5);
const foreground = new GLTiles(gl, canvas, -1);
const tiledLoader = new MapLoader();
const tilesetloader = new TilesetLoader();

var texCoordLocation;
var resolutionLocation;
var positionAttributeLocation;

var transUniforms = {
    scaleLocation:null,
    translationLocation:null,
    rotationLocation:null
};

var player = {
    x : 0,
    y : 0
}

var sourceUniforms = {
    scale:null,
    pos:null
};

var imageAssets = new Images([
    "./TILED/TILESET/tilesv1.png"
]);

const mainshader = new Shader(document.querySelector("#vertex-shader-2d").text,document.querySelector("#fragment-shader-2d").text); // Custom shader class
const fx = new FXFilter(gl, document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#framebuffer-fragment-shader-2d").text);

var GMKeys = {};
var mouse = {
    x : 0,
    y : 0,
    down : 0
}

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
    await imageAssets.load();
    var map = await tiledLoader.parse("./TILED/MAP/ENTRANCE.tmj", 0);
    const tileset = await tilesetloader.parse("./TILED/TILESET/tilesv1.json");
    
    setupShaders();
    setupMouse();
    
    background.setup(imageAssets.files[0], transUniforms, map, tileset, gl);
    var map = await tiledLoader.parse("./TILED/MAP/ENTRANCE.tmj", 1);
    foreground.setup(imageAssets.files[0], transUniforms, map, tileset, gl)
    
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
    
    GMKeys["d"]?background.camera.x+=15:null;
    GMKeys["a"]?background.camera.x-=15:null;
    GMKeys["w"]?background.camera.y-=15:null;
    GMKeys["s"]?background.camera.y+=15:null;
    GMKeys["d"]?foreground.camera.x+=15:null;
    GMKeys["a"]?foreground.camera.x-=15:null;
    GMKeys["w"]?foreground.camera.y-=15:null;
    GMKeys["s"]?foreground.camera.y+=15:null;
    
    //audioContext.resume();
}

function render() {
    gl.useProgram(mainshader.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fx.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0,0,1024, 1024);
    background.render(gl, sourceUniforms, texCoordLocation, positionAttributeLocation);
    foreground.render(gl, sourceUniforms, texCoordLocation, positionAttributeLocation);
    fx.render(gl);
}

function gameloop() {
    update();
    
    render();
    
    requestAnimationFrame(gameloop);
}

//document.addEventListener("mousedown",()=>{!RUNNING?init():null});
document.addEventListener("keydown", (e)=>{GMKeys[e.key]=true});
document.addEventListener("keyup", (e)=>{GMKeys[e.key]=false});

init();