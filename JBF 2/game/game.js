import { Box } from "../lib/box.js";
import { Images } from "../lib/BetterImage.js";
export { Game }

class Game {
    constructor(gl, texCoordLoc, posAttribLoc) {
        // Graphics
        
        this.texCoordLoc = texCoordLoc;
        this.posAttribLoc = posAttribLoc;
        
        this.gl = gl;
        
        // Game
        
        /**
         * GS stands for Game Scene.
         * 
         * 0 - menu
         * 
         * 1 - normal mode fight
         * 2 - hard mode fight
         * 3 - experemental mode fight
         * 
         * 4 - lose
         * 5 - win
         * 
         * 6 - not started
         * 7 - loading
         */
        this.GS = 0; 
        this.loadingScreen = new Box(gl, 0, 0, gl.canvas.width, gl.canvas.height);
        this.imageAssets = new Images([
            "./assets/image/bullet.png",
            "./assets/image/Fireball.png",
            "./assets/image/Jarnett.png",
            "./assets/image/OuterSpace.png",
            "./assets/image/Ship.png",
            "./assets/image/GAMEOVER.png",
            "./assets/image/home.png",
            "./assets/image/win.png",
            "./assets/image/normalbtn.png",
            "./assets/image/deathbtn.png",
            "./assets/image/spark.png",
            "./assets/image/missile.png"
        ]);
        this.elements = [];
    }
    
    async init(gl, translationLocation, rotationLocation, scaleLocation) {
        await this.imageAssets.load();
        this.loadingScreen.width = gl.canvas.width;
        this.loadingScreen.setTexture(this.imageAssets.files[6], gl);
        this.loadingScreen.setTransforms(translationLocation, rotationLocation, scaleLocation);
        this.translationLocation = translationLocation;
        this.rotationLocation = rotationLocation;
        this.scaleLocation = scaleLocation;
        this.loadingScreen.update(gl);
        this.sceneChangeEvent()
    }
    
    sceneChangeEvent() {
        for ( let i = 0; i < this.elements.length; i++ ) {
            this.elements.delete(gl);
        }
        this.elements = [];
        
        switch (this.GS) {
            case 7:
                break;
            case 0:
                this.elements[0] = new Box(this.gl,0,0,100,100);
                this.elements[0].setTexture(this.imageAssets.files[6], this.gl);
                this.elements[0].setTransforms(this.translationLocation, this.rotationLocation, this.scaleLocation);
                this.elements[0].width = this.gl.canvas.width;
                this.elements[0].height = this.gl.canvas.height;
                this.elements[0].update(this.gl);
                
                this.elements[1] = new Box(this.gl, 0, 0, this.imageAssets.files[8].width, this.imageAssets.files[8].height);
                this.elements[1].setTexture(this.imageAssets.files[8], this.gl);
                this.elements[1].setTransforms(this.translationLocation, this.rotationLocation, this.scaleLocation);
                this.elements[1].x = (this.gl.canvas.width/2)-(this.imageAssets.files[8].width/2);
                this.elements[1].update(this.gl);
                break;
        }
    }
    
    gameloop(gl, fx) {
        switch (this.GS) {
            case 6:
                break;
            case 0:
                this.elements[0].width = gl.canvas.width;
                this.elements[0].height = gl.canvas.height;
                this.elements[1].x = (this.gl.canvas.width/2)-(this.imageAssets.files[8].width/2);
                break;
        }
        
        this.loadingScreen.width = gl.canvas.width;
        this.loadingScreen.height = gl.canvas.height;
        
        this.loadingScreen.update(gl);
        
        for ( let i = 0; i < this.elements.length; i++ ) {
            this.elements[0].update(this.gl);
        }
        
        
        
        fx.BindFBO(0, gl);
        
        this.renderElements(gl);
        
        fx.BindFBO(1, gl);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.elements[1].render(gl, this.texCoordLoc, this.posAttribLoc);
        
        fx.render(gl);
    }
    
    renderElements(gl) {
        if(this.GS == 7 || this.GS == 6) {
            this.loadingScreen.render(gl, this.texCoordLoc, this.posAttribLoc);
        } else {
            for ( let i = 0; i < this.elements.length; i++ ) {
                this.elements[i].update(this.gl);
                this.elements[i].render(gl, this.texCoordLoc, this.posAttribLoc);
            }
        }
        
    }
}