# Validation — October 30, 2026

This file records the **first redesign**. Current round-two results and before/after comparisons are in [Creative refinement](creative-refinement.md) and [refinement-lab-results.json](refinement-lab-results.json).

## Automated checks

- `npm run build`: generates nine static HTML pages, sitemap, robots.txt, and `.nojekyll` with no runtime dependencies.
- `npm run check`: passes for nine pages and 193 local link/asset references, with heading, metadata, structured-data, image-alt/dimension, fragment, and CSS-asset checks.
- Node syntax checks for the build, server, and application script pass. Python QA and asset scripts compile. `git diff --check` passes.
- Playwright: nine pages × eight widths × three browser engines = **216 layout checks**. Widths: 320, 375, 390, 768, 1024, 1366, 1440, and 1920px. No horizontal overflow.
- Chromium, Firefox, and WebKit: mobile menu open/close, Escape/focus return, desktop resize, native FAQ Enter/Space, no-JavaScript reading/navigation/FAQ, and completion of scroll/word reveals pass.
- Axe-core 4.10.3: **18 checks** (nine pages × mobile/desktop), with zero reported violations. Includes WCAG 2 A/AA, WCAG 2.1 A/AA, WCAG 2.2 AA, best-practice tags, and the accessible-name/visible-label check.
- Browser runtime-error and failed-resource checks pass for all pages. The local preview additionally checks the Pages subdirectory and branded HTTP 404 behavior for nested missing routes.

Browser versions and raw summaries are recorded in [lab-results.json](lab-results.json). Passing automated checks is not a claim of exhaustive WCAG conformance. Screen-reader testing with assistive technology and physical-device testing remain owner release checks.

## Lighthouse mobile lab measurements

Lighthouse 12.8.2, Windows, local HTTP server, HeadlessChrome 156. Default simulated mobile throttling: 412 × 823 viewport, DPR 1.75, 150ms RTT, approximately 1.6Mbps throughput, 4× CPU slowdown. One recorded successful run per final representative page. Baseline uses an archive of original commit `fb51d70` with its original CDN resources. The redesigned site uses the Node preview. These are localhost lab comparisons, not deployed-site field measurements or a controlled statistical study.

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Original homepage | 84 | 98 | 96 | 100 | 3.6s | 0ms | 0 |
| Redesigned homepage | 98 | 100 | 100 | 100 | 1.7s | 40ms | 0 |
| Redesigned book page | 100 | 100 | 100 | 100 | 1.7s | 0ms | 0.003 |

The final runs include a Lighthouse warning that the host CPU is slower than its expected calibration. Background browser QA also ran on this host. The warning and complete settings are preserved in the JSON summary. Results vary by machine and network. The first attempted audit encountered an interstitial caused by a local preview path-guard bug; it was fixed and that failed run is excluded from the table.

No field Core Web Vitals are available. INP requires real interactions/field data and is not substituted with TBT. The original 267 × 425 cover is retained without synthetic upscaling; a higher-resolution publisher asset would improve sharpness on high-density screens. Font swapping and responsive images reserve their layout space. Actual caching and compression on GitHub Pages require a post-deployment check.

## Visual review

Full-page desktop and mobile screenshots of every page were captured in all three browser engines. Desktop and mobile contact sheets were inspected, as were the complete homepage captures. Review confirmed the original cover is not cropped, the portrait remains the supplied photograph, long copy stays readable, and contact/FAQ/purchase paths remain clear.

- [Original desktop homepage](screenshots/before-desktop.webp)
- [Redesigned desktop homepage](screenshots/after-desktop.webp)
- [Original mobile homepage](screenshots/before-mobile.webp)
- [Redesigned mobile homepage](screenshots/after-mobile.webp)

Complete PNG screenshots, browser reports, and raw Lighthouse JSON are in ignored `artifacts/` in the working copy. Reproduce browser checks with the commands in the README; `node scripts/report.mjs` collects available browser and Lighthouse reports into `artifacts/summary.json`.

## Functional and editorial limits

All local navigation, image requests, and purchase URL markup were checked. Amazon checkout, live stock, shipping, edition accuracy, and mailbox deliverability were not tested. The existing email and paperback metadata need owner confirmation, as does the canonical public URL. The form was replaced with a real email link; no message delivery or success state is simulated. Privacy/terms are provided for owner review.

Production hosting, workflow execution, DNS, publication, and authenticated external services were not changed or exercised. See [handoff notes](design-and-handoff.md).
