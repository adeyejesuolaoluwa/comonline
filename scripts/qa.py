"""Browser QA: pip install playwright; python scripts/qa.py --axe-path PATH/axe.min.js.

Install browser binaries with `python -m playwright install` if required.
Reports and screenshots are written to ignored artifacts/qa/.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:8000/')
parser.add_argument('--axe-path', type=Path)
parser.add_argument('--browsers', nargs='+', default=['chromium', 'firefox', 'webkit'])
args = parser.parse_args()
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/qa'
OUT.mkdir(parents=True, exist_ok=True)
PAGES = ['index', 'authors', 'books', 'what-we-write', 'faq', 'contact', 'privacy', 'terms', '404']
WIDTHS = [320, 375, 390, 768, 1024, 1366, 1440, 1920]
report = {'layouts': [], 'accessibility': [], 'failures': [], 'interactions': [], 'unavailable': [], 'browsers': {}}

def expect(condition, message):
    if not condition:
        report['failures'].append(message)

with sync_playwright() as p:
    for engine in args.browsers:
        try:
            browser = getattr(p, engine).launch()
        except Exception as error:
            report['unavailable'].append({'browser': engine, 'reason': str(error)})
            continue
        report['browsers'][engine] = browser.version
        page = browser.new_page(reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        responses = []
        page.on('response', lambda response: responses.append({'url': response.url, 'status': response.status}) if response.status >= 400 else None)
        for slug in PAGES:
            page.set_viewport_size({'width': 1440, 'height': 1000})
            page.goto(args.url + slug + '.html', wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            for width in WIDTHS:
                page.set_viewport_size({'width': width, 'height': 900})
                page.wait_for_timeout(40)
                metrics = page.evaluate('''() => ({width: innerWidth, scroll: document.documentElement.scrollWidth,
                  overflowing: [...document.querySelectorAll('main *')].filter(el => {const r=el.getBoundingClientRect(); return r.width && (r.right > innerWidth+1 || r.left < -1)}).map(el => el.tagName+'.'+el.className)})''')
                expect(metrics['scroll'] <= width + 1, f'{engine}/{slug}/{width}: horizontal overflow {metrics}')
                report['layouts'].append({'browser': engine, 'page': slug, 'width': width, 'overflow': metrics['scroll'] > width + 1})
                if width in (390, 1440):
                    # Force lazy images to load for full-page review sheets.
                    page.evaluate('document.querySelectorAll("img[loading=lazy]").forEach(img => img.loading="eager")')
                    page.evaluate('Promise.all([...document.images].map(img => img.decode().catch(() => {})))')
                    page.screenshot(path=str(OUT / f'{engine}-{slug}-{width}.png'), full_page=True)
            page.set_viewport_size({'width': 390, 'height': 844})
            menu = page.locator('.menu-toggle')
            menu.wait_for(state='visible')
            page.locator('#primary-nav').wait_for(state='hidden')
            expect(not page.locator('#primary-nav').is_visible(), f'{engine}/{slug}: mobile menu initially closed')
            menu.click()
            expect(page.locator('#primary-nav').is_visible(), f'{engine}/{slug}: mobile menu opens')
            page.keyboard.press('Escape')
            expect(not page.locator('#primary-nav').is_visible(), f'{engine}/{slug}: Escape closes menu')
            expect(menu.evaluate('(el) => el === document.activeElement'), f'{engine}/{slug}: focus restored to menu')
            page.set_viewport_size({'width': 1024, 'height': 900})
            page.locator('#primary-nav').wait_for(state='visible')
            menu.wait_for(state='hidden')
            expect(page.locator('#primary-nav').is_visible(), f'{engine}/{slug}: desktop nav visible after resize')
            expect(not menu.is_visible(), f'{engine}/{slug}: desktop toggle hidden')
            report['interactions'].append(f'{engine}/{slug}: mobile open, Escape, focus, resize')
            if slug == 'faq':
                summary = page.locator('summary').first
                was_open = page.locator('details').first.get_attribute('open') is not None
                summary.focus()
                page.keyboard.press('Enter')
                expect((page.locator('details').first.get_attribute('open') is not None) != was_open, f'{engine}: FAQ toggles by Enter')
                page.keyboard.press('Space')
                expect((page.locator('details').first.get_attribute('open') is not None) == was_open, f'{engine}: FAQ restores by Space')
                report['interactions'].append(f'{engine}: FAQ Enter/Space')
            if engine == 'chromium' and args.axe_path:
                for width in (390, 1440):
                    page.set_viewport_size({'width': width, 'height': 1000})
                    page.add_script_tag(path=str(args.axe_path))
                    result = page.evaluate('''async () => {
                      const r = await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']},rules:{'label-content-name-mismatch':{enabled:true}}});
                      return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};
                    }''')
                    report['accessibility'].append({'page': slug, 'width': width, **result})
                    expect(not result['violations'], f'axe/{slug}/{width}: {json.dumps(result["violations"])}')
        expect(not errors, f'{engine}: console runtime errors {errors}')
        expect(not responses, f'{engine}: failed responses {responses}')
        response = page.goto(args.url + 'missing/deeper.html', wait_until='networkidle')
        expect(response.status == 404, f'{engine}: missing nested route returns HTTP 404')
        expect(page.locator('h1').is_visible(), f'{engine}: branded 404 content is visible')
        expect(page.locator('.site-header').evaluate('(el) => getComputedStyle(el).backgroundColor') == 'rgb(246, 244, 239)', f'{engine}: 404 stylesheet resolves under base path')
        page.locator('main .button').click()
        expect(page.url == args.url + 'index.html', f'{engine}: nested 404 returns to homepage')
        # No-JS fallback must preserve mobile navigation and FAQ.
        context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
        fallback = context.new_page()
        fallback.goto(args.url + 'faq.html')
        expect(fallback.locator('#primary-nav').is_visible(), f'{engine}: no-JS navigation visible')
        fallback_open = fallback.locator('details').first.get_attribute('open') is not None
        fallback.locator('summary').first.click()
        expect((fallback.locator('details').first.get_attribute('open') is not None) != fallback_open, f'{engine}: no-JS FAQ works')
        fallback.screenshot(path=str(OUT / f'{engine}-no-js.png'), full_page=True)
        context.close()
        # Normal-motion reveals must eventually show all content.
        page.emulate_media(reduced_motion='no-preference')
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.goto(args.url, wait_until='networkidle')
        for y in range(0, page.evaluate('document.documentElement.scrollHeight'), 500):
            page.evaluate('(y) => window.scrollTo({top:y,behavior:"instant"})', y)
            page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
        page.wait_for_timeout(1200)
        expect(page.locator('.reveal-pending:not(.is-visible)').count() == 0, f'{engine}: scroll reveals complete')
        expect(page.locator('.word:not(.lit)').count() == 0, f'{engine}: word reveals complete')
        page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
        page.screenshot(path=str(OUT / f'{engine}-motion-home.png'), full_page=True)
        report['interactions'].append(f'{engine}: no-JS fallback, scroll and word reveals')
        browser.close()

(OUT / 'report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({'layouts': len(report['layouts']), 'axe_checks': len(report['accessibility']), 'interactions': len(report['interactions']), 'failures': report['failures'], 'unavailable': report['unavailable']}, indent=2))
raise SystemExit(bool(report['failures']))
