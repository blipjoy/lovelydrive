
/*
 * So many variables!
 *
 * `camera` and `cameraTemp` are 4x4 matrices for camera motion
 * `mountainScroll` sets the horizontal motion for the mountains
 * `velocity` and `heading` are for physics
 * `anim` is a frame counter used for the title screen and crash screen animations
 * `score` is a running total of the distance (in world units)
 * `highScore` is ... pretty obvious
 * `playerControl` switches between auto-drive (0) and player-drive (1)
 * `controlDelay` is a boolean that disallows player input when set (1)
 */
var camera = new Float32Array(16),
    cameraTemp = new Float32Array(16),
    mountainScroll = velocity = heading = playerControl = anim = score = 0,
    highScore = +localStorage.getItem("highScore") || 0,
    controlDelay = 1,
    audioCtx = new AudioContext(),
    songGenerator = new sonantx.MusicGenerator(bgm_lovely_drive),
    motor = new MotorSound(audioCtx, new MotorSound.DeterministicGenerator(.1)),
    distance = document.getElementById("d")

const ANIM_FRAMES = 10

// Play some sweet driving tunes
function startMusic(buffer) {
    var source = audioCtx.createBufferSource(),
        status = document.getElementById("m"),
        bar = document.getElementById("p")

    source.buffer = buffer
    source.loop = 1
    source.connect(audioCtx.destination)
    source.start(0)

    // Start your engines!
    motor.setVolume(0)
    motor.regenerate()
    motor.start()

    // Start animation
    status.style.opacity = 0
    bar.style.opacity = 0
    document.body.firstChild.style.opacity = 1
    raf()

    // Accept input in about 2 seconds
    setTimeout(function () {
        controlDelay = 0

        document.body.removeChild(status)
        document.body.removeChild(bar)
    }, 1000)
}

songGenerator.createAudioBuffer(function (buffer) {
    // Update progress bar
    progress()

    // iOS is the devil
    var needsUnmute = enableiOSAudio(function () {
        // Start music when iOS audio is enabled
        startMusic(buffer)
    })

    if (needsUnmute) {
        // Inform player to interact
        document.getElementById("m").innerText = "Tap to start..."
    }
    else {
        startMusic(buffer)
    }
})

function startGame() {
    playerControl = 1

    // Remove the logo
    document.body.removeChild(document.getElementById("l"))

    // Initial camera position
    camera.set(roadPosition)
    mat4Translate(camera, 1, 0, 0)
}

function updatePhysics() {
    if (!playerControl) {
        if (!controlDelay && inputs.throttle) {
            startGame()
        }

        return
    }

    // Acceleration
    velocity = Math.max(velocity + inputs.throttle * .001, -.5)

    // Friction
    var pos = velocity - 5e-4
    velocity = (pos > 0) ? pos : 0

    // Steering
    heading = inputs.steering * velocity * .3

    // Motor sounds make your car go faster!
    motor.setSpeed(velocity * 2 + .3)
    motor.setVolume(velocity / 2 + .1)

    // Update scores
    score += velocity
    highScore = Math.max(highScore, score)
    distance.innerHTML = "distance: " + printFloat(score, 3) + "m<br>" +
        "<span>high: " + printFloat(highScore, 3) + "m</span>"

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
        playerControl = anim = velocity = heading = score = 0

        localStorage.setItem("highScore", highScore)

        // Motor off
        motor.setVolume(0)

        // Accept control input in about 1 second
        controlDelay = 1
        setTimeout(function () {
            controlDelay = 0
        }, 1000)

        // Reconfigure the logo with a nice loss message
        var div = document.createElement("div")
        div.setAttribute("id", "l")
        div.innerHTML = "Lovely&nbsp; &nbsp; <br>&nbsp; &nbsp; Crash!"
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
    mountainScroll += playerControl ? heading * 10 : roadAngle
    viewMatrix[12] = mountainScroll % (MOUNTAIN_SCALE * 6)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6, 8 * 6 * 6) // 8 layers * 6 quads * 6 vertices


    // Move camera
    if (playerControl) {
        mat4RotateY(camera, heading)
        mat4Translate(camera, 0, 0, velocity)
        mat4Inverse(cameraTemp, camera)
    }
    else {
        if (!(anim % ANIM_FRAMES)) {
            shiftRoadSegments()
        }

        // Tween the camera
        var t = anim % ANIM_FRAMES / ANIM_FRAMES
        cameraTemp.set(mat4Identity)
        mat4RotateY(cameraTemp, -roadAngle * t)
        mat4Translate(cameraTemp, -1, 0, -t)
        mat4Inverse(camera, roadPosition)
        mat4Multiply(cameraTemp, camera)

        anim++
    }


    // Draw ground
    viewMatrix.set(cameraTemp)
    gl.uniformMatrix4fv(viewMatrixPointer, 0, viewMatrix)
    gl.uniform1i(sampler2dPointer, 2)
    gl.drawArrays(gl.TRIANGLES, 6 + 4 * 3 * 6 + 8 * 6 * 6, 28 * 6) // 28 quads * 6 vertices


    requestAnimationFrame(raf)
}
