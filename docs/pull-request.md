# Refine responsive composition and correct premature phone reveals

On narrow screens, the hero book competed with the portrait and the homepage author summary felt oversized. Some scroll animations were triggered by a whole section, so the closing book could finish moving before it became visible. This pass reduces the phone book to 96?112 px with a 4-degree resting angle, uses 20/28 px mobile summary text, tightens the desktop author composition, and observes each animated subject independently.

The approved page structure, content, photography, artwork, navigation, palette, and retailer links remain intact. Existing cinematic hero and lazy GSAP closing choreography are retained. Purchase controls stay stationary; reduced motion and no-JavaScript presentation remain supported.

Validation: 216 responsive layouts, 18 axe scans, 33 interaction checks, 210 scene/enlarged-text checks, 42 content/link regressions, and focused motion/failure-fallback checks across Chromium, Firefox, and WebKit passed. See [final screenshots, measured performance, and limitations](production-finish.md).

Contributor branch: `feat/cinematic-motion-polish`. No push, merge, or deployment performed.
