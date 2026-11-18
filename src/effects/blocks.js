import * as THREE from "three";
import { morphs } from "../poses.js";

export function createBlocks() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(14, 12, 14);
  camera.lookAt(0, 1, 0);
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxGeometry(0.8, 1, 0.8);
  geometry.translate(0, 0.5, 0);
  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const bars = [];
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++) {
      const material = new THREE.MeshBasicMaterial({
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const edges = new THREE.LineBasicMaterial();
      const bar = new THREE.Mesh(geometry, material);
      bar.add(new THREE.LineSegments(edgeGeometry, edges));
      bar.position.set(i - 4, 0, j - 4);
      group.add(bar);
      bars.push({ bar, i, j, material, edges });
    }
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const point = new THREE.Vector3();
  const pointer = new THREE.Vector2();
  const ripple = new THREE.Vector3();
  const accent = new THREE.Color(0x1b3bff);
  let rippleTime = -99;
  function hit(state) {
    camera.updateMatrixWorld();
    group.updateMatrixWorld();
    pointer.copy(state.p).multiplyScalar(2).subScalar(1);
    ray.setFromCamera(pointer, camera);
    return ray.ray.intersectPlane(plane, point)
      ? group.worldToLocal(point)
      : null;
  }
  return {
    scene,
    camera,
    resize(width, height) {
      camera.aspect = width / height;
      // Keep the field centered and near viewport width in both orientations.
      camera.zoom = Math.min(2.7, Math.max(0.85, camera.aspect * 1.75));
      camera.updateProjectionMatrix();
    },
    tap(state) {
      const h = hit(state);
      if (h) {
        ripple.copy(h);
        rippleTime = state.time;
      }
    },
    reset() {
      rippleTime = -99;
    },
    update(state) {
      const dark = state.tab === "marka";
      camera.zoom = dark ? 0.8 : camera.zoom;
      camera.updateProjectionMatrix();
      group.rotation.y =
        state.time * 0.055 + (state.p.x - 0.5) * 0.4 * state.amp;
      group.rotation.x = -(state.p.y - 0.5) * 0.08 * state.amp;
      const hovering = hit(state);
      for (const { bar, i, j, material, edges } of bars) {
        const proximity = hovering
          ? Math.max(
              0,
              1 -
                Math.hypot(
                  bar.position.x - hovering.x,
                  bar.position.z - hovering.z,
                ) /
                  2.2,
            ) * state.amp
          : 0;
        const age = state.time - rippleTime;
        const distance = Math.hypot(
          bar.position.x - ripple.x,
          bar.position.z - ripple.z,
        );
        const wave =
          age < 3
            ? Math.max(0, 1 - Math.abs(distance - age * 6) / 1.2) *
              Math.exp(-age) *
              2
            : 0;
        bar.scale.y =
          morphs[dark ? 4 : 0](i, j, state.time * 0.4) + proximity * 2.4 + wave;
        bar.visible = bar.scale.y >= 0.15;
        material.color
          .set(dark ? 0x000000 : 0xffffff)
          .lerp(accent, Math.min(1, proximity * 1.4));
        edges.color
          .set(dark ? 0xffffff : 0x000000)
          .lerp(accent, Math.min(1, proximity * 1.4));
      }
    },
    dispose() {
      geometry.dispose();
      edgeGeometry.dispose();
      bars.forEach(({ material, edges }) => {
        material.dispose();
        edges.dispose();
      });
    },
  };
}
