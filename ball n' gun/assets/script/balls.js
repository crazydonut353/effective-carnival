export { Ball, BallSystem }

class Ball {
    constructor(x,y, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.vx = vx;
        this.vy = vy;
    }
    update() {
        this.x+=this.vx;
        this.y+=this.vy;
    }
}

class BallSystem {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {*} ballCountLocation 
     * @param {*} ballsLocation 
     */
    constructor(gl) {
        this.balls = [];
        this.last = Date.now();
        this.nextT = 1000;
        this.gl = gl;
    }
    
    init(ballCountLocation, ballsLocation) {
        this.ballCountLocation = ballCountLocation;
        this.ballsLocation = ballsLocation;
    }
    
    update() {
        for(let i=0;i<this.balls.length;i++){
            if(this.balls[i].x>this.gl.canvas.width||this.balls[i].x<0||this.balls[i].y>this.gl.canvas.height||this.balls[i].y<0) {
                this.balls.splice(i,1);
                i--;
            } else {
                this.balls[i].update();
            }
        }
        if(Date.now()>this.last+this.nextT) {
            this.balls.push(new Ball(Math.floor(Math.random() * this.gl.canvas.width),Math.floor(Math.random() * this.gl.canvas.height),Math.floor(Math.random() * 4)-2,Math.floor(Math.random() * 4)-2))
            this.nextT = Math.floor(Math.random() * 200)+800;
            this.last = Date.now();
        }
    }
    
    setUniforms() {
        this.gl.uniform1i(this.ballCountLocation, this.balls.length);
        let r=[];
        for(let i=0;i<this.balls.length;i++){r.push(this.balls[i].x,this.balls[i].y)}
        this.gl.uniform2fv(this.ballsLocation,r);
    }
}