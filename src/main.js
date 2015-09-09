
var camera = new Float32Array(16),
    anim = 0

// Render loop
function raf() {
    // Responsive canvas sizing
    resize_canvas()
    gl.clear(gl.COLOR_BUFFER_BIT)


    // Draw linear gradient for background
    viewMatrix.set(mat4Identity)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 0, 6) // 6 vertices


    // Draw clouds
    viewMatrix[12] = Date.now() / -250 % (cloudScale * 4)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 6, 4 * 3 * 6) // 4 layers * 3 quads * 6 vertices


    // Draw mountains
    viewMatrix[12] = Date.now() / -500 % (mountainScale * 6)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6, 8 * 6 * 6) // 8 layers * 6 quads * 6 vertices



    // FIXME: Animate ground
    if (!(anim % 10)) {
        roadPosition.set(mat4Identity)
        gl.bufferSubData(gl.ARRAY_BUFFER, (6 + 4 * 3 * 6 + 8 * 6 * 6) * 40, new Float32Array(roadVertices(~~(anim / 10))))
        mat4Inverse(camera, roadPosition)
        mat4Translate(camera, -1, 0, 0)
    }
    anim++



    // Draw ground
    viewMatrix.set(camera)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6 + 8 * 6 * 6, 28 * 6) // 28 quads * 6 vertices


    requestAnimationFrame(raf)
}
raf()
