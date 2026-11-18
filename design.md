# design.md: Editorial No-Scroll System with Three.js Interactive Layer

A design guide for a **single-viewport, tabbed, motion-rich editorial site**. It combines minimal editorial layout (hard grid, giant type, thin rules) with a PlayStation-style tab model (one panel per screen, no page scroll) and a **Three.js scene** that gives the whole site a tactile, interactive depth.

Reference DNA: The Brand Identity (centered editorial stories), Lovers Magazine (giant names, portrait grids), midlife engineering (edge-to-edge display type, product object overlapping text), and the portfolio mockup (tabs, sub-tabs, timeline + detail, metric callout).

---

## 1. Principles

1. **One screen, one idea.** Each tab is a complete composition at 100dvh. If it needs scrolling, split it into a sub-tab or another tab.
2. **Type is the hero.** Oversized Plus Jakarta Sans carries each panel. Imagery and 3D support it.
3. **The grid is felt through alignment.** Strict columns, hard edges, thin rules. No rounded corners, no shadows.
4. **Black, white, one blue.** Blue marks meaning: the active state, one accent word, one key number, the hovered 3D object.
5. **Motion explains, then gets out of the way.** One orchestrated entrance per panel, and responses to the person's actions. Nothing loops except a marquee and a loader.
6. **The 3D scene is a metaphor for the subject, not decoration.** It must be a physical object that means something (see §9.1).
7. **Content never depends on the scene.** If WebGL fails, the site is complete.

---

## 2. Color

| Token | Hex | Role |
|---|---|---|
| `--white` | `#FFFFFF` | Default panel background; text on black |
| `--black` | `#000000` | Text, rules, emphasis-panel background |
| `--blue` | `#1B3BFF` | Accent word, active tab underline, key number, links on hover, hovered 3D objects |
| `--blue-on-black` | `#4D68FF` | Blue on black panels |
| `--gray-100` | `#F2F2F2` | Image placeholders, input fill |
| `--gray-500` | `#6B6B6B` | Secondary text on white |
| `--gray-400` | `#9A9A9A` | Secondary text on black |

- Panel mix: about 85% black or white, 10% gray, at most 5% blue.
- **Background strategy:** white by default. One tab in four or five is an **emphasis panel** (black), used for the locked, call-to-action, or closing tab.
- Blue is never used for body text and never sits on a gray fill. At most **one blue accent word per headline** and **two blue elements per panel**.
- **Swapping the brand color** (for example to green and lime from the original mockup) only changes `--blue` and `--blue-on-black`. Nothing else in the system should hard-code color.

---

## 3. Typography

**Plus Jakarta Sans** for everything. **Georgia Italic** is used **only for accent words** in headlines, in blue.

```css
--font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
--font-accent: Georgia, "Times New Roman", serif;
em.accent { font-family: var(--font-accent); font-style: italic; font-weight: 400; color: var(--accent); }
```

| Token | Size | Weight | Tracking | Line height | Use |
|---|---|---|---|---|---|
| `display-xl` | `clamp(96px, 22vw, 360px)` | 500 | -0.06em | 0.82 | Edge-to-edge wordmark panel |
| `display-l` | `clamp(56px, min(13vw, 20vh), 220px)` | 500 | -0.055em | 0.86 | Name or title panel |
| `heading` | `clamp(36px, 6.4vw, 104px)` | 500 | -0.045em | 0.92 | Section title |
| `headline` | `clamp(24px, 2.8vw, 44px)` | 500 | -0.03em | 1.05 | Statement under a name |
| `title` | `clamp(15px, 1.3vw, 22px)` | 600 | -0.02em | 1.15 | Row titles, card titles, tab labels |
| `body` | `clamp(15px, 1.05vw, 17px)` | 400 | 0 | 1.45 | Body |
| `meta` | `12px` | 500 | 0.01em | 1.3 | Roles, dates, captions (sentence case) |

Rules:
- Georgia is never used for body, UI, labels, or whole headlines. One word or short phrase per headline.
- Weight 500 for display, 600 for titles. Never heavier than 600.
- Body measure max **52ch**. Left-aligned by default. Center only a single statement on a panel.
- Sentence case everywhere. No tracked-out all-caps labels.
- Use real typographic punctuation: `’`, `“ ”`, `–`, and a true minus `−` for negative numbers.
- Use `font-variant-numeric: tabular-nums` on any animated number.

---

## 4. Layout

### Viewport model
```css
html, body { height: 100%; overflow: hidden; }
.app  { height: 100%; display: flex; flex-direction: column; position: relative; z-index: 1; }
header{ height: var(--bar); flex: none; }
main  { flex: 1; min-height: 0; position: relative; }
.panel{ position: absolute; inset: 0; display: none; overflow-y: auto; scrollbar-width: none;
        align-content: safe center; }          /* internal scroll is a fallback only */
.panel.on { display: grid; }
```
- Safe areas: `viewport-fit=cover`, root padding with `env(safe-area-inset-top/bottom)`.
- Use `100%` or `dvh`, never `100vh`.
- **No page scroll.** Dense content uses sub-tabs, pagers, or drag rails. Internal panel scroll exists only as a last-resort fallback on small screens.

### Grid
- **12 columns**, 16px gutter, 24px margin on desktop. **4 columns**, 8px gutter, 16px margin under 768px.
- Hard-edged rectangles only. Images are cropped to grid cells.
- Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 96`.

### Structure is information
- **1px rules** separate real groups: list rows, header, marquee, metric tables.
- **Rows with rules, not cards.** Content groups are rule-separated cells (2×2 grid with 1px borders), never filled boxes with radius and shadow.
- Numbering only for a true sequence. A timeline uses dates, not 01/02/03.

---

## 5. Navigation

### Primary tab bar (top)
```
┌──────────────────────────────────────────────────────────────────┐
│ [AF]  Professional profile  Work experience  Expertise  Services  More than Marka 🔒 │ 56px
│       ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                                                                │
└──────────────────────────────────────────────────────────────────┘
```
- 4 to 6 tabs. Logo mark (36px outlined square) at left.
- Inactive: `--gray-500`. Active and hover: `--fg`. **Active indicator is a 2px blue underline** that slides between tabs (350ms). Never a filled pill.
- Header bottom edge is a 1px rule in `--fg`; the header has no fill so the scene shows through.
- Mobile: tabs become a horizontal snap strip, the active tab is scrolled into view.
- Hash routing: plain `#name` per tab (`#profile`, `#work`), updated with `history.replaceState`.
- Input: click, `←` `→`, horizontal swipe (≥ 70px), logo returns to the first tab.

### Sub-tabs (inside a panel)
- Row of rectangular buttons, 40px high, 1px border. **Active = filled `--fg` with `--bg` text.** Hover = blue text and border.
- Content swaps in place with a 600ms rise-in animation. Sub-tabs without content show one muted line, "Content coming soon".
- Use sub-tabs to split what would otherwise be scrolling content (skills vs tools vs certifications).

---

## 6. Panel Templates

### A. Profile hero
Giant name, one-line positioning with a blue Georgia accent word, buttons, a sub-tabbed overview, and a client marquee on the bottom edge. The 3D scene occupies the right 40%.
```
┌──────────────────────────────────────────┬──────────┐
│ Role, company                            │          │
│ Alif                  (display-l)        │   3D     │
│ Fairuz                                   │  scene   │
│ Positioning line with <em>accent</em>    │          │
│ [Primary] [Secondary] [Secondary]        │          │
│ [Overview][How I work][Results]  text    │          │
├──────────────────────────────────────────┴──────────┤
│ Client · Client · Client · Client  (marquee)        │
└─────────────────────────────────────────────────────┘
```

### B. Timeline + detail
Left: rule-separated role list (role in `title`, company and dates in `meta`). Selected row gets a 3px blue inset bar and a slight indent. Right: detail view with the **key metric** (blue `display` number with two-line label) and a 2×2 rule grid. Non-featured roles show company and dates in large type.
```
Work experience
┌──────────────────────┬───────────────────────────────┐
│ ▌Media Planner       │ MoveIt PH                      │
│  Senior Analyst      │ −18%  Cost per session         │
│  Senior Executive    │       Over three months        │
│  Executive           │ ┌───────────┬──────────────┐   │
│  Optimizer           │ │ Strategy  │ Optimization │   │
│                      │ ├───────────┼──────────────┤   │
│                      │ │ Expansion │ Client&team  │   │
└──────────────────────┴───────────────────────────────┘
```

### C. Heading + sub-tabs + rule grid
Used for expertise and services. Title, sub-tab row, optional one-line lead, a 2×2 rule grid, and an optional call to action.

### D. Locked or emphasis panel (black)
Centered lock icon, title with one blue accent word, a 1px loader line with a sliding blue segment, and a meta line. The scene brightens (white edges) behind it.

### E. Wordmark panel (for brand or product sites)
`display-xl` word edge to edge with a long 6px dash between its halves and the 3D object overlapping the type.

### F. Index grid (for galleries or interviews)
Paged grid of hard-edged 4:5 tiles with a rule-and-counter header (`1 / 3`). Never vertical scroll.

---

## 7. Components

| Component | Spec |
|---|---|
| Primary button | Black fill, white text, 0 radius, 44px min height, 20px padding, weight 600. Hover: blue fill, white text |
| Secondary button | 1px border, transparent fill. Hover: blue text and border |
| On black panels | Primary inverts (white fill), hover goes `--blue-on-black` |
| Link | Underline 1px at 3px offset. Hover blue. Verb-led labels ("Download résumé", "Discuss a project") |
| Metric | Blue number (`clamp(64px, 8vw, 128px)`, tracking -0.06em, tabular nums) next to a muted two-line label |
| Marquee | 48px strip with top rule, `title`-size names, 30s linear loop, content duplicated for a seamless -50% translate |
| Loader | 1px line with a 3px blue segment sliding left to right (2.2s) |
| Input | `gray-100` fill, 1px bottom rule, focus becomes 2px blue |

---

## 8. Motion System

### Tokens
```
--ease: cubic-bezier(.2,.7,.2,1)
panel in 450ms · panel out 280ms · reveal 800–900ms · hover 200ms · underline 350ms
```

### Choreography (per tab entry)
1. **Panel transition:** the outgoing panel fades and drifts 40px against the direction of travel (280ms). The incoming panel arrives from the other side (450ms). Direction follows tab order.
2. **Headline reveal (once per entry):** split each heading into words, then characters. Each character rises from `translateY(110%)` inside an `overflow: hidden` word mask. Stagger `16ms × index`, base delay 120ms. Add `padding-bottom: .14em; margin-bottom: -.14em` on the mask so descenders aren't clipped.
3. **Content stagger:** elements marked `.r` fade and rise 16px, delayed `70ms × index + 350ms`.
4. **Count-up:** key numbers animate from 0 over 1300ms with cubic ease-out whenever their view is shown.
5. **Swap animation:** sub-tab content and detail views re-trigger a 600ms rise-in (`from { opacity:0; translateY(18px) }`).
6. **Leaving a panel removes its reveal state**, so the choreography replays on return.

### Interaction motion
- **Magnetic buttons:** translate toward the pointer by 20% (x) and 30% (y) of the offset from center. Reset on leave. Transition 250ms.
- **Hover:** color changes only. No card lifts, no scale, no shadows.
- **Tab underline** slides between tabs.

### Looping motion (allowed list)
Marquee, loader segment, and the 3D scene's slow idle rotation. Nothing else loops.

### Reduced motion
`prefers-reduced-motion: reduce`: no reveal transforms (content simply visible), no panel slide (instant), no count-up (final value), no marquee or loader animation, 3D scene freezes at `t = 0` with no idle rotation (pointer response may remain, gentle).

---

## 9. Three.js Interactive Layer

Build natively with Three.js as the interactive engine. Pin the version and install from npm in a real build (`three`); in a hosted single-file page, load a pinned UMD build from an allowed CDN (for example `three@0.128.0` on cdnjs).

### 9.1 Concept: pick a metaphor from the subject
The scene is a physical object that represents what the site is about.
- Media planner → a **field of bars**, like a media-spend chart (default in this guide).
- Brand or identity studio → a stack of rotating typographic slabs.
- Music or hardware → the product mesh itself.
- Data or finance → a terrain or ribbon.

Rules: one object system, monochrome, edges drawn, no textures required, no particle clouds, no bloom, no neon.

### 9.2 Architecture
```
src/
  main.js            // tab router, panel choreography
  scene.js           // renderer, camera, objects, loop
  poses.js           // per-tab pose and morph functions (data-driven)
  motion.js          // split text, count-up, magnetic buttons
  styles.css
```
- **One persistent, full-viewport `<canvas>`**, `position: fixed; inset: 0; z-index: 0; pointer-events: none; aria-hidden="true"`. All UI sits above at `z-index: 1` with transparent panels.
- A single renderer, scene, and camera live for the whole session. Tabs change the scene's **state**, never rebuild it.
- Pointer events are listened to on `window` (the canvas ignores them), so the UI is never blocked.

### 9.3 Renderer and camera
```js
const R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
R.setPixelRatio(Math.min(devicePixelRatio, 2));
const C = new THREE.PerspectiveCamera(32, aspect, .1, 100);
C.position.set(14, 12, 14); C.lookAt(0, 0, 0);       // isometric-leaning view
```
- Transparent background, so page color and theme remain CSS-controlled.
- **Move the object across the screen with `camera.setViewOffset`, not by translating it in world space.** This shifts the object in screen pixels with no perspective distortion:
```js
C.zoom = pose.zoom;
C.setViewOffset(W, H, -pose.fx * W, -pose.fy * H, W, H);   // fx, fy = fraction of viewport
```

### 9.4 The bar field (default object)
- Grid of **9 × 9 boxes** (`BoxGeometry(.8, 1, .8)` translated so scale grows upward), each a `Mesh` with a `LineSegments(EdgesGeometry)` child.
- Face material: `MeshBasicMaterial` with `polygonOffset` (factor 1, units 1) so edges draw cleanly. Faces are the background color so bars occlude each other, edges are the foreground color.
- Tone is a lerped value: light panel means white faces and black edges, black panel means black faces and white edges.
- Per-bar `scale.y` is eased toward a target height every frame: `y += (target - y) * 0.07`.
- If the object count grows beyond about 200, switch to `InstancedMesh`.

### 9.5 Per-tab morphs (data-driven)
Each tab defines a height function `h(i, j, t)`. This is what makes tab changes feel physical: the same bars re-form.

| Tab type | Shape | Function idea |
|---|---|---|
| Profile | Rolling wave | `1.7 + sin(i·.6 + t) + cos(j·.6 − t·.8)` |
| Timeline | Rising staircase | `.3 + i·.38 + (j % 2)·.25` |
| Skills | Ring | tall where `2 < dist < 3.7`, low elsewhere |
| Services | Pillars | tall at `i % 3 == 1 && j % 3 == 1` |
| Locked | Near-flat, one low column | small height at the center |

### 9.6 Poses (screen position per tab)
`[fx, fy, zoom, opacity]`. `fx` and `fy` are fractions of viewport width and height; positive `fx` moves right, positive `fy` moves down. Values ease toward the target at 5% per frame.

| Tab | Desktop | Mobile (< 768px) |
|---|---|---|
| Profile | `[.27, 0, .85, 1]` | `[0, .3, .7, .4]` |
| Text-heavy tabs | `[.2, 0, 1.2, .1]` | `[0, 0, 1, .1]` |
| Locked or closing | `[0, 0, .8, .55]` | `[0, 0, .8, .5]` |

**Legibility rule:** where the panel has body text, scene opacity stays at or below `.12` so it reads as texture. Full opacity only where the scene has its own clear area (the right 40% of the hero).

### 9.7 Pointer interaction
- Cast a ray from the pointer to the plane `y = 0`, convert to group-local space, and for each bar compute `k = max(0, 1 − distance / 2.2)`.
- A bar's target height increases by `k × 2.4`, and its face and edge color lerp toward blue by `k × 1.4`. This makes hovered bars **rise and turn blue**.
- The group rotates gently toward the pointer: `rotation.y → idle + px × .45`, `rotation.x → py × .08`, eased at 5%.
- **Click ripple:** on `pointerdown`, store the hit point and time. Each bar adds `max(0, 1 − |dist − age × 6| / 1.2) × exp(−age) × 2` for 3 seconds.
- Touch: the same events work. Use `pointerdown` and `pointermove` so taps ripple.

### 9.8 Theming
Read the active theme from `body[data-tone]`. Lerp `tone` 0 → 1 at 8% per frame, and compute face, edge, and blue colors from it each frame (`blue → blue-on-black`). The scene and CSS transition together.

### 9.9 Performance and robustness
- Cap pixel ratio at 2. Render only while the page is visible (the browser pauses `requestAnimationFrame` in hidden tabs).
- No allocations in the render loop. Reuse vectors and colors.
- Handle `resize`: update size and aspect.
- On dispose in a real app: `geometry.dispose()`, `material.dispose()`, `renderer.dispose()`.
- Wrap scene creation in `try/catch`. If WebGL is unavailable the canvas is simply empty and the site works.
- Budget: first interactive under 2s on a mid-range phone; 60fps desktop; under 150KB of own JS plus Three.js.

### 9.10 Accessibility of the scene
- The canvas is decorative (`aria-hidden`). Nothing meaningful is communicated only through 3D.
- Pointer response is a progressive enhancement; keyboard users lose nothing.
- Reduced motion freezes time-based morphing (§8).

---

## 10. Responsive

| Breakpoint | Behavior |
|---|---|
| ≥ 1280 | Full 12-column layouts |
| 768–1279 | Index grids drop to 3 per page; split columns tighten |
| < 768 | 4-column grid; panels stack inside the viewport; rule grids become one column; timeline subtitles hide; scene moves below text at reduced opacity |
| Height < 640 | Hide the marquee and any decorative strip; reduce bottom padding |

Shrink imagery or the scene first, then trim copy. Do not introduce page scrolling.

---

## 11. Accessibility

- ARIA tablist: `role="tablist"`, `role="tab"` with `aria-selected`, `role="tabpanel"`. Inactive panels are `display: none`.
- Visible focus: 2px blue outline, 2px offset (`--blue-on-black` on dark).
- Contrast ≥ 4.5:1 for text. Touch targets ≥ 44px (sub-tabs 40px minimum).
- Hash deep links work, and back and forward restore the tab.
- Every animation has a reduced-motion equivalent.

---

## 12. Copy

- Sentence case, active voice, plain words. Buttons are verbs: "Download résumé", "Discuss a project".
- Positioning lines state what the person does, with one Georgia accent word on the strongest term.
- Metadata stays short: role, company, dates. Use an en dash for ranges.
- Unfinished sections say what they are: "Content coming soon". Do not invent content.

---

## 13. Do and Don't

**Do**
- Give each tab one confident composition and one memorable element.
- Let the 3D scene change shape per tab, and respond to the pointer.
- Keep blue rare so it reads as meaning.
- Keep everything on the grid, with hard edges and thin rules.

**Don't**
- Scroll the page.
- Use rounded corners, drop shadows, gradients, glass effects, or filled cards.
- Use Georgia outside accent words, or more than one accent word per headline.
- Put the scene at full opacity behind body text.
- Add particles, bloom, neon, loaders that block content, or scroll-jacking.
- Add looping motion beyond the allowed list.
- Add a fifth color. Grays are neutrals, not a palette.

---

## 14. Token and Config Summary

```css
:root {
  --white:#FFFFFF; --black:#000000;
  --blue:#1B3BFF; --blue-on-black:#4D68FF;
  --gray-100:#F2F2F2; --gray-400:#9A9A9A; --gray-500:#6B6B6B;
  --font-sans:"Plus Jakarta Sans", system-ui, sans-serif;
  --font-accent:Georgia, "Times New Roman", serif;
  --bar:56px; --m:24px; --gutter:16px;
  --ease:cubic-bezier(.2,.7,.2,1);
}
@media (max-width:767px){ :root{ --bar:52px; --m:16px; --gutter:8px; } }

body            { --bg:#fff; --fg:#000; --mu:var(--gray-500); --accent:var(--blue); }
body[data-tone=dark]{ --bg:#000; --fg:#fff; --mu:var(--gray-400); --accent:var(--blue-on-black); }
```

```js
// poses.js
export const tabs = ["profile","work","expertise","services","marka"];
export const tone = [0,0,0,0,1];                       // 1 = black emphasis panel
export const pose = {                                  // [fx, fy, zoom, opacity]
  desktop: [[.27,0,.85,1],[.2,0,1.2,.1],[.2,0,1.2,.1],[.2,0,1.2,.1],[0,0,.8,.55]],
  mobile:  [[0,.3,.7,.4],[0,0,1,.1],[0,0,1,.1],[0,0,1,.1],[0,0,.8,.5]]
};
export const morph = [wave, stairs, ring, pillars, flat];  // (i, j, t) => height
```

---

## 15. Build Checklist

1. Tokens and theme attribute in place; no hard-coded colors outside tokens.
2. Tab bar, hash routing, keyboard, and swipe work.
3. Every panel fits at 1440×900, 1280×720, 390×844, and 844×390 without page scroll.
4. Headline split reveal, stagger, count-up, panel transition, and magnetic buttons implemented.
5. Three.js: single canvas, `setViewOffset` poses, per-tab morphs, pointer hover, click ripple, tone lerp.
6. Reduced-motion and no-WebGL paths verified.
7. One blue accent word per headline, at most two blue elements per panel.
8. Placeholder content is labeled honestly; no invented claims.
