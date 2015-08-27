/*
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

var geoScale = 20 // I don't know why! :) Maybe because science!

// Generate vertex attributes for mountain layers
function mountainVertices(layer) {
    function quad(offset) {
        // Return a quad that is 1 unit high and 4 units wide, scaled to desired size
        return [
            (-2 + offset) * geoScale, geoScale - layer * geoScale / 15, z, x1, y1, // Upper left corner
            ( 2 + offset) * geoScale, geoScale - layer * geoScale / 15, z, x2, y1, // Upper right corner
            (-2 + offset) * geoScale,          - layer * geoScale / 15, z, x1, y2, // Lower left corner
            (-2 + offset) * geoScale,          - layer * geoScale / 15, z, x1, y2, // Lower left corner
            ( 2 + offset) * geoScale, geoScale - layer * geoScale / 15, z, x2, y1, // Upper right corner
            ( 2 + offset) * geoScale,          - layer * geoScale / 15, z, x2, y2  // Lower right corner
        ]
    }

    // Texture coordinates
    var x1 = 8 / textureSize,
        x2 = .5 - x1,
        y1 = 1 / 8 * layer + x1,
        y2 = 1 / 8 * (layer + 1) - x1,
        z = layer * 3 - 50

    // Quads
    return quad(-8).concat(quad(-4), quad(0), quad(4), quad(8), [
        -14 * geoScale,               - layer * geoScale / 15, z, x1, y2, // Upper left corner
         14 * geoScale,               - layer * geoScale / 15, z, x1, y2, // Upper right corner
        -14 * geoScale, 6 * -geoScale - layer * geoScale / 15, z, x1, y2, // Lower left corner
        -14 * geoScale, 6 * -geoScale - layer * geoScale / 15, z, x1, y2, // Lower left corner
         14 * geoScale,               - layer * geoScale / 15, z, x1, y2, // Upper right corner
         14 * geoScale, 6 * -geoScale - layer * geoScale / 15, z, x1, y2  // Lower right corner
    ])
}

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    mountainVertices(0)
        .concat(mountainVertices(1))
        .concat(mountainVertices(2))
        .concat(mountainVertices(3))
        .concat(mountainVertices(4))
        .concat(mountainVertices(5))
        .concat(mountainVertices(6))
        .concat(mountainVertices(7))
), gl.STATIC_DRAW)
