attribute vec4 vPosition;
attribute vec4 vNormal;
uniform mat4 mProjection;
uniform mat4 mModelView;
varying vec4 fPosition;

void main(){
    fPosition = vPosition;
    gl_Position = mProjection * mModelView * (vPosition + 0.2 * vNormal);
}