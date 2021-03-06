/*
 * https://github.com/cemrich/js-motor-sound-generation
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 cemrich
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function (exports) {

	var MotorSound = function (context, generator) {
		this.currentFrame = 0;
		this.context = context;
		this.speed = 0.6;
		this.isPlaying = false;
		this.generator = generator;

		// scriptNode to change sound wave on the run
		this.scriptNode = context.createScriptProcessor(1024);
		this.scriptNode.onaudioprocess = this.process.bind(this);

		// gainNode for volume control
		this.gainNode = context.createGain();
		this.gainNode.gain.value = 0.5;
		this.scriptNode.connect(this.gainNode);

		this.regenerate();
	};

	MotorSound.prototype.start = function () {
		this.gainNode.connect(this.context.destination);
	};

	MotorSound.prototype.stop = function () {
		this.gainNode.disconnect(this.context.destination);
	};

	MotorSound.prototype.regenerate = function () {
		this.data = this.generator.generate();
	};

	MotorSound.prototype.setVolume = function (volume) {
		this.gainNode.gain.value = volume;
	};

	MotorSound.prototype.setGenerator = function (generator) {
		this.generator = generator;
		this.regenerate();
	};

	MotorSound.prototype.setSpeed = function (speed) {
		this.speed = speed;
	};

	MotorSound.prototype.process = function (event) {
		// this is the output buffer we can fill with new data
		var channelL = event.outputBuffer.getChannelData(0);
		var channelR = event.outputBuffer.getChannelData(1);
		var index;

		for (var i = 0; i < channelL.length; ++i) {
			// skip more data frames on higher speed
			this.currentFrame += this.speed;
			index = Math.floor(this.currentFrame) % this.data.length;
			// update buffer from data
			channelL[i] = channelR[i] = this.data[index];
		}
		this.currentFrame %= this.data.length;
	};



	var DeterministicGenerator = function (seed) {
		this.dataLength = 1024;

		while (seed > 1) {
			seed /= 10;
		}
		this.seed = seed;
	};

	DeterministicGenerator.prototype.random = function () {
		this.seed += Math.E;
		return this.seed % 1;
	};

	DeterministicGenerator.prototype.pushLinear = function (data, toValue, toPosition) {
		var lastPosition = data.length - 1;
		var lastValue = data.pop();
		var positionDiff = toPosition - lastPosition;
		var step = (toValue - lastValue) / positionDiff;
		for (var i = 0; i < positionDiff; i++) {
			data.push(lastValue + step * i);
		}
		return data;
	};

	DeterministicGenerator.prototype.generate = function () {
		var data = [];
		var lastValue = 1;
		var lastPosition = 0;
		var nextValue, nextPosition;

		data.push(lastValue);

		for (var i = 0.05; i < 1; i += this.random()/8+0.01) {
			nextPosition = Math.floor(i * this.dataLength);
			nextValue = this.random() * 2 - 1;
			this.pushLinear(data, nextValue, nextPosition);
		}

		this.pushLinear(data, 1, this.dataLength);
		return data;
	};


// XXX: <DEBUG>
	var LinearGenerator = function () {
		this.dataLength = 1024;
	};

	LinearGenerator.prototype.pushLinear = function (data, toValue, toPosition) {
		var lastPosition = data.length - 1;
		var lastValue = data.pop();
		var positionDiff = toPosition - lastPosition;
		var step = (toValue - lastValue) / positionDiff;
		for (var i = 0; i < positionDiff; i++) {
			data.push(lastValue + step * i);
		}
		return data;
	};

	LinearGenerator.prototype.generate = function () {
		var data = [];
		var lastValue = 1;
		var lastPosition = 0;
		var nextValue, nextPosition;

		data.push(lastValue);

		for (var i = 0.05; i < 1; i += Math.random()/8+0.01) {
			nextPosition = Math.floor(i * this.dataLength);
			nextValue = Math.random() * 2 - 1;
			this.pushLinear(data, nextValue, nextPosition);
		}

		this.pushLinear(data, 1, this.dataLength);
		return data;
	};



	var NoiseGenerator = function () {
		this.dataLength = 4096;
		this.linearLength = 30;
		this.smoothness = 3;
	};

	NoiseGenerator.prototype.generate = function () {
		var data = [];
		var lastValue = 0.5;
		data.push(lastValue);

		for (var i = 1; i <= this.dataLength-this.linearLength; i++) {
			lastValue += (Math.random() - 0.5) / this.smoothness;
			lastValue = Math.min(1, lastValue);
			lastValue = Math.max(-1, lastValue);
			data.push(lastValue);
		}

		// interpolate the last view values
		var step = (0.5 - lastValue) / this.linearLength;
		for (var j = 0; j < this.linearLength; j++) {
			data.push(lastValue + step * j);
		}

		data.push(0.5);
		return data;
	};



	var CanvasGenerator = function () {
		this.canvas = document.createElement('canvas');
		this.canvas.width = 1024;
		this.canvas.height = 1;
		this.ctx = this.canvas.getContext('2d');
	};

	CanvasGenerator.prototype.getRandomGradient = function () {
		// get a horizontal gradient with several stops
		var gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
		gradient.addColorStop(0, "rgba(0, 0, 0, 255)");
		for (var i = 0.05; i < 1; i += Math.random()/8+0.01) {
			gradient.addColorStop(i, "rgba(0, 0, 0," + Math.random() + ")");
		}
		gradient.addColorStop(1, "rgba(0, 0, 0, 255)");
		return gradient;
	};

	CanvasGenerator.prototype.generate = function () {
		// draw new gradient
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = this.getRandomGradient();
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// get data from gradient
		var imageData = this.ctx.getImageData(0, 0, this.canvas.width, 1).data;
		var data = [];
		for (var i = 3, len = imageData.length; i < len; i += 4) {
			data.push(imageData[i] / 128 - 1);
		}
		return data;
	};
// XXX: </DEBUG>


	exports.MotorSound = MotorSound;
	exports.MotorSound.DeterministicGenerator = DeterministicGenerator;

// XXX: <DEBUG>
	exports.MotorSound.LinearGenerator = LinearGenerator;
	exports.MotorSound.CanvasGenerator = CanvasGenerator;
	exports.MotorSound.NoiseGenerator = NoiseGenerator;
// XXX: </DEBUG>

})(window);
