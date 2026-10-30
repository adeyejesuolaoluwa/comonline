# Refine cinematic motion and biography within the approved design

The approved author site needed more deliberate entrance timing and stronger biography presentation. This pass retimes the existing hero mask and headline, gives the book a finite floating settle, refines book shadows, and adds chapter divisions, an opening drop cap, and an active biography index without changing verified wording, purchase links, palette, typography, or page order.

A locally vendored GSAP/ScrollTrigger timeline choreographs the final title and invitation. It loads only near the finale, with native fallback. Controls stay in normal flow; reduced-motion changes cancel/revert motion.

Validation: static checks; 216 browser layouts, 18 axe scans, 33 interactions; 210 scene/enlarged-text checks; 42 regression checks; focused lazy-loading, reduced-motion, chapter and failed-library checks across Chromium/Firefox/WebKit. Final simulated-mobile Lighthouse: 97/100/100/100, LCP 2.3 s, TBT 0 ms, CLS 0. See [full evidence and limitations](motion-polish.md).

Local contributor branch: `feat/cinematic-motion-polish`. No push, merge, deployment, or workflow change. Physical-device/assistive-technology certification, public URL/mailbox verification, and retailer checkout remain outside local testing.
