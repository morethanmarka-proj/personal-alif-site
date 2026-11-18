import * as THREE from "three";
import { disposeScene } from "./shared.js";

const fragment = `
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uRes, uPointer, uVel;
uniform vec4 uTaps[8];
uniform float uTime, uPress, uCell, uGlyphs, uAmp;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);
}
void main() {
  vec2 px = vUv*uRes, cell = floor(px/uCell), cuv = (cell+.5)*uCell/uRes;
  float aspect = uRes.x/uRes.y;
  float n = noise(cuv*vec2(3.*aspect,3.)+vec2(uTime*.08,uTime*.05));
  float light = smoothstep(.15,1.,1.-cuv.y+.25*(n-.5)+.12*sin(cuv.x*4.+uTime*.3));
  vec2 d = (cuv-uPointer)*vec2(aspect,1.);
  float speed = min(length(uVel),3.);
  float push = exp(-dot(d,d)/(.018+.05*uPress+.012*speed))*uAmp;
  light += push*(.55+.45*uPress)+push*speed*.35;
  float ring = 0.;
  for(int i=0;i<8;i++) {
    float age = uTime-uTaps[i].z;
    float distance = length((cuv-uTaps[i].xy)*vec2(aspect,1.));
    ring += uTaps[i].w*exp(-pow((distance-age*.8)*10.,2.))*exp(-age*1.5);
  }
  light = clamp(light+ring*.6,0.,1.);
  float scramble = max(smoothstep(.12,.5,push),ring);
  float tick = floor(uTime*(10.+22.*uPress));
  float index = floor(light*(uGlyphs-1.)+.5);
  index = mix(index,floor(hash(cell+tick)*uGlyphs),step(hash(cell*1.7+tick),scramble*1.15));
  vec2 glyphUV = fract(px/uCell);
  float glyph = texture2D(uAtlas,vec2((index+glyphUV.x)/uGlyphs,glyphUV.y)).r;
  vec3 color = mix(vec3(.106,.231,1.),vec3(0.),smoothstep(.5,1.,light));
  gl_FragColor = vec4(color,glyph*smoothstep(.05,.4,light));
}`;

export function createAscii() {
  const ramp = " .·:+x0S8#@";
  const atlas = document.createElement("canvas");
  atlas.width = 32 * ramp.length;
  atlas.height = 32;
  const context = atlas.getContext("2d");
  context.fillStyle = "black";
  context.fillRect(0, 0, atlas.width, atlas.height);
  context.fillStyle = "white";
  context.font = "600 25px ui-monospace, Menlo, monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  [...ramp].forEach((letter, i) => context.fillText(letter, i * 32 + 16, 17));
  const texture = new THREE.CanvasTexture(atlas);
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const taps = Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, -99, 0));
  let tapIndex = 0;
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uAtlas: { value: texture },
      uGlyphs: { value: ramp.length },
      uRes: { value: new THREE.Vector2() },
      uCell: { value: 14 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uVel: { value: new THREE.Vector2() },
      uPress: { value: 0 },
      uAmp: { value: 1 },
      uTaps: { value: taps },
    },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: fragment,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
  return {
    scene,
    camera,
    resize(width, height, dpr) {
      material.uniforms.uRes.value.set(width * dpr, height * dpr);
      material.uniforms.uCell.value = (width < 768 ? 12 : 14) * dpr;
    },
    tap(state) {
      taps[tapIndex++ % taps.length].set(state.p.x, state.p.y, state.time, 1);
    },
    reset() {
      taps.forEach((tap) => (tap.w = 0));
    },
    update(state) {
      const u = material.uniforms;
      u.uTime.value = state.time;
      u.uPointer.value.copy(state.p);
      u.uVel.value.copy(state.velocity);
      u.uPress.value = state.press;
      u.uAmp.value = state.amp;
    },
    dispose() {
      texture.dispose();
      disposeScene(scene);
    },
  };
}
