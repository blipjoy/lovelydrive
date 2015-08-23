// Fractal state
var fractalSize = 128 // Real fractal size is n^2+1 to handle wrapping

var fractalData = []
for (i = 0; i <= fractalSize; i++) {
    fractalData[i] = []
}

// Diamond-square worker queue
var fractalQueue = []


// Height map function
function height(value, weight) {
    return Math.max(Math.min(value + (Math.random() - .5) * weight, 1), 0)
}

function diamond(x, y, w, s, f) {
    fractalData[x + w / 2][y + w / 2] = f((
        fractalData[x][y] +
        fractalData[x + w][y] +
        fractalData[x][y + w] +
        fractalData[x + w][y + w]
    ) / 4, s)
}

function subsquare(x, y, w, s, f) {
    fractalData[x][y] =
    fractalData[x % fractalSize][y % fractalSize] =
    f((
        fractalData[(x - w + fractalSize) % fractalSize][y] +
        fractalData[x][(y - w + fractalSize) % fractalSize] +
        fractalData[(x + w) % fractalSize][y] +
        fractalData[x][(y + w) % fractalSize]
    ) / 4, s)
}

function square(x, y, w, s, f) {
    subsquare(x + w / 2, y, w / 2, s, f)
    subsquare(x, y + w / 2, w / 2, s, f)
    subsquare(x + w, y + w / 2, w / 2, s, f)
    subsquare(x + w / 2, y + w, w / 2, s, f)

    // Update fractal state
    w /= 2
    s /= 2

    // Recurse
    if (w > 1) {
        // Perform diamond steps
        diamond(x, y, w, s, f)
        diamond(x + w, y, w, s, f)
        diamond(x, y + w, w, s, f)
        diamond(x + w, y + w, w, s, f)

        // Push square steps onto a worker queue
        fractalQueue.push([ x, y, w, s, f ])
        fractalQueue.push([ x + w, y, w, s, f ])
        fractalQueue.push([ x, y + w, w, s, f ])
        fractalQueue.push([ x + w, y + w, w, s, f ])
    }
}
