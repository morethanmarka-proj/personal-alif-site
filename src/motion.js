export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

export function reveal(view) {
  const objects = [
    ...view.querySelectorAll(
      ":scope > .view-heading, :scope > .marka-heading, :scope > .profile-copy, :scope > .personal-band, .case-layout > *, .skills-layout > *, :scope > .proof-dock, .service-layout > *, :scope > .process, :scope > .pipeline, :scope > .marka-comparison, :scope > .marka-footer",
    ),
  ];
  const targets = objects.length ? objects : [view];
  targets.forEach((item, index) => {
    item.getAnimations().forEach((animation) => animation.cancel());
    item.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 340,
        delay: index * 48,
        fill: "backwards",
        easing: "cubic-bezier(.2,.7,.2,1)",
      },
    );
  });
}

export function swap(element) {
  if (!element) return;
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 280,
      fill: "both",
      easing: "cubic-bezier(.2,.7,.2,1)",
    },
  );
}
