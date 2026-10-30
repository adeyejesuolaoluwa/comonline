# Cinematic refinement and animation master pass

The existing cream/charcoal/cobalt identity, serif typography, split hero, real portrait, floating jacket, navigation, and asymmetric layouts are retained. This pass refines their behavior and adds the requested closing scene. Work is on `feat/cinematic-master-pass`, based on `c109df3`.

## Findings and implemented changes

The attachment contained the written brief; the locally rendered website was used for the visual baseline. All nine pages were captured at 1440px, 768px, and 390px. Additional viewport captures inspected the spotlight and author section with normal motion enabled.

- **Spotlight CTA:** the settled default-size baseline did not reproduce an overlapping control. The copy nevertheless mixed inline button flow with independently animated text and margins. It now uses explicit grid rows and a 24px gap, with heading, description, and CTA each occupying their own row. The purchase control is excluded from entrance animation and remains opaque, stationary, and clickable while text moves. Tests check both separation and real hit targets during the sequence.
- **Author repetition:** the source contained one parallel “working life / writing life” heading and four distinct biography paragraphs, rather than duplicated DOM paragraphs. The homepage heading is now “The life behind the pages,” and the redundant second summary sentence is removed. The full biography's original four paragraphs remain intact. The long biography no longer moves as one large reveal layer.
- **Actual enlarged-text defect:** at 200% text size, the fixed-height hero allowed its copy to extend into the following story. Its height now follows content with a viewport-based minimum; the portrait is positioned within the resulting grid area. Headline text wraps naturally. Other enlarged-text overflows in book metadata, thematic headings, correspondence, and email links were corrected through intrinsic sizing and wrapping. No global horizontal-overflow hiding was added.
- **Closing:** a full-width charcoal finale follows the author section. “The story continues” is set in oversized serif type, with the actual paperback at the right, a short invitation to read, a primary Amazon CTA, secondary author link, and a restrained edition colophon. Mobile uses a deliberate label → statement → book → invitation sequence.

No book quotations, endorsements, ratings, or new biographical claims are introduced. The original cover, portrait, Amazon destinations, canonical configuration, and production workflow remain unchanged.

## Motion direction

Browser-native CSS, Web Animations, and IntersectionObserver provide the requested effects without a GSAP/ScrollTrigger dependency. This scope does not need pinned scenes, timeline scrubbing, or heavy rendering libraries.

- Hero: a transform-based portrait unmask, staggered headline lines, subtle jacket depth, and a short CTA entrance. Keyboard focus bypasses the CTA entrance.
- Portrait parallax: a 24px scroll-driven CSS enhancement on wider fine-pointer devices. Chromium and WebKit support it in the tested versions; Firefox receives a static portrait fallback. It stops changing when scrolling stops and uses no JavaScript scroll listener.
- Story: restrained existing section reveals; paragraph reading is not delayed.
- Spotlight and finale: one-shot, consistently eased text sequences and a controlled book entrance. Static shadows and the jacket edge give depth. There is no continuous rotation or floating loop. Touch/small-screen book entrances use a shorter translation rather than animated perspective changes.
- Author: a short grouped transition connects its heading and summary. Full biography paragraphs stay in normal reading flow.
- Menu: short, cancellable link entrances accompany the existing menu-icon morph. Escape, focus return, resize, and native link behavior remain intact.

Content is visible by default. CSS animation requires the enhancement class; native animations use finite effects that return to normal styles. Reduced motion disables the mask, stagger, parallax, transitions, and book movement, and cancels active native effects. Observer setup is idempotent so repeated scrolling cannot nest word wrappers or duplicate text.

## Before and after

| Viewport | Before | After |
| --- | --- | --- |
| Desktop, 1440px | [Baseline](screenshots/master-before-desktop.webp) | [Master pass](screenshots/master-after-desktop.webp) |
| Tablet, 768px | [Baseline](screenshots/master-before-tablet.webp) | [Master pass](screenshots/master-after-tablet.webp) |
| Mobile, 390px | [Baseline](screenshots/master-before-mobile.webp) | [Master pass](screenshots/master-after-mobile.webp) |

Scene captures:

- [Spotlight, desktop](screenshots/master-spotlight-desktop.webp) / [mobile](screenshots/master-spotlight-mobile.webp)
- [Author, desktop](screenshots/master-author-desktop.webp) / [mobile](screenshots/master-author-mobile.webp)
- [Finale, desktop](screenshots/master-finale-desktop.webp) / [mobile](screenshots/master-finale-mobile.webp)

Full-page captures use reduced motion to document completed composition. Separate normal-motion viewport captures sample the scenes at entry and at rest. All nine pages were visually reviewed at desktop, tablet, and mobile sizes; complete PNGs and contact sheets remain in ignored `artifacts/master-pass/`.

## Verification

- Static build and checks pass: nine pages and 202 local link/asset references, including metadata, schema, heading structure, image dimensions/alternatives, and fragments.
- **216 standard layout checks pass:** nine pages × eight widths × Chromium, Firefox, and WebKit. Widths: 320, 375, 390, 768, 1024, 1366, 1440, and 1920px.
- **18 axe-core checks pass with zero reported violations:** mobile and desktop for all nine pages, including WCAG 2.2 AA tags and the visible-label/accessible-name rule.
- **210 scene/resize checks pass:** CTA geometry and hit-testing at 0, 120, 400, and 1100ms; source/text uniqueness; the finale's purchase path; scroll-driven/static fallback behavior; reduced motion; repeated-scroll word integrity; and 200% text size on all nine pages in all three engines at 320px and 1440px.
- **43 focused interaction/content checks pass:** exact preservation of all four biography paragraphs against the archived baseline, finite opening animation, portrait-caption clearance, tablet navigation, real clipboard write/failure recovery, Privacy/Terms routes and browser history, and original Amazon destinations.
- JavaScript syntax, Python compilation, generated-file consistency, and Git whitespace checks pass. Browser runs report no runtime errors or missing assets.

Browser versions: Chromium 153.0.8010.12, Firefox 155.0, WebKit 26.6. Resize checks await actual computed menu visibility and scroll checks await rendered frames; they do not force visibility or alter production classes to pass.

### Lighthouse mobile lab results

Lighthouse 12.8.2, HeadlessChrome 156, local HTTP, default simulated mobile throttling: 412 × 823, DPR 1.75, 4× CPU slowdown, 150ms RTT, approximately 1.6Mbps throughput. These are individual measurements on the working Windows machine. The product-page run includes a slower-host-CPU calibration warning, retained in the raw summary.

| Final page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 97 | 100 | 100 | 100 | 2.3s | 0ms | 0 |
| Book | 98 | 100 | 100 | 100 | 1.7s | 0ms | 0 |

The [measurement summary](master-pass-lab-results.json) contains settings, timestamps, browser versions, warnings, test results, and an archived-baseline diagnostic run. The table reports final-page measurements. Field Core Web Vitals and INP are not available; TBT is a separate laboratory measure. Automated accessibility results are evidence, rather than a claim of exhaustive WCAG conformance; assistive-technology and physical-device review remain useful release checks.

## Owner handoff

Preview with `npm run build`, `npm run check`, and `npm run preview`, then visit `http://127.0.0.1:8000/`.

Reproduce optional browser checks with:

```powershell
python scripts/qa.py --url http://127.0.0.1:8000/comonline/ --axe-path PATH/TO/axe.min.js
python scripts/refinement-qa.py --out artifacts/master-pass
python scripts/master-pass-qa.py
python scripts/capture.py --out artifacts/master-pass/after
node scripts/report.mjs artifacts/master-pass
```

The biography comparison uses `--baseline-url` when a server hosting the archived `c109df3` version is available. Tests require Playwright/browser binaries; captures additionally require Pillow. No test dependencies are deployed with the site.

The inherited contact address, paperback metadata, public domain, and legal text still need owner confirmation before publication. Retailer destination markup is verified; live checkout, stock, and email deliverability are not certified. The existing 267 × 425 cover remains the supplied publisher image; higher-resolution artwork would improve high-density display quality.

The user's untracked `new design.md` is untouched. No push, merge, PR creation, production deployment, DNS change, or workflow modification was performed. Local commits use the existing explicit Codex agent identity without changing Git configuration.
