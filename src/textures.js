/*
 * Texture memory layout:
 *
 * 0: clouds and mountains
 */


// Procedural texture generation
var textureSize = 2048 // Real texture size is n^2
var textureMapW = textureSize / 2 - 16 // Texture atlas constant
var textureMapH = textureSize / 8 - 16 // Texture atlas constant

var ctx = document.createElement("canvas").getContext("2d")
ctx.canvas.width = ctx.canvas.height = textureSize
var img = ctx.createImageData(textureMapW, textureMapW)

// XXX: <DEBUG>
//document.body.firstChild.style.display = "none"
//document.body.appendChild(ctx.canvas)
// XXX: </DEBUG>


/*
 * Multiple cloud layers:
 *
 * - Render two fractal-clouds into the texture
 * - Clouds are rendered in the alpha channel of a solid color: rgb(220,200,220)
 * - Give each layer a constant velocity (wind)
 * - In the scene, draw the upper and lower halves of each cloud with a linear
 *   gradient fading at the bottom; rgba(1,1,1,1)..rgb(1,1,1,0)
 */
for (var i = 0; i < 2; i++) {
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

    // RENDER CLOUDS
    tmp = 0
    for (var y = 0; y < textureMapW; y++) {
        for (var x = 0; x < textureMapW; x++) {
            // Interpolate between each node
            var sx = x / textureMapW * fractalSize,
                sy = y / textureMapW * fractalSize,

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

            // Choose color and alpha based on node height
            img.data[tmp++] = 102 + h * 118 // 102 -> 220
            img.data[tmp++] = 145 + h * 55 // 145 -> 200
            img.data[tmp++] = 220
            img.data[tmp++] = h * 255
        }
    }

    // Duplicate pixels on the horizontal edges to fix texture seams when tiled
    for (var x = 4; x < 8; x++) {
        ctx.putImageData(img, textureMapW + 16 + x, (textureMapW + 16) * i + 8)
    }
    for (var x = 12; x >= 8; x--) {
        ctx.putImageData(img, textureMapW + 16 + x, (textureMapW + 16) * i + 8)
    }
}


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
ctx.translate(8, 8)
for (var i = 0; i < 8; i++) {
    for (var y = 0; y < 16; y++) {
        ctx.beginPath()

        // Choose a color based on depth
        // FIXME: Use fragment shader to add fog (based on depth)
        ctx.fillStyle =
            "rgb(" +
            // TODO: Implement fog in the fragment shader
            ~~((fractalSize - (y + i * 16) * .4) / fractalSize * 200) + "," +
            ~~((fractalSize - (y + i * 16) * .6) / fractalSize * 184) + "," +
            "222)"

        ctx.moveTo(-4, textureMapH + 4)
        ctx.lineTo(-4, (1 - fractalData[y + i * 16][0] * ((8 - i) / 16 + .5)) * textureMapH)

        for (var x = 0; x <= fractalSize; x++) {
            ctx.lineTo(x / fractalSize * textureMapW,
                (
                    1 - (fractalData[y + i * 16][x] * ((8 - i) / 16 + .5) * .8 + .2)
                ) * textureMapH + y / 16 * .2 * textureMapH
            )
        }

        ctx.lineTo(textureMapW + 4, (1 - fractalData[y + i * 16][0] * ((8 - i) / 16 + .5)) * textureMapH)
        ctx.lineTo(textureMapW + 4, textureMapH + 4)
        ctx.fill()
    }
    ctx.translate(0, textureMapH + 16)
}

// Upload our new texture to the GPU
gl.texImage2D(
    gl.TEXTURE_2D,
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture()),
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    ctx.canvas
);

// Disable mipmap on the background texture (not needed, and causes texture seams)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
