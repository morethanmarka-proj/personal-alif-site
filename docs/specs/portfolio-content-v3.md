# ALIF FAIRUZ — INTERACTIVE PORTFOLIO CONTENT DESIGN

**Artifact:** Content and information architecture specification (not a visual style guide)  
**Target:** Existing five-view PS5-inspired personal website  
**Version:** 3.0 · November 2026  
**Primary audiences:** (1) Digital / Performance Media Manager hiring teams; (2) startup and emerging-brand freelance clients  
**Core identity:** **Performance-driven. Business-minded.**  
**Professional descriptor:** Digital Media & Performance Marketing Strategist

---

## 0. Non-negotiable product constraints

1. **No scrolling within any page/view at the target desktop viewport.** All primary and secondary content must fit the available stage after global navigation, within a single screen. Do not implement a hidden vertical scroll region as a workaround.
2. **The existing five top-level `data-view` identifiers remain unchanged:** `profile`, `work`, `skills`, `services`, `marka`.
3. **Interaction is tab/sub-tab/selector driven.** A click swaps content *within the same fixed grid area*; it must not append a section below the viewport or move neighboring modules.
4. **Keep the current visual language and navigation system.** Content specification only: no new glassmorphism. Grids, editorial typography, subtle layers/depth, and existing visual vocabulary can remain.
5. **Composition-first, varied grids:** Every view must have a DISTINCT spatial layout and visual rhythm. Use grids as flexible scaffolding, not a repeated left-selector/right-detail/bottom-band template. Empty space is preferable to cramped text.
6. **Short initial content, rich on demand:** One lead headline, one short supporting line, one primary interactive module, and contextual details behind selections. The full resume is a download/contact action, not a page-length panel.
7. **No invented achievements.** No quantitative campaign results, undisclosed business data, or causal claims unsupported by the user's material. Clearly distinguish own responsibilities from collaborative work.
8. **Marka+ is v0, pre-launch.** Never describe the product as publicly launched, validated, or generating a proven five-minute output. The five-minute workflow is an intended design goal only.
9. **Responsive constraint:** On smaller screens, use one focused panel at a time (sub-tab/stepper) rather than a vertically stacked scrolling interpretation of the desktop grid. Maintain accessible navigation, tap targets, and keyboard access.
10. **Content-and-interaction handoff:** Layout zones, content, data fields, and intended motion triggers are specified below. Exact colors, typography, timing implementation, frontend framework, and component internals remain with the current site.

### Global content hierarchy

- **Persistent header/navigation:** Existing five labels, unchanged.
- **Page-level heading:** One per view, never repeated inside child tabs.
- **Stage:** Fixed-height content area below navigation.
- **Sub-navigation:** Within the stage; switches content without changing overall screen height.
- **Action:** One primary CTA per view; secondary actions only where necessary.
- **Microcopy:** Prefer labels of 2–5 words and descriptions of 8–20 words. Limit paragraphs to exceptional cases.

### Variable composition system (mandatory)

**There is no universal 12-column × 3-row template.** The fixed viewport and five main tabs are consistent; the internal composition deliberately changes from view to view. All proportions below are *suggested spatial relationships*, not hard-coded CSS.

| View | Composition signature | Why this view looks different |
|---|---|---|
| `profile` | **Editorial asymmetry:** large hero/type area + portrait; direct email/LinkedIn contact zone and short personal statement | Feels personal, approachable, and immediately actionable |
| `work` | **Case-study cockpit:** narrow case selector + dominant evidence canvas + compact insight panel | Puts the campaigns and the actual work at center stage |
| `skills` | **Staged funnel:** custom connected Foundation → Experience → Evolution visualization + contextual stage-detail panel and credential dock | Shows how broad foundations become applied expertise and fuel experimentation |
| `services` | **Service workstation:** left selector + right detailed offer + full-width bottom process | Gives service detail enough permanent real estate to be useful |
| `marka` | **Product-lab storyboard:** wide pipeline + side-by-side comparison/preview + compact status | Feels experimental and product-oriented |

**Shared constraints, not shared geometry:**
- All five views are entirely visible in one PS5-like screen; no page scroll and no internal scrolling.
- Tabs and sub-tabs replace a reserved zone rather than stacking new content.
- Do not force the same header position, bottom bar, card count, column ratio, alignment, or background grid into every view.
- A section can use 2 columns, 3 columns, horizontal bands, an asymmetric mosaic, or a large central visualization.
- Use varying whitespace, negative space, image-to-type ratios, and content density across the five views.
- Layered depth is permitted; **no glass effects**. Retain the site's existing typography, grid lines, palette, and motion language.
- If any content overflows, shorten, reflow, or move secondary data to another **tab state**—never hide it behind a scroll.

### At-a-glance viewport choreography

1. **Profile:** read a large personal statement, notice the portrait, and immediately choose Email, LinkedIn, or Explore my work; the lower band adds a brief human story.
2. **Work:** choose a brand, focus on a large campaign/evidence visual, then toggle the insight beside it.
3. **Skills:** select Foundation, Experience, or Evolution on a connected staged funnel; the anchored detail and proof zones update in place.
4. **Services:** choose the business problem on the left, inspect scope/deliverables/engagement on the right, see the work process across the bottom.
5. **Marka:** follow a left-to-right concept pipeline, then compare generic and contextual content within an interactive product-lab area.

**Compact copy fallback:** If any copy exceeds the stage, shorten it rather than shrinking font sizes indiscriminately or enabling scroll.

---

## 1. `data-view="profile"` — A bit about me

**Visitor question:** Who is Alif, what is his professional focus, and how can I contact him?

**Desired takeaway:** A performance-driven, business-minded media strategist who is approachable, adaptive, and easy to collaborate with.

### Distinct composition: editorial hero + portrait + connection hub

**Layout character:** Portrait-led editorial asymmetry. The Profile is a personal introduction **and a direct-contact gateway**, not a metric explorer, dashboard, or biography.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ PERSONAL HERO / IDENTITY (~60–65%)     │ PORTRAIT (~35–40%)          │
│ Hey, I'm Alif.                         │ Existing personal portrait │
│ Performance-driven. Business-minded.  │ subtle layered depth       │
│ 1 short introduction                   │                            │
│ [Email me]   [LinkedIn]                │                            │
├────────────────────────────────────────┴────────────────────────────┤
│ HUMAN / EXPERIENCE BAND                                              │
│ Different brands. Different challenges. Always learning.           │
│ one short supporting sentence + Adaptable · Collaborative · Curious│
│ optional compact [Explore my work] action                           │
└─────────────────────────────────────────────────────────────────────┘
```

- **Main asymmetry:** hero text occupies roughly 60–65%; the existing portrait occupies 35–40%. Layout may overlap on a visual grid, without obscuring the face or requiring a glass effect.
- **Primary CTA cluster:** two immediately visible actions inside the hero, not buried behind another click: `Email me` and `LinkedIn`. Show an icon and clear hover/focus feedback, with no intrusive motion.
- **Bottom story band:** one short experience statement + the three personal traits. This replaces the **entire** metric-to-meaning interaction and must not reproduce it elsewhere within Profile.
- **Optional tertiary action:** `Explore my work` switches to `data-view="work"`. Keep it visually less prominent than the two direct contact actions.
- **No eyebrow text or pre-heading micro-label.** Let the natural greeting, positioning headline, portrait, and CTAs establish hierarchy.
- **No biography sub-tabs or additional cards below the viewport.** Secondary experience evidence belongs in Work; education belongs in Skills.

### Visible content (default state)

| Element | Exact or recommended copy | Purpose |
|---|---|---|
| Greeting | `Hey, I'm Alif.` | Human entry point; not an eyebrow label |
| Hero headline | `Performance-driven. Business-minded.` | Permanent professional positioning |
| Role | `Digital Media & Performance Marketing Strategist` | Hiring relevance |
| Support | `I connect media strategy, audience understanding, and business thinking to help brands grow with purpose.` | Short statement of value |
| Portrait | Existing personal portrait | Personal recognition; do not change subject/face |
| Experience band headline | `Different brands. Different challenges. Always learning.` | Adaptability through experience |
| Experience band support | `From local businesses to regional platforms, I adapt my approach without losing sight of marketing fundamentals.` | One-sentence context |
| Traits | `Adaptable` · `Collaborative` · `Curious` | Human working style |

### Direct contact actions

| Action | Destination | Interaction |
|---|---|---|
| `Email me` **(primary)** | `mailto:aliffairuz.personal@gmail.com` | Open user's mail client; optional subject `Let's connect` |
| `LinkedIn` **(secondary)** | `https://www.linkedin.com/in/aliffairuz` | Open professional profile |
| `Explore my work` **(tertiary, optional)** | Switch existing site view to `work` | Use same tab-navigation mechanism; do not create scroll navigation |

**Motion behavior:** On entering Profile, a short **Split Text**-style word reveal may animate `Hey, I'm Alif.` or the main headline *once*. Supporting copy can resolve softly through a **Blur Text**-style transition. Portrait can have subtle depth or spotlight response; do **not** alter facial appearance. CTA hover/focus is a restrained directional or border change. The permanent headline must never continuously rotate or shuffle.

**Do not include here:** Metric-to-meaning rail, CPM/traffic/brand-lift selector, quantified results, award tiles, full chronology, degrees, certifications, extended services, or project carousel.

---

## 2. `data-view="work"` — What I've been up to

**Visitor question:** What has Alif actually owned, and how has his responsibility evolved?

**Desired takeaway:** Execution foundation → in-house brand/business perspective → strategic media planning and account responsibility.

### Distinct composition: three-column case-study cockpit

**Layout character:** **campaign/evidence first**, with a three-column editorial workspace and small floating navigation, not a repeated two-column details grid.

```text
┌───────────────┬──────────────────────────────────┬──────────────────┐
│ CASE RAIL     │ DOMINANT CAMPAIGN CANVAS          │ INSIGHT PANEL    │
│ (~20–23%)     │ (~45–50%)                         │ (~27–33%)        │
│ 1 MOVE IT     │ selected visual / diagram /       │ case title       │
│ 2 GRAB PH     │ brand/campaign evidence            │ tabs: Context... │
│ 3 TRAVELOKA   │                                  │ 1 focused note   │
│               │                                  │                  │
│ mini career   │                                  │                  │
│ progression   │                                  │                  │
└───────────────┴──────────────────────────────────┴──────────────────┘
            floating micro-label: primary PH / MY + resume action
```

- **Case rail:** exactly three case selections, with company/campaign name, role emphasis, and current-state indicator. A very small career sequence may sit at its end: `Local MSMEs → Grab → Traveloka → MOVE IT`.
- **Central evidence canvas:** the largest block on the page. It shows one authorized campaign visual, an editorial campaign collage, or an evidence-based diagram. Changing case swaps this whole canvas.
- **Right insight panel:** selected case label/title, four compact tabs (`Context`, `My role`, `Thinking`, `Learning`), and **one** short explanation. No cramped four-card stack.
- **Micro-footer, not a full-width row:** `Primary markets: PH / MY` and `View résumé` may sit as small footnotes/overlay in spare rail or canvas space.
- **Visual hierarchy:** the campaign should be visually dominant; the UI controls are supporting elements.
- **Fixed height:** every panel remains stable when cases/tabs change. No second timeline, map, or chart appended underneath.
- **On smaller viewports:** use two stages `Case gallery → Case insight`, switched by tabs. Do not stack all three columns vertically.

### Default visible content

- **Headline:** `From doing the work to shaping the direction.`
- **Support:** `Different brands, different markets, and a growing responsibility for the bigger media picture.`
- **Career micro-sequence (inside case rail):** `Local MSMEs → Grab PH → Traveloka MY → MOVE IT PH`
  - Stage subtitles (shown on select/hover only): `Digital foundations` → `Execution at scale` → `In-house perspective` → `Strategic account planning`.
- **Case selector:** Exactly **three cases**, ordered by relevance to present positioning (not career chronology):
  1. `MOVE IT Philippines` — `Strategic Media Planning`
  2. `Grab Philippines` — `Sweet Summer / Integrated Media`
  3. `Traveloka Malaysia` — `#HargaBagus / Brand × Performance`
- **Default case:** MOVE IT Philippines.
- **Case sub-tabs:** `Context` · `My role` · `Thinking` · `Learning`
- **Default sub-tab:** `Context`.
- **Compact rail/canvas micro-label:** `Primary: Philippines · Malaysia` / `Additional regional campaign support`.
- **Small action in rail/canvas:** `View résumé` (existing valid resume URL/file only) or `Get in touch` if no resume link is connected.

### Exact case content

#### Case 1 — MOVE IT Philippines

**Card label:** `MOVE IT PH`  
**Case title:** `Planning beyond the dashboard.`  
**Context/role:** Media Planner / Associate Manager, M+C Saatchi Performance  
**Visual evidence:** Authorized MOVE IT campaign or brand material; otherwise a diagram of demand, supply, competition, and media response.

| Sub-tab | Content |
|---|---|
| **Context** | `Mobility performance is shaped by more than advertising: supply, weather, traffic, and competition all influence demand.` |
| **My role** | `Translate business objectives into audience, channel, investment, and full-funnel media recommendations; coordinate client and delivery teams.` |
| **Thinking** | `Interpret campaign signals alongside operating conditions before deciding whether to optimize media, reconsider audiences, or challenge assumptions.` |
| **Learning** | `Good media planning responds to business reality—not just platform metrics.` |

**Fallback evidence canvas diagram (replaces campaign image in central canvas):** `Business conditions ↔ User demand ↔ Media decisions`. No invented data or estimated lift.

#### Case 2 — Grab Philippines

**Card label:** `GRAB PH`  
**Case title:** `Sweet Summer: full-funnel media at scale.`  
**Campaign:** Grab PH **Sweet Summer**, as identified in the supplied portfolio. Do not substitute a creative-award campaign title or imply ownership of creative work.  
**Role:** Media Executive / Senior Media Executive, M&C Saatchi Performance  
**Visual evidence:** An authorized Sweet Summer campaign creative, or media-channel map as fallback.

| Sub-tab | Content |
|---|---|
| **Context** | `An integrated seasonal campaign requiring aligned reach, engagement, and conversion activity across multiple channels.` |
| **My role** | `Owned media execution and co-developed strategy with planning teams across paid social, programmatic, and third-party media.` |
| **Thinking** | `Coordinate audiences, media mix, creative testing, delivery, and measurement across the funnel rather than treating channels in isolation.` |
| **Learning** | `Large campaigns work when strategic choices and delivery discipline reinforce each other.` |

**Fallback evidence canvas diagram:** `Awareness → Consideration → Conversion`, with `Paid social / Programmatic / Partners` as channel tags. This is a conceptual funnel, not a claim of measured results.

#### Case 3 — Traveloka Malaysia

**Card label:** `TRAVELOKA MY`  
**Case title:** `#HargaBagus: where brand meets performance.`  
**Campaign:** Traveloka MY **#HargaBagus**  
**Role:** Senior Performance Marketing Analyst, Traveloka  
**Visual evidence:** Authorized #HargaBagus campaign asset, or brand/performance relationship diagram.

| Sub-tab | Content |
|---|---|
| **Context** | `A Malaysia-market branding initiative requiring media decisions to support broader brand and customer objectives.` |
| **My role** | `Planned and managed campaign media; collaborated with and helped lead discussions involving brand and product marketing teams.` |
| **Thinking** | `Connect audience, placement, and measurement choices with brand objectives—not only short-term media efficiency.` |
| **Learning** | `The in-house perspective makes cross-functional alignment part of effective performance marketing.` |

**Fallback evidence canvas diagram:** `Brand priorities + Product priorities + Media strategy → Coordinated campaign`.

### Case state behavior

- Selecting a new case resets its sub-tab to `Context`.
- The **central canvas** swaps case visual/diagram, while the **right insight panel** swaps sub-tab text in place; neither changes height.
- Only one case and one case sub-tab are active at a time.
- No quantitative result tiles. No awards or creative accolades unless separately validated and correctly attributed.
- **No broad market map required in this fixed view.** Market labels provide enough geographic proof without consuming the case-study stage. If a map already exists, it should be an optional `Markets` state that replaces, not pushes down, the main panel.
- Full professional chronology should be accessible through a resume asset or concise career strip, not a second scrolling work list.

---

## 3. `data-view="skills"` — What shaped me

**Visitor question:** How did Alif's education, applied media work, and current experimentation develop into a connected professional capability?

**Desired takeaway:** Broad business and brand foundations → proven media strategy and performance experience → evolving analytics, AI, and workflow capabilities. The stages compound rather than replace one another.

### Distinct composition: interactive staged funnel + anchored detail and proof dock

**Layout character:** A **custom progressive, connected funnel** that dominates the visual canvas, paired with one stable contextual panel. This must feel different from Work's case cockpit and Services' selector workstation.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Built on fundamentals. Shaped by experience. Always evolving.         │
│ brief supporting sentence only                                         │
├──────────────────────────────────────────┬──────────────────────────────┤
│ INTERACTIVE FUNNEL (~58–65%)             │ SELECTED STAGE (~35–42%)     │
│                                          │                              │
│ ┌──────────────────────────────────────┐ │ Stage title                  │
│ │ FOUNDATION                           │ │ One-line thesis              │
│ │ Business · Marketing · Brand         │ │ [capability chips]           │
│ └──────────────────────────────────────┘ │ Selected explanation         │
│                   ↓                      │ Related evidence             │
│   ┌────────────────────────────────┐     │                              │
│   │ EXPERIENCE                     │     │                              │
│   │ Media · Performance · Growth   │     │                              │
│   └────────────────────────────────┘     │                              │
│                   ↓                      │                              │
│       ┌────────────────────────┐         │                              │
│       │ EVOLUTION              │         │                              │
│       │ Analytics · AI · Systems│         │                              │
│       └────────────────────────┘         │                              │
├──────────────────────────────────────────┴──────────────────────────────┤
│ COMPACT PROOF DOCK: [Education] [Platforms] [Analytics] [Credentials]   │
│ 1 small, fixed-height evidence panel (tab-swapped; never scrolling)     │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Custom funnel, not three same-size cards:** broad Foundation at the top, medium Experience below, narrower Evolution at the end, with a visible linking path. The visual represents progression and refinement, **not quantity, seniority scores, or relative value**.
- **Stage click behavior:** selecting a funnel segment highlights that segment and updates the adjacent detail panel **in place**. All three stages stay visible as selectable navigation; nothing expands vertically.
- **Detail behavior:** within a stage, compact capability chips update **one** explanation at a time. No paragraphs or endless stacked bullet lists.
- **Proof dock:** an independent shallow row with tabs `Education / Platforms / Analytics / Credentials`. It remains a fixed height, and its contents swap without moving the funnel or the stage panel. On small viewports, it can become another focused sub-tab rather than vertical overflow.
- **Default focus:** `Experience` → `Audience & media planning`, proof dock `Education`. This gives recruiters the strongest relevant evidence at first glance.
- **No eyebrow labels.** The headline serves as the entry point. Stage names are functional labels and remain.

### Visible content

- **Headline:** `Built on fundamentals. Shaped by experience. Always evolving.`
- **Support:** `Business thinking underneath, media expertise in practice, and smarter systems on the horizon.`
- **Stage 1:** `Foundation` — `Business · Marketing · Brand`
- **Stage 2:** `Experience` — `Media · Performance · Growth`
- **Stage 3:** `Evolution` — `Analytics · AI · Systems`

### Stage-specific data and content states

**Foundation**
- **Stage thesis:** `Good marketing decisions start with understanding businesses, brands, and people.`
- **Supporting proof:** `ITB · Bachelor of Management` / `NUS Business School · MSc in Management`.
- **Selectable capabilities:**
  - `Business strategy` → `Connect marketing objectives with commercial priorities.`
  - `Consumer & brand` → `Understand relevance, perception, and customer behavior.`
  - `Marketing analytics` → `Use evidence to question assumptions and improve decisions.`

**Experience** *(default)*
- **Stage thesis:** `Turning business context into audience decisions, media plans, and practical execution.`
- **Supporting proof:** `Indonesian local MSMEs · Grab PH · Traveloka MY · MOVE IT PH`.
- **Selectable capabilities:**
  - `Audience & media planning` → `Segmentation, media mix, full-funnel plans, and budget decisions.`
  - `Paid media execution` → `Search, social, programmatic, mobile app, and media-partner campaigns.`
  - `Measurement & testing` → `Reporting, optimization, lift studies, and experimentation.`
  - `Stakeholder leadership` → `Connect client, brand, product, analytics, and delivery teams.`

**Evolution**
- **Stage thesis:** `Using analytics, AI, and automation to improve marketing work—not replace judgment.`
- **Supporting proof:** `Marka+ · Independent, pre-launch v0 experiment`.
- **Selectable capabilities:**
  - `Reporting workflows` → `Improve recurring reporting and insight-sharing processes.`
  - `No-code integrations` → `Connect repeatable tasks through practical automation.`
  - `AI-assisted marketing` → `Ground content workflows in brand and business context.`
- **Optional action:** `Explore Marka+` → switch to `marka` view.

### Compact credential and tools proof dock

- `Education` **(default):** `ITB · Bachelor of Management` + `NUS Business School · MSc in Management`; keep in order, no disputed dates.
- `Platforms`: `Meta Ads` · `Google Ads` · `TikTok Ads` · `DV360` · `Programmatic / Ad Networks`.
- `Analytics`: `Power BI` · `Tableau` · `Python` · `R` · `Marketing measurement`; add other tools only if hands-on knowledge is verified.
- `Credentials`: show exact, verified Google / Meta / TikTok certification titles; avoid placeholder certifications that appear awarded.

### Interaction and animation behavior

1. First entry: funnel stages enter in a short **staggered** sequence with linking paths drawn or revealed; no scroll triggers.
2. Selection: one segment receives the active border/fill and a small depth adjustment; the others remain legible and clickable.
3. The stage thesis and one selected capability explanation update with a brief **Blur Text**-style reveal. Preserve panel dimensions.
4. Changing a capability chip does **not** replay the entire funnel animation.
5. The connecting SVG paths can animate briefly on stage selection, then remain still. The funnel should not pulse or loop continuously.
6. Honor keyboard and touch interaction and reduced-motion settings. Under reduced motion, use instant text replacement and a clear active outline.

**Do not include:** Generic percentage skill bars, fake seniority measurements, full-page logo mosaics, scroll-triggered animation, or an implication that the Foundation layer disappears when moving to Evolution.

---

## 4. `data-view="services"` — How I can help you

**Visitor question:** What exact problem can Alif help my business solve, what will he deliver, and how would we work together?

**Desired takeaway:** Strategy plus hands-on execution; practical, scoped support for startups and emerging brands. This view is intentionally **more detailed** than others, but detail stays behind selection—not on a scrolling page.

### Distinct composition: service workstation (purpose-built three-zone grid)

**Layout character:** **functional workspace**; this is the one view intentionally organized as left selector + right detail + bottom process. Do not copy this arrangement to other pages.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ TOP STRIP: "Good marketing starts with the right problem."             │
├───────────────────────┬─────────────────────────────────────────────────┤
│ LEFT — SELECTOR       │ RIGHT — MAIN OFFER + DETAIL                     │
│ (~27–32%)             │ (~68–73%)                                       │
│ [1 Performance]       │ Offer name / promise / who it is for            │
│ [2 Marketing/Brand]   │ [Scope][Deliverables][Engagement] ← sub-tabs     │
│ [3 AI & Automation]   │ selected offer item + precise description       │
├───────────────────────┴─────────────────────────────────────────────────┤
│ BOTTOM — WAY I WORK: Discover → Prioritize → Execute → Improve + CTA    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Layout contract:**
- Left selector uses **three stacked service groups**, each with a short client problem—not generic icons alone.
- Right main offer is the largest interactive text zone of the site. Use one active category and nested `Scope / Deliverables / Engagement` tabs, plus item selection to avoid long lists.
- Right panel can internally divide into **a narrow item menu and large description stage**. This is a nested grid *inside the right area*, not an expanding accordion.
- Bottom process spans both columns, is always visible, and contains the single main inquiry CTA. It never becomes a fourth service card.
- The services layout may be more information-dense than Profile or Marka, but never scrolls.

### Default state

- **Headline:** `Good marketing starts with the right problem.`
- **Support:** `Strategy when you need direction. Hands-on delivery when you need action.`
- **Selected category:** `01 Performance Media & Growth`
- **Selected detail tab:** `Scope`
- **Bottom CTA:** `Discuss a project` → verified email/contact destination.

### LEFT — Three service categories

| Selector | Short client problem | Offer label |
|---|---|---|
| `01 Performance Media & Growth` | `My campaigns need clearer direction or stronger execution.` | `Plan · Run · Improve` |
| `02 Marketing & Brand Advisory` | `We need to decide what marketing should do next.` | `Diagnose · Focus · Grow` |
| `03 AI & Marketing Automation` | `Our marketing workflows take too much manual effort.` | `Simplify · Connect · Adopt` |

Use a single active category. Changing categories updates the right content and resets its detail tab to `Scope`.

### RIGHT — Complete service data

#### SERVICE 01 — Performance Media & Growth

**Hero promise:** `Better media decisions, from plan to performance.`  
**Audience:** Startups, emerging brands, and teams that need paid media expertise beyond ad-platform setup.  
**Value:** A strategic partner who can also manage execution and interpret results in business context.

**Sub-tab: `Scope`** — present as four grouped offer items (not paragraphs):

| Group | Detailed scope |
|---|---|
| `01 Strategy & planning` | Objective and KPI alignment; audience segmentation; funnel design; channel selection; media mix; budget and flighting recommendations. |
| `02 Campaign activation` | Paid social/search/app and relevant programmatic or media partner setup; creative/asset coordination; launch QA; tracking dependencies and conversion-event checks with responsible teams. |
| `03 Ongoing optimization` | Pacing and spend allocation; audience and creative tests; placement/channel optimization; performance diagnostics; response to category and market changes. |
| `04 Measurement & learning` | Reporting structure; KPI interpretation; funnel and attribution review; experiment design; brand/conversion-lift study coordination where platform and budget permit; next-action recommendations. |

**Sub-tab: `Deliverables`** — a concise output checklist, not an undifferentiated skills list:

1. `Media strategy / plan` — goals, audiences, channels, budget logic, campaign roadmap.
2. `Campaign build / launch checklist` — activation plan, dependencies, QA, measurement readiness.
3. `Performance review` — dashboard/reporting summary, drivers, risks, and strategic recommendations.
4. `Optimization roadmap` — prioritized tests and investment decisions for the next cycle.

**Sub-tab: `Engagement`**

| Mode | What is included | Useful when |
|---|---|---|
| `Paid media audit` | Campaign structure, budget, audience, creative, and signal review + prioritized improvements. | Advertising is already running but direction is unclear. |
| `Campaign / launch project` | Time-bound strategy, setup, activation, monitoring, and closing review. | Launching a product, promotion, or growth initiative. |
| `Ongoing media partner` | Regular planning, execution oversight or management, optimization, and reporting. | A team needs sustained strategic + operational support. |

**Scope boundary:** Does not imply full creative production, engineering ownership of analytics instrumentation, guaranteed ROAS, or ownership of business factors beyond marketing.

#### SERVICE 02 — Digital Marketing & Brand Advisory

**Hero promise:** `Find the right marketing problem before choosing the channels.`  
**Audience:** Founders and emerging teams facing uncertain positioning, fragmented activity, or unclear growth priorities.  
**Value:** Connect commercial questions, customer understanding, and brand context to an actionable digital marketing direction.

**Sub-tab: `Scope`**

| Group | Detailed scope |
|---|---|
| `01 Business & marketing diagnosis` | Clarify business stage, objectives, constraints, customer journey, marketing maturity, and current channel performance. |
| `02 Customer & audience strategy` | Define or refine segments, needs, purchase barriers, motivations, digital touchpoints, and decision occasions. |
| `03 Brand-informed digital direction` | Review value proposition, differentiation, relevance, messaging consistency, and the role of paid/owned/commerce channels. |
| `04 Prioritization & growth roadmap` | Recommend channel roles, content and campaign priorities, measurement approach, experiment backlog, resourcing, and practical next steps. |

**Sub-tab: `Deliverables`**

1. `Marketing diagnostic` — concise assessment of gaps, opportunities, and constraints.
2. `Audience & positioning working map` — key segments, needs, value proposition, and channel implications.
3. `Digital marketing roadmap` — prioritized initiatives with suggested owners, sequencing, and success signals.
4. `Strategy working session` — collaborative review to align the team and decide next actions.

**Sub-tab: `Engagement`**

| Mode | What is included | Useful when |
|---|---|---|
| `Marketing health check` | Fast review of business context, existing marketing, and a shortlist of priorities. | The business needs an external perspective. |
| `Strategy sprint` | Discovery, customer/channel assessment, strategic choices, and action plan. | Preparing to launch, reposition, or reset marketing direction. |
| `Advisory partner` | Periodic planning, decision support, and evaluation of growth initiatives. | A founder/team wants ongoing strategic input. |

**Scope boundary:** Brand-informed digital strategy and marketing advice, **not** a claim to provide comprehensive visual identity design, specialist consumer research fieldwork, full brand-repositioning implementation, or legal/PR consultancy.

#### SERVICE 03 — AI-Enabled Marketing & Automation

**Hero promise:** `Make repetitive marketing work lighter—and decisions more informed.`  
**Audience:** Lean teams that want practical AI/no-code improvements to existing marketing workflows.  
**Value:** Identify an appropriate use case, build a scoped workflow or prototype, and keep human review in control.

**Sub-tab: `Scope`**

| Group | Detailed scope |
|---|---|
| `01 Workflow diagnosis` | Identify repetitive tasks, inputs/outputs, handoffs, error risks, tools already used, and candidate tasks for automation. |
| `02 Reporting & insight workflows` | Structure recurring data collection, aggregation, summaries, alerts, and reporting handoffs subject to data access and platform constraints. |
| `03 AI-assisted marketing production` | Brand-context intake, reusable prompt structures, brief/content ideation workflows, review checkpoints, and human approval. |
| `04 No-code integration & adoption` | Connect supported services/tools, establish triggers and handoffs, document the workflow, test edge cases, and train the team on maintenance. |

**Sub-tab: `Deliverables`**

1. `Use-case map` — opportunities ranked by effort, feasibility, and business value.
2. `Workflow blueprint` — trigger, inputs, logic, outputs, and human review points.
3. `Working prototype / scoped automation` — implemented only within agreed tools and access.
4. `Handover kit` — documentation, prompts/templates, QA checklist, and adoption guidance.

**Sub-tab: `Engagement`**

| Mode | What is included | Useful when |
|---|---|---|
| `AI workflow audit` | One-team or one-process review, shortlist of use cases, and pilot recommendation. | The team is curious about AI but lacks a clear starting point. |
| `Automation pilot` | One selected workflow from specification through testing and handover. | The team has a repetitive task worth improving. |
| `Adoption session` | Structured demonstration, templates, human-review rules, and simple usage guidance. | A team needs to adopt an agreed workflow safely and consistently. |

**Scope boundary:** No implied enterprise AI transformation, bespoke production-grade software platform, guaranteed time savings, unrestricted access to confidential customer data, or claims that Marka+ is a launched client product. Complex engineering/infrastructure work requires separately agreed specialist support.

### How to reveal detail without scroll

Each service category has **three right-panel sub-tabs**:

- `Scope`: four items; show **titles simultaneously**, but only **one selected item's detailed sentence** in a fixed preview area. A selected scope item uses a single-line short description. This preserves depth without squeezing four long descriptions onto the screen.
- `Deliverables`: four compact output rows; selecting a row shows its one-line definition in the same fixed preview area.
- `Engagement`: three engagement-mode chips; selecting a mode shows `Included` + `Best for` in the fixed preview area. A small scope-boundary disclosure replaces the preview when selected.

**Right-panel secondary selection defaults:** first scope group, first deliverable, first engagement mode. No nested accordion expansion.

### BOTTOM — How I work (persistent across service selection)

`01 Discover → 02 Prioritize → 03 Build / Execute → 04 Learn & Improve`

Clicking a step swaps its microcopy in a **single reserved subtitle slot**:

| Step | One-line copy |
|---|---|
| `Discover` | `Understand the business, audience, workflow, and constraints.` |
| `Prioritize` | `Agree on the most valuable and feasible next move.` |
| `Build / Execute` | `Deliver the plan, campaign, or workflow within scope.` |
| `Learn & Improve` | `Review evidence, identify gaps, and refine the approach.` |

**CTA:** `Discuss a project` (with selected category added to inquiry subject if supported).  
**Secondary CTA:** None necessary. Avoid adding a second form or pricing calculator inside this fixed grid.

### Services content-state model

```text
selectedService = performance | advisory | automation
selectedDetailTab = scope | deliverables | engagement
selectedDetailItem = service-specific item ID
selectedProcessStep = discover | prioritize | execute | improve

onSelectService:
  update selectedService
  reset selectedDetailTab = scope
  reset selectedDetailItem = first scope item

onSelectDetailTab:
  update selectedDetailTab
  reset selectedDetailItem = first item in that tab

All swaps occur within the RIGHT zone; the BOTTOM process remains stable.
```

---

## 5. `data-view="marka"` — Currently building

**Visitor question:** What is Alif experimenting with beyond his day job, and how does it connect to his marketing perspective?

**Desired takeaway:** An independent, pre-launch, framework-first AI marketing project; a believable signal of initiative and practical experimentation.

### Distinct composition: product-lab storyboard

**Layout character:** **horizontal experimental story**, with the product concept and comparison as the heroes. Avoid duplicating either the case-study cockpit or services selector.

```text
┌────────────────────────────────────────────────────────────────────┐
│ MARKA+ / V0  ·  "Less generic AI. More brand thinking."           │
├────────────────────────────────────────────────────────────────────┤
│ WIDE LEFT-TO-RIGHT PIPELINE                                       │
│ [Business context] → [Framework] → [AI workflow] → [Content angle]│
├───────────────────────────────┬────────────────────────────────────┤
│ CONCEPTUAL INPUT / PROMPT     │ ILLUSTRATIVE OUTPUT / CONTENT      │
│ chosen mode + context chips   │ sample angle + short explanation   │
│ (Generic / Framework-first)   │                                    │
└───────────────────────────────┴────────────────────────────────────┘
  tiny status: v0 pre-launch · Salience / Relevance / Context · project link
```

- **Upper middle:** one **full-width horizontal process pipeline**, not a vertical list.
- **Lower stage:** two approximately balanced comparison canvases: input on the left, illustrative content direction on the right. One toggle (`Generic` / `Framework-first`) updates **both sides together**.
- **Status and three principles:** compact micro-labels anchored in spare top/bottom whitespace, **not** a large third row of separate cards.
- **Optional product screenshot:** when actual screens exist, use one screenshot as the right-hand output canvas; no new gallery that would require scroll.
- **No service-style left menu.** This page should read like a small product experiment, not a consultancy interface.

### Visible content

- **Status (functional badge, not eyebrow):** `v0 · Pre-launch`
- **Project title:** `Marka+`
- **Headline:** `Less generic AI. More brand thinking.`
- **Support:** `Exploring how business context and marketing frameworks can guide better AI-assisted content.`
- **Framework chain:** `Business & brand context → Marketing framework → AI-assisted workflow → Contextual content direction`
- **Three principle labels:** `Salience` · `Relevance` · `Context`
- **Status line:** `In development. Exploring a faster framework-first creation process.`
- **Project action:** `Explore morethanmarka.com` (verify the actual live destination before publishing as a working app).

### Input/output comparison states (illustrative, not actual Marka+ outputs)

| State | Input | Example direction | Caption |
|---|---|---|---|
| `Generic prompt` | `Give me 5 Instagram ideas for a coffee brand.` | `5 reasons to drink coffee in the morning.` | `Broad output with little brand-specific direction.` |
| `Framework-first` | `Coffee brand + office workers + afternoon occasion + accessible price point.` | `Jam 3 sore, kenapa kopi selalu jadi ide bagus?` | `A specific angle informed by audience, occasion, and brand context.` |

**Behavior:** Comparison toggles replace BOTH input and output content in-place. No automatic slideshow or scroll. If actual product screenshots become available, the comparison can become a two-state screenshot/demo switch without changing the zone arrangement.

**Do not say:** `Launched`, `production-ready`, `proven five-minute creation`, `validated product results`, or `used by clients` until separately verified.

---

## 6. Cross-view content inventory and rules

| Content item | Primary home | Rule elsewhere |
|---|---|---|
| Main professional positioning | `profile` | Short descriptor only where necessary |
| Business-first performance philosophy | `profile` | Express briefly in the positioning; Work cases demonstrate the detail |
| Career progression and employment evidence | `work` | Only one-line context in Profile |
| MOVE IT / Grab Sweet Summer / Traveloka #HargaBagus | `work` | Only refer to employers briefly elsewhere |
| Education and knowledge foundation | `skills` | Do not make Profile text-heavy with degrees |
| Platforms, analytical tools, certifications | `skills` | Show only tools relevant to a case/service when needed |
| Detailed commercial offers and client process | `services` | No duplicate service list on other pages |
| Marka+ concept, workflow, and v0 status | `marka` | Skills may mention it as an independent experiment only |

### Copy hierarchy / density limits

- Main heading: preferably **3–8 words**.
- Supporting line: preferably **12–24 words**.
- Category/card label: **2–5 words**.
- Interactive detail state: ideally **one sentence**, maximum ~35 words.
- No more than **one prominent explanatory paragraph** per view. Lists can have structured rows because only a subset is visible at a time.
- No standalone long biography in the PS5 views. Provide long-form resume or LinkedIn externally.

### Accessibility and interaction behavior

- Each selection has a visible selected state and meaningful label.
- Keyboard focus and controller-style directional navigation should follow a predictable order: **top tabs → left selector → right sub-tabs/items → bottom process → CTA**.
- Escape/back returns to the previous level of selection where applicable, never unexpectedly changes top-level page.
- Mobile should present the same hierarchy via tabbed stages (e.g. `Select → Detail → Process`) and not a page that starts vertically scrolling.
- Motion should preserve spatial context and respect reduced-motion settings.
- Maintain enough contrast and legible text at target viewing distance; do not force copy density into tiny fonts.

---

## 7. Content change checklist for the current site

- [ ] Keep existing global navigation and `data-view` values.
- [ ] Remove all decorative eyebrow/pre-heading labels; preserve only meaningful functional status/selector labels.
- [ ] Remove the metric-to-meaning rail and its four metric states completely.
- [ ] Wire Profile `Email me` and `LinkedIn` as direct, immediately visible actions.
- [ ] Replace Profile's `Overview / How I work / Results & awards` groups with an editorial hero, portrait, immediate Email/LinkedIn CTAs, and concise personal traits.
- [ ] Remove or withhold numerical result tiles; do not confuse cost per session with CPA.
- [ ] Do not attribute creative awards personally without evidence.
- [ ] Limit the Work case selector to exactly MOVE IT PH, Grab PH Sweet Summer, and Traveloka MY #HargaBagus.
- [ ] Change Work case sub-tabs to `Context / My role / Thinking / Learning`.
- [ ] Keep work career progression as a compact strip; don't show a second full chronology below the cases.
- [ ] Rebuild Skills around a custom interactive Foundation → Experience → Evolution funnel, one anchored stage-detail panel, and compact credentials.
- [ ] Replace Services' old narrow tabs with three broad service categories; include Paid Media Audit as an engagement mode.
- [ ] Build Services' required **left selector / right offer & detail / bottom way-I-work** grid.
- [ ] Show all service detail through fixed-region swapping and secondary selection, not an expanding accordion.
- [ ] Label Marka+ `v0 / pre-launch` and make examples explicitly illustrative.
- [ ] Test all content states at target desktop size and small screens: **zero view-level scroll and zero content clipping**.

---

## 8. Suggested default states (first impression)

| View | Default selection | Why |
|---|---|---|
| Profile | Hero + direct `Email me` and `LinkedIn` actions; no sub-selection | Establishes identity and offers immediate connection |
| Work | `MOVE IT PH` → `Context` | Shows current strategic responsibility first |
| Skills | Funnel stage `Experience` → capability `Audience & media planning`; proof `Education` | Puts strongest relevant expertise first |
| Services | `Performance Media & Growth` → `Scope` → `Strategy & planning` | Matches primary professional positioning |
| Marka+ | `Framework-first` | Demonstrates what is distinctive about the concept |

## 9. Interaction and motion layer (React Bits evaluation)

This section specifies **use cases and triggers**, not a requirement to adopt React Bits components wholesale. Preserve the site's existing design language, simple grid treatment, and layered depth. Avoid glass effects.

| View | Signature interaction | Candidate behavior | Trigger | Guardrail |
|---|---|---|---|---|
| Profile | Personal greeting and direct contact | Split Text entrance; subtle CTA/portrait spotlight | Enter Profile / hover or focus CTA | No continuous rotating headline or animated facial manipulation |
| Work | Three-case evidence explorer | Short title reveal; image crossfade/depth; detail blur-in | Change MOVE IT / Grab / Traveloka; switch case tab | Keep all three cases instantly selectable; no automatic carousel |
| Skills | Progressive funnel | Staggered segment entry, connecting SVG path, in-place detail transition | Enter Skills / select stage or chip | Custom semantic funnel, not decorative percentage chart |
| Services | Selector + detailed offer + process | Subtle selectable-card response; Blur Text details; optional Stepper for process | Choose service, sub-tab, or work-process stage | Right panel and bottom process stay in fixed zones |
| Marka+ | Framework-first demonstration | Step-wise pipeline; one optional Decrypted Text/Shuffle output transition | User explicitly switches example | Illustrative output labeled as such; no proven product claim |

**Motion tiers:**
- **Entrance (one-shot):** title/major visual reveal on entering a view. Suggested 350–700 ms; never block basic navigation.
- **Selection (responsive):** content replacement 180–400 ms; focused on the panel that changed.
- **Hover/focus (subtle):** pointer/keyboard feedback around 120–200 ms. Touch must have an equivalent selected state.
- **Ambient:** minimal or none. Prefer a quiet, professional screen at rest.

**Shared requirements:** Respect `prefers-reduced-motion`; no scroll-triggered effects; stable panel heights; no content clipping, unexpected reflow, glittering/pulsing loops, or inaccessible hover-only actions. Component libraries enhance interactions, **not** determine the page composition.

---

## 10. Source and evidence notes

This spec is based on the four supplied career documents, the user's two positioning rounds and final fact-check answers, and the live site's publicly accessible page structure as reviewed November 2026. It intentionally preserves the user's qualitative-only case-study preference.

- **MOVE IT:** Strategic account planning and context-aware media decisions, not a named campaign invented for the site.
- **Grab PH:** Use **Sweet Summer**, the featured case named in the supplied digital portfolio; media execution ownership plus co-developed strategy, not full creative campaign ownership.
- **Traveloka MY:** Use **#HargaBagus**, with direct media management and cross-functional brand/product marketing contribution.
- **Regional work:** Primarily PH and MY, with other markets described as support.
- **Education chronology:** ITB then NUS; avoid disputed date displays.
- **Assets:** Actual campaign imagery and credentials should be used only when rights/attribution are appropriate.

**Deliverable intent:** A complete content map for the existing PS5-like interface, with **five deliberately different compositions**, fixed-screen tab-driven content, no scrolling, and no change to the established visual aesthetic.
