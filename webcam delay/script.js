console.clear();

;(function(){


  
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

if ( !navigator.getUserMedia ) { return false; }
  
  var width = 0, height = 0;
  
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);
  
  var video = document.createElement('video'),
      track;
  video.setAttribute('autoplay',true);
  
  window.vid = video;
  
  function getWebcam(){ 
  
    navigator.getUserMedia({ video: true, audio: false }, function(stream) {
      video.srcObject = stream;
      track = stream.getTracks()[0];
    }, function(e) {
      console.error('Rejected!', e);
    });
  }
  
  getWebcam();
  
  var rotation = 0,
      loopFrame,
      centerX,
      centerY,
      twoPI = Math.PI * 2;
  var sTime = [Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),];
  
  function loop(){
    
    loopFrame = requestAnimationFrame(loop);
    
    //ctx.clearRect(0, 0, width, height);
    
    // ctx.globalAlpha = 0.005;
    // ctx.fillStyle = "#FFF";
    // ctx.fillRect(0, 0, width, height);
    
    ctx.save();
    
    
    // ctx.beginPath();
    // ctx.arc( centerX, centerY, 140, 0, twoPI , false);
    // //ctx.rect(0, 0, width/2, height/2);
    // ctx.closePath();
    // ctx.clip();
    
    //ctx.fillStyle = "#FFF";
    //ctx.fillRect(0, 0, width, height);
    
    // ctx.translate( centerX, centerY );
    // rotation += 0.005;
    // rotation = rotation > 360 ? 0 : rotation;
    // ctx.rotate(rotation);
    // ctx.translate( -centerX, -centerY );
    
    ctx.drawImage(video, 0, 0, width, 10, 0, 0, width, 10);
    for(let i = 0; i < sTime.length; i++) {
        if(sTime[i]<Date.now()){
            ctx.drawImage(video, 0, (height/sTime.length)*i, width, height/sTime.length, 0, (height/sTime.length)*i, width, height/sTime.length);
            sTime[i] = Date.now()+(i*10);
        }
    }
    
    
    ctx.restore();

  }
  
  function startLoop(){ 
    loopFrame = loopFrame || requestAnimationFrame(loop);
  }
  
  video.addEventListener('loadedmetadata',function(){
    width = canvas.width = video.videoWidth;
    height = canvas.height = video.videoHeight;
    centerX = width / 2;
    centerY = height / 2;
    startLoop();
  });
  
  canvas.addEventListener('click',function(){
    if ( track ) {
      if ( track.stop ) { track.stop(); }
      track = null;
    } else {
      getWebcam();
    }
  });
  
  
})()