import * as THREE from "three";
import { createBlocks } from "./effects/blocks.js";
import { createAscii } from "./effects/ascii.js";
import { createGrid } from "./effects/grid.js";

const styleForTab = {
  profile: "blocks",
  work: "blocks",
  skills: "ascii",
  services: "grid",
  marka: "blocks",
};

export function createScene(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
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
  let effects = makeEffects(),
    current = effects.blocks;
  let frame = 0,
    last = 0,
    idle = 0,
    down = false,
    lost = false,
    disposed = false;
  function makeEffects() {
    return {
      blocks: createBlocks(),
      ascii: createAscii(),
      grid: createGrid(mobile),
    };
  }
  function draw(dt = 0) {
    current.update(state, dt);
    renderer.render(current.scene, current.camera);
  }
  function loop(now) {
    if (disposed || lost || state.tab === "work") return;
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
    if (state.tab !== "work") frame = requestAnimationFrame(loop);
  }
  function resize() {
    width = innerWidth;
    height = innerHeight;
    if (mobile !== width < 768) {
      mobile = width < 768;
      Object.values(effects).forEach((effect) => effect.dispose());
      effects = makeEffects();
      current = effects[styleForTab[state.tab]];
    }
    const dpr = Math.min(devicePixelRatio, mobile ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    Object.values(effects).forEach((effect) =>
      effect.resize(width, height, dpr),
    );
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
  function resetMotion() {
    down = false;
    state.press = 0;
    state.velocity.set(0, 0);
    Object.values(effects).forEach((effect) => effect.reset());
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
      state.tab = styleForTab[name] ? name : "profile";
      current = effects[styleForTab[state.tab]];
      canvas.dataset.effect = styleForTab[state.tab];
      resetMotion();
      current.resize(width, height, renderer.getPixelRatio());
      resume();
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
      Object.values(effects).forEach((effect) => effect.dispose());
      renderer.dispose();
    },
  };
}
