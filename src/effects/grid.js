import * as THREE from "three";
import { instancedPlane, planePointer, disposeScene } from "./shared.js";

export function createGrid(mobile) {
  const cols = mobile ? 14 : 28,
    rows = mobile ? 22 : 20;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 150);
  camera.position.z = 18;
  const group = new THREE.Group();
  scene.add(group);
  const geometry = instancedPlane(cols, rows);
  const energy = new Float32Array(cols * rows);
  const attribute = new THREE.InstancedBufferAttribute(energy, 1).setUsage(
    THREE.DynamicDrawUsage,
  );
  geometry.setAttribute("aE", attribute);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uScroll: { value: 0 }, uRows: { value: rows } },
    vertexShader: `
      attribute vec2 aPos; attribute float aE;
      uniform float uScroll,uRows;
      varying vec2 vUv; varying float vE,vFade;
      void main(){
        vUv=uv;vE=aE;
        float y=mod(aPos.y+uScroll+uRows*.5,uRows)-uRows*.5;
        float angle=clamp(aE,0.,1.)*1.5708;
        mat2 rotation=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
        vec2 q=rotation*(position.xy*.96);
        vFade=1.-smoothstep(.25,.5,abs(y)/uRows);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(aPos.x+q.x,y+q.y,aE*.7,1.);
      }`,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;varying float vE,vFade;
      void main(){
        vec2 b=min(vUv,1.-vUv);
        float edge=1.-smoothstep(0.,.045,min(b.x,b.y));
        float e=clamp(vE,0.,1.);
        vec3 ink=vec3(0.);
        vec3 core=mix(vec3(.106,.231,1.),ink,smoothstep(.6,1.,e));
        vec3 color=mix(ink,core,smoothstep(.02,.5,e));
        gl_FragColor=vec4(color,(.07*edge+e*(.14+.8*edge))*vFade);
      }`,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  group.add(mesh);
  const hitLocal = planePointer(group, camera);
  const rings = [];
  let scroll = 0;
  function cellY(y) {
    return THREE.MathUtils.euclideanModulo(y - scroll + rows / 2, rows) - 0.5;
  }
  return {
    scene,
    camera,
    resize(width, height) {
      camera.aspect = width / height;
      camera.position.z = Math.max(
        18,
        (cols * 0.45) /
          (Math.tan(THREE.MathUtils.degToRad(17.5)) * camera.aspect),
      );
      camera.updateProjectionMatrix();
    },
    tap(state) {
      const hit = hitLocal(state.p);
      if (hit) {
        if (rings.length >= 8) rings.shift();
        rings.push({
          x: hit.x + (cols - 1) / 2,
          y: cellY(hit.y),
          time: state.time,
        });
      }
    },
    reset() {
      rings.length = 0;
      energy.fill(0);
    },
    update(state, dt) {
      scroll = state.time * 0.35;
      material.uniforms.uScroll.value = scroll;
      group.rotation.x = -0.95 + (state.p.y - 0.5) * 0.18 * state.amp;
      group.rotation.y = (state.p.x - 0.5) * 0.28 * state.amp;
      const hit = hitLocal(state.p);
      const cx = hit ? hit.x + (cols - 1) / 2 : -999;
      const cy = hit ? cellY(hit.y) : -999;
      const radius =
        1.6 + Math.min(state.velocity.length(), 1) * 3 + state.press * 2.5;
      for (let i = rings.length - 1; i >= 0; i--)
        if (state.time - rings[i].time > 3) rings.splice(i, 1);
      const decay = Math.pow(0.12, dt);
      for (let i = 0; i < energy.length; i++) {
        const x = i % cols,
          y = Math.floor(i / cols);
        let dy = Math.abs(y - cy);
        dy = Math.min(dy, rows - dy);
        const influence = Math.max(0, 1 - Math.hypot(x - cx, dy) / radius);
        energy[i] = Math.max(
          energy[i] * decay,
          influence * influence * (3 - 2 * influence) * state.amp,
        );
        for (const ring of rings) {
          const age = state.time - ring.time;
          let ringY = Math.abs(y - ring.y);
          ringY = Math.min(ringY, rows - ringY);
          const wave =
            Math.max(
              0,
              1 - Math.abs(Math.hypot(x - ring.x, ringY) - age * 14) / 1.5,
            ) * Math.exp(-age * 1.2);
          energy[i] = Math.max(energy[i], wave);
        }
      }
      attribute.needsUpdate = true;
    },
    dispose() {
      disposeScene(scene);
    },
  };
}
