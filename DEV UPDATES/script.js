import { Box } from "./lib/box.js";
import { Shader } from "./lib/shader.js";
import { Images } from "./lib/BetterImage.js";
import { FXFilter, DualFXFilter } from "./lib/postfx.js";

// WebGL
/** @type { HTMLCanvasElement } */
const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");

var joe = new Box(gl, 0, 0, 400,400);

var ball = {
    x : 0.11,
    y : 0.11,
    vx : .0123,
    vy : .0332,
    r : 0.1
}

const mainshader = new Shader(document.querySelector("#vertex-shader-2d").text,document.querySelector("#fragment-shader-2d").text); // Custom shader class
const fx = new FXFilter(gl, document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#framebuffer-fragment-shader-2d").text);

var texCoordLocation;
var resolutionLocation;
var ballPosLocation;
var positionAttributeLocation;

var transUniforms = {
    scaleLocation:null,
    translationLocation:null,
    rotationLocation:null
};

// Assets
const imageAssets = new Images([
    "./IMG_8985.JPG",
    "./num.png"
]);

function resize(canvas) {
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = 400;
    canvas.height = 400;
    gl.viewport(0,0,canvas.width,canvas.height)
}

function setupMouse() {
    document.addEventListener("mousemove",(e)=>{mouse.x=e.clientX;mouse.y=e.clientY;});
    document.addEventListener("mousedown",()=>{mouse.down=true;});
    document.addEventListener("mouseup",()=>{mouse.down=false;});
}

function detectColl(x,y,r) {
    return x+r>=1||x-r<=0||y+r>=1||y-r<=0;
}

function setupShaders() {
    // Compiles the vertex shader and fragment shader then packages them into one program ( mainshader.program ).
    mainshader.setup(gl);
    
    // Look up the attributes here.
    texCoordLocation = gl.getAttribLocation(mainshader.program, "a_texCoord");
    positionAttributeLocation = gl.getAttribLocation(mainshader.program, "a_position");
    
    // Look up the uniforms here.
    resolutionLocation = gl.getUniformLocation(mainshader.program, "u_resolution");
    transUniforms.translationLocation = gl.getUniformLocation(mainshader.program, "u_translation");
    transUniforms.rotationLocation = gl.getUniformLocation(mainshader.program, "u_rotation");
    transUniforms.scaleLocation = gl.getUniformLocation(mainshader.program, "u_scale");
    ballPosLocation = gl.getUniformLocation(fx.program, "center");
}

async function init() {
    await imageAssets.load();
    
    setupShaders();
    
    joe.setTexture(imageAssets.files[0], gl);
    joe.setTransforms(transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation);
    
    resize(canvas);
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(texCoordLocation);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 1);
    
    gameloop();
}

function gameloop() {
    gl.useProgram(mainshader.program);
    joe.update(gl);
    
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, fx.framebuffer)
    joe.render(gl, texCoordLocation, positionAttributeLocation);
    
    joe.render(gl, texCoordLocation, positionAttributeLocation);
    
    gl.useProgram(fx.program);
    gl.uniform2f(ballPosLocation, ball.x, ball.y);
    fx.render(gl);
    
    if(ball.x+ball.r>=1||ball.x-ball.r<=0) {
        ball.vx = -ball.vx;
    }
    
    if(ball.y+ball.r>=1||ball.y-ball.r<=0) {
        ball.vy = -ball.vy;
    }
    
    //ball.x+=ball.vx;
    //ball.y+=ball.vy;
    
    requestAnimationFrame(gameloop);
}

canvas.addEventListener("mousemove", (e) => {
    console.log((e.offsetX)/canvas.width)
    ball.x = (e.offsetX)/canvas.width;
    ball.y = 1-((e.offsetY)/canvas.height);
});

init();