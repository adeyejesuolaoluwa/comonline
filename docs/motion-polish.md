# Cinematic motion and visual polish

Work is local on `feat/cinematic-motion-polish`, based on the approved cinematic master pass. The palette, fonts, page order, authentic biography, original images, and retailer URLs are preserved. No push, deployment, workflow change, or main-branch update was performed.

## Implemented

- Hero: the portrait veil opens over 1.1 seconds, headline lines are separated by 140 ms, and controls settle after the headline starts. The book rises gently past its resting position and settles within 1.8 seconds. There is no continuous floating animation.
- Reading: chapter headings reveal individually when visible. The biography retains all four original paragraphs, with a cobalt drop cap, chapter rules, and a sticky index that identifies the chapter in the reading area. The homepage author summary gains editorial serif emphasis without changing its wording.
- Book objects: layered contact and ambient shadows give the existing cover and perspective more convincing depth, including the final invitation.
- Finale: a GSAP 3.14.2 ScrollTrigger timeline reveals the title, then settles the invitation paragraph 240 ms later. GSAP and ScrollTrigger are vendored locally and load only as the finale approaches. A native reveal remains available on failed loading or rapid scrolling. No pinning, scroll hijacking, or moving purchase controls.
- Existing gentle desktop portrait parallax remains CSS scroll driven, with a static fallback in engines without support. No added JavaScript parallax loop.
- Reduced motion skips entrance setup and lazy library loading. Changing the preference while viewing the site cancels native animations and reverts the GSAP timeline. All text and links retain normal document flow. No-JavaScript reading and navigation remain usable.

Implementation follows the [official ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Vendor versions and license links are recorded in `assets/js/vendor/README.md`.

## Browser evidence

Final rendered Chromium screenshots:

| Page | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Homepage | [1440 px](screenshots/polish-index-desktop.webp) | [768 px](screenshots/polish-index-tablet.webp) | [390 px](screenshots/polish-index-mobile.webp) |
| Biography | [1440 px](screenshots/polish-authors-desktop.webp) | [768 px](screenshots/polish-authors-tablet.webp) | [390 px](screenshots/polish-authors-mobile.webp) |

Completed-state screenshots use reduced motion so long-page captures show all content. Additional normal-motion finale captures and the approved-state baseline remain in ignored `artifacts/motion-polish/`. Screenshot inspection covered the home and biography composition on desktop and phone, including cover captions and final purchase controls.

## Validation

Results are recorded in `docs/motion-polish-results.json`:

- Static build/check: 9 pages, 202 local links/assets, metadata/schema/image checks passed.
- General browser QA: 216 layouts, 18 axe scans, 33 interaction checks; no failures or unavailable engines.
- Scene QA: 210 checks passed, including 54 enlarged-text cases.
- Content/contact/retailer/motion regression suite: 42 checks passed.
- Focused motion QA: startup without GSAP, lazy timeline load/completion, live reduced-motion reversion, chapter navigation, and failed-library mobile fallback pass in all three engines.
- Final Lighthouse 12.8.2 simulated mobile: **97 performance / 100 accessibility / 100 best practices / 100 SEO**. LCP **2.3 s**, TBT **0 ms**, CLS **0**. Local Headless Chrome, default mobile simulation. This is a lab observation, not a controlled field-performance comparison. An earlier eager-library diagnostic measured 83 performance; libraries were subsequently deferred and the final run was taken without concurrent browser suites.

Commands:

```powershell
npm run build
npm run check
python scripts/qa.py --url http://127.0.0.1:8000/comonline/ --axe-path PATH/TO/axe.min.js
python scripts/master-pass-qa.py
python scripts/refinement-qa.py --out artifacts/motion-polish
python scripts/motion-polish-qa.py
```

The general suite covers nine pages at eight widths in Chromium, Firefox, and WebKit, plus keyboard navigation, native FAQ behavior, no-JavaScript fallback, branded 404, runtime failures, and axe. The scene suite checks purchase-control flow/hit testing, typography, parallax, reduced motion, repeated scrolling, and 200% text at 320 and 1440 px across all nine pages. Focused motion checks exercise lazy GSAP loading, timeline completion, live reduced-motion changes, and chapter-index accuracy in all three engines.

The root-URL diagnostic run reported three 404-return URL mismatches because the branded 404 intentionally uses the configured `/comonline/` base. The suite passed when run against that configured base; no routing behavior was changed to satisfy the test.

## Remaining limitations

Automated emulation is not physical-device or assistive-technology certification. Firefox keeps the intended static portrait fallback. The book float is a finite entrance rather than a perpetual loop. Browser screenshots cannot convey timing; use the local preview with normal motion to review choreography. Lab Lighthouse measurements are single simulated-mobile runs, not field Core Web Vitals or INP. The public domain, mailbox delivery, and live retailer stock/checkout remain owner/external verification items inherited from the approved foundation.

## Phone arrangement follow-up

Reviewed all nine phone-page screenshots and refined only the narrow-screen layout (520 px and below): hero actions now stack with a full-width primary button and a separate 44 px secondary target; the final purchase button also fills the available width; the homepage author summary uses 24/32 px type; footer navigation retains 44 px tap height. Desktop composition and content remain unchanged.

[Updated 390 px homepage screenshot](screenshots/phone-review-home.webp). Raw captures for all pages at 390 px are available locally in `artifacts/phone-review/`.

Validation: 162 phone layouts passed across Chromium, Firefox, and WebKit at 320, 360, 375, 390, 414, and 430 px, covering all nine pages. Hero actions remain stacked with a 44 px secondary target; no horizontal overflow. `npm run check` also passed. These are browser viewport checks rather than physical-device certification.
