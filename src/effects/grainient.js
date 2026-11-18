import * as THREE from "three";
import { disposeScene } from "./shared.js";

const P = {
  decay: 0.25,
  radius: 0.012,
  gain: 1,
  warp: 0.9,
  scale: 2.2,
  grain: 0.22,
  grainPx: 1,
  dir: [1, 1],
};

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

const SIM = `
precision highp float;
uniform sampler2D uPrev; uniform vec2 uPtr, uVel; uniform vec3 uTap;
uniform float uAsp, uRad, uGain, uDecay, uTime, uPress, uAmp, uTexel;
varying vec2 vUv;
void main(){
  vec3 c = texture2D(uPrev, vUv).xyz;
  vec3 n = (texture2D(uPrev, vUv + vec2(uTexel, 0.)).xyz + texture2D(uPrev, vUv - vec2(uTexel, 0.)).xyz
          + texture2D(uPrev, vUv + vec2(0., uTexel)).xyz + texture2D(uPrev, vUv - vec2(0., uTexel)).xyz) * .25;
  vec3 s = mix(c, n, .2) * uDecay;

  vec2 d = (vUv - uPtr) * vec2(uAsp, 1.);
  float br = exp(-dot(d, d) / (uRad * (1. + 2.5 * uPress)));
  vec2 sw = vec2(-d.y, d.x) * 3.;
  float sp = length(uVel);
  s.xy += (uVel + sw * sp * .25 + sw * uPress * .6) * br * uGain * uAmp;
  s.z  += br * (sp * .8 + uPress * .4) * uGain * uAmp;

  vec2 td = (vUv - uTap.xy) * vec2(uAsp, 1.);
  float age = uTime - uTap.z;
  float ring = exp(-pow((length(td) - age * .7) * 12., 2.)) * exp(-age * 2.2);
  s.xy += normalize(td + 1e-4) * ring * uGain * .08 * uAmp; s.z += ring * uGain * .05 * uAmp;

  s.xy = clamp(s.xy, -2., 2.);
  gl_FragColor = vec4(s, 1.);
}`;

const TAB_COLORS = {
  profile: new THREE.Color(0x1b3bff),
  work: new THREE.Color(0xdc2626),
  skills: new THREE.Color(0x7c3aed),
  services: new THREE.Color(0x52525b),
  marka: new THREE.Color(0x10b981),
};

const DISP = `
precision highp float;
uniform sampler2D uStir; uniform vec2 uPtr, uDir; uniform vec3 uColor;
uniform float uTime, uAsp, uPress, uAmp, uWarp, uScale, uGrain, uGrainPx;
varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h(i), h(i + vec2(1,0)), f.x), mix(h(i + vec2(0,1)), h(i + 1.), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a * vn(p); p = p * 2.03 + 17.1; a *= .5; } return s; }

void main(){
  vec2 uv = vUv; vec3 st = texture2D(uStir, uv).xyz;
  vec2 p = vec2(uv.x * uAsp, uv.y) * uScale + st.xy * uWarp * uAmp;
  float t = uTime * .06;

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3. * q + vec2(1.7, 9.2) + t * 1.3), fbm(p + 3. * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 3. * r);

  float v = dot(uv - .5, normalize(uDir)) * 1.1 + .5 + (f - .5) * 1.1;
  v += (st.z * .35 + length(st.xy) * .2) * uAmp;
  vec2 d = (uv - uPtr) * vec2(uAsp, 1.); v += uPress * exp(-dot(d, d) / .03) * .25;

  float n = h(floor(gl_FragCoord.xy / uGrainPx) + floor(uTime * 24.) * vec2(17., 31.));
  v = clamp(v + (n - .5) * uGrain * .35, 0., 1.);

  vec3 K = vec3(0.);
  vec3 c = mix(K, uColor * .42, smoothstep(0., .45, v));
  c = mix(c, uColor * .86, smoothstep(.45, .85, v));
  c = mix(c, uColor, smoothstep(.85, 1., v));
  c += (n - .5) * uGrain * (1. - abs(v - .5) * 1.5);
  gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
}`;

export function createGrainient(renderer) {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geo = new THREE.PlaneGeometry(2, 2);
  const canSim = Boolean(renderer?.capabilities?.isWebGL2);
  const mk = () =>
    new THREE.WebGLRenderTarget(256, 256, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    });
  let A = canSim ? mk() : null;
  let B = canSim ? mk() : null;
  const fallbackTex = new THREE.DataTexture(
    new Uint8Array([0, 0, 0, 255]),
    1,
    1,
  );
  fallbackTex.needsUpdate = true;

  const simMat = new THREE.ShaderMaterial({
    uniforms: {
      uPrev: { value: A ? A.texture : fallbackTex },
      uPtr: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2() },
      uTap: { value: new THREE.Vector3(0.5, 0.5, -99) },
      uAsp: { value: 1 },
      uRad: { value: P.radius },
      uGain: { value: 1 },
      uDecay: { value: 1 },
      uTime: { value: 0 },
      uPress: { value: 0 },
      uAmp: { value: 1 },
      uTexel: { value: 1 / 256 },
    },
    vertexShader: VERT,
    fragmentShader: SIM,
  });

  const dispMat = new THREE.ShaderMaterial({
    uniforms: {
      uStir: { value: A ? A.texture : fallbackTex },
      uPtr: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uAsp: { value: 1 },
      uPress: { value: 0 },
      uAmp: { value: 1 },
      uWarp: { value: P.warp },
      uScale: { value: P.scale },
      uGrain: { value: P.grain },
      uGrainPx: { value: 1 },
      uDir: { value: new THREE.Vector2(...P.dir) },
      uColor: { value: TAB_COLORS.profile.clone() },
    },
    vertexShader: VERT,
    fragmentShader: DISP,
  });

  const simScene = new THREE.Scene();
  simScene.add(new THREE.Mesh(geo, simMat));
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geo, dispMat));

  return {
    scene,
    camera,
    resize(width, height, dpr) {
      const a = width / Math.max(height, 1);
      simMat.uniforms.uAsp.value = a;
      dispMat.uniforms.uAsp.value = a;
      dispMat.uniforms.uGrainPx.value = Math.max(1, P.grainPx * dpr);
    },
    tap(state) {
      simMat.uniforms.uTap.value.set(state.p.x, state.p.y, state.time);
    },
    reset() {
      simMat.uniforms.uTap.value.set(0.5, 0.5, -99);
    },
    update(state, dt = 0.016) {
      const s = simMat.uniforms;
      const d = dispMat.uniforms;
      s.uTime.value = d.uTime.value = state.time;
      s.uPtr.value.copy(state.p);
      d.uPtr.value.copy(state.p);
      s.uVel.value.copy(state.velocity);
      s.uPress.value = d.uPress.value = state.press;
      s.uAmp.value = d.uAmp.value = state.amp;
      const targetColor = TAB_COLORS[state.tab] || TAB_COLORS.profile;
      const lerpAlpha = dt > 0 ? 1 - Math.exp(-dt * 6) : 1;
      d.uColor.value.lerp(targetColor, lerpAlpha);
      s.uGain.value = P.gain * Math.min(Math.max(dt, 0.001) * 60, 2);
      s.uDecay.value = Math.pow(P.decay, Math.max(dt, 0.001));

      if (canSim && A && B && renderer) {
        s.uPrev.value = A.texture;
        renderer.setRenderTarget(B);
        renderer.render(simScene, camera);
        renderer.setRenderTarget(null);
        [A, B] = [B, A];
        d.uStir.value = A.texture;
      }
    },
    dispose() {
      A?.dispose();
      B?.dispose();
      fallbackTex.dispose();
      disposeScene(simScene);
      disposeScene(scene);
    },
  };
}
