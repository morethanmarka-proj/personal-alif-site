import "./styles.css";
import { createScene } from "./scene.js";
import { setupPanels } from "./panels.js";
import { reveal } from "./motion.js";
const names = ["profile", "work", "skills", "services", "marka"];
const scene = createScene(document.getElementById("media-scene"));
const buttons = [...document.querySelectorAll("nav [data-view]")];
const panels = [...document.querySelectorAll("[data-screen]")];
document.querySelector("nav").setAttribute("role", "tablist");
function navigate(name, update = true) {
  if (!names.includes(name)) name = "profile";
  document.body.dataset.panel = name;
  buttons.forEach((button) => {
    const active = button.dataset.view === name;
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.screen !== name;
    if (!panel.hidden) reveal(panel);
  });
  scene.setTab(name);
  if (update) history.replaceState(null, "", "#" + name);
  buttons
    .find((button) => button.dataset.view === name)
    .scrollIntoView({ block: "nearest", inline: "nearest" });
}
buttons.forEach((button, index) => {
  const name = button.dataset.view;
  button.id = "tab-" + name;
  button.setAttribute("role", "tab");
  button.setAttribute("aria-controls", "panel-" + name);
  const panel = panels.find((panel) => panel.dataset.screen === name);
  panel.id = "panel-" + name;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", button.id);
  button.addEventListener("click", () => navigate(name));
  button.addEventListener("keydown", (event) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % names.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + names.length) % names.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = names.length - 1;
    else return;
    event.preventDefault();
    navigate(names[next]);
    buttons[next].focus();
  });
});
setupPanels();
document.querySelectorAll("[data-go]").forEach((button) =>
  button.addEventListener("click", () => {
    navigate(button.dataset.go);
    buttons.find((tab) => tab.dataset.view === button.dataset.go).focus();
  }),
);
window.addEventListener("hashchange", () =>
  navigate(location.hash.slice(1), false),
);
window.addEventListener("popstate", () =>
  navigate(location.hash.slice(1), false),
);
navigate(location.hash.slice(1) || "profile", false);
if (import.meta.hot) import.meta.hot.dispose(() => scene.dispose());
