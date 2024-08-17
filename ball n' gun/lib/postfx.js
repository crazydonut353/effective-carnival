export { FXFilter, DualFXFilter }

class FXFilter {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {*} vertexShaderSource 
     * @param {*} fragmentShaderSource 
     */
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl;
        this.vertexShaderSource = vertexShaderSource;
        this.fragmentShaderSource = fragmentShaderSource;

        this.initShaders();
        this.initProgram();
        this.initBuffers();
        this.initTexture();
        this.initFramebuffer();
    }

    initShaders() {
        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        console.log(this.gl.getShaderInfoLog(shader));
        return shader;
    }

    initProgram() {
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        this.resolutionLocation = this.gl.getUniformLocation(this.program, "resolution");
        this.realResolutionLocation = this.gl.getUniformLocation(this.program, "realResolution");
        this.ballCountLocation = this.gl.getUniformLocation(this.program, "ballCount");
        this.ballsLocation = this.gl.getUniformLocation(this.program, "balls");
        this.point1 = this.gl.getUniformLocation(this.program, "point1");
        this.point2 = this.gl.getUniformLocation(this.program, "point2");
    }

    initBuffers() {
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.vertices = [
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
            -1.0,  1.0,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    }

    initTexture() {
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 2048, 1024, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    }

    initFramebuffer() {
        this.framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
    }

    useProgram() {
        this.gl.useProgram(this.program);
    }

    bindFBO() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.viewport(0, 0, 1024, 2048);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    setUniforms() {
        this.gl.uniform2f(this.resolutionLocation, 2048, 1024);
        this.gl.uniform2f(this.realResolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
    }

    render() {
        this.useProgram();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        const positionLocation = this.gl.getAttribLocation(this.program, "position");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.setUniforms();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}


class DualFXFilter {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl;
        this.vertexShaderSource = vertexShaderSource;
        this.fragmentShaderSource = fragmentShaderSource;

        // Create vertex shader
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexShaderSource);
        gl.compileShader(this.vertexShader);
        console.log(gl.getShaderInfoLog(this.vertexShader));

        // Create fragment shader
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragmentShader, this.fragmentShaderSource);
        gl.compileShader(this.fragmentShader);
        console.log(gl.getShaderInfoLog(this.fragmentShader));

        // Create shader program
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        
        this.resolutionLocation = gl.getUniformLocation(this.program, "resolution");
        this.textureLocation = gl.getUniformLocation(this.program, "u_texture");
        this.texture2Location = gl.getUniformLocation(this.program, "u_texture2");

        // Create buffer to hold quad vertices
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.vertices = [
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
            -1.0,  1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        // Create textures
        this.texture1 = this.createTexture();
        this.texture2 = this.createTexture();

        // Create framebuffers
        this.framebuffer1 = this.createFramebuffer(this.texture1);
        this.framebuffer2 = this.createFramebuffer(this.texture2);

        gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    }
    
    BindFBO(id, gl) {
        if(id == 0) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer1);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture1);
        }
        if(id == 1) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer2);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture2);
        }
        
        gl.viewport(0,0,1024,1024)
    }

    createTexture() {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1024, 1024, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        return texture;
    }

    createFramebuffer(texture) {
        const framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
        return framebuffer;
    }

    useProgram() {
        this.gl.useProgram(this.program);
        
    }

    setUniforms() {
        this.gl.uniform2f(this.resolutionLocation, window.innerWidth, window.innerHeight);
        this.gl.uniform1i(this.textureLocation, 0);
        this.gl.uniform1i(this.texture2Location, 1);
    }

    render() {
        
        
        // Use this program
        this.useProgram();
        
        //this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Set up position attribute
        const positionLocation = this.gl.getAttribLocation(this.program, "position");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Set any necessary uniforms
        this.setUniforms();

        // Draw the quad
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture1);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture2);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
    
