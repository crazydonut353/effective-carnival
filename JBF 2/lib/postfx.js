export { FXFilter, DualFXFilter }

class FXFilter {
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

        // Create texture
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // Create framebuffer
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        
        gl.viewport(0,0,1024, 1024);
    }

    useProgram(gl) {
        gl.useProgram(this.program);
    }

    setUniforms() {
        this.gl.uniform2f(this.resolutionLocation,this.gl.canvas.width, this.gl.canvas.height);
    }

    render(gl) {

        // Use this program
        this.useProgram(gl);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);

        // Set up position attribute
        const positionLocation = gl.getAttribLocation(this.program, "position");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Set any necessary uniforms
        this.setUniforms();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // Draw the quad
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        gl.viewport(0,0, 1024, 1024);
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
        }
        if(id == 1) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer2);
            this.gl.activeTexture(this.gl.TEXTURE1);
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
        
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
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
    
