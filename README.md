# Alif Fairuz Portfolio

A five-view portfolio for a performance-driven, business-minded marketing strategist. Vite, vanilla JavaScript, and Three.js; no framework migration.

## Run and build

Requires Node.js 18 or newer.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Publish `dist/` to a static host. Hash navigation requires no server route rewrites. Deployment is managed separately.

## Edit

- `index.html`: semantic compositions, profile, contact links, and Marka+ concept.
- `src/content.js`: three qualitative case studies, skills, proof, service details, process, and illustrative examples.
- `src/panels.js`: selection/reset rules, keyboard interaction, and mobile focused panels.
- `src/main.js`: top-level navigation and hash links.
- `src/styles.css`: five distinct layouts, desktop/portrait/landscape behavior, and foreground contrast.
- `src/motion.js`: brief entrance and selection transitions.
- `src/scene.js`: one Grainient renderer, pointer input, lifecycle, and reduced-motion behavior.
- `src/effects/grainient.js`: animated background; blue Profile, red Work, purple Skills, green Services, light-gray Marka.
- `public/assets/`: portrait, résumé, self-hosted fonts, and existing supporting assets.

## Content baseline

`docs/specs/portfolio-content-v3.md` contains the supplied brief. The user's corrections in `docs/specs/confirmed-v3.md` take precedence. Older design and Anti-Slop reports describe historical versions, not the current requirements.

The site replaces numerical result/award displays with qualitative cases. Small screens expose focused steps rather than stacked scrolling panels. Marka+ remains labeled pre-launch; its comparison examples are illustrative. Grainient runs continuously during normal viewing; reduced motion freezes it and hidden documents suspend frames. No pause buttons are exposed, as requested.
