import { work } from "./work-data.js";
import { swap } from "./motion.js";

export function setupWork() {
  const content = document.getElementById("work-content");
  const title = document.getElementById("work-client");
  const roles = [...document.querySelectorAll("[data-role]")];
  const sections = [...document.querySelectorAll("[data-work-section]")];
  let role = "saatchi",
    section = "client";
  content.setAttribute("role", "tabpanel");
  function render() {
    const entry = work[role];
    title.textContent = entry.name;
    const list = document.createElement("dl");
    list.className = "work-explanation";
    for (const [heading, description] of entry[section]) {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const detail = document.createElement("dd");
      term.textContent = heading;
      detail.textContent = description;
      row.append(term, detail);
      list.append(row);
    }
    content.replaceChildren(list);
    swap(content);
  }
  const roleList = roles[0]?.closest(".timeline");
  if (roleList) roleList.setAttribute("role", "tablist");
  const selectRole = (button) => {
    role = button.dataset.role;
    roles.forEach((item) => {
      const active = item === button;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    button.scrollIntoView({ block: "nearest", inline: "nearest" });
    render();
  };
  roles.forEach((button, idx) => {
    const active = button.getAttribute("aria-pressed") === "true" || idx === 0;
    button.id = "subtab-role-" + button.dataset.role;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "work-content");
    button.setAttribute("aria-selected", String(active));
    button.removeAttribute("aria-pressed");
    button.tabIndex = active ? 0 : -1;
    button.addEventListener("click", () => selectRole(button));
    button.addEventListener("keydown", (event) => {
      let nextIdx = roles.indexOf(button);
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        nextIdx = (nextIdx + 1) % roles.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        nextIdx = (nextIdx - 1 + roles.length) % roles.length;
      else if (event.key === "Home") nextIdx = 0;
      else if (event.key === "End") nextIdx = roles.length - 1;
      else return;
      event.preventDefault();
      selectRole(roles[nextIdx]);
      roles[nextIdx].focus();
    });
  });
  const sectionList = sections[0]?.closest(".subnav");
  if (sectionList) sectionList.setAttribute("role", "tablist");
  const selectSection = (button) => {
    section = button.dataset.workSection;
    sections.forEach((item) => {
      const active = item === button;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    content.setAttribute("aria-labelledby", button.id);
    render();
  };
  sections.forEach((button, idx) => {
    const active = button.getAttribute("aria-pressed") === "true" || idx === 0;
    button.id = "subtab-work-section-" + button.dataset.workSection;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "work-content");
    button.setAttribute("aria-selected", String(active));
    button.removeAttribute("aria-pressed");
    button.tabIndex = active ? 0 : -1;
    if (active) content.setAttribute("aria-labelledby", button.id);
    button.addEventListener("click", () => selectSection(button));
    button.addEventListener("keydown", (event) => {
      let nextIdx = sections.indexOf(button);
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        nextIdx = (nextIdx + 1) % sections.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        nextIdx = (nextIdx - 1 + sections.length) % sections.length;
      else if (event.key === "Home") nextIdx = 0;
      else if (event.key === "End") nextIdx = sections.length - 1;
      else return;
      event.preventDefault();
      selectSection(sections[nextIdx]);
      sections[nextIdx].focus();
    });
  });
  render();
}
