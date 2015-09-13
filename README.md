# It's a Lovely Day for a Drive

A ridiculous [js13k-2015](http://2015.js13kgames.com/) game.

> "It's like [Desert Bus](https://en.wikipedia.org/wiki/Penn_%26_Teller%27s_Smoke_and_Mirrors#Desert_Bus). Only worse."
>
> ~ Said No One Ever

## About

Lovely Drive pays homage to Desert Bus. You are a driver on a lonely desert highway with nothing but the wind rushing by and your chill tunes on the radio. Unfortunately, your transmission is stuck in reverse. But that won't let you stop you from enjoying this lovely day.

The theme for js13k-2015 is "Reversed". If *Desert Bus* was the worst game ever made, and Lovely Drive is *Desert Bus in reverse*, then by that logic Lovely Drive is the *best game ever made*.

![Desktop screenshot](screenshots/desktop.png?raw=true "Desktop Screenshot")

## Controls

* USB or wireless Gamepad: Left joystick to steer, [almost] any button for throttle
* Keyboard: A (:arrow_left:) and D (:arrow_right:) to steer, S (:arrow_down:) for throttle
* Mobile: Tilt sensor to steer, tap/hold for throttle

### Tips

Use a gamepad for the best possible experience. Beware that not all gamepads will have the "standard" button mapping in all browsers. (Tested with a PS3 controller on Chrome)

There are known limitations with calibrating the mobile steering. Your best bet might be to calibrate your body (spin around while tapping slowly until the car stops turning). When you are in a good location, the tilt sensor will let you drive as if your mobile device is the steering wheel.

## Supported Platforms

The following list of platforms have been tested. Others may (or may not!) work.

* Chrome
* Firefox
* Safari
* iOS
* Android

![iPhone 4S screenshot](screenshots/iphone4s.png?raw=true "iPhone 4S Screenshot")

## Building

Install development environment:

```bash
$ npm install
```

Build the distro:

```bash
$ grunt
```

This will create a distro file in `build/index.zip`. The goal is for this file to be exactly 13,312 bytes or less.

## Tech

### Size Optimized

The code is intended to be sized optimized, which means it will generally run slower than its full potential. Some of the optimizations are outlined below.

* Inline everything (a single, self-contained html file)
* Minify all the things! (Mostly strip whitespace and comments)
* Prefer duplicate code over reusable functions (better zip compression)
* Code order matters (try to reduce entropy)
* Sometimes more is less (use eg. vec4 everywhere instead of multiple data types, even smaller sizes)

### Fractals

Uses the [diamond-square](http://www.gameprogrammer.com/fractal.html) algorithm extensively to create 2D fractals. These fractals generate the mountains, clouds, asphalt textures, and even the winding road.

Diamond-square is combined with different noise generators (white noise and pink noise) to give an infinite variety of results.

### Third-Party Libraries

* [Sonant-X](https://github.com/nicolas-van/sonant-x) (zlib license)
* [js-motor-sound-generation](https://github.com/cemrich/js-motor-sound-generation) (MIT license)
