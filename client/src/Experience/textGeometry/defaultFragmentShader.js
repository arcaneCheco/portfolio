const shader = `#version 300 es
#define varying in
out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
#define gl_FragDepthEXT gl_FragDepth
#define texture2D texture
#define textureCube texture
#define texture2DProj textureProj
#define texture2DLodEXT textureLod
#define texture2DProjLodEXT textureProjLod
#define textureCubeLodEXT textureLod
#define texture2DGradEXT textureGrad
#define texture2DProjGradEXT textureProjGrad
#define textureCubeGradEXT textureGrad
precision highp float;
precision highp int;
uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
varying vec2 vUv;
float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 mySample = texture2D(map, vUv).rgb;
  float sigDist = median(mySample.r, mySample.g, mySample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
  gl_FragColor = vec4(color.xyz, alpha * opacity);
  if (gl_FragColor.a < 0.0001) discard;
}`;

export default shader;
