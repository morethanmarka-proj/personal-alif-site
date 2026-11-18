# Interactive background scenes

Direction: keep Alif's editorial black, white, and blue portfolio. ENERGY 3 / RHYTHM 2 / MOTION 3. The attached Gradient ASCII, Shape Grid, and Micro Slats references supply the visual and interaction design; their sample code is adapted to the existing application lifecycle.

## Tab mapping

- Homepage / Professional Profile: centered, viewport-scale blocks, with a transparent Micro Slats layer. The user explicitly confirmed that the slats belong here alongside the blocks.
- Expertise, Skills & Education: Gradient ASCII in its light-page treatment. Glyphs drift, scramble near the pointer, and react to presses.
- Services: Shape Grid, with perspective, energized cells, trailing energy, and tap waves.
- Work Experience: existing campaign videos and controls retained, with no slats.
- More Than Marka: existing subdued block motif retained.

## Implementation choices

A single renderer runs the active scene. Separate canvases were considered, but would duplicate WebGL contexts and animation loops. The homepage uses two render passes in the same context to combine blocks and slats. Static CSS effects serve as a fallback when WebGL is unavailable or its context is lost.

The supplied continuous motion is intentional. A keyboard-accessible Play/Pause effect control freezes the scene, reduced motion defaults to paused, and hidden documents stop requesting frames. Existing marquee and video pause controls remain independent. Mobile caps DPR at 1.5 and uses the references' smaller grid counts. Horizontal content dragging now interacts with the scene rather than changing tabs; top navigation and keyboard tab navigation remain available.

Background opacity preserves text contrast: homepage 28% (18% on mobile), ASCII 20%, grid 35%. Slats have an additional 42% material alpha before the homepage opacity is applied. The gray text on these panels is darkened to keep it readable. The ASCII monospace atlas is decorative; interface typography stays Plus Jakarta Sans. No résumé copy, metrics, or service claims change.

The application ships only the light-page versions of the three new effects because their assigned tabs are light. Dark-page variants and the slats' optional wall-to-sea morph are not exposed as unused controls.
