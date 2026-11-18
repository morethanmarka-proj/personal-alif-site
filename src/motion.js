export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

export function reveal(container, direction = 1) {
  container.animate(
    [
      { opacity: 0, transform: "translateX(" + direction * 40 + "px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
    { duration: 450, easing: "cubic-bezier(.2,.7,.2,1)" },
  );
  container
    .querySelectorAll(
      ".subnav,.actions,.timeline,.detail,[data-intro-panel]:not([hidden])",
    )
    .forEach((element, index) => {
      element.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 600,
          delay: 350 + index * 70,
          fill: "backwards",
          easing: "cubic-bezier(.2,.7,.2,1)",
        },
      );
    });
  const heading = container.querySelector("h1,h2");
  if (heading) {
    if (!heading.dataset.split) {
      heading.dataset.split = "true";
      heading.setAttribute("aria-label", heading.textContent.trim());
      const tokens = [];
      for (const node of heading.childNodes) {
        const baseCls = node.nodeType === 1 ? node.className : "";
        const isStrong = node.nodeType === 1 && node.nodeName === "STRONG";
        const cls = [baseCls, isStrong ? "title-bold" : ""]
          .filter(Boolean)
          .join(" ");
        for (const word of (node.textContent || "").trim().split(/\s+/)) {
          if (word) tokens.push({ word, cls });
        }
      }
      heading.replaceChildren();
      for (const { word, cls } of tokens) {
        const mask = document.createElement("span");
        mask.className = cls ? "word-mask " + cls : "word-mask";
        mask.setAttribute("aria-hidden", "true");
        for (const character of word) {
          const span = document.createElement("span");
          span.textContent = character;
          mask.append(span);
        }
        heading.append(mask, document.createTextNode(" "));
      }
    }
    heading.querySelectorAll(".word-mask span").forEach((span, index) => {
      span.animate(
        [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
        {
          duration: 850,
          delay: 120 + index * 16,
          fill: "backwards",
          easing: "cubic-bezier(.2,.7,.2,1)",
        },
      );
    });
  }
}
export function swap(container) {
  container.animate(
    [
      { opacity: 0, transform: "translateY(18px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 600, easing: "cubic-bezier(.2,.7,.2,1)" },
  );
  container
    .querySelectorAll(".result strong,.proof-stat")
    .forEach((element) => {
      const label = element.dataset.value || element.textContent;
      element.dataset.value = label;
      const value = Number(label.replace(/[^0-9.]/g, ""));
      if (!value) {
        element.textContent = label;
        return;
      }
      const start = performance.now();
      const generation = String(start);
      element.dataset.generation = generation;
      function tick(now) {
        if (element.dataset.generation !== generation) return;
        if (element.closest("[hidden]")) {
          element.textContent = label;
          return;
        }
        const progress = Math.min(1, (now - start) / 1300);
        element.textContent = label.replace(
          /[0-9.]+/,
          String(Math.round(value * (1 - (1 - progress) ** 3))),
        );
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
}
export function magneticButtons() {
  document.querySelectorAll(".actions a").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = button.getBoundingClientRect();
      button.style.translate =
        (event.clientX - rect.left - rect.width / 2) * 0.2 +
        "px " +
        (event.clientY - rect.top - rect.height / 2) * 0.3 +
        "px";
    });
    button.addEventListener("pointerleave", () => {
      button.style.translate = "";
    });
  });
}
