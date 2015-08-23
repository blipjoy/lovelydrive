// Procedural texture generation
var textureSize = 1024 // Real texture size is n^2

var ctx = document.createElement("canvas").getContext("2d")
ctx.canvas.width = ctx.canvas.height = textureSize
var img = ctx.createImageData(textureSize, textureSize)

// XXX: <DEBUG>
document.body.firstChild.style.display = "none"
document.body.appendChild(ctx.canvas)
// XXX: </DEBUG>



// Setup initial fractal state
fractalData[0][0] =
fractalData[0][fractalSize] =
fractalData[fractalSize][0] =
fractalData[fractalSize][fractalSize] = .3 // Corners

diamond(0, 0, fractalSize, 2, height) // Center
square(0, 0, fractalSize, 2, height)

// Empty worker queue
while (fractalQueue.length) {
    square.apply(square, fractalQueue.shift())
}



/*
 * Multiple cloud layers??? They can be given a constant velocity (wind).
 * It would require a background color: rgb(102,145,220) OR linear gradient.
 * All clouds would be rendered in the alpha channel of a solid color:
 * rgb(220,200,220)
 *
 * How many cloud layers? Maybe just 4.
 */

// RENDER CLOUDS
tmp = 0
for (var y = 0; y < textureSize; y++) {
    for (var x = 0; x < textureSize; x++) {
        // Interpolate between each node
        var sx = x / textureSize * fractalSize,
            sy = y / textureSize * fractalSize,

            p1 = fractalData[~~sy][~~sx],
            p2 = fractalData[~~sy][~~sx + 1],
            p3 = fractalData[~~sy + 1][~~sx],
            p4 = fractalData[~~sy + 1][~~sx + 1],

            h = (
                (p1 + (p2 - p1) * (sx % 1)) * (1 - sy % 1) +
                (p1 + (p3 - p1) * (sy % 1)) * (1 - sx % 1) +
                (p3 + (p4 - p3) * (sx % 1)) * (sy % 1) +
                (p2 + (p4 - p2) * (sy % 1)) * (sx % 1)
            ) / 2

        // Choose a color based on node height
        img.data[tmp++] = 102 + h * 118 // 102 -> 220
        img.data[tmp++] = 145 + h * 55 // 145 -> 200
        img.data[tmp++] = 220
        img.data[tmp++] = 255
    }
}
ctx.putImageData(img, 0, 0)



// Reinitialize fractal state
fractalData[0][0] =
fractalData[0][fractalSize] =
fractalData[fractalSize][0] =
fractalData[fractalSize][fractalSize] = .5 // Corners

diamond(0, 0, fractalSize, 2, height) // Center
square(0, 0, fractalSize, 2, height)

// Empty worker queue
while (fractalQueue.length) {
    square.apply(square, fractalQueue.shift())
}


/*
 * 16 layers can be packed into 4 textures (each layer is 1/4 texture height)
 * Draw 8 ridges per layer with pre-computed fog (? Need a good interpolation function)
 * Apply ambient fog (and light) in the fragment shader
 *
 * 16 parallax layers? holy crap! O_o  Probably 8 layers is better!
 * 8 layers in 2 textures; 16 mountain ridges each.
 *
 * To properly shift the distant mountains up, a small triangle strip must run
 * along the bottom, using the foregroound mountain color. For simplicity, the
 * same kind of strip is needed at the bottom of each layer.
 *
 * It can just stretch a pixel from the bottom of the same texture
 *
 *
 * Each layer:
 * - is a very wide quad
 * - uses texture coordinates that repeat left and right
 * - has an equally wide quad just below, with a single pixel stretched across
 *
 *
 * Tips:
 * - Use the depth buffer ? (draw transparents last, in sorted order)
 * - Group all objects by texture; draw the entire group in one call
 */

// RENDER MOUNTAINS
for (var y = 0; y <= fractalSize; y++) {
    ctx.beginPath()

    // Choose a color based on depth
    // FIXME: Use fragment shader to add fog (based on depth)
    ctx.fillStyle =
        "rgb(" +
        ~~((fractalSize - y * .4) / fractalSize * 200) + "," +
        ~~((fractalSize - y * .6) / fractalSize * 184) + "," +
        "222)"

    ctx.moveTo(0, textureSize)

    for (var x = 0; x <= fractalSize; x++) {
        // When (y == 0): highest point scaled to 0.5, lowest scaled to 0.8
        // When (y == n): highest point scaled to 0.8, lowest scaled to 0.9
        ctx.lineTo(x / fractalSize * textureSize,
            (
                (1 - fractalData[y][x]) *
                (((fractalSize - y) / fractalSize) * .3 + (y / fractalSize) * .1) +
                (((fractalSize - y) / fractalSize) * .5 + (y / fractalSize) * .8)
            ) * textureSize
        )
    }

    ctx.lineTo(textureSize, textureSize)
    ctx.fill()
}
