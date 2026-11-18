import * as THREE from "three";
import { poses, morphs, tabs } from "./poses.js";

export function createScene(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
  } catch {
    canvas.hidden = true;
    return { setTab() {}, dispose() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(14, 12, 14);
  camera.lookAt(0, 0, 0);
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxGeometry(0.8, 1, 0.8);
  geometry.translate(0, 0.5, 0);
  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const bars = [];
  for (let i = 0; i < 9; i++) {
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
      bar.scale.y = morphs[0](i, j, 0);
      group.add(bar);
      bars.push({ bar, i, j, material, edges });
    }
  }
  const css = getComputedStyle(document.documentElement);
  const white = new THREE.Color(css.getPropertyValue("--white").trim());
  const black = new THREE.Color(css.getPropertyValue("--black").trim());
  const lightBlue = new THREE.Color(css.getPropertyValue("--blue").trim());
  const darkBlue = new THREE.Color(
    css.getPropertyValue("--blue-on-black").trim(),
  );
  const face = new THREE.Color();
  const edge = new THREE.Color();
  const accent = new THREE.Color();
  const pointer = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const ripple = new THREE.Vector3();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const pose = [...poses.desktop[0]];
  let index = 0,
    tone = 0,
    width = 1,
    height = 1,
    frame = 0,
    time = 0,
    last = 0;
  let pointerActive = false,
    rippleTime = -10,
    lost = false;

  function resize() {
    width = innerWidth;
    height = innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reduced.matches) render(performance.now());
  }
  function track(event) {
    pointer.set(
      (event.clientX / width) * 2 - 1,
      -(event.clientY / height) * 2 + 1,
    );
    pointerActive = true;
  }
  function locatePointer() {
    ray.setFromCamera(pointer, camera);
    if (!ray.ray.intersectPlane(plane, hit)) return false;
    group.worldToLocal(hit);
    return true;
  }
  function press(event) {
    track(event);
    if (locatePointer()) {
      ripple.copy(hit);
      rippleTime = time;
    }
  }
  function leave() {
    pointerActive = false;
  }
  function render(now) {
    if (lost) return;
    const delta = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    if (!reduced.matches) time += delta;
    const ease = reduced.matches ? 1 : 1 - Math.exp(-5 * delta);
    const target = (width < 768 || height < 480 ? poses.mobile : poses.desktop)[
      index
    ];
    for (let k = 0; k < 4; k++) pose[k] += (target[k] - pose[k]) * ease;
    tone += ((index === 4 ? 1 : 0) - tone) * ease;
    camera.zoom = pose[2];
    camera.setViewOffset(
      width,
      height,
      -pose[0] * width,
      -pose[1] * height,
      width,
      height,
    );
    camera.updateProjectionMatrix();
    canvas.style.opacity = pose[3];
    group.rotation.y +=
      ((reduced.matches ? 0 : time * 0.055 + pointer.x * 0.2) -
        group.rotation.y) *
      ease;
    group.rotation.x +=
      ((reduced.matches ? 0 : -pointer.y * 0.04) - group.rotation.x) * ease;
    group.updateMatrixWorld();
    const hovering = pointerActive && !reduced.matches && locatePointer();
    face.copy(white).lerp(black, tone);
    edge.copy(black).lerp(white, tone);
    accent.copy(lightBlue).lerp(darkBlue, tone);
    for (const item of bars) {
      const { bar, i, j, material, edges } = item;
      const proximity = hovering
        ? Math.max(
            0,
            1 -
              Math.hypot(bar.position.x - hit.x, bar.position.z - hit.z) / 2.2,
          )
        : 0;
      const age = time - rippleTime;
      const distance = Math.hypot(
        bar.position.x - ripple.x,
        bar.position.z - ripple.z,
      );
      const wave =
        !reduced.matches && age < 3
          ? Math.max(0, 1 - Math.abs(distance - age * 6) / 1.2) *
            Math.exp(-age) *
            2
          : 0;
      const targetHeight =
        morphs[index](i, j, reduced.matches ? 0 : time * 0.4) +
        proximity * 2.4 +
        wave;
      bar.scale.y += (targetHeight - bar.scale.y) * ease;
      material.color.copy(face).lerp(accent, Math.min(1, proximity * 1.4));
      edges.color.copy(edge).lerp(accent, Math.min(1, proximity * 1.4));
    }
    renderer.render(scene, camera);
  }
  function loop(now) {
    render(now);
    frame = requestAnimationFrame(loop);
  }
  function resume() {
    cancelAnimationFrame(frame);
    last = 0;
    if (document.hidden || lost) return;
    if (reduced.matches) render(performance.now());
    else frame = requestAnimationFrame(loop);
  }
  function contextLost(event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    canvas.hidden = true;
  }
  function contextRestored() {
    lost = false;
    canvas.hidden = false;
    resume();
  }
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", track);
  window.addEventListener("pointerdown", press);
  document.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", resume);
  reduced.addEventListener("change", resume);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  resize();
  resume();
  return {
    setTab(name) {
      index = Math.max(0, tabs.indexOf(name));
      if (reduced.matches) render(performance.now());
    },
    dispose() {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", track);
      window.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", resume);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      geometry.dispose();
      edgeGeometry.dispose();
      bars.forEach(({ material, edges }) => {
        material.dispose();
        edges.dispose();
      });
      renderer.dispose();
    },
  };
}
