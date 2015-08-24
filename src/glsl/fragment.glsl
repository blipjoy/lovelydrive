precision highp float;

uniform vec4 c; // Color
uniform sampler2D s; // Texture

varying vec2 t; // Texture coordinates

void main(void) {
    // Set the fragment color by sampling the texture and multiply color
    gl_FragColor = texture2D(s, t) * c;
}
