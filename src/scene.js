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
var cloudScale = 51 // Same as depth!

// Generate vertex attributes for mountain layers
function mountainVertices(layer) {
    function quad(offset) {
        // Return a quad that is 1 unit high and 4 units wide, scaled to desired size
        return [
            r, g, b, 1, x1, y1, (-2 + offset) * mountainScale, mountainScale - layer * mountainScale / 15, z, // Upper left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * mountainScale, mountainScale - layer * mountainScale / 15, z, // Upper right corner
            r, g, b, 1, x1, y2, (-2 + offset) * mountainScale,               - layer * mountainScale / 15, z, // Lower left corner
            r, g, b, 1, x1, y2, (-2 + offset) * mountainScale,               - layer * mountainScale / 15, z, // Lower left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * mountainScale, mountainScale - layer * mountainScale / 15, z, // Upper right corner
            r, g, b, 1, x2, y2, ( 2 + offset) * mountainScale,               - layer * mountainScale / 15, z  // Lower right corner
        ]
    }

    // Texture coordinates
    var x1 = 8 / textureSize,
        x2 = .5 - x1,
        y1 = 1 / 8 * layer + x1,
        y2 = 1 / 8 * (layer + 1) - x1,
        z = layer * 3 - 50,
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
    return quad(-8).concat(quad(-4), quad(0), quad(4), quad(8), [
        r, g, b, 1, x1, y2, -10 * mountainScale,                    - layer * mountainScale / 15, z, // Upper left corner
        r, g, b, 1, x1, y2,  10 * mountainScale,                    - layer * mountainScale / 15, z, // Upper right corner
        r, g, b, 1, x1, y2, -10 * mountainScale, 6 * -mountainScale - layer * mountainScale / 15, z, // Lower left corner
        r, g, b, 1, x1, y2, -10 * mountainScale, 6 * -mountainScale - layer * mountainScale / 15, z, // Lower left corner
        r, g, b, 1, x1, y2,  10 * mountainScale,                    - layer * mountainScale / 15, z, // Upper right corner
        r, g, b, 1, x1, y2,  10 * mountainScale, 6 * -mountainScale - layer * mountainScale / 15, z  // Lower right corner
    ])
}


// Generate vertex attributes for cloud layers
function cloudVertices(layer) {
    function quad(offset) {
        // Return a quad that is .5 units high and 4 units wide
        return [
            r, g, b, 1, x1, y1, (-2 + offset) * cloudScale, cloudScale, z, // Upper left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * cloudScale, cloudScale, z, // Upper right corner
            0, 0, 0, 0, x1, y2, (-2 + offset) * cloudScale,          0, z, // Lower left corner
            0, 0, 0, 0, x1, y2, (-2 + offset) * cloudScale,          0, z, // Lower left corner
            r, g, b, 1, x2, y1, ( 2 + offset) * cloudScale, cloudScale, z, // Upper right corner
            0, 0, 0, 0, x2, y2, ( 2 + offset) * cloudScale,          0, z  // Lower right corner
        ]
    }

    var x1 = .5 + 8 / textureSize,
        x2 = 1 - 8 / textureSize,
        y1 = layer / 4 + 8 / textureSize,
        y2 = y1 + .25,
        z = layer * 8 - cloudScale,
        // Sunset
        r = [ 239, 102,  62, 221 ][layer] / 255,
        g = [ 137, 145,  22, 148 ][layer] / 255,
        b = [  44, 220, 121,  92 ][layer] / 255

    return quad(-4).concat(quad(0), quad(4))
}



// Fill the vertex attribute buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    // Background geometry
    [
/*
        // Noon
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0, -52 * 5, 52, -52, // Upper left corner
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0,  52 * 5, 52, -52, // Upper right corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0, -52 * 5,  0, -52, // Lower left corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0, -52 * 5,  0, -52, // Lower left corner
        112 / 255, 160 / 255, 255 / 255, 1, 0, 0,  52 * 5, 52, -52, // Upper right corner
        140 / 255, 178 / 255, 255 / 255, 1, 0, 0,  52 * 5,  0, -52  // Lower right corner
/*/
        // Sunset
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0, -52 * 5, 52, -52, // Upper left corner
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0,  52 * 5, 52, -52, // Upper right corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0, -52 * 5,  0, -52, // Lower left corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0, -52 * 5,  0, -52, // Lower left corner
         61 / 255,  92 / 255, 134 / 255, 1, 0, 0,  52 * 5, 52, -52, // Upper right corner
        255 / 255, 223 / 255, 145 / 255, 1, 0, 0,  52 * 5,  0, -52  // Lower right corner
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
), gl.STATIC_DRAW)
