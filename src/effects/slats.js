import * as THREE from "three";
import { instancedPlane, planePointer, disposeScene } from "./shared.js";

export function createSlats(mobile) {
  const cols = mobile ? 40 : 72,
    rows = mobile ? 20 : 30;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 500);
  const group = new THREE.Group();
  scene.add(group);
  const ripples = Array.from(
    { length: mobile ? 4 : 8 },
    () => new THREE.Vector4(0, 0, -99, 0),
  );
  let rippleIndex = 0;
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uPress: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uVelocity: { value: new THREE.Vector2() },
      uRipples: { value: ripples },
      uGrid: { value: new THREE.Vector2(cols, rows * 1.7) },
    },
    vertexShader: `
      attribute vec2 aPos;
      uniform float uTime,uAmp,uPress;
      uniform vec2 uPointer,uVelocity,uGrid;
      uniform vec4 uRipples[${ripples.length}];
      varying vec2 vUv;varying float vLit,vGlint,vFade;
      float wave(vec2 p){
        return sin(p.x*.35+uTime*.9)*cos(p.y*.28-uTime*.7)*.6+sin(p.x*.8-p.y*.5+uTime*1.3)*.25;
      }
      void main(){
        vUv=uv;
        vec2 center=aPos*vec2(1.,1.7);
        float h=wave(center),tilt=h*.9;
        vec2 delta=center-uPointer;
        float push=exp(-dot(delta,delta)/(6.+14.*uPress))*(1.1+1.5*uPress)*uAmp;
        tilt+=push*(1.+length(uVelocity))+push*uVelocity.y*.5;
        for(int i=0;i<${ripples.length};i++){
          vec4 ripple=uRipples[i];float age=uTime-ripple.z;
          float d=length(center-ripple.xy)-age*18.;
          tilt+=ripple.w*exp(-age*1.1)*sin(d*.9)*exp(-d*d*.0144)*uAmp;
        }
        vec2 local=position.xy*vec2(.5,1.4);
        vec3 world=vec3(center.x+local.x,center.y+local.y*cos(tilt),local.y*sin(tilt)+h*.4);
        vec3 normal=vec3(0.,-sin(tilt),cos(tilt));
        float diffuse=max(dot(normal,normalize(vec3(0.,.55,.83))),0.);
        vLit=diffuse;vGlint=pow(diffuse,24.)*smoothstep(.1,.8,h);
        vFade=1.-smoothstep(.6,1.,length(center/(uGrid*.5)));
        gl_Position=projectionMatrix*modelViewMatrix*vec4(world,1.);
      }`,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;varying float vLit,vGlint,vFade;
      void main(){
        vec2 q=abs(vUv-.5)*vec2(.5,1.4)-vec2(.25,.7)+.2;
        float distance=length(max(q,0.))+min(max(q.x,q.y),0.)-.2;
        if(distance>0.) discard;
        float lit=.15+.85*vLit;
        vec3 color=mix(vec3(.95),vec3(0.),lit*.75);
        color=mix(color,vec3(.106,.231,1.),vGlint);
        gl_FragColor=vec4(color,vFade*.42);
      }`,
  });
  const mesh = new THREE.Mesh(instancedPlane(cols, rows), material);
  mesh.frustumCulled = false;
  group.add(mesh);
  const hitLocal = planePointer(group, camera);
  return {
    scene,
    camera,
    resize(width, height) {
      camera.aspect = width / height;
      camera.position.z =
        (cols * 0.47) /
        (Math.tan(THREE.MathUtils.degToRad(15)) * camera.aspect);
      camera.updateProjectionMatrix();
    },
    tap(state) {
      const hit = hitLocal(state.p);
      if (hit)
        ripples[rippleIndex++ % ripples.length].set(
          hit.x,
          hit.y,
          state.time,
          1,
        );
    },
    reset() {
      ripples.forEach((ripple) => (ripple.w = 0));
    },
    update(state) {
      group.rotation.x = -(state.p.y - 0.5) * 0.066 * state.amp;
      group.rotation.y = (state.p.x - 0.5) * 0.12 * state.amp;
      const hit = hitLocal(state.p);
      const u = material.uniforms;
      u.uTime.value = state.time;
      u.uAmp.value = state.amp;
      u.uPress.value = state.press;
      u.uVelocity.value.copy(state.velocity).clampLength(0, 3);
      u.uPointer.value.set(hit?.x ?? 999, hit?.y ?? 999);
    },
    dispose() {
      disposeScene(scene);
    },
  };
}
