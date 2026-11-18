import "./styles.css";
import { tabs } from "./poses.js";
import { createScene } from "./scene.js";
import { reveal, swap, magneticButtons, reducedMotion } from "./motion.js";

const root = document.getElementById("alif-stage");
const primary = [...root.querySelectorAll("nav [data-view]")];
const panels = [...root.querySelectorAll("[data-screen]")];
const scene = createScene(document.getElementById("media-scene"));
let current = "profile";
let transition = 0;
const underline = document.createElement("span");
underline.className = "tab-indicator";
root.querySelector("nav").append(underline);

function positionIndicator() {
  const selected = primary.find((button) => button.dataset.view === current);
  underline.style.width = selected.offsetWidth + "px";
  underline.style.transform = "translateX(" + selected.offsetLeft + "px)";
}
function navigate(name, updateHash = true) {
  if (!tabs.includes(name)) name = "profile";
  const previous = current;
  current = name;
  const direction = tabs.indexOf(name) >= tabs.indexOf(previous) ? 1 : -1;
  const generation = ++transition;
  const next = panels.find((panel) => panel.dataset.screen === name);
  const outgoing = panels.find((panel) => panel.dataset.screen === previous);
  document.body.dataset.panel = name;
  document.body.dataset.tone = name === "marka" ? "dark" : "light";
  primary.forEach((button) => {
    const active = button.dataset.view === name;
    button.setAttribute("aria-selected", active);
    button.tabIndex = active ? 0 : -1;
  });
  if (updateHash) history.replaceState(null, "", "#" + name);
  scene.setTab(name);
  positionIndicator();
  primary
    .find((button) => button.dataset.view === name)
    .scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
  const show = () => {
    if (generation !== transition) return;
    panels.forEach((panel) => {
      panel.hidden = panel !== next;
    });
    reveal(next, direction);
    swap(next);
  };
  if (outgoing !== next && !reducedMotion.matches) {
    outgoing
      .animate(
        [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: "translateX(" + -direction * 40 + "px)" },
        ],
        { duration: 280 },
      )
      .finished.then(show);
  } else show();
}
root.querySelector("nav").setAttribute("role", "tablist");
primary.forEach((button) => {
  const name = button.dataset.view;
  button.id = "tab-" + name;
  button.setAttribute("role", "tab");
  button.setAttribute("aria-controls", "panel-" + name);
  button.removeAttribute("aria-pressed");
  const panel = panels.find((item) => item.dataset.screen === name);
  panel.id = "panel-" + name;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", button.id);
  button.addEventListener("click", () => navigate(name));
  button.addEventListener("keydown", (event) => {
    let index = tabs.indexOf(current);
    if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      index = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = tabs.length - 1;
    else return;
    event.preventDefault();
    navigate(tabs[index]);
    primary[index].focus();
  });
});
root
  .querySelector(".home-key")
  .addEventListener("click", () => navigate("profile"));
for (const [control, panel] of [
  ["intro", "intro-panel"],
  ["role", "detail"],
  ["project", "case"],
  ["skill", "skill-panel"],
  ["service", "service-panel"],
]) {
  const buttons = [...root.querySelectorAll("[data-" + control + "]")];
  const children = [...root.querySelectorAll("[data-" + panel + "]")];
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-" + control);
      buttons.forEach((item) =>
        item.setAttribute("aria-pressed", item === button),
      );
      children.forEach((child) => {
        child.hidden = child.getAttribute("data-" + panel) !== value;
        if (!child.hidden) swap(child);
      });
    }),
  );
}
let touch;
root.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch" && !event.target.closest("button,a,nav"))
    touch = { x: event.clientX, y: event.clientY };
});
root.addEventListener("pointerup", (event) => {
  if (!touch) return;
  const dx = event.clientX - touch.x,
    dy = event.clientY - touch.y;
  touch = null;
  if (Math.abs(dx) >= 70 && Math.abs(dx) > Math.abs(dy) * 1.5)
    navigate(
      tabs[
        (tabs.indexOf(current) + (dx < 0 ? 1 : -1) + tabs.length) % tabs.length
      ],
    );
});
root.addEventListener("pointercancel", () => {
  touch = null;
});
const fromHash = () => navigate(location.hash.slice(1), false);
window.addEventListener("hashchange", fromHash);
window.addEventListener("popstate", fromHash);
window.addEventListener("resize", positionIndicator);
document.fonts.ready.then(positionIndicator);
magneticButtons();
navigate(location.hash.slice(1) || "profile");
if (import.meta.hot) import.meta.hot.dispose(() => scene.dispose());
