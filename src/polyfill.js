// For Safari
if (!Float32Array.prototype.slice) {
    Float32Array.prototype.slice = function (start, end) {
        return new Float32Array(Array.prototype.slice.call(this, start, end))
    }
}
