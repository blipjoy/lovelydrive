
var camera = new Float32Array(roadPosition),
    cameraTemp = new Float32Array(16),
    mountainScroll = velocity = heading = crashed = 0

// Initial camera position
mat4Translate(camera, -1, 0, 0)

function updatePhysics() {
    if (crashed) {
        return
    }

    // Acceleration
    velocity = Math.max(velocity - inputs.throttle * .001, -.5)

    // Friction
    var neg = velocity + 5e-4,
        pos = velocity - 5e-4

    velocity = (neg < 0) ? neg : (pos > 0) ? pos : 0

    // Steering
    heading = inputs.steering * -velocity * .3

    // Collision detection
    var cx = camera[12],
        cz = camera[14],
        ax = roadGeometry[27 * 6 * 9 + 3 * 9 + 6] - cx,
        az = roadGeometry[27 * 6 * 9 + 3 * 9 + 8] - cz,
        bx = roadGeometry[27 * 6 * 9 + 5 * 9 + 6] - cx,
        bz = roadGeometry[27 * 6 * 9 + 5 * 9 + 8] - cz,
        dot1 = ax * ax + az * az,
        dot2 = bx * bx + bz * bz

    if (dot1 > 36 || dot2 > 36) { // 6^2, where 6 is the width of the road
        // Running off the road ends the game
        crashed = 1
        velocity = heading = 0

        var div = document.createElement("div"),
            text = document.createTextNode("You Crashed!")

        div.setAttribute("class", "t")
        div.appendChild(text)
        document.body.appendChild(div)
    }
    else if (Math.sqrt(dot1) + Math.sqrt(dot2) < 6.1) { // With 10% margin of error
        // Hitting the end of the road generates more road
        shiftRoadSegments()
    }
}

// Render loop
function raf() {
    // Gamepad support!
    updateGamepads()

    // Responsive canvas sizing
    resize_canvas()


    // "Physics" lol!
    updatePhysics()


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
    mountainScroll += heading * 10
    viewMatrix[12] = mountainScroll % (MOUNTAIN_SCALE * 6)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6, 8 * 6 * 6) // 8 layers * 6 quads * 6 vertices


    // Move camera
    mat4RotateY(camera, heading)
    mat4Translate(camera, 0, 0, -velocity)
    mat4Inverse(cameraTemp, camera)


    // Draw ground
    viewMatrix.set(cameraTemp)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.uniform1i(sampler2dPointer, 2)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6 + 8 * 6 * 6, 28 * 6) // 28 quads * 6 vertices


    requestAnimationFrame(raf)
}
raf()
