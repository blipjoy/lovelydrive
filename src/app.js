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

// Deterministic random function
/*random = function () {
    var x = Math.PI
    return function () {
        x += Math.E
        return x % 1
    }
}()//*/

// Sinusoidal tween
function easeInOut(value) {
    return .5 * (1 - Math.cos(Math.PI * value))
}

// Height map function
function height(value, weight) {
    return Math.max(Math.min(value + (Math.random() - .5) * weight, 1), 0)
}

// Generate fractal mountains
var n = 128
var d = []
for (var i = 0; i <= n; i++) {
    d[i] = []
}

// diamond-square worker queue
var q = []

function diamond(x, y, w, s, f) {
    d[x + w / 2][y + w / 2] = f((
        d[x][y] +
        d[x + w][y] +
        d[x][y + w] +
        d[x + w][y + w]
    ) / 4, s)
}

function subsquare(x, y, w, n, s, f) {
    d[x][y] =
    // FIXME: This assignment makes the factral wrap properly. How can I make this smaller?
    d[!x ? n : x == n ? 0 : x][!y ? n : y == n ? 0 : y] =
    f((
        d[(x - w + n) % n][y] +
        d[x][(y - w + n) % n] +
        d[(x + w) % n][y] +
        d[x][(y + w) % n]
    ) / 4, s)
}

function square(x, y, w, n, s, f) {
    subsquare(x + w / 2, y, w / 2, n, s, f)
    subsquare(x, y + w / 2, w / 2, n, s, f)
    subsquare(x + w, y + w / 2, w / 2, n, s, f)
    subsquare(x + w / 2, y + w, w / 2, n, s, f)

    // Update fractal state
    w /= 2
    s /= 2

    // Recurse
    if (w > 1) {
        // Perform diamond steps
        diamond(x, y, w, s, f)
        diamond(x + w, y, w, s, f)
        diamond(x, y + w, w, s, f)
        diamond(x + w, y + w, w, s, f)

        // Push square steps onto a worker queue
        q.push([ x, y, w, n, s, f ])
        q.push([ x + w, y, w, n, s, f ])
        q.push([ x, y + w, w, n, s, f ])
        q.push([ x + w, y + w, w, n, s, f ])
    }
}

// Setup initial state
d[0][0] = d[0][n] = d[n][0] = d[n][n] = .3 // Corners

d[n / 2][n / 2] = .5 // Center: 0 for clouds, 1 for mountains
square(0, 0, n, n, 2, height)

// Empty worker queue
while (q.length) {
    square.apply(square, q.shift())
}


// Procedural texture generation
m = 1024
var ctx = document.createElement("canvas").getContext("2d")
ctx.canvas.width = ctx.canvas.height = m
var img = ctx.createImageData(m, m)

// XXX: <DEBUG>
document.body.appendChild(ctx.canvas)
// XXX: </DEBUG>


// RENDER CLOUDS
tmp = 0
for (var y = 0; y < m; y++) {
    for (var x = 0; x < m; x++) {
        // Interpolate between each node
        var sx = x / m * n
        var sy = y / m * n

        var p1 = d[~~sx][~~sy]
        var p2 = d[~~sx + 1][~~sy]
        var p3 = d[~~sx][~~sy + 1]
        var p4 = d[~~sx + 1][~~sy + 1]

        var h = (
            (p1 + (p2 - p1) * (sx % 1)) * (1 - sy % 1) +
            (p1 + (p3 - p1) * (sy % 1)) * (1 - sx % 1) +
            (p3 + (p4 - p3) * (sx % 1)) * (sy % 1) +
            (p2 + (p4 - p2) * (sy % 1)) * (sx % 1)
        ) / 2

        // Choose a color based on node height
        img.data[tmp++] = 102 + h * 118 // 102 -> 220
        img.data[tmp++] = 145 + h * 55 // 145 -> 200
        img.data[tmp++] = 220
        img.data[tmp++] = 255
    }
}


// Setup initial state
/*
d[0][0] = d[0][n] = d[n][0] = d[n][n] = .3 // Corners

d[n / 2][n / 2] = 1 // Center: 0 for clouds, 1 for mountains
square(0, 0, n, n, 2, height)

// Empty worker queue
while (q.length) {
    square.apply(square, q.shift())
}
*/

// RENDER MOUNTAINS
for (var y = 0; y <= n; y++) {
    for (var x = 0; x < m; x++) {
        // Interpolate between each node
        var sx = x / m * n
        var p1 = d[~~sx][y]
        var p2 = d[~~sx + 1][y]
        var j = (p2 - p1) * (sx % 1)

        // Compute the node height
        var h = ~~(m - (p1 + j) * m * .4 * (((n - y) / n) + .3))

        // Draw a vertical strip with the computed height
        while (h <= m) {
            tmp = (h * m + x) * 4

            // Choose a color based on depth
            img.data[tmp]     = (n - y * .4) / n * 200//230
            img.data[tmp + 1] = (n - y * .6) / n * 184//222
            img.data[tmp + 2] = 222
            img.data[tmp + 3] = 255

            h++
        }
    }
}


ctx.putImageData(img, 0, 0)


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
