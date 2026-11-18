(() => {
  const root = document.getElementById("alif-stage");
  const groups = [
    ["view", "screen", root.querySelectorAll("header [data-view]")],
    ["intro", "intro-panel", root.querySelectorAll("[data-intro]")],
    ["role", "detail", root.querySelectorAll("[data-role]")],
    ["project", "case", root.querySelectorAll("[data-project]")],
    ["skill", "skill-panel", root.querySelectorAll("[data-skill]")],
    ["service", "service-panel", root.querySelectorAll("[data-service]")]
  ];

  groups.forEach(([control, panel, selection]) => {
    const controls = root.querySelectorAll("[data-" + control + "]");
    const panels = root.querySelectorAll("[data-" + panel + "]");
    controls.forEach(button => {
      button.addEventListener("click", () => {
        const value = button.dataset[control];
        if (control === "view" && value === "profile") {
          root.querySelector('[data-intro="overview"]').click();
        }
        panels.forEach(section => {
          section.hidden = section.getAttribute("data-" + panel) !== value;
        });
        selection.forEach(item => {
          item.setAttribute("aria-pressed", String(item.dataset[control] === value));
        });
        if (!selection.length || Array.from(selection).includes(button)) return;
        Array.from(selection).find(item => item.dataset[control] === value)?.focus();
      });
    });
  });
})();
