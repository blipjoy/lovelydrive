// Fractal state
var FRACTAL_SIZE = 128 // Real fractal size is n^2+1 to handle wrapping

var fractalData = []
for (var y = 0; y <= FRACTAL_SIZE; y++) {
    fractalData[y] = []
}

// Diamond-square worker queue
var fractalQueue = []


// Height map function
function heightMapFn(value, weight) {
    return Math.max(Math.min(value + (Math.random() - .5) * weight, 1), 0)
}

// Kinda-sorta pink noise function
function pinkNoiseFn(value, weight) {
    /*
     * At first, I implemented a "more accurate" pink noise function based on
     * octaves, as described here: http://www.firstpr.com.au/dsp/pink-noise/
     *
     * The noise it generated looked too white. Probably because it's not meant
     * to be generated with a diamond-square. In any case, using pure white
     * noise is less code, and produces subkectively better results!
     */
    return Math.max(Math.min(value + (Math.random() - .5) * weight, 1), -1)
}


// Half-weight function
function halfWeightFn(weight) {
    return weight / 2
}


function diamond(x, y, width, weight, permuteFn) {
    fractalData[y + width / 2][x + width / 2] = permuteFn((
        fractalData[y][x] +
        fractalData[y + width][x] +
        fractalData[y][x + width] +
        fractalData[y + width][x + width]
    ) / 4, weight)
}

function subsquare(x, y, width, weight, permuteFn) {
    fractalData[y][x] =
    fractalData[y % FRACTAL_SIZE][x % FRACTAL_SIZE] =
    permuteFn((
        fractalData[y][(x - width + FRACTAL_SIZE) % FRACTAL_SIZE] +
        fractalData[(y - width + FRACTAL_SIZE) % FRACTAL_SIZE][x] +
        fractalData[y][(x + width) % FRACTAL_SIZE] +
        fractalData[(y + width) % FRACTAL_SIZE][x]
    ) / 4, weight)
}

function square(x, y, width, weight, permuteFn, nextWeightFn) {
    subsquare(x + width / 2, y, width / 2, weight, permuteFn)
    subsquare(x, y + width / 2, width / 2, weight, permuteFn)
    subsquare(x + width, y + width / 2, width / 2, weight, permuteFn)
    subsquare(x + width / 2, y + width, width / 2, weight, permuteFn)

    // Update fractal state
    width /= 2
    weight = nextWeightFn(weight)

    // Recurse
    if (width > 1) {
        // Perform diamond steps
        diamond(x, y, width, weight, permuteFn)
        diamond(x + width, y, width, weight, permuteFn)
        diamond(x, y + width, width, weight, permuteFn)
        diamond(x + width, y + width, width, weight, permuteFn)

        // Push square stepweight onto a widthorker queue
        fractalQueue.push([ x, y, width, weight, permuteFn, nextWeightFn ])
        fractalQueue.push([ x + width, y, width, weight, permuteFn, nextWeightFn ])
        fractalQueue.push([ x, y + width, width, weight, permuteFn, nextWeightFn ])
        fractalQueue.push([ x + width, y + width, width, weight, permuteFn, nextWeightFn ])
    }
}

function fractal(corners, weight, permuteFn, nextWeightFn) {
    fractalData[0][0] =
        fractalData[0][FRACTAL_SIZE] =
        fractalData[FRACTAL_SIZE][0] =
        fractalData[FRACTAL_SIZE][FRACTAL_SIZE] = corners

    diamond(0, 0, FRACTAL_SIZE, weight, permuteFn) // Center
    square(0, 0, FRACTAL_SIZE, weight, permuteFn, nextWeightFn)

    // Empty worker queue
    while (fractalQueue.length) {
        square.apply(square, fractalQueue.shift())
    }
}
