export { Gun };

import { Images } from "../../lib/BetterImage.js";
import { Box } from "../../lib/box.js";
import { BulletSystem } from "./bullets.js";

class Gun {
    /**
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl) {
        this.gl = gl;
        this.imageAssets = new Images(["./assets/image/rubberdotter.png"]);
        this.bulletImg = new Images(["./assets/image/bullet.png"]);
        this.x = 100;
        this.y = 100;
        this.bodyBox = new Box(gl, -0.5, -0.5, 100, 100);
        this.shotBool = false;
        this.bulletsystem = new BulletSystem()
        
        this.gun = 0; // Index of the gun.
        this.coolTime = 0;
        this.ammo = 10;
        this.reload = 0;
        this.guns = [
            {
                name : "Rubber Dotter",
                desc : "A simple aluminium gun with low force. Lowest tier gun.", // Gun description
                reload : 400,
                max : 10,
                cool : 200
            }
        ]
    }
    
    async setup(transUniforms) {
        await this.imageAssets.load();
        await this.bulletImg.load();
        this.bulletsystem = new BulletSystem(this.bulletImg.files[0], transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation, this.gl)
        this.bodyBox.setTexture(this.imageAssets.files[0], this.gl); // Set the texture to the first gun texture: the Rubber Dotter
        this.bodyBox.setTransforms(transUniforms.translationLocation, transUniforms.rotationLocation, transUniforms.scaleLocation);
    }
    
    update(mouse, canvas, shootCallback) {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        
        // Sets the rotation attribute to face the mouse.
        this.bodyBox.rotation = 90-((Math.atan2(mouse.x - this.x, mouse.y - this.y) * 180) / Math.PI);
        // Sets the gun's body position to the position attributes of the gun.
        this.bodyBox.x = this.x;
        this.bodyBox.y = this.y;
        
        // Updates the uniforms ( position and scale )
        this.bulletsystem.update(canvas);
        this.bodyBox.update(this.gl);
        
        if(mouse.down&&!this.shotBool) {
            this.bulletsystem.angle = this.bodyBox.rotation;
            this.bulletsystem.x = this.x;
            this.bulletsystem.y = this.y;
            this.bulletsystem.spawn();
            shootCallback({
                p1 : {
                    x : this.bulletsystem.bullets[this.bulletsystem.bullets.length-1].x,
                    y : this.bulletsystem.bullets[this.bulletsystem.bullets.length-1].y
                },
                p2 : {
                    x : (this.bulletsystem.bullets[this.bulletsystem.bullets.length-1].x + (Math.sin((360 - this.bulletsystem.bullets[this.bulletsystem.bullets.length-1].rotation+90) * Math.PI / 180)*1000)),
                    y : canvas.height - (this.bulletsystem.bullets[this.bulletsystem.bullets.length-1].y + (Math.cos((360 - this.bulletsystem.bullets[this.bulletsystem.bullets.length-1].rotation+90) * Math.PI / 180)*1000))
                }
            });
            this.shotBool = true;
        }
        
        if(!mouse.down) {
            this.shotBool = false;
        }
    }
    
    toLine(i, canvas) {
        var p1x;
        try {
            p1x = this.bulletsystem.bullets[i].x
        } catch (error) {
            console.log(error + i)
        }
        return {
            p1 : {
                x : p1x,
                y : this.bulletsystem.bullets[i].y
            },
            p2 : {
                x : (this.bulletsystem.bullets[i].x + (Math.sin((360 - this.bulletsystem.bullets[i].rotation+90) * Math.PI / 180)*20)),
                y : canvas.height - (this.bulletsystem.bullets[i].y + (Math.cos((360 - this.bulletsystem.bullets[i].rotation+90) * Math.PI / 180)*20))
            }
        }
    }
    
    render(texCoordLocation, positionAttributeLocation) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.bodyBox.render(this.gl, texCoordLocation, positionAttributeLocation);
        this.bulletsystem.render(texCoordLocation, positionAttributeLocation)
    }
    
    renderBloom(texCoordLocation, positionAttributeLocation) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.bulletsystem.render(texCoordLocation, positionAttributeLocation)
    }
}