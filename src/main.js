
// Render loop
function raf() {
    // Responsive canvas sizing
    resize_canvas()
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Draw linear gradient for background
    viewMatrix[12] = 0
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.uniform1i(textureSampler, textureIdDefault)
    gl.drawArrays(gl.TRIANGLES, 0, 6) // 6 vertices


    // Draw clouds
    viewMatrix[12] = Date.now() / -50 % (cloudScale * 4)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.uniform1i(textureSampler, textureIdMountains)
    gl.drawArrays(gl.TRIANGLES, 6, 4 * 3 * 6) // 4 layers * 3 quads * 6 vertices


    // Draw mountains
    viewMatrix[12] = Date.now() / -500 % (mountainScale * 4)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6, 8 * 6 * 6) // 9 layers * 6 quads * 6 vertices

    requestAnimationFrame(raf)
}
raf()
