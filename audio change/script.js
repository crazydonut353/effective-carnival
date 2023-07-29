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
let microphone;
/**
 * @type {AudioContext}
 */
const aCtx = (window.AudioContext);
navigator.mediaDevices.getUserMedia({audio:true})
.then((stream) => {
    microphone = aCtx.createMediaStreamSource(stream);
})