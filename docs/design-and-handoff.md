# Living with Bipolar: redesign and owner handoff

The current implementation is documented in [Cinematic master pass](cinematic-master-pass.md). [Creative refinement](creative-refinement.md) records the earlier photographic direction. The initial decisions below remain architectural context; the current report supersedes older composition and motion descriptions.

## Audit and implementation decision

The original repository was a six-page static site, developed from an Atelier publishing scaffold. Git history showed the transition from a multi-book template to a single memoir. Every page, the shared CSS and JavaScript, image assets, README, and Pages workflow were reviewed. The only pre-existing local change was the untracked `new design.md` brief; it remains outside the implementation commits.

Baseline browser inspection reproduced `Cannot set properties of null (setting 'textContent')` on page initialization. The shared script referenced a countdown that no page contained. That exception prevented later event handlers, including form submission, from being installed. Other issues included a search overlay without search logic, an unconnected contact form, unattributed testimonials, an absent favicon, incorrect FAQ markup, mobile display rules that overrode menu visibility, obsolete styling, repeated navigation, and stale documentation.

**Architecture:** retain static HTML rather than introduce a client framework. A zero-dependency Node build composes shared layout and metadata with page bodies. Generated HTML is committed at the original URLs. The existing Pages workflow can continue serving the root without installing Node or running a build. No production deployment settings, DNS, or workflow permissions were changed.

**Design:** a literary editorial composition rather than a dashboard or card grid. Warm paper, ink, and cobalt sampled from the existing book cover; Cormorant Garamond for literary headings and Manrope for readable supporting text. Both fonts are served locally with OFL licenses. The original portrait forms the photographic opening, with the book crossing its seam. The dedicated book page uses a warm paper stage. The real portrait remains the only author photograph.

The original page URLs, author biography, synopsis, paperback details, portrait, cover, and Amazon book/author links are preserved. “What We Write” is now called “The story” in navigation, at the same URL. Unattributed endorsements were replaced with an invitation for readers to respond. No ratings, endorsements, publication history, or medical outcomes were invented.

## Design system

- Paper `#f6f4ef`; secondary paper `#eeece5`; ink `#20211f`; secondary text `#62635f`; cobalt `#253eb9`; rules `#d5d4cc`; dark panels `#181818`.
- Spacing uses a 4/8/12/16/24/32/40/48/64/80/96px rhythm. Main content has a 1328px maximum width.
- Headings use an editorial serif scale with breakpoint changes; body copy is 16px and supporting copy varies by role. Wide screens use paired columns; phones use a single reading sequence.
- Buttons and controls have visible hover, active and keyboard focus states. Links retain native browser behavior. Outbound purchases identify Amazon and announce new tabs to assistive technology.
- Scroll reveals use IntersectionObserver and transforms/opacity. Initial viewport content is never delayed. No scroll listeners, scroll manipulation, autoplay, custom cursor, flashing, or WebGL.
- Words in the standalone statement become readable in sequence when observed. Reduced motion displays everything immediately. Keyboard focus makes any pending reveal visible. Reading, navigation, email, and native FAQ interactions work with JavaScript disabled.

## Content and services to confirm before publication

1. **Contact address:** `hello@pjraybooks.com` is inherited from the repository. Mailbox ownership and deliverability have not been verified. Update `site.config.json` if necessary. There is no form endpoint or pretend submission state. Email links open the visitor's mail application; the website cannot confirm email delivery.
2. **Paperback facts:** the existing 257 pages, April 27, 2026 publication date, English language, and 6 × 0.58 × 9 inch dimensions are retained. These are existing editorial data, not independently certified retailer facts. The visitor is directed to the retailer for edition and availability confirmation. No price or availability guarantee is encoded in structured data.
3. **Canonical origin:** `site.config.json` defaults to the repository's expected Pages project URL, `https://adeyejesuolaoluwa.github.io/comonline/`. This is a configuration assumption, not a claim that the site is live there. Confirm the actual public URL before release. If using Comonline.com or another custom domain, change this value and rebuild. It controls canonicals, schema IDs, sharing image URLs, sitemap, robots, and the 404 base path.
4. **Legal copy:** privacy and terms explain the implemented static site and external purchase/email paths. The owner should confirm they reflect hosting, email handling, and copyright ownership. They do not claim an invented retention policy or contractual guarantee.
5. **Retailer links:** original URLs are preserved. Checkout, shipping, price, customer service, and edition availability belong to Amazon. Live retailer checkout was not exercised.

## Safe owner review and deployment

Run `npm run build`, `npm run check`, and `npm run preview`, then open `http://127.0.0.1:8000`. Node 20 or later is sufficient; no package installation is needed. The preview supports both `/` and the configured Pages subdirectory. It serves a real HTTP 404 for unknown public paths.

Review all nine generated pages (the original six, privacy, terms, and 404), the screenshots, configuration, and content notes. Rebuild after changes to `src/` or configuration. Commit the regenerated root HTML alongside source changes. Submit the feature branch for owner review when authorized; do not merge directly into `main`.

The existing workflow deploys root files on a push to `main`. It was retained as requested. The repository owner should separately review its older action versions and Pages configuration before choosing to release. No workflow run, deployment, push, PR creation, merge, or DNS change was performed for this redesign.

Local commits use the explicit agent identity `Codex <codex@local.invalid>` because no Git author was configured. No repository or global Git identity settings were changed. The current work is on `feat/cinematic-master-pass`, based on the preceding refinement branch.

## Files and maintenance

- `src/layout.html`: shared accessible header, footer, and document metadata.
- `src/pages/*.html`: page content and composition.
- `scripts/build.mjs`: generates the nine root HTML files plus sitemap and robots.
- `assets/css/styles.css`: visual system, responsive layouts, reduced motion, print styling.
- `assets/js/app.js`: navigation and progressive motion enhancements.
- `assets/fonts/`: local variable fonts and licenses.
- `assets/img/`: original images plus responsive/optimized derivatives, favicon, and sharing card.
- `scripts/check.mjs`: static links, asset availability, headings, metadata, and schema checks.
- `scripts/qa.py`: optional Playwright cross-browser layout, accessibility, interaction, and screenshot checks.
- `scripts/prepare-assets.py`: optional regeneration of image derivatives and local fonts. Requires Pillow; social card generation uses Windows Georgia/Segoe UI fonts. It is not part of the build or deployment.

See `docs/validation.md` for measured results and limitations, and `docs/pull-request.md` for the prepared review description.
