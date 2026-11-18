import { work } from "./work-data.js";
import { campaignVideo } from "./campaign-video.js";
import { swap } from "./motion.js";

export function setupWork() {
  const video = campaignVideo();
  const content = document.getElementById("work-content");
  const title = document.getElementById("work-client");
  const roles = [...document.querySelectorAll("[data-role]")];
  const sections = [...document.querySelectorAll("[data-work-section]")];
  let role = "saatchi",
    section = "client";
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
  roles.forEach((button) =>
    button.addEventListener("click", () => {
      role = button.dataset.role;
      roles.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      button.scrollIntoView({ block: "nearest", inline: "nearest" });
      video.setVideo(work[role].video);
      render();
    }),
  );
  sections.forEach((button) =>
    button.addEventListener("click", () => {
      section = button.dataset.workSection;
      sections.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      render();
    }),
  );
  video.setVideo(work[role].video);
  render();
  return video;
}
