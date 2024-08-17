import { Box } from "./lib/box.js";
import { Shader } from "./lib/shader.js";
import { Images } from "./lib/BetterImage.js";
import { FXFilter, DualFXFilter } from "./lib/postfx.js";

import { Gun } from "./assets/script/gun.js";
import { BallSystem } from "./assets/script/balls.js";
import { Bullet } from "./assets/script/bullets.js";

// WebGL
/** @type { HTMLCanvasElement } */
const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");

const mainshader = new Shader(document.querySelector("#vertex-shader-2d").text,document.querySelector("#fragment-shader-2d").text); // Custom shader class
const fx = new DualFXFilter(gl, document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#framebuffer-fragment-shader-2d").text);
const chromaticAbberation = new FXFilter(gl, document.querySelector("#framebuffer-vertex-shader-2d").text,document.querySelector("#chromatic-fragment-shader-2d").text);

var transUniforms = {
    scaleLocation:null,
    translationLocation:null,
    rotationLocation:null
};

var texCoordLocation;
var resolutionLocation;
var positionAttributeLocation;

// Assets
const imageAssets = new Images([
]);

// Game
const gun = new Gun(gl);
const ballsystem = new BallSystem(gl)

var mouse = {
    x:0,
    y:0,
    down:false
}

function rayIntersectsSquare(ray, square) {
    // Define helper functions
    const onSegment = (p, q, r) => {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
            return true;
        }
        return false;
    };

    const orientation = (p, q, r) => {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) return 0; // colinear
        return (val > 0) ? 1 : 2; // clock or counterclockwise
    };

    const doIntersect = (p1, q1, p2, q2) => {
        const o1 = orientation(p1, q1, p2);
        const o2 = orientation(p1, q1, q2);
        const o3 = orientation(p2, q2, p1);
        const o4 = orientation(p2, q2, q1);

        if (o1 !== o2 && o3 !== o4) return true;
        if (o1 === 0 && onSegment(p1, p2, q1)) return true;
        if (o2 === 0 && onSegment(p1, q2, q1)) return true;
        if (o3 === 0 && onSegment(p2, p1, q2)) return true;
        if (o4 === 0 && onSegment(p2, q1, q2)) return true;
        return false;
    };

    // Extract points from ray object
    const { p1, p2 } = ray;
    const op1 = { x: p1.x, y: p1.y };
    const op2 = { x: p2.x, y: p2.y };

    // Extract points from square object
    const x1 = square.x-square.radius;
    const y1 = square.y-square.radius;
    const x2 = square.x+square.radius;
    const y2 = square.y+square.radius;

    // Define square edges
    const edges = [
        [{ x: x1, y: y1 }, { x: x2, y: y1 }],
        [{ x: x2, y: y1 }, { x: x2, y: y2 }],
        [{ x: x2, y: y2 }, { x: x1, y: y2 }],
        [{ x: x1, y: y2 }, { x: x1, y: y1 }]
    ];

    // Check if the ray intersects with any of the square's edges
    for (const edge of edges) {
        if (doIntersect(op1, op2, ...edge)) {
            return true;
        }
    }
    return false;
}


function collisionCircleLine(circle,line){ // Both are objects

    var side1 = Math.sqrt(Math.pow(circle.x - line.p1.x,2) + Math.pow(circle.y - line.p1.y,2)); // Thats the pythagoras theoram If I can spell it right

    var side2 = Math.sqrt(Math.pow(circle.x - line.p2.x,2) + Math.pow(circle.y - line.p2.y,2));

    var base = Math.sqrt(Math.pow(line.p2.x - line.p1.x,2) + Math.pow(line.p2.y - line.p1.y,2));

    if(circle.radius > side1 || circle.radius > side2)
        return true;

    var angle1 = Math.atan2( line.p2.x - line.p1.x, line.p2.y - line.p1.y ) - Math.atan2( circle.x - line.p1.x, circle.y - line.p1.y ); // Some complicated Math

    var angle2 = Math.atan2( line.p1.x - line.p2.x, line.p1.y - line.p2.y ) - Math.atan2( circle.x - line.p2.x, circle.y - line.p2.y ); // Some complicated Math again

    if(angle1 > Math.PI / 2 || angle2 > Math.PI / 2) // Making sure if any angle is an obtuse one and Math.PI / 2 = 90 deg
        return false;


        // Now if none are true then

        var semiperimeter = (side1 + side2 + base) / 2;

        var areaOfTriangle = Math.sqrt( semiperimeter * (semiperimeter - side1) * (semiperimeter - side2) * (semiperimeter - base) ); // Heron's formula for the area

        var height = 2*areaOfTriangle/base;

        if( height < circle.radius )
            return true;
        else
            return false;

}

// General functions 

function resize(canvas) {
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    gl.viewport(0,0,canvas.width,canvas.height)
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
    
    // Look up the uniforms here.
    resolutionLocation = gl.getUniformLocation(mainshader.program, "u_resolution");
    transUniforms.translationLocation = gl.getUniformLocation(mainshader.program, "u_translation");
    transUniforms.rotationLocation = gl.getUniformLocation(mainshader.program, "u_rotation");
    transUniforms.scaleLocation = gl.getUniformLocation(mainshader.program, "u_scale");
}

// Game

function shootCallback(line) {
}

// Main functions

async function init() {
    // Game
    await imageAssets.load();
    setupMouse();
    ballsystem.init(chromaticAbberation.ballCountLocation,chromaticAbberation.ballsLocation);
    
    // WebGL
    setupShaders();
    
    // Setup gun
    await gun.setup(transUniforms);
    
    resize(canvas);
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(texCoordLocation);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 1);
    gameloop();
}

function gameloop() {
    mainshader.use(gl);
    
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
    gun.update(mouse, canvas, shootCallback);
    ballsystem.update();
    
    fx.BindFBO(0, gl);
    gun.render(texCoordLocation, positionAttributeLocation);
    
    fx.BindFBO(1, gl);
    gun.renderBloom(texCoordLocation, positionAttributeLocation);
    
    chromaticAbberation.bindFBO(gl);
    fx.render();
    
    chromaticAbberation.useProgram();
    ballsystem.setUniforms();
    for(let i = 0; i < gun.bulletsystem.bullets.length; i++) {
        let b = gun.bulletsystem.bullets[i];
        gl.uniform2f(chromaticAbberation.point1, b.x, canvas.height - b.y);
        gl.uniform2f(chromaticAbberation.point2, b.x + (Math.sin((360 - b.rotation+90) * Math.PI / 180)*20), canvas.height - (b.y + (Math.cos((360 - b.rotation+90) * Math.PI / 180)*20)));
        for(let j = 0; j < ballsystem.balls.length; j++) {
            const line = gun.toLine(i,canvas);
            if(rayIntersectsSquare(line,ballsystem.balls[j])) {
                console.log(ballsystem.balls.splice(j,1));
                j--;
            }
        }
    }
    chromaticAbberation.render(gl);
    
    resize(canvas);
    
    requestAnimationFrame(gameloop);
}

init();