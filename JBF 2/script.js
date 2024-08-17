import { Box } from "./lib/box.js";
import { Shader } from "./lib/shader.js";
import { Images } from "./lib/BetterImage.js";
import { FXFilter, DualFXFilter } from "./lib/postfx.js";

import { Game } from "./game/game.js";

// Get A WebGL context
const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");

// Get the strings for our GLSL shaders
const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

// Create a simple box
const GAME = new Game(gl, null, null)

var resolutionLocation;
var translationLocation;
var rotationLocation;
var texCoordLocation;
var positionAttributeLocation;
var scaleLocation;


// game stuff
const imageAssets = new Images(["./assets/image/home.png"]);

// Shader
const fx = new DualFXFilter(gl, document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#framebuffer-fragment-shader-2d").text);
const mainshader = new Shader(document.querySelector("#vertex-shader-2d").text,document.querySelector("#fragment-shader-2d").text);

function resize(canvas) {
  document.body.style.padding = "0px";
  document.body.style.margin = "0px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
}

async function init() {
  
  
  await imageAssets.load();
  mainshader.setup(gl);
  
  // look up where the vertex data needs to go.
  texCoordLocation = gl.getAttribLocation(mainshader.program, "a_texCoord");
  positionAttributeLocation = gl.getAttribLocation(mainshader.program, "a_position");
  resolutionLocation = gl.getUniformLocation(mainshader.program, "u_resolution");
  translationLocation = gl.getUniformLocation(mainshader.program, "u_translation");
  rotationLocation = gl.getUniformLocation(mainshader.program, "u_rotation");
  scaleLocation = gl.getUniformLocation(mainshader.program, "u_scale");
  
  await GAME.init(gl, translationLocation, rotationLocation, scaleLocation);
  
  GAME.texCoordLoc = texCoordLocation;
  GAME.posAttribLoc = positionAttributeLocation;
  
  resize(canvas);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  

  // Turn on the attribute
  
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(texCoordLocation);
  
 
  gameloop();
}

function gameloop() {
  // Set the main rendering shader program
  gl.useProgram(mainshader.program);
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear the framebuffer before rendering
  
  if(gl.canvas.width > 1000) {
    resize(canvas);
    GAME.gameloop(gl,fx);
  }
  
  requestAnimationFrame(gameloop);

}

init();
