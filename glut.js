/**
 * Created by screw on 21.02.2015.
 */
(function() {
    "use strict";

    window.Glut = {
        getGL: function(canvas) {
            var gl =
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
            gl.viewport(0, 0, canvas.width, canvas.height);

            return gl;
        },
        getProgram: function(gl, vshader_id, fshader_id) {
            var vshader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vshader, document.getElementById(vshader_id).text);
            gl.compileShader(vshader);
            if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(vshader));
            }

            var fshader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fshader, document.getElementById(fshader_id).text);
            gl.compileShader(fshader);
            if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(fshader));
            }

            var program = gl.createProgram();
            gl.attachShader(program, vshader);
            gl.attachShader(program, fshader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program));
            }

            gl.useProgram(program);

            return program;
        },

        getGLVars: function(gl, program, vars) {
            var gl_vars = {};
            var attributes = vars.attributes || [];
            var uniforms = vars.uniforms || [];

            attributes.forEach(function(att) {
                gl_vars[att] = gl.getAttribLocation(program, att);
            });
            uniforms.forEach(function(u) {
                gl_vars[u] = gl.getUniformLocation(program, u);
            });

            return gl_vars;
        },

        setBuffer: function(gl, attribute, data, item_size, type) {
            type = type || gl.FLOAT;
            var buffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            gl.vertexAttribPointer(attribute, item_size, type, false, 0, 0);
            gl.enableVertexAttribArray(attribute);
            buffer.size = data.length / item_size;

            return buffer;
        },

        setIndexBuffer: function(gl, data) {
            var buffer = gl.createBuffer();

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
            buffer.size = data.length;

            return buffer;
        },

        enableBuffer: function(gl, attribute, buffer, item_size) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(attribute, item_size, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(attribute);

            return buffer;
        },

        enableIndexBuffer: function(gl, buffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        },

        loadTexture: function(gl, texture_unit, texture_image, options) {
            options = options || {};

            var texture = gl.createTexture();
            var mag_filter = options.mag_filter || gl.LINEAR;
            var min_filter = options.min_filter || gl.LINEAR_MIPMAP_NEAREST;
            var wrap_s = options.wrap_s || gl.REPEAT;
            var wrap_t = options.wrap_t || gl.REPEAT;

            gl.activeTexture(texture_unit);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                texture_image
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag_filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min_filter);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap_s);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap_t);

            if (
                min_filter === gl.LINEAR_MIPMAP_NEAREST ||
                min_filter === gl.LINEAR_MIPMAP_LINEAR
            ) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            return texture;
        },

        cube: {
            // Create a cube
            //    v6------v5
            //   /|      /|
            //  v1------v0|
            //  | |     | |
            //  | |v7---|-|v4
            //  |/      |/
            //  v2------v3
            vertices: new Float32Array([
                1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                1.0, // v0-v1-v2-v3 front
                1.0,
                1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                1.0,
                -1.0, // v0-v3-v4-v5 right
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                1.0, // v0-v5-v6-v1 up
                -1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                1.0, // v1-v6-v7-v2 left
                -1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                1.0, // v7-v4-v3-v2 down
                1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                -1.0 // v4-v7-v6-v5 back
            ]),

            colors: new Float32Array([
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0, // v0-v1-v2-v3 front
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0, // v0-v3-v4-v5 right
                1,
                1,
                0,
                1,
                1,
                0,
                1,
                1,
                0,
                1,
                1,
                0, // v0-v5-v6-v1 up
                1,
                0,
                1,
                1,
                0,
                1,
                1,
                0,
                1,
                1,
                0,
                1, // v1-v6-v7-v2 left
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1, // v7-v4-v3-v2 down
                0,
                1,
                1,
                0,
                1,
                1,
                0,
                1,
                1,
                0,
                1,
                1 // v4-v7-v6-v5 back
            ]),

            normals: new Float32Array([
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0, // v0-v1-v2-v3 front
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0, // v0-v3-v4-v5 right
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0, // v0-v5-v6-v1 up
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0, // v1-v6-v7-v2 left
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0, // v7-v4-v3-v2 down
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0 // v4-v7-v6-v5 back
            ]),

            indices: new Uint8Array([
                0,
                1,
                2,
                0,
                2,
                3, // front
                4,
                5,
                6,
                4,
                6,
                7, // right
                8,
                9,
                10,
                8,
                10,
                11, // up
                12,
                13,
                14,
                12,
                14,
                15, // left
                16,
                17,
                18,
                16,
                18,
                19, // down
                20,
                21,
                22,
                20,
                22,
                23 // back
            ])
        }
    };
})();
