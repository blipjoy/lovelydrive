// Generate vertex attributes for mountain layers
function mountainVertices(layer, scale, z) {
    function quad(offset) {
        return [
            (-4 + offset) * scale, scale, z, 1, x1, y1,     // Upper left corner
            (4 + offset) * scale, scale, z, 1, x2, y1,      // Upper right corner
            (-4 + offset) * scale, -scale, z, 1, x1, y2,    // Lower left corner
            (-4 + offset) * scale, -scale, z, 1, x1, y2,    // Lower left corner
            (4 + offset) * scale, scale, z, 1, x2, y1,      // Upper right corner
            (4 + offset) * scale, -scale, z, 1, x2, y2      // Lower right corner
        ]
    }

    // Texture coordinates
    var x1 = 8 / textureSize,
        x2 = .5 - x1,
        y1 = 1 / 8 * layer + x1
        y2 = 1 / 8 * (layer + 1) - x1

    // Quads
    return quad(-8).concat(quad(0), quad(8), [
        -12 * scale, -scale, z, 1, x1, y2,      // Upper left corner
        12 * scale, -scale, z, 1, x1, y2,       // Upper right corner
        -12 * scale, -scale * 4, z, 1, x1, y2,  // Lower left corner
        -12 * scale, -scale * 4, z, 1, x1, y2,  // Lower left corner
        12 * scale, -scale, z, 1, x1, y2,       // Upper right corner
        12 * scale, -scale * 4, z, 1, x1, y2    // Lower right corner
    ])
}

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    mountainVertices(0, 300, -100)
        .concat(mountainVertices(1, 60, -20))
        .concat(mountainVertices(2, 30, -10))
        .concat(mountainVertices(3, 15, -5))
        .concat(mountainVertices(4, 12, -4))
        .concat(mountainVertices(5, 9, -3))
        .concat(mountainVertices(6, 7.5, -2.5))
        .concat(mountainVertices(7, 6, -2))
), gl.DYNAMIC_DRAW)
