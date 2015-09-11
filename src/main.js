
var camera = new Float32Array(16),
    cameraTemp = new Float32Array(mat4Identity),
    mountainScroll = 0,
    anim = 0

const ANIM_FRAMES = 10

// Render loop
function raf() {
    // Responsive canvas sizing
    resize_canvas()


    // Draw linear gradient for background
    viewMatrix.set(mat4Identity)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.uniform1i(sampler2dPointer, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6) // 6 vertices


    // Draw clouds
    viewMatrix[12] = Date.now() / -250 % (CLOUD_SCALE * 4)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.uniform1i(sampler2dPointer, 1)
    gl.drawArrays(gl.TRIANGLES, 6, 4 * 3 * 6) // 4 layers * 3 quads * 6 vertices


    // Draw mountains
    mountainScroll += roadAngle
    viewMatrix[12] = mountainScroll % (MOUNTAIN_SCALE * 6)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6, 8 * 6 * 6) // 8 layers * 6 quads * 6 vertices



    // FIXME: Animate ground
    if (!(anim % ANIM_FRAMES)) {
        shiftRoadSegments()
    }

    // Tween the camera
    var t = anim % ANIM_FRAMES / ANIM_FRAMES
    camera.set(mat4Identity)
    mat4RotateY(camera, -roadAngle * t)
    mat4Translate(camera, -1, 0, -t)
    mat4Inverse(cameraTemp, roadPosition)
    mat4Multiply(camera, cameraTemp)

    anim++



    // Draw ground
    viewMatrix.set(camera)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.uniform1i(sampler2dPointer, 2)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6 + 8 * 6 * 6, 28 * 6) // 28 quads * 6 vertices


    requestAnimationFrame(raf)
}
raf()
