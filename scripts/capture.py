"""Capture rendered page reviews: python scripts/capture.py --out artifacts/round-two/after.
Requires Playwright and Pillow. Reduced motion shows the completed visual state.
"""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageOps, ImageDraw

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:8000/comonline/')
parser.add_argument('--out', type=Path, default=Path('artifacts/round-two/after'))
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
slugs = ['index', 'authors', 'books', 'what-we-write', 'faq', 'contact', 'privacy', 'terms', '404']
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(reduced_motion='reduce')
    for width in [1440, 768, 390]:
        for slug in slugs:
            page.set_viewport_size({'width': width, 'height': 1000 if width > 760 else 844})
            page.goto(args.url + slug + '.html', wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            page.evaluate('document.querySelectorAll("img").forEach(img => img.loading="eager")')
            page.evaluate('Promise.all([...document.images].map(img => img.decode().catch(() => {})))')
            page.screenshot(path=str(args.out / f'{slug}-{width}.png'), full_page=True)
        sheet = Image.new('RGB', (1200, 2700), '#d5d4cc')
        draw = ImageDraw.Draw(sheet)
        for i, slug in enumerate(slugs):
            thumb = ImageOps.contain(Image.open(args.out / f'{slug}-{width}.png'), (390, 860))
            sheet.paste(thumb, ((i % 3) * 400, (i // 3) * 900 + 24))
            draw.text(((i % 3) * 400 + 8, (i // 3) * 900 + 8), slug, fill='black')
        sheet.save(args.out / f'review-{width}.jpg')
    browser.close()
print('Captured all nine pages at desktop, tablet and mobile.')
