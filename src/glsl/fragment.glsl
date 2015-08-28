precision highp float;

uniform sampler2D s; // Texture

varying vec4 i; // Interpolation Color
varying vec2 t; // Texture coordinates

void main(void) {
    // Set the fragment color by sampling the texture and multiply color
    gl_FragColor = texture2D(s, t) * i;
}
