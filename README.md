# Alif Fairuz Portfolio

An editorial, single-viewport portfolio for a marketing strategist specializing in digital media and performance. Three.js renders an interactive field of media bars that changes shape with each tab.

## Run locally

Requires Node.js 18 or newer.

```sh
npm ci
npm run dev
```

## Build for deployment

```sh
npm run build
npm run preview
```

Publish the generated `dist/` directory to a static host. The site uses hash routes, so server-side route rewrites are unnecessary.

## Edit the site

- `index.html` contains copy, images, role details, and service offers.
- `src/styles.css` contains design tokens, typography, and responsive layouts.
- `src/main.js` handles tabs, keyboard navigation, swipe, and hash links.
- `src/motion.js` handles text reveals, metric count-up, and button interaction.
- `src/scene.js` manages Three.js rendering, hover, tap ripples, and resource cleanup.
- `src/poses.js` defines each tab’s scene position and shape.
- `public/assets/` contains the résumé, images, and self-hosted fonts.
- `design.md` records the supplied design brief.

The scene pauses in hidden browser tabs and freezes time-based motion when reduced motion is enabled. The content works when WebGL is unavailable. Very small viewports and enlarged text can use internal panel scrolling as an accessibility fallback.
