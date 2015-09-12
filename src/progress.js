// Update progress bar
var progress = (function () {
    var current = 0
    const PROGRESS_TOTAL = 8

    return function () {
        document.getElementById("p").style.width = (++current / PROGRESS_TOTAL * 100) + "%"
    }
})()
