window.onload = main;

function main() {
    var canvas = document.querySelector("canvas");
    var width = (canvas.width = window.innerWidth); //document.body.innerWidth;
    var height = (canvas.height = window.innerHeight); //document.body.innerHeight;
    var startTime = new Date().getTime();
    // Initialize the GL context
    var gl = Glut.getGL(canvas);
    gl.program = Glut.getProgram(
        gl,
        "vertex-shader",
        "fragment-shader"
    );
    var glVars = Glut.getGLVars(gl, gl.program, {
        attributes: ["position"],
        uniforms: ["time", "resolution"]
    });
  
    // Only continue if WebGL is available and working
    Glut.setBuffer(
        gl,
        glVars.position,
        new Float32Array([
            -1,
            1,
            -1,
            -1,
            1,
            -1,
            1,
            -1,
            1,
            1,
            -1,
            1
        ]),
        2
    );
  
    gl.uniform2fv(glVars.resolution, [width, height]);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    window.onresize = function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2fv(glVars.resolution, [width, height]);
    };

    (function drawScene() {
        requestAnimationFrame(drawScene);
        var time = new Date().getTime() - startTime;

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(glVars.time, time * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    })();
}  