export const tabs = ["profile", "work", "skills", "services", "marka"];
export const poses = {
  desktop: [
    [0.29, 0.02, 0.65, 1],
    [0.2, 0, 1.2, 0.09],
    [0.2, 0, 1.2, 0.09],
    [0.2, 0, 1.2, 0.09],
    [0, 0, 0.8, 0.2],
  ],
  mobile: [
    [0.1, 0.28, 0.65, 0.08],
    [0, 0, 1, 0.06],
    [0, 0, 1, 0.06],
    [0, 0, 1, 0.06],
    [0, 0, 0.8, 0.2],
  ],
};
export const morphs = [
  (i, j, t) =>
    1.8 + Math.sin(i * 0.6 + t) * 0.65 + Math.cos(j * 0.6 - t * 0.8) * 0.65,
  (i, j) => 0.3 + i * 0.38 + (j % 2) * 0.25,
  (i, j) => {
    const distance = Math.hypot(i - 4, j - 4);
    return distance > 2 && distance < 3.7 ? 2.8 : 0.25;
  },
  (i, j) => (i % 3 === 1 && j % 3 === 1 ? 3.5 : 0.3),
  (i, j) => (i === 4 && j === 4 ? 0.7 : 0.1),
];
