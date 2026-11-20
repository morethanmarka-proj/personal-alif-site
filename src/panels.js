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
  const el = $(id);
  if (el) el.textContent = value;
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
  let currentIndex = initial;
  const buttons = items.map((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    buttonLabel(
      button,
      typeof item === "string" ? item : item[0],
      typeof item === "string" ? "" : item[1],
    );
    button.addEventListener("click", () => select(index, true));
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
      select(next, true);
      buttons[next].focus();
    });
    container.append(button);
    return button;
  });
  function select(index, userTriggered = false) {
    currentIndex = ((index % items.length) + items.length) % items.length;
    buttons.forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === currentIndex));
      button.tabIndex = i === currentIndex ? 0 : -1;
    });
    onSelect(currentIndex, userTriggered);
  }
  select(initial, false);
  select.next = () => select(currentIndex + 1, false);
  select.current = () => currentIndex;
  return select;
}
export function setupPanels() {
  let diagramIndex = 0;
  let diagramNodes = [];
  function highlightDiagram(idx) {
    if (!diagramNodes.length) return;
    diagramIndex = ((idx % diagramNodes.length) + diagramNodes.length) % diagramNodes.length;
    diagramNodes.forEach((node, i) => {
      node.setAttribute("aria-pressed", String(i === diagramIndex));
    });
  }

  const careerSteps = [...document.querySelectorAll("#career-flow .career-step")];
  const selectCase = choices(
    $("case-selector"),
    cases.map((entry) => [entry.brand, entry.emphasis]),
    (index) => {
      const entry = cases[index];
      careerSteps.forEach((step) => {
        step.dataset.active = String(step.dataset.career === entry.id);
      });
      text("case-title", entry.title);
      text("case-role", entry.role);
      text("case-caption", entry.brand);
      text("case-summary", entry.summary);
      const diagram = $("case-diagram");
      diagram.replaceChildren();
      diagram.dataset.case = entry.id;
      diagramNodes = entry.diagram.map((label, i) => {
        const node = document.createElement("button");
        node.type = "button";
        node.className = "diagram-node";
        const number = document.createElement("span");
        number.className = "diagram-number";
        number.textContent = String(i + 1).padStart(2, "0");
        const title = document.createElement("strong");
        title.textContent = label;
        const tag = document.createElement("small");
        tag.textContent = entry.tags[i];
        node.append(number, title, tag);
        node.addEventListener("click", () => highlightDiagram(i));
        diagram.append(node);
        return node;
      });
      highlightDiagram(0);
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
  careerSteps.forEach((step) => {
    if (step.tagName !== "BUTTON") return;
    step.addEventListener("click", () => {
      const idx = cases.findIndex((c) => c.id === step.dataset.career);
      if (idx >= 0) selectCase(idx, true);
    });
  });

  let stageTimer = 0;
  const selectStage = choices(
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
      clearInterval(stageTimer);
      stageTimer = setInterval(() => {
        if (document.body.dataset.panel === "skills") selectStage.next();
      }, 3600);
    },
    0,
  );

  const proofKeys = Object.keys(proof);
  let activeProofTab = 0;
  let activeProofItem = 0;
  let proofItems = [];
  function highlightProofItem(idx) {
    if (!proofItems.length) return;
    activeProofItem = ((idx % proofItems.length) + proofItems.length) % proofItems.length;
    proofItems.forEach((el, i) => {
      el.setAttribute("aria-pressed", String(i === activeProofItem));
    });
  }
  const selectProofTab = choices($("proof-tabs"), proofKeys, (index) => {
    activeProofTab = index;
    const panel = $("proof-content");
    panel.replaceChildren();
    proofItems = Object.values(proof)[index].map(([heading, description], i) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "proof-card";
      const title = document.createElement("strong");
      title.textContent = heading;
      item.append(title);
      if (description) {
        const detail = document.createElement("span");
        detail.textContent = description;
        item.append(detail);
      }
      item.addEventListener("click", () => highlightProofItem(i));
      panel.append(item);
      return item;
    });
    highlightProofItem(0);
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

  let processTimer = 0;
  const selectProcess = choices(
    $("process-steps"),
    process.map((step, i) => [String(i + 1).padStart(2, "0") + " " + step[0], "Step " + (i + 1)]),
    (index) => {
      text("process-note", process[index][1]);
      swap($("process-note"));
      clearInterval(processTimer);
      processTimer = setInterval(() => {
        if (document.body.dataset.panel === "services") selectProcess.next();
      }, 2800);
    },
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

  const pipelineItems = [...document.querySelectorAll("#marka-pipeline li")];
  let pipelineIndex = 0;
  function highlightPipeline(idx) {
    if (!pipelineItems.length) return;
    pipelineIndex = ((idx % pipelineItems.length) + pipelineItems.length) % pipelineItems.length;
    pipelineItems.forEach((li, i) => {
      li.setAttribute("data-active", String(i === pipelineIndex));
    });
  }
  pipelineItems.forEach((li, i) => {
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.addEventListener("click", () => highlightPipeline(i));
    li.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        highlightPipeline(i);
      }
    });
  });
  highlightPipeline(0);

  setInterval(() => {
    const panel = document.body.dataset.panel;
    if (panel === "work") {
      highlightDiagram(diagramIndex + 1);
    } else if (panel === "skills") {
      if (activeProofItem + 1 < proofItems.length) {
        highlightProofItem(activeProofItem + 1);
      } else {
        selectProofTab((activeProofTab + 1) % proofKeys.length);
      }
    } else if (panel === "marka") {
      highlightPipeline(pipelineIndex + 1);
    }
  }, 2400);

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
