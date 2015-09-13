// Initialize WebGL
var gl = document.body.firstChild.getContext("webgl", { alpha: 0 })

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


// Enable blending
gl.enable(gl.BLEND)
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)


// XXX: <DEBUG>
// Chrome supports this extension, but does not include the defines
if (!("TEXTURE_MAX_ANISOTROPY_EXT" in gl)) {
    gl.TEXTURE_MAX_ANISOTROPY_EXT = 34046
    gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 34047
}
// XXX: </DEBUG>

// Enable Anisotropic filtering
var anisotropic = gl.getExtension("EXT_texture_filter_anisotropic") ?
    gl.getParameter(gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0


// Initialize attribute variables
gl.vertexAttribPointer(
    gl.getAttribLocation(handle, "v"),
    3, // Number of floats
    gl.FLOAT,
    gl.vertexAttribPointer(
        gl.getAttribLocation(handle, "u"),
        2, // Number of floats
        gl.FLOAT,
        gl.enableVertexAttribArray(gl.vertexAttribPointer(
            gl.getAttribLocation(handle, "c"),
            4, // Number of floats
            gl.FLOAT,
            gl.enableVertexAttribArray(1),
            36, // Stride: (4 + 3 + 2) * 4
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()) // Offset: 0 * 4
        )),
        36, // Stride: (4 + 3 + 2) * 4
        16  // Offset: 4 * 4
    ),
    36, // Stride: (4 + 3 + 2) * 4
    24  // Offset: (4 + 2) * 4
)
gl.enableVertexAttribArray(2)


// Initialize uniform variables
var projectionMatrixPointer =   gl.getUniformLocation(handle, "p")
var viewMatrixPointer =         gl.getUniformLocation(handle, "m")
var sampler2dPointer =          gl.getUniformLocation(handle, "s")
var viewMatrix =                new Float32Array(mat4Identity)


// Resize function
function resize_canvas() {
    if (
        gl.canvas.width != gl.canvas.clientWidth ||
        gl.canvas.height != gl.canvas.clientHeight
    ) {
        gl.viewport(
            0,
            0,
            gl.canvas.width = gl.canvas.clientWidth,
            gl.canvas.height = gl.canvas.clientHeight
        )

        gl.uniformMatrix4fv(
            projectionMatrixPointer,
            0,
            // Perspective projection matrix: http://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html
            // FOV = 90° == (Math.PI / 2) RAD
            // near = 1
            // far = 54
            new Float32Array([
                Math.tan(Math.PI * .5 - .5 * (Math.PI / 2)) / (gl.canvas.clientWidth / gl.canvas.clientHeight), 0, 0, 0,
                0, Math.tan(Math.PI * .5 - .5 * (Math.PI / 2)), 0, 0,
                0, 0, (1 + 54) * (1.0 / (1 - 54)), -1,
                0, 0, 1 * 54 * (1.0 / (1 - 54)) * 2, 0
            ])
        )
    }
}

// Update progress bar
progress()
