precision highp float;

uniform sampler2D s[3]; // Texture Sampler2D

varying vec4 i; // Interpolation Color
varying vec2 t; // Texture coordinates
varying float y; // Texture Sampler2D index

void main(void) {
    // Set the fragment color by sampling the texture and multiply color
    if (y == 0.0) {
        gl_FragColor = texture2D(s[0], t) * i;
    }
    else if (y == 1.0) {
        gl_FragColor = texture2D(s[1], t) * i;
    }
    else {
        gl_FragColor = texture2D(s[2], t) * i;
    }
}
