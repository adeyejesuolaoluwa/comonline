# Creative refinement, round two

## Visual audit and decisions

The first redesign (`0b21233`) was reviewed as a rendered website at 1440px, 768px, and 390px across all nine pages. It had a consistent identity but too much repeated composition. The most important findings were:

| Weakness | Implemented refinement |
| --- | --- |
| The homepage opened with an inset product card, separating the author from the book. | An edge-to-edge split composition pairs warm paper and expressive title typography with the actual author photograph. The paperback crosses the seam as a visible, linked product. |
| The book, statement, biography, reader invitation, and final purchase section repeated similar messages. | Six major sections become four distinct movements: opening, story, book, author. The reader invitation becomes a quiet closing line. |
| Large titles followed by paired columns made interior pages feel interchangeable. | Biography becomes an indexed long read after a portrait opening; the book gets a warm paper stage; story gets a thematic contents panel; FAQ and contact become compact utilities. |
| Tablet navigation was squeezed down to very small type. | The expandable menu starts at 960px. Open tablet navigation uses 16px text, and supporting labels are at least 12px. |
| Motion lacked a defined opening sequence. | Two masked headline lines, a finite portrait settle, and a brief jacket entrance establish the homepage. Scroll reveals are restrained, and the typographic statement is prepared only as it approaches the viewport. |
| The first performance trace attributed a long task to synchronous layout measurements during entrance setup. | IntersectionObserver now supplies visibility without synchronous geometry reads. Text splitting is deferred until the statement approaches the viewport. |
| The composition review found the seam-crossing cover obscuring a portrait caption. | Caption placement is explicitly checked against the cover at nine widths, including 412px. |
| The contact page had duplicate email actions without a convenient copy path. | One visible email destination, an email-app link, and an optional copy control with real success/error states. No form or simulated send confirmation. |

The source biography's four paragraphs are preserved exactly, verified against the first-round rendered page with whitespace normalized. The synopsis, original retailer URLs, author photograph, book cover, and edition data are retained. No reviews, credentials, or medical claims were invented. A 1080px WebP derivative preserves more of the supplied portrait's detail on larger displays; no image was enlarged beyond its source dimensions. The unused atmospheric-cover derivative was removed.

The original split-screen reference image was not attached to the round-two request. This implementation follows the written photographic/editorial direction using the supplied real assets; no claim of matching an unavailable screenshot is made.

## Before and after

All captures use the same viewport dimensions and reduced motion to show completed layouts. Complete page captures were made for all nine pages at desktop, tablet, and mobile sizes. The contact sheets and complete homepage screenshots were visually inspected. The normal-motion opening was separately captured and tested.

| Viewport | First refinement | Round two |
| --- | --- | --- |
| Desktop, 1440px | [Before](screenshots/refinement-before-desktop.webp) | [After](screenshots/refinement-after-desktop.webp) |
| Tablet, 768px | [Before](screenshots/refinement-before-tablet.webp) | [After](screenshots/refinement-after-tablet.webp) |
| Mobile, 390px | [Before](screenshots/refinement-before-mobile.webp) | [After](screenshots/refinement-after-mobile.webp) |

The homepage's captured height falls from 3926px to 3005px on desktop and from 4661px to 3599px on mobile, about 23% shorter at both widths. The opening is given more presence while the rest of the reading sequence becomes more economical. These are measured layout dimensions, not conversion results.

## Validation

- Static build/check: nine pages and 200 local link/asset references pass; headings, metadata, JSON-LD, local fragments, image alternatives/dimensions, and CSS asset references are checked.
- Cross-browser QA: **216 layouts** across Chromium 153.0.8010.12, Firefox 155.0, and WebKit 26.6. Tested widths: 320, 375, 390, 768, 1024, 1366, 1440, and 1920px. No horizontal overflow or missing resources; no runtime errors.
- **18 axe-core 4.10.3 accessibility checks** pass with zero reported violations, including the visible-label/accessible-name check. Keyboard FAQ behavior, menu open/Escape/focus return, desktop resize, reduced motion, no-JavaScript navigation/FAQ, and nested 404 recovery pass.
- **43 focused checks** pass: source biography integrity, finite entrance animation, title visibility under reduced motion, non-overlapping captions at nine widths, readable tablet menu, real clipboard write, clipboard failure recovery, legal-footer navigation/history, and all Amazon destinations matching configuration.
- Privacy and Terms each resolve to their actual pages; browser Back returns to contact. Contact has no form, and no code claims a message has been sent. The copy status is shown only after the Clipboard API succeeds; failure leaves a usable control and an explicit fallback.
- Node syntax, Python compilation, and Git whitespace checks pass. The existing GitHub Pages workflow and deployment configuration are unchanged.

Automated checks do not establish exhaustive WCAG conformance. Screen-reader evaluation, physical-device testing, and production-network measurements remain outside this local review.

### Performance conditions and results

See [refinement-lab-results.json](refinement-lab-results.json) for final measurements, browser details, settings, warnings, and test summaries. Lighthouse 12.8.2 ran on local HTTP servers with HeadlessChrome 156 and its default simulated mobile configuration: 412 × 823, DPR 1.75, 4× CPU slowdown, 150ms RTT, and approximately 1.6Mbps throughput. The baseline is an archive of `0b21233`, not the original Atelier scaffold. Results are individual local lab runs, not field Core Web Vitals or a statistical performance study. The browser suites finished before the final product-page measurement.

The first-round homepage measured 99/100/100/100 (performance/accessibility/best practices/SEO), with 1.9s LCP, 60ms TBT, and zero CLS. The refined photographic homepage measures **97/100/100/100**, **2.3s LCP**, **0ms TBT**, and **0 CLS**. The new photo/entrance composition adds some LCP time while remaining within the 2.5s lab target; the removal of synchronous layout work eliminates the measured blocking time in this run. INP is not claimed; TBT is a distinct laboratory metric.

| Mobile lab page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| First-round homepage | 99 | 100 | 100 | 100 | 1.9s | 60ms | 0 |
| Refined homepage | 97 | 100 | 100 | 100 | 2.3s | 0ms | 0 |
| Refined book page | 98 | 100 | 100 | 100 | 1.8s | 0ms | 0 |

## Remaining author decisions

The inherited email address, paperback metadata, and intended public canonical domain still need owner confirmation before publication. The contact flow cannot confirm mailbox deliverability or email delivery. Existing legal copy should reflect the eventual hosting and email arrangements.

All local purchase links are checked against the preserved Amazon URLs. Live attempts to fetch the book and author pages returned service errors (500/503) in this environment, so stock, edition availability, checkout, and live retailer status are not certified. The supplied 267 × 425 cover is presented without synthetic upscaling; a publisher-provided larger cover would improve high-density rendering.

Work is isolated on `feat/editorial-refinement`. No push, merge, PR creation, production deployment, workflow modification, or DNS change was performed. The owner's untracked `new design.md` remains untouched.

## Reproduce and preview

```powershell
npm run build
npm run check
npm run preview
# With optional Playwright, Pillow, browser binaries, and axe-core available:
python scripts/qa.py --url http://127.0.0.1:8000/comonline/ --axe-path PATH/TO/axe.min.js
python scripts/refinement-qa.py
python scripts/capture.py
node scripts/report.mjs artifacts/round-two
```

The biography comparison is included when `--baseline-url` is passed to `refinement-qa.py` with a server hosting the first-round archive. Runtime reports, complete PNGs, and opening animation frames are in ignored `artifacts/round-two/` and `artifacts/qa/`. The committed WebP comparisons and JSON summary preserve review evidence without shipping test dependencies to the website.
