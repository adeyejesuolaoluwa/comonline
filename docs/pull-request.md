# Redesign Living with Bipolar as an editorial author website

The previous single-book site retained a publishing scaffold, unfinished search/form UI, unattributed testimonials, and a countdown exception that interrupted initialization. This change gives all six original pages a consistent literary identity, a clear path from the memoir to its author and Amazon listing, and accessible interactions that continue to work without JavaScript.

The design uses paper, ink, and cover-derived cobalt; serif editorial headings; the original book cover and portrait; CSS book depth; and restrained, reduced-motion-aware reveals. “What We Write” becomes “The story” without changing its URL. Native FAQ disclosure, working mobile navigation, an explicit email contact path, local licensed fonts, responsive portraits, metadata/schema, sitemap, privacy/terms, and a branded 404 replace incomplete scaffold features.

Static HTML remains the deployed output. A zero-dependency Node generator shares document layout and metadata across pages. The existing GitHub Pages workflow is unchanged. The original biography, synopsis, edition data, and Amazon URLs are retained. No invented reviews or ratings are included.

Validation: static checks pass; 216 layouts across Chromium/Firefox/WebKit pass; 18 axe checks report zero violations; menu, keyboard FAQ, focus, resize, reduced motion, no-JS fallbacks, and nested 404 behavior are covered. Local mobile Lighthouse scores are 98/100/100/100 for the homepage and 100/100/100/100 for the book page. See [measurement conditions and screenshots](validation.md).

Before release, confirm the inherited email, paperback metadata, canonical public URL in `site.config.json`, and legal copy. The contact page opens the visitor's email app; it does not provide a form backend. The owner should review the existing workflow's older action versions separately. No deployment or DNS changes are part of this work.

Preview with `npm run build`, `npm run check`, and `npm run preview`. See [design and owner handoff](design-and-handoff.md) for the source map and release details.
