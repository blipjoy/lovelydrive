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



// RENDER CLOUDS
tmp = 0
for (var y = 0; y < textureSize; y++) {
    for (var x = 0; x < textureSize; x++) {
        // Interpolate between each node
        var sx = x / textureSize * fractalSize
        var sy = y / textureSize * fractalSize

        var p1 = fractalData[~~sx][~~sy]
        var p2 = fractalData[~~sx + 1][~~sy]
        var p3 = fractalData[~~sx][~~sy + 1]
        var p4 = fractalData[~~sx + 1][~~sy + 1]

        var h = (
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
fractalData[fractalSize][fractalSize] = 0 // Corners

diamond(0, 0, fractalSize, 2, height) // Center
square(0, 0, fractalSize, 2, height)

// Empty worker queue
while (fractalQueue.length) {
    square.apply(square, fractalQueue.shift())
}



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
        // When (y == 0): highest point scaled to 0.4, lowest scaled to 0.8
        // When (y == n): highest point scaled to 0.7, lowest scaled to 0.9
        ctx.lineTo(x / fractalSize * textureSize,
            (
                (1 - fractalData[x][y]) *
                (((fractalSize - y) / fractalSize) * .4 + (y / fractalSize) * .2) +
                (((fractalSize - y) / fractalSize) * .4 + (y / fractalSize) * .7)
            ) * textureSize
        )
    }

    ctx.lineTo(textureSize, textureSize)
    ctx.fill()
}
