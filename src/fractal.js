// Fractal state
var fractalSize = 128 // Real fractal size is n^2+1 to handle wrapping

var fractalData = []
for (var y = 0; y <= fractalSize; y++) {
    fractalData[y] = []
}

// Diamond-square worker queue
var fractalQueue = []


// Height map function
function height(value, weight) {
    return Math.max(Math.min(value + (Math.random() - .5) * weight, 1), 0)
}

function diamond(x, y, w, s, f) {
    fractalData[y + w / 2][x + w / 2] = f((
        fractalData[y][x] +
        fractalData[y + w][x] +
        fractalData[y][x + w] +
        fractalData[y + w][x + w]
    ) / 4, s)
}

function subsquare(x, y, w, s, f) {
    fractalData[y][x] =
    fractalData[y % fractalSize][x % fractalSize] =
    f((
        fractalData[y][(x - w + fractalSize) % fractalSize] +
        fractalData[(y - w + fractalSize) % fractalSize][x] +
        fractalData[y][(x + w) % fractalSize] +
        fractalData[(y + w) % fractalSize][x]
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
