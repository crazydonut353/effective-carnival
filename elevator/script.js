// Get the canvas element
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

//get the 2d canvas rendering context
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

function resize() {
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
}
window.onload = function(){
    resize();
    
}
function gameloop() {
    
}
