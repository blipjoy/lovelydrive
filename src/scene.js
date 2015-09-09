/*
 * Linear gradients are cool
 *
 * There are currently two pre-defined gradients:
 * - Noon
 * - Sunset
 *
 * They are specified below for background and mountains.
 *
 * TODO: Interpolate between the magic numbers to create a time-of-day effect.
 *
 *
 * An aside on 3D geometry:
 *
 * With the default perspective projection, a 1 unit high quad will fill the
 * screen vertically when at z==0. Since we cannot have z==0, we place it at
 * z==-1, and scale the quad to 2 units high. This provides the same effect.
 *
 * For every unit of depth, the scale must be doubled to fill the sceen;
 *
 *   scale = -z * 2
 *
 * Using this property, we can accurately scale our geometry for any depth.
 *
 * Since the screen automatically adjusts to any aspect ratio, we have to take
 * precautions against super mega ultra wide aspect ratios that will reveal the
 * edges of our geometry... This is just done on a best effort; use more quads!
 *
 * Using 5 quads across (each 4 units wide) works with screen aspect ratios up
 * to about 2.4:1 when scaling by 20 units.
 */

var mountainScale = 20 // I don't know why! :) Maybe because science!
var cloudScale = 52 // Same as depth!

// Generate vertex attributes for mountain layers
function mountainVertices(layer) {
    function quad(offset) {
        // Return a quad that is 1 unit high and 4 units wide, scaled to desired size
        return [
            r, g, b, 1, x1, y1, (-3 + offset) * mountainScale, mountainScale - layer * 2 + 12, z, 1, // Upper left corner
            r, g, b, 1, x2, y1, ( 3 + offset) * mountainScale, mountainScale - layer * 2 + 12, z, 1, // Upper right corner
            r, g, b, 1, x1, y2, (-3 + offset) * mountainScale,               - layer * 2 + 12, z, 1, // Lower left corner
            r, g, b, 1, x1, y2, (-3 + offset) * mountainScale,               - layer * 2 + 12, z, 1, // Lower left corner
            r, g, b, 1, x2, y1, ( 3 + offset) * mountainScale, mountainScale - layer * 2 + 12, z, 1, // Upper right corner
            r, g, b, 1, x2, y2, ( 3 + offset) * mountainScale,               - layer * 2 + 12, z, 1  // Lower right corner
        ]
    }

    // Texture coordinates
    var x1 = 8 / TEXTURE_SIZE,
        x2 = .5 - x1,
        y1 = 1 / 8 * layer + x1,
        y2 = 1 / 8 * (layer + 1) - x1,
        z = layer * 3 - 51,
/*
        // Noon
        r = 200 / 255 * 1.125 * ((7 - layer) / 7 * .4 + .6),
        g = 184 / 255 * 1.125 * ((7 - layer) / 7 * .6 + .4),
        b = 222 / 255 * 1.125
/*/
        // Sunset
        r = 71 / 255 * 1.125 * ((7 - layer) / 7 * .8 + .2),
        g = 28 / 255 * 1.125 * ((7 - layer) / 7 * .8 + .2),
        b = 14 / 255 * 1.125 * ((7 - layer) / 7 * .8 + .2)
//*/

    // Quads
    return quad(-12).concat(quad(-6), quad(0), quad(6), quad(12), [
        r, g, b, 1, x1, y2, -15 * mountainScale,                    - layer * 2 + 12, z, 1, // Upper left corner
        r, g, b, 1, x1, y2,  15 * mountainScale,                    - layer * 2 + 12, z, 1, // Upper right corner
        r, g, b, 1, x1, y2, -15 * mountainScale, 6 * -mountainScale - layer * 2 + 12, z, 1, // Lower left corner
        r, g, b, 1, x1, y2, -15 * mountainScale, 6 * -mountainScale - layer * 2 + 12, z, 1, // Lower left corner
        r, g, b, 1, x1, y2,  15 * mountainScale,                    - layer * 2 + 12, z, 1, // Upper right corner
        r, g, b, 1, x1, y2,  15 * mountainScale, 6 * -mountainScale - layer * 2 + 12, z, 1  // Lower right corner
    ])
}


// Generate vertex attributes for cloud layers
function cloudVertices(layer) {
    function quad(offset) {
        // Return a quad that is .5 units high and 4 units wide
        return [
            r, g, b, 1, x1, y1, (-2 + offset) * cloudScale, cloudScale, z, 1, // Upper left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * cloudScale, cloudScale, z, 1, // Upper right corner
            0, 0, 0, 0, x1, y2, (-2 + offset) * cloudScale,          0, z, 1, // Lower left corner
            0, 0, 0, 0, x1, y2, (-2 + offset) * cloudScale,          0, z, 1, // Lower left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * cloudScale, cloudScale, z, 1, // Upper right corner
            0, 0, 0, 0, x2, y2, ( 2 + offset) * cloudScale,          0, z, 1  // Lower right corner
        ]
    }

    var x1 = .5 + 8 / TEXTURE_SIZE,
        x2 = 1 - 8 / TEXTURE_SIZE,
        y1 = layer / 4 + 8 / TEXTURE_SIZE,
        y2 = y1 + .25,
        z = layer * 8 - cloudScale,
        // Sunset
        r = [ 239, 102,  62, 221 ][layer] / 255,
        g = [ 137, 145,  22, 148 ][layer] / 255,
        b = [  44, 220, 121,  92 ][layer] / 255

    return quad(-4).concat(quad(0), quad(4))
}



var roadPosition = new Float32Array(mat4Identity)

// Fractal pavement
fractal(0, .2, pinkNoiseFn, eval) // eval is the identity function (saves 8 bytes)

// Generate vertex attributes for road
function roadVertices(i) {
    // Road state
    var x1, z1,
        x2, z2,
        x3 = -3,
        x4 = 3,
        z3 = z4 = 0,
        angle = 0,
        step = 0

    function quad(z) {
        var a = (z - i + 1) / 28,
            b = (z - i + 2) / 28,

            // Compute a rotation angle from the next fractal node
            turn = fractalData[~~(z / fractalSize) % fractalSize][z % fractalSize] * Math.PI / 4,
            state

        /*
         * This is a state machine which forces the road direction if the angle is
         * greater than 45 degrees. The forcing persists for 10 segments, which can
         * create winding/snaking roads. Very interesting driving!
         *
         * The default state is to let the noise navigate.
         *
         * The reason for the angle clamping is to prevent loops. We're guaranteed
         * that the road always extends away from the origin (toward its original
         * direction)
         */
        if (angle > Math.PI / 4) {
            step = 0
            state = 1
        }
        else if (angle < -Math.PI / 4) {
            step = 0
            state = 2
        }
        else if (step++ > 10) {
            state = 0
        }

        // Apply a transform to the turn, based on state
        if (state == 1) {
            turn = -Math.abs(turn)
        }
        if (state == 2) {
            turn = Math.abs(turn)
        }

        // Update the angle and create a new segment
        angle += turn

        // xz1 and xz2 are copied from the previous xz3 and xz4
        if (navigator.userAgent.indexOf("Firefox/") > 0) {
            x1 = + "" + x3
            z1 = + "" + z3
            x2 = + "" + x4
            z2 = + "" + z4
        }
        else {
            x1 = x3
            z1 = z3
            x2 = x4
            z2 = z4
        }

        // Rotate the pivot point
        mat4RotateY(roadPosition, turn)

        // Get the next xz3 and xz4
        mat4Translate(roadPosition, -3, 0, 1)
        x3 = roadPosition[12]
        z3 = roadPosition[14]
        mat4Translate(roadPosition, 6, 0, 0)
        x4 = roadPosition[12]
        z4 = roadPosition[14]
        mat4Translate(roadPosition, -3, 0, 0)

        return [
            // FIXME: Texture coordinates are not correct
            a, a, a, a,  0,   0, x1, -1, z1, 2, // Upper Left corner
            a, a, a, a, .5,   0, x2, -1, z2, 2, // Upper right corner
            b, b, b, b,  0, 1/8, x3, -1, z3, 2, // Lower left corner
            b, b, b, b,  0, 1/8, x3, -1, z3, 2, // Lower left corner
            a, a, a, a, .5,   0, x2, -1, z2, 2, // Upper right corner
            b, b, b, b, .5, 1/8, x4, -1, z4, 2, // Lower right corner
        ]
    }

    var quads = []

    for (var z = i; z < i + 28; z++) {
        quads = quads.concat(quad(z))
    }

    return quads
}

// Fill the vertex attribute buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    // Background geometry
    [
/*
        // Noon
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0, -53 * 5, 53, -53, 0, // Upper left corner
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0,  53 * 5, 53, -53, 0, // Upper right corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0, -53 * 5, 10, -53, 0, // Lower left corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0, -53 * 5, 10, -53, 0, // Lower left corner
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0,  53 * 5, 53, -53, 0, // Upper right corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0,  53 * 5, 10, -53, 0  // Lower right corner
/*/
        // Sunset
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0, -53 * 5, 53, -53, 0, // Upper left corner
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0,  53 * 5, 53, -53, 0, // Upper right corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0, -53 * 5, 10, -53, 0, // Lower left corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0, -53 * 5, 10, -53, 0, // Lower left corner
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0,  53 * 5, 53, -53, 0, // Upper right corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0,  53 * 5, 10, -53, 0  // Lower right corner
//*/
    ]

    // Cloud geometry
    .concat(cloudVertices(0))
    .concat(cloudVertices(1))
    .concat(cloudVertices(2))
    .concat(cloudVertices(3))

    // Mountain geometry
    .concat(mountainVertices(0))
    .concat(mountainVertices(1))
    .concat(mountainVertices(2))
    .concat(mountainVertices(3))
    .concat(mountainVertices(4))
    .concat(mountainVertices(5))
    .concat(mountainVertices(6))
    .concat(mountainVertices(7))

    .concat(roadVertices(0))
), gl.DYNAMIC_DRAW)
