export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
export function reveal(element) {
  if (reducedMotion.matches) return;
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 400, easing: "cubic-bezier(.2,.7,.2,1)" },
  );
}
export function swap(element) {
  if (reducedMotion.matches) return;
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate([{ opacity: 0.25 }, { opacity: 1 }], {
    duration: 220,
    easing: "ease-out",
  });
}
