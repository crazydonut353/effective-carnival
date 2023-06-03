function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    //NOTE: this is in radians to reduce lag
    return theta;
  }
// Get the canvas element
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');


/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

var images = ["rat.png"];
async function loadImages(images) {
    for (let index = 0; index < images.length; index++) {
        const a = await fetch(images[index]);
        images[index] = a;
    }
}
var bullets = [];
var bullet = new Image();
bullet.addEventListener("load", gameloop());
bullet.src = "rat.png";



canvas.addEventListener("click", (e) => {
    bullets.push([0,0,angle(0,0,e.clientX,e.clientY)])
})

function gameloop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (let index = 0; index < bullets.length; index++) {
        ctx.rotate(bullets[index][2]);
        ctx.drawImage(bullet, bullets[index][0],bullets[index][1], 200, 100);
        ctx.rotate(-bullets[index][2]);
        bullets[index][0] += Math.cos(bullets[index][2]);
        //bullets[index][1] += Math.sin(bullets[index][2]);
    }
    requestAnimationFrame(gameloop)
}