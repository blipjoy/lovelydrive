# It's a Lovely Day for a Drive

A ridiculous [js13k-2015](http://2015.js13kgames.com/) game.

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

## Size Optimized

The code is intended to be sized optimized, which means it will generally run slower than its full potential. Some of the optimizations are outlined below.

* Inline everything (a single, self-contained html file)
* Minify all the things! (Mostly strip whitespace and comments)
* Prefer duplicate code over reusable functions (better zip compression)
* Code order matters (try to reduce entropy)
* Sometimes more is less (use eg. vec4 everywhere instead of multiple data types, even smaller sizes)
