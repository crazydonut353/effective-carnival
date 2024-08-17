import { Images } from "./lib/BetterImage.js";
import { AudioCollection } from "./lib/BetterAudio.js";
import { Box } from "./lib/box.js";
import { Shader } from "./lib/shader.js";
import { FXFilter } from "./lib/postfx.js";

/**
 * @type {HTMLCanvasElement}
 */
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

var mouse = {
    x:0,
    y:0,
    dragging:false,
    itemDragging:0,
    originalIndex:0
};

var level = 0;

var wincount = 0;

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

const tileBox = new Box(gl, 0, 0, 100, 100);
const numBox = new Box(gl, 0, 0, 100, 100);

var lastWin = Date.now();

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
    "./sounds/gamble.wav",
    "./sounds/fungi.wav"
]);

var winParticles = null;
var bombParticles = null;
var chezParticles = null;

var map = {
    x: (window.innerWidth/2)-200,
    y: (window.innerHeight/2)-200,
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

var money = 0;

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
    document.addEventListener("mousedown",mouseDragStart);
    document.addEventListener("mouseup",mouseDragEnd);
}

function mouseDragStart(e) {
    //const shopItem = mouseInUi(mouse.x,mouse.y);
    //if(shopItem != undefined && money >= shopItem.cost) {
    //    shopItem.eventFunc();
    //    money -= shopItem.cost;
    //}
    
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
                //audioAssets.playsound(1,audioContext);
                level++;
                mouse.dragging = false;
                break;
            case 8:
                map.tiles.forEach((v,i,a)=>{a[i]=tile+1});
                //audioAssets.playsound(1,audioContext);
                mouse.dragging = false;
                level++;
                break;
            case 12:
                map.tiles.forEach((v,i,a)=>{a[i]=tile+1});
                //audioAssets.playsound(1,audioContext);
                mouse.dragging = false;
                level++;
                break;
            case 16:
                map.tiles.forEach((v,i,a)=>{a[i]=1}); // Reset tiles
                for(let i = 0; i<20; i++){
                    // particle spawn
                }
                money += Math.floor(Math.random()*1000);
                wincount++;
                lastWin = Date.now();
                mouse.dragging = false;
                //audioAssets.playsound(2,audioContext);
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
    setupShaders();
    setupMouse();
    
    await imageAssets.load();
    await audioAssets.getFile(audioContext);
    
    tileBox.setTransforms(transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation);
    tileBox.setTexture(imageAssets.files[0],gl);
    
    tileBox.setTransforms(transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation);
    tileBox.setTexture(imageAssets.files[0],gl);
    
    resize(canvas);
    
    gl.clearColor(1, .8, .6, 1);
    
    gl.useProgram(mainshader.program);
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(texCoordLocation);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    audioAssets.playsound(5,audioContext);
    
    gameloop();
}

function gameloop() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    resize(canvas);
    
    tileBox.width=100;
    tileBox.height=100;
    for(let r = 0; r < map.rows; r++) {
        for(let c = 0; c < map.colomns; c++) {
            tileBox.x = (c * map.tsize)+map.x;
            tileBox.y = (r * map.tsize)+map.y;
            gl.uniform2f(sourceUniforms.scale, 1/18, 1);
            gl.uniform2f(sourceUniforms.pos, (1/18)*map.tiles[r*map.colomns+c],0); 
            tileBox.update(gl);
            tileBox.render(gl, texCoordLocation, positionAttributeLocation);
        }
    }
    
    if(mouse.dragging==true){
        tileBox.width=200;
        tileBox.height=200;
        tileBox.x = mouse.x-100;
        tileBox.y = mouse.y-100;
        gl.uniform2f(sourceUniforms.scale, 1/18, 1);
        gl.uniform2f(sourceUniforms.pos, (1/18)*mouse.itemDragging,0); 
        tileBox.update(gl);
        tileBox.render(gl, texCoordLocation, positionAttributeLocation);
    }
    
    numBox.render(gl, texCoordLocation, positionAttributeLocation);
    
    requestAnimationFrame(gameloop);
}

init();