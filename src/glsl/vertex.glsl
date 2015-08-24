attribute vec4 v; // Vertex position
attribute vec2 u; // Texture coordinates

uniform mat4 p; // Projection matrix
uniform mat4 m; // View matrix

varying vec2 t; // Texture coordinates

void main(void) {
    // Pass varyings along to fragment shader
    t = u;

    // Transform the vertex position by the projection and view matrices
    gl_Position = v * m * p;
}
