
// Render loop
function raf() {
    // Responsive canvas sizing
    resize_canvas()
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Reset view matrix (animation state)
    viewMatrix[12] = 0
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)

    // Draw linear gradient for background
    gl.uniform1i(textureSampler, textureIdDefault)
    gl.drawArrays(gl.TRIANGLES, 0, 6) // 6 vertices

    // Update view matrix (animation state)
    viewMatrix[12] = Date.now() / -50 % (geoScale * 4)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)

    // Draw mountains
    gl.uniform1i(textureSampler, textureIdMountains)
    gl.drawArrays(gl.TRIANGLES, 6, 8 * 6 * 6) // 8 layers * 6 quads * 6 vertices

    requestAnimationFrame(raf)
}
raf()
