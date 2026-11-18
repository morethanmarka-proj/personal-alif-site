# Work experience update: delivery review

Scope: the homepage text rows and work experience changes, reviewed in During mode on 18 November 2026. Existing site direction is retained: ENERGY 3 / RHYTHM 2 / MOTION 3.

Verification: production build and whitespace checks passed. Browser checks exercised all four roles and their four detail sections at 1440×900, 1280×720, 390×844, and 844×390 without content overflow or JavaScript errors. Desktop and mobile work screenshots were inspected. A simulated YouTube API verified video selection, mute, loop configuration, pause/resume, one player at a time, off-tab pause, and reduced-motion behavior. Actual YouTube playback remains unverified because the API did not load in this environment; the visible error state and direct YouTube link were checked instead.

## Hard gate

- R-02 PASS: added copy contains no em dashes.
- R-03 PASS: the changed panels fit all four tested viewports.
- R-17 PASS: 18% lower CPA, 15% new-user uplift, and 20+ initiatives come from the user's supplied and confirmed results.
- R-18 PASS: no testimonials added.
- R-23 PASS: the user supplied the videos, requested text rows, and specified the four detail categories.
- R-24 PASS: changed role and detail buttons target existing data; video links use the supplied IDs.
- R-25 PASS: changed text uses black on white; video has an 88% white overlay to preserve contrast even over black footage.
- R-26 PASS: role, detail, text pause, video pause, and video-link controls have implemented behavior; controls were exercised.
- R-27 PASS: video loading, paused, unavailable, and playback states are implemented; unavailable state was observed.
- R-28 PASS: no FAQ added.
- R-32 PASS: native buttons and links retain focus outlines and keyboard activation; existing primary tab keyboard navigation is preserved.
- R-33 PASS: features live in HTML, CSS, and JavaScript source modules.
- R-34 PASS: no theme toggle added or changed.
- R-35 PASS: production build and browser interaction checks ran; external video playback limitation is explicitly recorded above.
- R-36 PASS: no security or compliance claims added; no unmeasured performance scores reported.
- R-37 PASS: editorial direction and dials were declared before implementation.
- R-38 PASS: client scope and responsibilities follow the user brief; no new numeric Traveloka or Grab claims added.
- R-39 PASS: native named controls, focus styles, pause buttons, and reduced-motion behavior remain available; reduced-motion and pause behavior were exercised.
- R-40 PASS: video occupies a reserved absolute background, status has reserved height, and the API loads asynchronously on demand.

## Purpose gate

- R-01 PASS: no gradients or glows added.
- R-04 PASS: no decorative icons added.
- R-06 PASS: existing proportional editorial typography retained for reading detailed professional experience.
- R-07 PASS: no background grid added.
- R-08 PASS: no decorative arrows added.
- R-09 PASS: no badges added.
- R-10 PASS: no glass panels added.
- R-12 PASS: no shadows added.
- R-13 PASS: no glows added.
- R-14 PASS: information uses a timeline and labeled definition rows, not uniform feature cards.
- R-19 PASS: user-requested moving text summarizes expertise and markets; campaign videos provide campaign context; both can pause.
- R-22 PASS: no generic illustrations added.

## Liveliness

- Dials PASS: ENERGY 3 / RHYTHM 2 / MOTION 3 recorded above.
- Consistency PASS: retained large editorial heading, restrained blue selection, and requested continuous media.
- Focal point PASS: work heading and selected client organize the inspected desktop and mobile views.
- Whitespace PASS: separate timeline, section controls, and detail rows group related information.
- Accent PASS: blue marks selection and focus.
- Identity PASS: hard rules, black typography, and blue selection repeat the existing site language.
- Design Read PASS: declared before generation in the session.

## Craft

- C-1 PASS: typography preserves site identity; four sections directly implement the user's requested information hierarchy.
- C-2 PASS: changed controls were exercised, including simulated player controls and observed unavailable-video state.
- C-3 PASS: every added section serves supplied professional experience or expertise.
- C-4 PASS: changed content fits tested desktop, portrait, and landscape sizes; native keyboard controls and reduced motion retained.
- C-5 PASS: published numeric changes use user-confirmed figures.
- R-05 PASS: retained the viewport-based professional portfolio, without adding generic landing-page sections.
- R-11 PASS: controls retain hard rectangular edges.
- R-15 PASS: actions say Pause text, Play text, Pause video, Play video, and Watch on YouTube.
- R-16 PASS: AI-powered marketing is the user's explicitly requested expertise label; no additional promotional buzzwords added.
- R-20 PASS: content names Alif's clients, markets, work, and supplied results.
- R-21 PASS: existing light work view retained.
- R-29 PASS: existing black, white, and blue palette retained.
- R-30 PASS: existing editorial styling retained; no new imitation of another product's visual assets.
- R-31 PASS: timeline supports chronology, tabs prevent dense simultaneous copy, and the white video overlay preserves readability.
