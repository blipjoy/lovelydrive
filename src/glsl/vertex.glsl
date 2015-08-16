attribute vec4 v; // Vertex position

uniform mat4 p; // Projection matrix
uniform mat4 m; // View matrix

void main(void) {
    gl_Position = v * m * p;
}
