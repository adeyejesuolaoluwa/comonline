# Refine the memoir experience with native motion and a cinematic ending

The site retains its cream/charcoal/cobalt identity, photographic split hero, original portrait and cover, serif typography, and minimal navigation. The opening now coordinates a portrait unmask, headline lines, jacket depth, CTA entrance, and progressive desktop parallax. One-shot native scene sequences connect the story, spotlight, author, and a substantial “The story continues” finale with a direct Amazon purchase path.

The spotlight uses explicit grid rows and a static purchase control, eliminating dependence on animated inline text flow. The repetitive homepage author heading is replaced and its summary shortened; the four original full-biography paragraphs are preserved exactly. Content-driven hero sizing, intrinsic grid sizing, flexible metadata, and wrapping prevent overlap and overflow at 200% text size. Touch devices receive simpler book motion, unsupported browsers retain a static parallax fallback, and reduced motion cancels native and CSS effects. No runtime animation dependency was added.

Validation passes: 216 standard layouts across Chromium/Firefox/WebKit; 18 axe scans with zero reported violations; 210 scene, CTA timing/hit-test, text-integrity, reduced-motion, and enlarged-text checks; and 43 interaction/content checks. Local mobile Lighthouse scores are 97/100/100/100 for the homepage and 98/100/100/100 for the book page, both with zero measured TBT and CLS. See [before/after images, scene captures, and measurement conditions](cinematic-master-pass.md).

The inherited email, edition data, canonical public URL, and legal copy require owner confirmation before publication. Live checkout and email deliverability are not certified. Original media and retailer destinations are unchanged. Work is on `feat/cinematic-master-pass`; production workflow and DNS are unchanged, with no push, merge, deployment, or PR creation performed.

Preview: `npm run build`, `npm run check`, `npm run preview`.
