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

var box = new Box(gl,-1,-1,0,0);

const start = Date.now();

var mouse = {
    x:0,
    y:0,
    down:false,
};

var positionAttributeLocation;
var resolutionLocation;
var timeLocation;
var audioContext = new AudioContext();

const mainshader = new Shader(document.querySelector("#vertex-shader-2d").text,document.querySelector("#fragment-shader-2d").text); // Custom shader class

function resize(canvas) {
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    document.body.style.overflow = "hidden";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    gl.viewport(0,0,canvas.width*2,canvas.height*2);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
}

function setupMouse() {
}

function setupShaders() {
    // Compiles the vertex shader and fragment shader then packages them into one program ( mainshader.program ).
    mainshader.setup(gl);
    
    // Look up the attributes here.
    positionAttributeLocation = gl.getAttribLocation(mainshader.program, "a_position");
    
    // Look up the translation uniforms here.
    resolutionLocation = gl.getUniformLocation(mainshader.program, "u_resolution");
    timeLocation = gl.getUniformLocation(mainshader.program, "iTime");
}

async function init() {
    setupShaders();
    setupMouse();
    
    resize(canvas);
    
    gl.useProgram(mainshader.program);
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    gameloop();
}

function gameloop() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    resize(canvas);
    gl.uniform1f(timeLocation,Date.now()-start);
    
    box.render(gl, positionAttributeLocation);
    
    requestAnimationFrame(gameloop);
}

init();