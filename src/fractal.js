// Fractal state
n = 128 // Fractal size (n^2 + 1)

d = [] // Fractal array
for (i = 0; i <= n; i++) {
    d[i] = []
}

// Diamond-square worker queue
q = []


// Deterministic random function
rs = Math.PI
function random() {
    rs += Math.E + Math.cos(rs)
    return rs % 1
}

// Sinusoidal tween
function easeInOut(value) {
    return .5 * (1 - Math.cos(Math.PI * value))
}

// Height map function
function height(value, weight) {
    return Math.max(Math.min(value + (Math.random() - .5) * weight, 1), 0)
}

function diamond(x, y, w, s, f) {
    d[x + w / 2][y + w / 2] = f((
        d[x][y] +
        d[x + w][y] +
        d[x][y + w] +
        d[x + w][y + w]
    ) / 4, s)
}

function subsquare(x, y, w, s, f) {
    d[x][y] =
    // FIXME: This assignment makes the factral wrap properly. How can I make this smaller?
    d[x == n ? 0 : x][y == n ? 0 : y] =
    f((
        d[(x - w + n) % n][y] +
        d[x][(y - w + n) % n] +
        d[(x + w) % n][y] +
        d[x][(y + w) % n]
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
        q.push([ x, y, w, s, f ])
        q.push([ x + w, y, w, s, f ])
        q.push([ x, y + w, w, s, f ])
        q.push([ x + w, y + w, w, s, f ])
    }
}
