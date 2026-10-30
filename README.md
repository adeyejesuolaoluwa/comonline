# Living with Bipolar — P.J. Ray

A static, editorial author website for P.J. Ray's memoir. Built with semantic HTML, custom CSS, and progressive vanilla JavaScript. No framework, runtime CDN requests, analytics, cookies, or database. The homepage uses locally vendored GSAP 3.14.2 and ScrollTrigger for the finale; the build requires no package installation.

The second creative pass adds a photographic split opening, a shorter narrative, indexed biography, distinct book presentation, readable tablet navigation, and finite motion. See the [round-two audit, comparisons, and validation](docs/creative-refinement.md).

The [cinematic master pass](docs/cinematic-master-pass.md) preserves that direction and adds a portrait unmask, native scene choreography, progressive desktop parallax, stable spotlight controls, enlarged-text fixes, and a substantial “The story continues” finale. It includes current measurements and before/after scene captures.

The current [motion and visual-polish pass](docs/motion-polish.md) preserves the approved foundation and documents the latest implementation, screenshots, and validation.

The [final production refinement](docs/production-finish.md) records the current responsive composition, per-subject motion timing, and browser verification.

## Preview

Requires Node.js 20 or later. No install step is needed.

```powershell
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:8000. Set `PORT` to use another port. The preview also supports the subdirectory configured in `site.config.json` and returns the branded 404 for missing pages.

## Edit

- Update page content in `src/pages/`.
- Update shared navigation, footer, and head in `src/layout.html`.
- Set the public URL, email, and retailer links in `site.config.json`.
- Style in `assets/css/styles.css`; interactions in `assets/js/app.js`.
- Run `npm run build` and commit generated root HTML as well as source files.

The build uses Node's standard library. Original paths (`authors.html`, `books.html`, `what-we-write.html`, `faq.html`, and `contact.html`) are retained. “What We Write” appears as “The story” in navigation.

## Contact and content

Contact is an honest `mailto:` path, not a submission form. The original email address must be confirmed by the owner. Existing paperback metadata is preserved; the retailer remains authoritative for the edition being purchased. There are no invented testimonials or ratings.

**Before release:** confirm the public URL, email address, paperback data, and privacy/terms copy. The configured URL is the expected GitHub Pages project URL; it is not a verified live deployment. See [owner handoff](docs/design-and-handoff.md).

## Validation

```powershell
npm run check
# Optional browser QA (separate developer tooling):
python -m pip install playwright
python -m playwright install
python scripts/qa.py --axe-path PATH/TO/axe.min.js
python scripts/refinement-qa.py
python scripts/master-pass-qa.py
python scripts/motion-polish-qa.py
# Optional full-page review captures also require Pillow:
python scripts/capture.py
```

The browser suite covers nine pages at 320, 375, 390, 768, 1024, 1366, 1440, and 1920px across Chromium, Firefox, and WebKit. Screenshots and reports go to ignored `artifacts/qa/`. The axe argument is optional; supply an axe-core installation to run accessibility checks as well. See [validation results](docs/validation.md).

## Deployment

Generated root files remain compatible with the existing GitHub Pages workflow. No production deployment or DNS settings were changed. Owner review and merge are required before the existing workflow publishes from `main`. Confirm the base URL and review the existing workflow's action versions before release.

[Design and handoff](docs/design-and-handoff.md) · [Prepared PR description](docs/pull-request.md)
