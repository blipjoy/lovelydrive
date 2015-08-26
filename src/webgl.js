// Initialize WebGL
document.body.firstChild.width = document.body.clientWidth
document.body.firstChild.height = document.body.clientHeight
var gl = document.body.firstChild.getContext("webgl", { alpha: 0 })

// Hash all WebGL methods
// See Gruntfile.js for hash replacements
var tmp = []
for (i in gl) {
    // First, filter the methods into an array
    gl[i].bind && tmp.push(i)
}
for (i in tmp.sort()) {
    // Then map the sorted methods into the array
    gl[i] = gl[tmp[i]].bind(gl)
}

gl.viewport(0, 0, document.body.clientWidth, document.body.clientHeight)

// Build the shader program
var handle = gl.createProgram()

tmp = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(tmp, document.body.children[1].innerHTML)
gl.compileShader(tmp)
gl.attachShader(handle, tmp)

// XXX: <DEBUG>
if (!gl.getShaderParameter(tmp, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(tmp)
}
// XXX: </DEBUG>

tmp = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(tmp, document.body.children[2].innerHTML)
gl.compileShader(tmp)
gl.attachShader(handle, tmp)

// XXX: <DEBUG>
if (!gl.getShaderParameter(tmp, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(tmp)
}
// XXX: </DEBUG>

gl.linkProgram(handle)

// XXX: <DEBUG>
if (!gl.getProgramParameter(handle, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(handle)
}
// XXX: </DEBUG>

gl.useProgram(handle)


// Initialize background color (default is white)
gl.clearColor(102 / 255, 145 / 255, 220 / 255, 1)

// Enable blending
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);


// Initialize attribute variables
gl.vertexAttribPointer(
    gl.getAttribLocation(handle, "u"),
    2, // Number of floats
    gl.FLOAT,
    gl.enableVertexAttribArray(gl.vertexAttribPointer(
        gl.getAttribLocation(handle, "v"),
        3, // Number of floats
        gl.FLOAT,
        gl.enableVertexAttribArray(1),
        20, // Stride: (3 + 2) * 4
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()) // Offset: 0 * 4
    )),
    20, // Stride: (3 + 2) * 4
    12  // Offset: 3 * 4
)


// Initialize uniform variables
m = gl.getUniformLocation(handle, "m") // This is my view matrix pointer
v = new Float32Array(16) // This is my view matrix

gl.uniformMatrix4fv(
    gl.getUniformLocation(handle, "p"),
    gl.uniform4fv(
        c = gl.getUniformLocation(handle, "c"),
        u = new Float32Array([ 1, 1, 1, 1 ]) // `u` is assigned here; This is my color buffer
    ),
    // Perspective projection matrix: http://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html
    // FOV = 90° == (Math.PI / 2) RAD
    // near = 10
    // far = 50
    new Float32Array([
        Math.tan(Math.PI * .5 - .5 * (Math.PI / 2)) / (document.body.clientWidth / document.body.clientHeight), 0, 0, 0,
        0, Math.tan(Math.PI * .5 - .5 * (Math.PI / 2)), 0, 0,
        0, 0, (10 + 50) * (1.0 / (10 - 50)), -1,
        0, 0, 10 * 50 * (1.0 / (10 - 50)) * 2, 0
    ])
)

/*
// Set texture sampler
gl.uniform1i(
    s = gl.getUniformLocation(handle, "s"),
    0 // default is 0... I'll just save this here for later...
)
*/
