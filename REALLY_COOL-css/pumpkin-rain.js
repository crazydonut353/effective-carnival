// Get the canvas element
var canvas = document.getElementById('c');
var gl = canvas.getContext('webgl');

canvas.height = window.screen.height;
canvas.width = window.screen.width;
// Check if WebGL is supported
if (!gl) {
  alert('WebGL is not supported on your browser.');
}
  
// Set up WebGL viewport
gl.viewport(0, 0, canvas.width, canvas.height);

const images = ['./images/mozcheese.png', './images/mozcheese.png', './images/mozcheese.png', './images/mozcheese.png'];
const imageTextures = [];

// Load the images and create WebGL textures
for (let i = 0; i < images.length; i++) {
  const image = new Image();
  image.src = images[i];

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  imageTextures.push(texture);
}