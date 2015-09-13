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

const MOUNTAIN_SCALE = 20 // I don't know why! :) Maybe because science!
const CLOUD_SCALE_X = 80 // No reason. Just stretch it enough to handle ~3:1 displays
const CLOUD_SCALE_Y = 52 // Same as depth!
const FIREFOX = navigator.userAgent.indexOf("Firefox/") > 0
const ROAD_SEGMENTS = 28


// Generate vertex attributes for mountain layers
function mountainVertices(layer) {
    function quad(offset) {
        // Return a quad that is 1 unit high and 4 units wide, scaled to desired size
        return [
            r, g, b, 1, x1, y1, (-3 + offset) * MOUNTAIN_SCALE, MOUNTAIN_SCALE - layer * 2 + 12, z, // Upper left corner
            r, g, b, 1, x2, y1, ( 3 + offset) * MOUNTAIN_SCALE, MOUNTAIN_SCALE - layer * 2 + 12, z, // Upper right corner
            r, g, b, 1, x1, y2, (-3 + offset) * MOUNTAIN_SCALE,                - layer * 2 + 12, z, // Lower left corner
            r, g, b, 1, x1, y2, (-3 + offset) * MOUNTAIN_SCALE,                - layer * 2 + 12, z, // Lower left corner
            r, g, b, 1, x2, y1, ( 3 + offset) * MOUNTAIN_SCALE, MOUNTAIN_SCALE - layer * 2 + 12, z, // Upper right corner
            r, g, b, 1, x2, y2, ( 3 + offset) * MOUNTAIN_SCALE,                - layer * 2 + 12, z  // Lower right corner
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
        r, g, b, 1, x1, y2, -15 * MOUNTAIN_SCALE,                     - layer * 2 + 12, z, // Upper left corner
        r, g, b, 1, x1, y2,  15 * MOUNTAIN_SCALE,                     - layer * 2 + 12, z, // Upper right corner
        r, g, b, 1, x1, y2, -15 * MOUNTAIN_SCALE, 6 * -MOUNTAIN_SCALE - layer * 2 + 12, z, // Lower left corner
        r, g, b, 1, x1, y2, -15 * MOUNTAIN_SCALE, 6 * -MOUNTAIN_SCALE - layer * 2 + 12, z, // Lower left corner
        r, g, b, 1, x1, y2,  15 * MOUNTAIN_SCALE,                     - layer * 2 + 12, z, // Upper right corner
        r, g, b, 1, x1, y2,  15 * MOUNTAIN_SCALE, 6 * -MOUNTAIN_SCALE - layer * 2 + 12, z  // Lower right corner
    ])
}


// Generate vertex attributes for cloud layers
function cloudVertices(layer) {
    function quad(offset) {
        // Return a quad that is .5 units high and 4 units wide
        return [
            r, g, b, 1, x1, y1, (-2 + offset) * CLOUD_SCALE_X, CLOUD_SCALE_Y, z, // Upper left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * CLOUD_SCALE_X, CLOUD_SCALE_Y, z, // Upper right corner
            0, 0, 0, 0, x1, y2, (-2 + offset) * CLOUD_SCALE_X,             0, z, // Lower left corner
            0, 0, 0, 0, x1, y2, (-2 + offset) * CLOUD_SCALE_X,             0, z, // Lower left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * CLOUD_SCALE_X, CLOUD_SCALE_Y, z, // Upper right corner
            0, 0, 0, 0, x2, y2, ( 2 + offset) * CLOUD_SCALE_X,             0, z  // Lower right corner
        ]
    }

    var x1 = .5 + 8 / TEXTURE_SIZE,
        x2 = 1 - 8 / TEXTURE_SIZE,
        y1 = layer / 4 + 8 / TEXTURE_SIZE,
        y2 = y1 + .25,
        z = layer * 8 - CLOUD_SCALE_Y,
        // Sunset
        r = [ 239, 102,  62, 221 ][layer] / 255,
        g = [ 137, 145,  22, 148 ][layer] / 255,
        b = [  44, 220, 121,  92 ][layer] / 255

    return quad(-4).concat(quad(0), quad(4))
}



var roadPosition = new Float32Array(mat4Identity),
    nextRoadPosition = new Float32Array(mat4Identity),
    roadGeometry = new Float32Array(28 * 6 * 9),
    roadAngle = 0

// Fractal pavement
fractal(0, .2, pinkNoiseFn, eval) // eval is the identity function (saves 8 bytes)

var nextRoadAngle = (function() {
    // Road state
    var z = 0

    return function () {
        // Compute a rotation angle from the next fractal node
        return roadAngle = fractalData[~~(z / FRACTAL_SIZE) % FRACTAL_SIZE][z++ % FRACTAL_SIZE] * Math.PI / 8
    }
})()

var nextRoadSegment = (function () {
    // Road state
    var x1, z1,
        x2, z2,
        x3 = -3,
        x4 = 3,
        z3 = z4 = 0

    return function () {
        // xz1 and xz2 are copied from the previous xz3 and xz4
        if (FIREFOX) {
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

        // Copy the last road position for the camera
        roadPosition.set(nextRoadPosition)

        // Rotate the pivot point
        mat4RotateY(nextRoadPosition, nextRoadAngle())

        // Get the next xz3 and xz4
        mat4Translate(nextRoadPosition, -3, 0, 1)
        x3 = nextRoadPosition[12]
        z3 = nextRoadPosition[14]
        mat4Translate(nextRoadPosition, 6, 0, 0)
        x4 = nextRoadPosition[12]
        z4 = nextRoadPosition[14]
        mat4Translate(nextRoadPosition, -3, 0, 0)

        return [
            [ x1, -1, z1 ], // Upper Left corner
            [ x2, -1, z2 ], // Upper right corner
            [ x3, -1, z3 ], // Lower left corner
            [ x3, -1, z3 ], // Lower left corner
            [ x2, -1, z2 ], // Upper right corner
            [ x4, -1, z4 ]  // Lower right corner
        ]
    }
})()

// Updates the road geometry, then copies it to the WebGL Array Buffer
function shiftRoadSegments() {
    // Get a copy of the texture coordinates on the first segment
    // These will be cycled to the last segment
    var v = [
        roadGeometry[5],
        roadGeometry[14],
        roadGeometry[23],
        roadGeometry[32],
        roadGeometry[41],
        roadGeometry[50]
    ]

    // Shift all position vectors (and texture coordinates) to the previous segment
    for (var i = 1; i < ROAD_SEGMENTS; i++) {
        for (var j = 0; j < 6; j++) {
            var n = (i - 1) * 6 * 9 + j * 9 + 5,
                m = i * 6 * 9 + j * 9 + 5

            roadGeometry.set(roadGeometry.slice(m, m + 4), n)
        }
    }

    // FIXME: Update the alpha for each segment to properly blend while scrolling
    // This will prevent a perceptable "flash" in the road

    // Update the last segment
    var segment = nextRoadSegment()
    for (var i = 0; i < 6; i++) {
        roadGeometry.set([ v[i] ].concat(segment[i]), (ROAD_SEGMENTS - 1) * 6 * 9 + i * 9 + 5)
    }

    // Copy the new road geometry to the WebGL Array Buffer
    gl.bufferSubData(gl.ARRAY_BUFFER, (6 + 4 * 3 * 6 + 8 * 6 * 6) * 9 * 4, roadGeometry)
}

// Generate vertex attributes for road
function roadVertices() {
    function quad(z) {
        var a = z / ROAD_SEGMENTS,
            b = (z + 1) / ROAD_SEGMENTS,
            v1 = z % 4 / 8,
            v2 = v1 + 1 / 8

        return [
            // FIXME: Texture coordinates are not correct
            a, a, a, a, .5, v1, 0, 0, 0, // Upper Left corner
            a, a, a, a,  1, v1, 0, 0, 0, // Upper right corner
            b, b, b, b, .5, v2, 0, 0, 0, // Lower left corner
            b, b, b, b, .5, v2, 0, 0, 0, // Lower left corner
            a, a, a, a,  1, v1, 0, 0, 0, // Upper right corner
            b, b, b, b,  1, v2, 0, 0, 0  // Lower right corner
        ]
    }

    var quads = []

    for (var z = 0; z < ROAD_SEGMENTS; z++) {
        var q = quad(z),
            segment = nextRoadSegment()

        for (var i = 0; i < 6; i++) {
            q.splice.apply(q, [ i * 9 + 6, 3 ].concat(segment[i]))
        }

        quads = quads.concat(q)
    }

    roadGeometry.set(quads)

    return quads
}

// Fill the vertex attribute buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    // Background geometry
    [
/*
        // Noon
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0, -53 * 5, 53, -53, // Upper left corner
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0,  53 * 5, 53, -53, // Upper right corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0, -53 * 5, 10, -53, // Lower left corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0, -53 * 5, 10, -53, // Lower left corner
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0,  53 * 5, 53, -53, // Upper right corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0,  53 * 5, 10, -53  // Lower right corner
/*/
        // Sunset
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0, -53 * 5, 53, -53, // Upper left corner
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0,  53 * 5, 53, -53, // Upper right corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0, -53 * 5, 10, -53, // Lower left corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0, -53 * 5, 10, -53, // Lower left corner
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0,  53 * 5, 53, -53, // Upper right corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0,  53 * 5, 10, -53  // Lower right corner
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

    .concat(roadVertices())
), gl.DYNAMIC_DRAW)

// Update progress bar
progress()
