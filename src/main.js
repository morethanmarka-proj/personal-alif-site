import "./styles.css";
import { tabs } from "./poses.js";
import { createScene } from "./scene.js";
import { setupWork } from "./work.js";
import { reveal, swap, magneticButtons } from "./motion.js";

const root = document.getElementById("alif-stage");
const homeKey = root.querySelector(".home-key");
const primary = [...root.querySelectorAll("nav [data-view]")];
const panels = [...root.querySelectorAll("[data-screen]")];
const scene = createScene(document.getElementById("media-scene"));
const campaign = setupWork();
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
  homeKey.setAttribute("aria-current", name === "profile" ? "page" : "false");
  primary.forEach((button) => {
    const active = button.dataset.view === name;
    button.setAttribute("aria-selected", active);
    button.tabIndex = active ? 0 : -1;
  });
  if (updateHash) history.replaceState(null, "", "#" + name);
  scene.setTab(name);
  campaign.setActive(name === "work");
  positionIndicator();
  primary
    .find((button) => button.dataset.view === name)
    .scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  const show = () => {
    if (generation !== transition) return;
    panels.forEach((panel) => {
      panel.hidden = panel !== next;
    });
    reveal(next, direction);
    swap(next);
  };
  if (outgoing !== next) {
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
homeKey.addEventListener("click", () => navigate("profile"));
for (const [control, panel] of [
  ["intro", "intro-panel"],
  ["skill", "skill-panel"],
  ["service", "service-panel"],
]) {
  const buttons = [...root.querySelectorAll("[data-" + control + "]")];
  const children = [...root.querySelectorAll("[data-" + panel + "]")];
  const list = buttons[0]?.closest(".subnav");
  if (list) list.setAttribute("role", "tablist");
  const selectSubTab = (targetButton) => {
    const value = targetButton.getAttribute("data-" + control);
    buttons.forEach((item) => {
      const active = item === targetButton;
      item.setAttribute("aria-selected", active);
      item.tabIndex = active ? 0 : -1;
    });
    children.forEach((child) => {
      child.hidden = child.getAttribute("data-" + panel) !== value;
      if (!child.hidden) swap(child);
    });
  };
  buttons.forEach((button, idx) => {
    const value = button.getAttribute("data-" + control);
    const active = button.getAttribute("aria-pressed") === "true" || idx === 0;
    const tabId = "subtab-" + control + "-" + value;
    const panelId = "subpanel-" + panel + "-" + value;
    button.id = tabId;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", panelId);
    button.setAttribute("aria-selected", active);
    button.removeAttribute("aria-pressed");
    button.tabIndex = active ? 0 : -1;
    const matchingPanel = children.find(
      (child) => child.getAttribute("data-" + panel) === value,
    );
    if (matchingPanel) {
      matchingPanel.id = panelId;
      matchingPanel.setAttribute("role", "tabpanel");
      matchingPanel.setAttribute("aria-labelledby", tabId);
    }
    button.addEventListener("click", () => selectSubTab(button));
    button.addEventListener("keydown", (event) => {
      let nextIdx = buttons.indexOf(button);
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        nextIdx = (nextIdx + 1) % buttons.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        nextIdx = (nextIdx - 1 + buttons.length) % buttons.length;
      else if (event.key === "Home") nextIdx = 0;
      else if (event.key === "End") nextIdx = buttons.length - 1;
      else return;
      event.preventDefault();
      selectSubTab(buttons[nextIdx]);
      buttons[nextIdx].focus();
    });
  });
}
const fromHash = () => navigate(location.hash.slice(1), false);
window.addEventListener("hashchange", fromHash);
window.addEventListener("popstate", fromHash);
window.addEventListener("resize", positionIndicator, { passive: true });
document.fonts.ready.then(positionIndicator);
magneticButtons();
navigate(location.hash.slice(1) || "profile");
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    scene.dispose();
    campaign.dispose();
  });
