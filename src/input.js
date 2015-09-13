var inputs = {
    "throttle": 0,
    "steering": 0
}

const KEYS = {
    37: "ArrowLeft",
    39: "ArrowRight",
    40: "ArrowDown",
    65: "KeyA",
    68: "KeyD",
    83: "KeyS"
}


function updateKeys(value) {
    return function (e) {
        var key = e.code || KEYS[e.which]

        if (/ArrowLeft|KeyA/.test(key) && inputs.steering <= 0) {
            inputs.steering = value ? Math.max(inputs.steering - value * .2, -1) : 0
        }
        if (/ArrowRight|KeyD/.test(key) && inputs.steering >= 0) {
            inputs.steering = value ? Math.min(inputs.steering + value * .2, 1) : 0
        }
        if (/ArrowDown|KeyS/.test(key)) {
            inputs.throttle = value
        }
    }
}

window.addEventListener("keydown", updateKeys(1))
window.addEventListener("keyup", updateKeys(0))


function updateTouch(value) {
    return function () {
        inputs.throttle = value
    }
}

function updateOrientation() {
    var origin

    return function (e) {
        var alpha = e.alpha || 0,
            orientation = window.orientation || 0

        if (typeof origin == "undefined") {
            origin = (alpha - orientation) || 0
        }

        inputs.steering = -Math.sin((origin - alpha - orientation) * Math.PI / 180)
    }
}

window.addEventListener("touchstart", updateTouch(1))
window.addEventListener("touchend", updateTouch(0))
window.addEventListener("touchcancel", updateTouch(0))
window.addEventListener("pointerdown", updateTouch(1))
window.addEventListener("pointerup", updateTouch(0))
window.addEventListener("pointercancel", updateTouch(0))
window.addEventListener("deviceorientation", updateOrientation())

var updateGamepads = navigator.getGamepads ? function () {
    var gamepads = navigator.getGamepads()

    // Only one gamepad supported
    if (gamepads[0]) {
        inputs.throttle = 0

        // Standard gamepad mapping is best gamepad mapping
        if (gamepads[0].mapping == "standard") {
            // Check any of the face and trigger buttons
            for (var i = 0; i < 8; i++) {
                if (gamepads[0].buttons[i].value) {
                    inputs.throttle = Math.max(inputs.throttle, gamepads[0].buttons[i].value)
                }
            }

            inputs.steering =
                // Check D-pad left, and left-control-stick left
                -gamepads[0].buttons[14].value ||
                (gamepads[0].axes[0] < -.1 ? gamepads[0].axes[0] : 0) ||

                // Check D-pad right, and left-control-stick right
                gamepads[0].buttons[15].value ||
                (gamepads[0].axes[0] > .1 ? gamepads[0].axes[0] : 0)
        }
        else {
            // UGH!
            // Check any of the face and trigger buttons
            for (var i = 0; i < gamepads[0].buttons.length; i++) {
                if (gamepads[0].buttons[i].value) {
                    inputs.throttle = Math.max(inputs.throttle, gamepads[0].buttons[i].value)
                }
            }

            inputs.steering =
                // Check D-pad left, and left-control-stick left
                (gamepads[0].axes[0] < -.1 ? gamepads[0].axes[0] : 0) ||

                // Check D-pad right, and left-control-stick right
                (gamepads[0].axes[0] > .1 ? gamepads[0].axes[0] : 0)
        }
    }
} : function () {}
