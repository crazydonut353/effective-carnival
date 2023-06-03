let audio1 = new Audio("videoplayback (1).weba")
var video = document.createElement('video');

video.addEventListener("loadedmetadata", () => {
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
var audioCtx;
const bar = new Image();
bar.src = "bar.jpg";
const bg = new Image();
bg.src = "bg.jpg";

function resize() {
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
}
resize();
let audioSource;
let analyser;

document.addEventListener("click", () => {
    video.loop = true;
    video.play();
    audioCtx = new AudioContext();
    audio1.play();
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x = 0;
    
    function animate() {
        x=0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        analyser.getByteFrequencyData(dataArray);
        ctx.drawImage(video,0-dataArray[5]*5/2,0-dataArray[5]*5/2,canvas.width+dataArray[5]*5,canvas.height+dataArray[5]*5) 
        ctx.font = "48px serif";
        ctx.fillText("HAPPY BIRTHDAY ROSS!!!", 10, 50);
        for(let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = "blue";
            ctx.drawImage(bar, x, canvas.height - barHeight, barWidth , barHeight);
            x+=barWidth;
        }
        
        requestAnimationFrame(animate);
    }
    console.log(bufferLength)
    animate();
})
});
video.src = "fire.mp4";