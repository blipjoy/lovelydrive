
var mat4Identity = new Float32Array(16), // Identity matrix
    mat4Temp = new Float32Array(mat4Identity) // Temporary Matrix

mat4Identity[0] = mat4Identity[5] = mat4Identity[10] = mat4Identity[15] = 1


function mat4Multiply(a, b) {
    // Multiply matrices; a = a * b
    var a0  = a[ 0], a1  = a[ 1],  a2 = a[ 2],
        a4  = a[ 4], a5  = a[ 5],  a6 = a[ 6],
        a8  = a[ 8], a9  = a[ 9], a10 = a[10]

    a[ 0]  = a0 * b[ 0] + a4 * b[ 1] +  a8 * b[ 2]
    a[ 1]  = a1 * b[ 0] + a5 * b[ 1] +  a9 * b[ 2]
    a[ 2]  = a2 * b[ 0] + a6 * b[ 1] + a10 * b[ 2]

    a[ 4]  = a0 * b[ 4] + a4 * b[ 5] +  a8 * b[ 6]
    a[ 5]  = a1 * b[ 4] + a5 * b[ 5] +  a9 * b[ 6]
    a[ 6]  = a2 * b[ 4] + a6 * b[ 5] + a10 * b[ 6]

    a[ 8]  = a0 * b[ 8] + a4 * b[ 9] +  a8 * b[10]
    a[ 9]  = a1 * b[ 8] + a5 * b[ 9] +  a9 * b[10]
    a[10]  = a2 * b[ 8] + a6 * b[ 9] + a10 * b[10]

    a[12] += a0 * b[12] + a4 * b[13] +  a8 * b[14]
    a[13] += a1 * b[12] + a5 * b[13] +  a9 * b[14]
    a[14] += a2 * b[12] + a6 * b[13] + a10 * b[14]
}

function mat4Inverse(a, b) {
    // Compute an inverse matrix by decomposition; a = inv(b)
    // See: http://ksimek.github.io/2012/08/22/extrinsic/

    // Transpose
    a[ 0] = b[ 0]
    a[ 1] = b[ 4]
    a[ 2] = b[ 8]

    a[ 4] = b[ 1]
    a[ 5] = b[ 5]
    a[ 6] = b[ 9]

    a[ 8] = b[ 2]
    a[ 9] = b[ 6]
    a[10] = b[10]

    a[ 3] = a[ 7] = a[11] = a[12] = a[13] = a[14] = 0
    a[15] = 1

    // Inverse translation
    mat4Temp.set(mat4Identity)
    mat4Temp[12] = -b[12]
    mat4Temp[13] = -b[13]
    mat4Temp[14] = -b[14]

    // Multiply
    mat4Multiply(a, mat4Temp)
}

function mat4Translate(m, x, y, z) {
    m[12] += x * m[0] + y * m[4] + z * m[ 8]
    m[13] += x * m[1] + y * m[5] + z * m[ 9]
    m[14] += x * m[2] + y * m[6] + z * m[10]
}
/*
// XXX: uglify-js does not remove dead code, despite its claims...
function mat4RotateX(m, r) {
    // Rotate about X axis
    mat4Temp.set([
        1,           0,            0, 0,
        0,  Math.cos(r), Math.sin(r), 0,
        0, -Math.sin(r), Math.cos(r), 0,
        0,           0,            0, 1
    ])
    mat4Multiply(m, mat4Temp)
}
*/
function mat4RotateY(m, r) {
    // Rotate about Y axis
    mat4Temp.set([
        Math.cos(r), 0, -Math.sin(r), 0,
                  0, 1,            0, 0,
        Math.sin(r), 0,  Math.cos(r), 0,
                  0, 0,            0, 1
    ])
    mat4Multiply(m, mat4Temp)
}
/*
function mat4RotateZ(m, r) {
    // Rotate about Z axis
    mat4Temp.set([
         Math.cos(r), Math.sin(r), 0, 0,
        -Math.sin(r), Math.cos(r), 0, 0,
                  0,            0, 1, 0,
                  0,            0, 0, 1
    ])
    mat4Multiply(m, mat4Temp)
}
*/
