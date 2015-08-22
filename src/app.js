// Initialize WebGL
document.body.firstChild.width = document.body.clientWidth
document.body.firstChild.height = document.body.clientHeight
var gl = document.body.firstChild.getContext("webgl")

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
gl.shaderSource(tmp, document.body.children[1].innerText)
gl.compileShader(tmp)
gl.attachShader(handle, tmp)

// XXX: <DEBUG>
if (!gl.getShaderParameter(tmp, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(tmp)
}
// XXX: </DEBUG>

tmp = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(tmp, document.body.children[2].innerText)
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
//gl.clearColor(0, 0, 0, 1)

// Initialize attribute variables
gl.vertexAttribPointer(
    0,
    4,
    gl.FLOAT,
    gl.enableVertexAttribArray(0),
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()),
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ // This is my triangle buffer
        0, 10, -2, 1,
        10 * Math.sin(Math.PI / 3), -10 * Math.cos(Math.PI / 3), -2, 1,
        -10 * Math.sin(Math.PI / 3), -10 * Math.cos(Math.PI / 3), -2, 1
    ]), gl.DYNAMIC_DRAW)
)

// Initialize uniform variables
t = gl.getUniformLocation(handle, "m") // This is my view matrix pointer
v = new Float32Array(16) // This is my view matrix
/*
gl.uniformMatrix4fv(
    t = gl.getUniformLocation(handle, "m"), // This is my view matrix pointer
    0,
    v = new Float32Array("1000010000100001".split("")) // This is my view matrix
)
*/
gl.uniformMatrix4fv(
    gl.getUniformLocation(handle, "p"),
    gl.uniform4fv(
        gl.getUniformLocation(handle, "c"),
        u = new Float32Array([ 0, 0, 1, 1 ]) // `u` is assigned here; This is my color buffer
    ),
    // Perspective projection matrix: http://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html
    // FOV = 45° == (Math.PI / 4) RAD
    // near = 10
    // far = 50
    new Float32Array([
        Math.tan(Math.PI * .5 - .5 * (Math.PI / 4)) / (document.body.clientWidth / document.body.clientHeight), 0, 0, 0,
        0, Math.tan(Math.PI * .5 - .5 * (Math.PI / 4)), 0, 0,
        0, 0, (10 + 50) * (1.0 / (10 - 50)), -1,
        0, 0, 10 * 50 * (1.0 / (10 - 50)) * 2, 0
    ])
)

// Render loop
function raf() {
    // Animation state
    tmp = Date.now() * 5e-4

    // Update view matrix (animate rotation)
    gl.uniformMatrix4fv(t, v.set([
        Math.cos(tmp), -Math.sin(tmp), 0, 0,
        Math.sin(tmp), Math.cos(tmp), 0, 0,
        0, 0, Math.sin(tmp % 43) + 1.5
    ]), v)

    // Draw it
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    requestAnimationFrame(raf)
}
raf()
