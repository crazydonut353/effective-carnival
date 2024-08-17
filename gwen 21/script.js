import { Box } from "./lib/box.js";
import { Shader } from "./lib/shader.js";
import { Images } from "./lib/BetterImage.js";
import { FXFilter } from "./lib/postfx.js";
import { GLTiles } from "./lib/glTiles.js";
import { TilesetLoader } from "./lib/TilesetLoader.js";
import { MapLoader } from "./lib/mapLoader.js";

document.body.style.cursor = "url(cur/select.cur), auto";

// Get A WebGL context
const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");

var mouse = {
    x:0,
    y:0,
    down:false
};
var player = {
    width : 32,
    height : 32,
    x : 0,
    y : 0,
    vely : 0,
    velx : 0,
    action:"idle",
    lastT:Date.now(),
    frame : 0
}
const ACTIONOBJECT = {
    "idle" : [7,8],
    "waddling" : [9,12]
}

var GMKeys = {};

// Get the strings for our GLSL shaders
const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

// Create a simple box
//var fx = new FXFilter(gl,document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#framebuffer-fragment-shader-2d").text);
const sillyman = new Box(gl, 0, 0, 200, 200);
const tiles = new GLTiles(gl, canvas, 0);

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

// game stuff
const imageAssets = new Images(["./game/TILED/TILESET/maintiles.png",
     "./img/PEnguin_sprites.png"
]);

const maps = [
  "untitled.json",
  "icey1.json"
];
var imap = 0;

// Shader
const mainshader = new Shader(document.querySelector("#vertex-shader-2d").text,document.querySelector("#fragment-shader-2d").text);

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
async function nextMap() {
  imap=(imap+1)%maps.length;
  let map = await new MapLoader().parse("./game/TILED/MAPS/"+maps[imap]);
  tiles.backgroundColor=map.backgroundcolor;
  tiles.tilemap = map.data;
  tiles.numRows = map.height;
  tiles.numColumns = map.width;
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
    mainshader.setup(gl);
    
    setupShaders();
    setupMouse();
    
    resize(canvas);
    tiles.setup(imageAssets.files[0],transUniforms,await new MapLoader().parse("./game/TILED/MAPS/untitled.json"), await new TilesetLoader().parse("./game/TILED/TILESET/maintiles.json"), gl);

    // Clear the canvas
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(.2, .2, .6, 1);
    
    
    sillyman.setTexture(imageAssets.files[1], gl);
    sillyman.setTransforms(transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation);
    // Turn on the attribute
    
    player.x = 1700;
    player.y = 800;
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(texCoordLocation);
    
 
    gameloop();
}

async function update() {
    resize(canvas);
    

    //console.log((Math.floor(tiles.camera.x / 100)*100) + " ss " + (Math.floor(tiles.camera.y / 100)*100));
    
    sillyman.x = (window.innerWidth/2)-150;
    sillyman.y = (window.innerHeight/2)-150;
    
    var startCol = Math.floor(player.x / 100);
    var endCol = (startCol + Math.ceil(player.width / 100));
    var startRow = Math.floor(player.y / 100);
    var endRow = (startRow + Math.ceil(player.height / 100));
    var canJump = false;
    // Loop through each tile
    for(let c = startCol; c <= endCol; c++) {
        if(tiles.map.getTile(c, endRow) != -1 && tiles.map.getTile(c, endRow) != 20) {
            ((c)*100)>=Math.floor((player.x+(player.width-1))/100)*100&&((c)*100)+100<=Math.floor((player.x+(player.width-1))/100)*100?null:canJump=true;
            
            player.y = Math.floor(player.y/100)*100;
            player.vely = 0;
            
        }
        if(tiles.map.getTile(c, endRow) == 20) {
          await nextMap();
          console.log(maps[imap])
        }
    }
    
    var startCol = Math.floor(player.x / 100);
    var endCol = (startCol + Math.ceil(player.width / 100));
    var startRow = Math.floor(player.y / 100);
    var endRow = (startRow + Math.ceil(player.height / 100));
    
    for(let r = startRow; r < endRow; r++) {
        if(tiles.map.getTile(endCol, r) != -1 && tiles.map.getTile(endCol, r) != 20) {
            player.velx = 0;
            //GMKeys["a"]?player.velx-=5:null;
            player.x = Math.floor(player.x/100)*100;
        } else {
            GMKeys["d"]?player.velx+=5:null;
        }
    }
    
    GMKeys["a"]?player.velx-=5:null;
    var startCol = Math.floor((player.x+player.velx) / 100);
    var endCol = (startCol + Math.ceil(player.width / 100));
    var startRow = Math.floor(player.y / 100);
    var endRow = (startRow + Math.ceil(player.height / 100));
    
    for(let r = startRow; r < endRow; r++) {
        if(tiles.map.getTile(startCol, r) != -1 && tiles.map.getTile(startCol, r) != 20) {
            ((c)*100)>=Math.ceil((player.x+(player.width+1))/100)*100&&((c)*100)+100<=Math.ceil((player.x+(player.width+1))/100)*100?null:canJump=true;
            
            player.x = Math.ceil((player.x+player.velx)/100)*100;
            player.velx = 0;
        }
    }
    console.log(tiles.map.getTile(Math.floor((player.x+(100/2))/100),Math.floor((player.y+101)/100)))
    if(tiles.map.getTile(Math.floor((player.x+(100/2))/100),Math.floor((player.y+101)/100))!=-1) {
        GMKeys["w"]?player.vely-=15:null;
    } else {
        player.vely += .5;
    }
    
    player.velx *= .7;
    
    if(Math.floor(player.velx)>0||Math.ceil(player.velx)<0) {
        player.action = "waddling";
    } else {
      player.action = "idle";
    }
    
    if(player.lastT+100<Date.now()) {
        player.frame = (player.frame+1)%((ACTIONOBJECT[player.action][1]-ACTIONOBJECT[player.action][0])+1);
        player.lastT = Date.now();
    }
    
    player.y += player.vely;
    player.x += player.velx;
    
    tiles.camera.x = Math.floor(player.x-(window.innerWidth/2)+50);
    tiles.camera.y = Math.floor(player.y-(window.innerHeight/2)+50);
    
    //audioContext.resume();
}

async function gameloop() {
    // Set the main rendering shader program
    gl.useProgram(mainshader.program);
    await update();
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the framebuffer before rendering
    
    tiles.render(gl, sourceUniforms, texCoordLocation, positionAttributeLocation);
    sillyman.update(gl);
    gl.uniform2f(sourceUniforms.scale, (1/13), 1);
    gl.uniform2f(sourceUniforms.pos, ((1/13)*(player.frame+ACTIONOBJECT[player.action][0])), 0);
    sillyman.render(gl, texCoordLocation, positionAttributeLocation);
    
    requestAnimationFrame(gameloop);
}


document.addEventListener("keydown", (e)=>{GMKeys[e.key]=true});
document.addEventListener("keyup", (e)=>{GMKeys[e.key]=false});
init();
