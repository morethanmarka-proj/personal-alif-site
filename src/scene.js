import * as THREE from "three";
import { createBlocks } from "./effects/blocks.js";
import { createAscii } from "./effects/ascii.js";
import { createGrid } from "./effects/grid.js";
import { createSlats } from "./effects/slats.js";

const styleForTab = {
  profile: "blocks",
  work: "blocks",
  skills: "ascii",
  services: "grid",
  marka: "blocks",
};

export function createScene(canvas) {
  const button = document.getElementById("scene-toggle");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
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
    button.hidden = true;
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
    paused = reduced.matches,
    lost = false,
    disposed = false;
  function makeEffects() {
    return {
      blocks: createBlocks(),
      ascii: createAscii(),
      grid: createGrid(mobile),
      slats: createSlats(mobile),
    };
  }
  function label() {
    button.textContent = paused ? "Play effect" : "Pause effect";
    button.setAttribute("aria-pressed", String(paused));
  }
  function draw(dt = 0) {
    current.update(state, dt);
    renderer.render(current.scene, current.camera);
    if (state.tab === "profile") {
      effects.slats.update(state, dt);
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(effects.slats.scene, effects.slats.camera);
      renderer.autoClear = true;
    }
  }
  function loop(now) {
    if (disposed || paused || lost || document.hidden || state.tab === "work")
      return;
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
    if (disposed || lost || document.hidden) return;
    draw();
    if (!paused && state.tab !== "work") frame = requestAnimationFrame(loop);
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
    if (paused) return;
    target.set(event.clientX / width, 1 - event.clientY / height);
    idle = 0;
  }
  function press(event) {
    if (paused || event.target.closest("button,a,input,select,textarea"))
      return;
    track(event);
    state.p.copy(target);
    down = true;
    current.tap(state);
    if (state.tab === "profile") effects.slats.tap(state);
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
  function preference() {
    paused = reduced.matches;
    state.amp = reduced.matches ? 0.3 : 1;
    resetMotion();
    label();
    resume();
  }
  function toggle() {
    paused = !paused;
    resetMotion();
    label();
    resume();
  }
  function visibility() {
    release();
    resume();
  }
  function contextLost(event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    canvas.hidden = true;
    button.hidden = true;
    document.body.dataset.sceneFallback = "true";
  }
  function contextRestored() {
    lost = false;
    canvas.hidden = false;
    button.hidden = false;
    delete document.body.dataset.sceneFallback;
    resize();
  }
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", track, { passive: true });
  window.addEventListener("pointerdown", press, { passive: true });
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  window.addEventListener("blur", release);
  document.addEventListener("visibilitychange", visibility);
  reduced.addEventListener("change", preference);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  button.addEventListener("click", toggle);
  state.amp = reduced.matches ? 0.3 : 1;
  label();
  resize();
  return {
    setTab(name) {
      state.tab = styleForTab[name] ? name : "profile";
      current = effects[styleForTab[state.tab]];
      canvas.dataset.effect = styleForTab[state.tab];
      button.hidden = state.tab === "work" || lost;
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
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      button.removeEventListener("click", toggle);
      Object.values(effects).forEach((effect) => effect.dispose());
      renderer.dispose();
    },
  };
}
