/*
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
*/
