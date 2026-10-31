# Portrait edge refinement

The former short linear fades created a blurred seam on desktop and a pale band through the hair on mobile. The portraits now sit directly on the existing cream backgrounds through a subject-shaped alpha mask instead.

The visible portrait remains the original owner-supplied photograph, including its actual facial detail and colors. The built-in image generation tool produced a background-removal cutout; only its alpha channel is used by CSS. The generated RGB portrait is not displayed. The mask is saved as `assets/img/pj-ray-portrait-mask.svg` with an embedded optimized WebP alpha source, and the original JPEG/WebP photograph files remain unchanged.

Mask sizing and position follow the photograph's responsive object position, including phone and tablet crops. The author-page portrait uses contain sizing to retain the full head. The mask feathers only the outer cropped clothing edges below the face, avoiding a rectangular shoulder cutoff. Existing captions, hero/book placement, entrances, and reduced-motion behavior remain intact. The mask works without JavaScript. Browsers without CSS mask support retain the original photograph.

The generation prompt is recorded in `portrait-mask-prompt.txt`. The original generated source is retained locally under `output/imagegen/pj-ray-portrait-mask-source.png`.


Validation: 24 portrait layouts passed across Chromium, Firefox and WebKit at 320, 390, 768 and 1440 px, including full-color display, successful alpha-mask decoding, no horizontal overflow or runtime errors, and normal-motion rendering. Static checks passed for nine pages and 202 links/assets. Screenshots were inspected in Chromium, Firefox and WebKit.

[Homepage desktop](screenshots/blend-home-desktop.webp) ? [Homepage phone](screenshots/blend-home-mobile.webp) ? [Author desktop](screenshots/blend-author-desktop.webp) ? [Author phone](screenshots/blend-author-mobile.webp)
