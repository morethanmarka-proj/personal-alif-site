import {
  cases,
  stages,
  proof,
  services,
  process,
  examples,
} from "./content.js";
import { swap } from "./motion.js";
const $ = (id) => document.getElementById(id);
const text = (id, value) => {
  $(id).textContent = value;
};
function buttonLabel(button, title, description) {
  const strong = document.createElement("strong");
  strong.textContent = title;
  button.append(strong);
  if (description) {
    const small = document.createElement("span");
    small.textContent = description;
    button.append(small);
  }
}
export function choices(container, items, onSelect, initial = 0) {
  container.replaceChildren();
  container.setAttribute("role", "group");
  const buttons = items.map((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    buttonLabel(
      button,
      typeof item === "string" ? item : item[0],
      typeof item === "string" ? "" : item[1],
    );
    button.addEventListener("click", () => select(index));
    button.addEventListener("keydown", (event) => {
      let next = index;
      if (["ArrowRight", "ArrowDown"].includes(event.key))
        next = (index + 1) % items.length;
      else if (["ArrowLeft", "ArrowUp"].includes(event.key))
        next = (index - 1 + items.length) % items.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = items.length - 1;
      else return;
      event.preventDefault();
      select(next);
      buttons[next].focus();
    });
    container.append(button);
    return button;
  });
  function select(index) {
    buttons.forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    onSelect(index);
  }
  select(initial);
  return select;
}
export function setupPanels() {
  choices(
    $("case-selector"),
    cases.map((entry) => [entry.brand, entry.emphasis]),
    (index) => {
      const entry = cases[index];
      text("case-title", entry.title);
      text("case-role", entry.role);
      text("case-caption", entry.brand);
      const diagram = $("case-diagram");
      diagram.replaceChildren();
      diagram.dataset.case = entry.id;
      entry.diagram.forEach((label, i) => {
        const node = document.createElement("div");
        node.className = "diagram-node";
        const number = document.createElement("span");
        number.className = "diagram-number";
        number.textContent = String(i + 1).padStart(2, "0");
        const title = document.createElement("strong");
        title.textContent = label;
        const tag = document.createElement("small");
        tag.textContent = entry.tags[i];
        node.append(number, title, tag);
        diagram.append(node);
      });
      if (entry.outcome) {
        const result = document.createElement("p");
        result.className = "diagram-outcome";
        result.textContent = entry.outcome;
        diagram.append(result);
      }
      choices($("case-tabs"), Object.keys(entry.notes), (note) => {
        text("case-note", Object.values(entry.notes)[note]);
        swap($("case-note"));
      });
      swap(diagram);
    },
  );
  choices(
    $("skill-stages"),
    stages.map((stage) => [stage.name, stage.summary]),
    (index) => {
      const stage = stages[index];
      text("stage-title", stage.name);
      text("stage-thesis", stage.thesis);
      text("stage-proof", stage.proof);
      $("marka-shortcut").hidden = index !== 2;
      choices(
        $("capabilities"),
        stage.capabilities.map((cap) => cap[0]),
        (cap) => {
          text("capability-note", stage.capabilities[cap][1]);
          swap($("capability-note"));
        },
      );
    },
    1,
  );
  choices($("proof-tabs"), Object.keys(proof), (index) => {
    const panel = $("proof-content");
    panel.replaceChildren();
    for (const [heading, description] of Object.values(proof)[index]) {
      const item = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = heading;
      item.append(title);
      if (description) {
        const detail = document.createElement("span");
        detail.textContent = description;
        item.append(detail);
      }
      panel.append(item);
    }
    swap(panel);
  });
  let activeService = services[0],
    selectedItem,
    activeDetail = "Scope",
    boundary = false;
  function showItem() {
    boundary = false;
    $("boundary-toggle").setAttribute("aria-expanded", "false");
    $("boundary-toggle").textContent = "Scope boundaries";
    const panel = $("service-description");
    panel.replaceChildren();
    if (activeDetail === "Engagement") {
      for (const [label, value] of [
        ["Included", selectedItem[1]],
        ["Best for", selectedItem[2]],
      ]) {
        const row = document.createElement("span");
        row.className = "engagement-line";
        const strong = document.createElement("strong");
        strong.textContent = label;
        row.append(strong, document.createTextNode(value));
        panel.append(row);
      }
    } else panel.textContent = selectedItem[1];
    swap(panel);
  }
  choices(
    $("service-selector"),
    services.map((service) => [service.name, service.problem]),
    (index) => {
      activeService = services[index];
      text("service-name", activeService.name);
      text("service-promise", activeService.promise);
      text("service-audience", activeService.audience);
      $("service-contact").href =
        "mailto:aliffairuz.personal@gmail.com?subject=" +
        encodeURIComponent("Project inquiry: " + activeService.name);
      choices(
        $("service-tabs"),
        ["Scope", "Deliverables", "Engagement"],
        (tab) => {
          activeDetail = ["Scope", "Deliverables", "Engagement"][tab];
          choices(
            $("service-items"),
            activeService[activeDetail].map((item) => item[0]),
            (index) => {
              selectedItem = activeService[activeDetail][index];
              showItem();
            },
          );
        },
      );
    },
  );
  $("boundary-toggle").addEventListener("click", () => {
    if (boundary) {
      showItem();
      return;
    }
    boundary = true;
    text("service-description", activeService.boundary);
    $("boundary-toggle").setAttribute("aria-expanded", "true");
    $("boundary-toggle").textContent = "Back to selected detail";
  });
  choices(
    $("process-steps"),
    process.map((step, i) => String(i + 1).padStart(2, "0") + " " + step[0]),
    (index) => text("process-note", process[index][1]),
  );
  choices(
    $("example-tabs"),
    examples.map((example) => example.name),
    (index) => {
      text("example-input", examples[index].input);
      text("example-output", examples[index].output);
      text("example-caption", examples[index].caption);
      swap($("example-output"));
    },
    1,
  );
  document.querySelectorAll("[data-focus-nav]").forEach((nav) => {
    const view = nav.closest(".view"),
      buttons = [...nav.querySelectorAll("button")];
    const values = buttons.map((button) => button.dataset.focusValue),
      labels = buttons.map((button) => button.textContent);
    const select = choices(nav, labels, (index) => {
      view.dataset.focus = values[index];
      view.querySelectorAll("[data-mobile-zone]").forEach((zone) => {
        zone.inert =
          matchMedia("(max-width: 760px), (max-height: 560px)").matches &&
          zone.dataset.mobileZone !== values[index];
      });
    });
    view.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        select(0);
        nav.querySelector("button").focus();
      }
    });
    const query = matchMedia("(max-width: 760px), (max-height: 560px)");
    query.addEventListener("change", () => {
      view.querySelectorAll("[data-mobile-zone]").forEach((zone) => {
        zone.inert =
          query.matches && zone.dataset.mobileZone !== view.dataset.focus;
      });
    });
  });
}
