function main() {
    var particles = []
/**
 * @type {CanvasRenderingContext2D}
 */
var ctx = document.getElementById("c").getContext("2d");

ctx.canvas.width = window.screen.width;
ctx.canvas.height = window.screen.height;

var lastFrame = Date.now();

var onedegree = Math.PI/360;

var pumpkinImage = new Image();
pumpkinImage.onload = loop;
particles.push([Math.floor(Math.random() * ctx.canvas.width),-(pumpkinImage.height/2),Math.floor(Math.random() * 30)+3,Math.floor(Math.random() * 30)-15]);
pumpkinImage.src = new Array("./images/pumpkin.png", "./images/cookie.svg")[Math.floor(Math.floor(Math.random()*500)/499)]

function loop() {
    
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = document.body.clientHeight +20;
    if(lastFrame+(particles.length*50)<Date.now()){
        particles.push([Math.floor(Math.random() * ctx.canvas.width),-(pumpkinImage.height/2),Math.floor(Math.random() * 30)+3,Math.floor(Math.random() * 30)-15]);
        lastFrame = Date.now()
    }
    
    particles.forEach(element => {
        
        //ctx.drawImage(pumpkinImage, element[0], element[1], 150, 100);
        ctx.save();
        ctx.translate(element[0], element[1]);
        ctx.rotate(element[3] * onedegree);
        ctx.drawImage(pumpkinImage, -75, -50, 150, 100);
        ctx.restore();
        
        element[3] > 0 ? element[3]+=3 : element[3]-=3;
        element[1]+=element[2]/10;
    });
    
    particles.forEach((element, i) => {
        if(element[1] > ctx.canvas.height + 100) {
            particles.splice(i, 1);
        }
    });
    
    
    

    
    requestAnimationFrame(loop);
    
}
}
document.onload = main();