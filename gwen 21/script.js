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
}

var GMKeys = {};
var player = {x:0,y:0,width:100,height:100}

// Get the strings for our GLSL shaders
const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

// Create a simple box
//var fx = new FXFilter(gl,document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#framebuffer-fragment-shader-2d").text);
const sillyman = new Box(gl, 0, 0, 100, 100);
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
   "./img/shitty_gwen.jpg"
]);

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

function detectCollision(tiles, rows, columns, tSize, rectangle) {
  let endPos = {x:rectangle.x,y:rectangle.y,width:rectangle.width,height:rectangle.height};
  const startCol = Math.floor(rectangle.x / 100);
  const endCol = (startCol + Math.ceil(rectangle.width / 100));
  const startRow = Math.floor(rectangle.y / 100);
  const endRow = (startRow + Math.ceil(rectangle.height / 100));
  // Loop through each tile
  
  return endPos;
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
  
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(texCoordLocation);
  
 
  gameloop();
}

function update() {
  resize(canvas);
  
  GMKeys["d"]?tiles.camera.x+=15:null;
  GMKeys["a"]?tiles.camera.x-=15:null;
  GMKeys["w"]?tiles.camera.y-=15:null;
  GMKeys["s"]?tiles.camera.y+=15:null;
  
  let e = detectCollision(tiles.tilemap,tiles.numRows,tiles.numColumns,tiles.map.tsize,{x:tiles.camera.x,y:tiles.camera.y,width:100,height:100})
  
  
  //audioContext.resume();
}

function gameloop() {
  // Set the main rendering shader program
  gl.useProgram(mainshader.program);
  update();
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear the framebuffer before rendering
  
  tiles.render(gl, sourceUniforms, texCoordLocation, positionAttributeLocation);
  sillyman.update(gl);
  gl.uniform2f(sourceUniforms.scale, 1, 1);
  gl.uniform2f(sourceUniforms.pos, 0, 0);
  sillyman.render(gl, texCoordLocation, positionAttributeLocation);
  
  requestAnimationFrame(gameloop);
}


document.addEventListener("keydown", (e)=>{GMKeys[e.key]=true});
document.addEventListener("keyup", (e)=>{GMKeys[e.key]=false});
init();
