"""Round-two motion, contact, legal navigation and composition checks."""
import json
import argparse
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/round-two'
OUT.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:8000/comonline/')
parser.add_argument('--baseline-url', default=None)
args = parser.parse_args()
URL = args.url
config = json.loads((ROOT / 'site.config.json').read_text(encoding='utf8'))
checks = []

def check(condition, description):
    assert condition, description
    checks.append(description)

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(permissions=['clipboard-read', 'clipboard-write'])
    page = context.new_page()
    if args.baseline_url:
        baseline = context.new_page()
        baseline.goto(args.baseline_url + 'authors.html', wait_until='networkidle')
        original_bio = [re.sub(r'\s+', ' ', text).strip() for text in baseline.locator('.prose p').all_text_contents()]
        page.goto(URL + 'authors.html', wait_until='networkidle')
        refined_bio = [re.sub(r'\s+', ' ', text).strip() for text in page.locator('.prose p').all_text_contents()]
        check(original_bio == refined_bio and len(refined_bio) == 4, 'All four original author biography paragraphs are preserved exactly')
        baseline.close()
    page.set_viewport_size({'width': 1440, 'height': 900})
    page.goto(URL, wait_until='domcontentloaded')
    check(page.evaluate('document.getAnimations().some(a=>a.playState==="running")'), 'First-load animation is active')
    page.screenshot(path=str(OUT / 'entrance-start.png'))
    page.wait_for_timeout(2000)
    check(not page.evaluate('document.getAnimations().some(a=>a.playState==="running")'), 'Entrance finishes; no continuous animation')
    page.screenshot(path=str(OUT / 'entrance-complete.png'))
    for width in (320, 375, 390, 412, 768, 1024, 1366, 1440, 1920):
        page.set_viewport_size({'width': width, 'height': 900})
        page.wait_for_timeout(80)
        check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'{width}px: no horizontal overflow')
        boxes = page.evaluate('''() => {
          const book=document.querySelector('.hero-book').getBoundingClientRect();
          const label=document.querySelector('.hero-portrait figcaption > span:last-child').getBoundingClientRect();
          const caption=document.querySelector('.hero-portrait figcaption > span:first-child');
          const rect=caption.getBoundingClientRect();
          const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
          return {labelClear:!overlaps(book,label),captionClear:getComputedStyle(caption).display==='none'||!overlaps(book,rect)};
        }''')
        check(boxes['labelClear'] and boxes['captionClear'], f'{width}px: book does not cover portrait captions')
    page.set_viewport_size({'width': 768, 'height': 1024})
    check(page.locator('.menu-toggle').is_visible(), 'Tablet has an appropriately sized menu control')
    page.locator('.menu-toggle').click()
    check(page.locator('#primary-nav > a').first.evaluate('(el)=>parseFloat(getComputedStyle(el).fontSize)') >= 16, 'Tablet navigation text is at least 16px when open')
    page.keyboard.press('Escape')
    page.goto(URL + 'contact.html', wait_until='networkidle')
    check(page.locator('form').count() == 0, 'Contact has no unconnected submission form')
    check(page.locator('.email-link').get_attribute('href') == 'mailto:' + config['email'], 'Email destination matches site configuration')
    page.locator('[data-copy-email]').click()
    page.wait_for_function('document.getElementById("copy-status").textContent === "Email address copied."')
    check(page.evaluate('navigator.clipboard.readText()') == config['email'], 'Copy confirmation follows a real clipboard write')
    page.evaluate('() => { navigator.clipboard.writeText = async () => { throw new Error("Permission denied for test"); }; }')
    page.locator('[data-copy-email]').click()
    page.wait_for_function('document.getElementById("copy-status").textContent.startsWith("Could not copy.")')
    check(page.locator('[data-copy-email]').is_enabled(), 'Clipboard error is visible and leaves a usable control')
    for slug, title in [('privacy', 'Privacy.'), ('terms', 'Website terms.')]:
        page.locator(f'.footer-bottom a[href="{slug}.html"]').click()
        check(page.locator('h1').inner_text() == title, f'{slug}: footer opens the actual legal page')
        page.go_back()
        check(page.url.endswith('contact.html'), f'{slug}: browser history returns to contact')
    for slug in ('index', 'authors', 'books', 'what-we-write', 'faq', 'contact', 'privacy', 'terms', '404'):
        page.goto(URL + slug + '.html', wait_until='domcontentloaded')
        links = page.locator('a[href*="amazon.com"]').evaluate_all('(els)=>els.map(el=>el.href)')
        check(all(url in [config['amazon'], config['amazonAuthor']] for url in links), f'{slug}: all Amazon destinations match preserved URLs')
    page.emulate_media(reduced_motion='reduce')
    page.goto(URL, wait_until='domcontentloaded')
    check(not page.evaluate('document.getAnimations().some(a=>a.playState==="running")'), 'Reduced motion prevents entrance animation')
    check('motion-ready' not in page.locator('html').get_attribute('class'), 'Reduced motion avoids first-load motion setup')
    check(page.locator('.hero-title').is_visible(), 'Reduced motion keeps the headline visible immediately')
    browser.close()

result = {'checks': len(checks), 'passed': checks}
(OUT / 'interaction-report.json').write_text(json.dumps(result, indent=2), encoding='utf8')
print(json.dumps(result, indent=2))
