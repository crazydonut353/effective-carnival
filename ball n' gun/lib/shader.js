export { Shader }

class Shader {
    constructor(vsSource, fsSource) {
        this.vsSource = vsSource;
        this.fsSource = fsSource;
        this.vs = null;
        this.fs = null;
        this.program = null;
    }
    
    setup(gl) {
        this.vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vs, this.vsSource);
        gl.compileShader(this.vs);
        var success = gl.getShaderParameter(this.vs, gl.COMPILE_STATUS);
        console.log("Completed vs compilation " + success);
        console.log(gl.getShaderInfoLog(this.vs));
        
        this.fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fs, this.fsSource);
        gl.compileShader(this.fs);
        var success = gl.getShaderParameter(this.fs, gl.COMPILE_STATUS);
        console.log("Completed fs compilation " + success);
        console.log(gl.getShaderInfoLog(this.fs));
        
        
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vs);
        gl.attachShader(this.program, this.fs);
        gl.linkProgram(this.program);
        var success = gl.getProgramParameter(this.program, gl.LINK_STATUS);
        console.log(gl.getProgramInfoLog(this.program));
        
        gl.useProgram(this.program);
        
    }
    use(gl) {
        gl.useProgram(this.program);
    }
}