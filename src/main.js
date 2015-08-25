
// Render loop
function raf() {
    // Animation state
    tmp = Date.now() * 2e-4

    // Update view matrix (animate translation)
    gl.uniformMatrix4fv(m, v.set([
        1, 0, Math.sin(tmp) * 28.5, 0,
        0, 1, 0, 0,
        0, 0, 1, 1,
        0, 0, 0, 1
    ]), v)

    // Draw it
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 8 * 4 * 6)

    requestAnimationFrame(raf)
}
raf()
