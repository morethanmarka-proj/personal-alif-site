import * as THREE from "three";
import { createGrainient } from "./effects/grainient.js";

const VALID_TABS = new Set(["profile", "work", "skills", "services", "marka"]);

export function createScene(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
  } catch {
    document.body.dataset.sceneFallback = "true";
    canvas.hidden = true;
    return { setTab() {}, dispose() {} };
  }
  const state = {
    p: new THREE.Vector2(0.5, 0.5),
    velocity: new THREE.Vector2(),
    time: 0,
    press: 0,
    amp: 1,
    tab: "profile",
  };
  const target = state.p.clone(),
    previous = state.p.clone(),
    velocity = new THREE.Vector2();
  let width = innerWidth,
    height = innerHeight,
    mobile = width < 768;
  const current = createGrainient(renderer);
  canvas.dataset.effect = "grainient";
  let frame = 0,
    last = 0,
    idle = 0,
    down = false,
    lost = false,
    disposed = false;
  function getDpr() {
    return Math.min(devicePixelRatio, mobile ? 0.75 : 1.25);
  }
  function draw(dt = 0) {
    current.update(state, dt);
    renderer.render(current.scene, current.camera);
  }
  function loop(now) {
    if (disposed || lost) return;
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    state.time += dt;
    idle += dt;
    if (idle > 2.5 && !down)
      target.set(
        0.5 + 0.28 * Math.sin(state.time * 0.35),
        0.5 + 0.2 * Math.sin(state.time * 0.595),
      );
    previous.copy(state.p);
    state.p.lerp(target, 1 - Math.exp(-dt * 12));
    velocity.copy(state.p).sub(previous).divideScalar(Math.max(dt, 0.001));
    state.velocity.lerp(velocity, 1 - Math.exp(-dt * 10));
    state.press +=
      ((down ? 1 : 0) - state.press) * (1 - Math.exp(-dt * (down ? 14 : 4)));
    draw(dt);
    frame = requestAnimationFrame(loop);
  }
  function resume() {
    cancelAnimationFrame(frame);
    last = 0;
    if (disposed || lost) return;
    draw();
    frame = requestAnimationFrame(loop);
  }
  function resize() {
    width = innerWidth;
    height = innerHeight;
    mobile = width < 768;
    const dpr = getDpr();
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    current.resize(width, height, dpr);
    resume();
  }
  function track(event) {
    target.set(event.clientX / width, 1 - event.clientY / height);
    idle = 0;
  }
  function press(event) {
    if (event.target.closest("button,a,input,select,textarea")) return;
    track(event);
    state.p.copy(target);
    down = true;
    current.tap(state);
  }
  function release() {
    down = false;
  }
  function contextLost(event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    canvas.hidden = true;
    document.body.dataset.sceneFallback = "true";
  }
  function contextRestored() {
    lost = false;
    canvas.hidden = false;
    delete document.body.dataset.sceneFallback;
    resize();
  }
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", track, { passive: true });
  window.addEventListener("pointerdown", press, { passive: true });
  window.addEventListener("pointerup", release, { passive: true });
  window.addEventListener("pointercancel", release, { passive: true });
  window.addEventListener("blur", release, { passive: true });
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  resize();
  return {
    setTab(name) {
      state.tab = VALID_TABS.has(name) ? name : "profile";
      canvas.dataset.effect = "grainient";
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", track);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      current.dispose();
      renderer.dispose();
    },
  };
}
