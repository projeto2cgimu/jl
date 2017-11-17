precision mediump float;
varying vec4 fPosition;

void main() {
    gl_FragColor = abs(fPosition);
}