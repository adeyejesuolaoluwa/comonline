# Create a photographic editorial experience for P.J. Ray's memoir

Visitors now meet the person and the book together in a split-screen opening using the original author portrait and paperback cover. The reading sequence moves through the story, book, and author with fewer repeated sections. The biography is an indexed long read, the product has a dedicated paper stage, and FAQ/contact pages provide direct, accessible answers and correspondence paths.

The static architecture remains compatible with GitHub Pages. A zero-dependency Node generator shares layout and metadata across the original six pages plus privacy, terms, and 404. Local fonts, responsive photographs, native FAQ disclosure, readable tablet navigation, finite reduced-motion-aware animation, SEO metadata, and schema replace the incomplete scaffold behavior. The biography, synopsis, edition data, and original Amazon URLs are preserved; no reviews or ratings are invented. Contact uses email links and a tested clipboard control, with no simulated send success.

Validation: nine-page static checks pass; 216 layouts across Chromium/Firefox/WebKit pass; 18 axe checks report zero violations; and 43 focused checks cover biography integrity, motion, composition, tablet navigation, clipboard success/failure, legal routes/history, and retailer destinations. Final local mobile Lighthouse scores are 97/100/100/100 for the homepage and 98/100/100/100 for the book page, with zero measured CLS and TBT. See [audit, screenshots, and measurement conditions](creative-refinement.md).

Before release, confirm the inherited email, edition metadata, canonical public URL, and legal copy. Live retailer fetches failed in this environment, so the unchanged URL destinations are verified but checkout and availability are not. The production workflow and DNS are unchanged. Work is on `feat/editorial-refinement`; no push, merge, deployment, or PR creation has been performed.

Preview with `npm run build`, `npm run check`, and `npm run preview`.
