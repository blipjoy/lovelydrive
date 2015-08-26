
// Render loop
function raf() {
    // Animation state
    tmp = Date.now() / -50 % (geoScale * 4)

    // Update view matrix (animate translation)
    gl.uniformMatrix4fv(m, v.set([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tmp, 0, 0, 1
    ]), v)

    // Draw it
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 8 * 6 * 6) // 8 layers * 6 quads * 6 vertices

    requestAnimationFrame(raf)
}
raf()
