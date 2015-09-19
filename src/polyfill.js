// For Safari
if (!window.AudioContext) {
    AudioContext = webkitAudioContext
}

if (!Float32Array.prototype.slice) {
    Float32Array.prototype.slice = function (start, end) {
        return new Float32Array(Array.prototype.slice.call(this, start, end))
    }
}

/*
 * iOS will only allow audio to be played after a user interaction.
 * Attempt to automatically unlock audio on the first user interaction.
 * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
 *
 * Stealthily barrowed from Howler.js; license information appears below.
 *
 * Copyright (c) 2013-2014 James Simpson and GoldFire Studios, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var iOSAudioEnabled = 0
function enableiOSAudio(callback) {
    // Only run this on iOS if audio isn't already eanbled.
    if (iOSAudioEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return
    }

    // Call this method on touch start to create and play a buffer,
    // then check if the audio actually played to determine if
    // audio has now been unlocked on iOS.
    var ctx = new AudioContext(),
        unlock = function() {
            // Create an empty buffer.
            var source = ctx.createBufferSource()

            source.buffer = ctx.createBuffer(1, 1, 22050)
            source.connect(ctx.destination)

            // Play the empty buffer.
            if (source.start) {
                source.start(0)
            }
            else {
                source.noteOn(0)
            }

            // Setup a timeout to check that we are unlocked on the next event loop.
            setTimeout(function () {
                if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
                    // Update the unlocked state and prevent this check from happening again.
                    iOSAudioEnabled = 1

                    // Remove the touch start listener.
                    document.removeEventListener("touchend", unlock, false)

                    // Notify client that we're ready to play
                    callback()
                }
            }, 0)
        }

    // Setup a touch start listener to attempt an unlock in.
    document.addEventListener("touchend", unlock, false);

    return 1
}
