"""Validate cinematic scenes during motion, at rest, and at larger text sizes."""
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/master-pass'
OUT.mkdir(parents=True, exist_ok=True)
URL = 'http://127.0.0.1:8000/comonline/'
checks = []
failures = []
features = {}

def check(condition, message):
    checks.append(message)
    if not condition:
        failures.append(message)

with sync_playwright() as p:
    for engine in ['chromium', 'firefox', 'webkit']:
        browser = getattr(p, engine).launch()
        page = browser.new_page()
        for width in [320, 390, 768, 1024, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            page.goto(URL, wait_until='networkidle')
            cta = page.locator('.memoir-feature-copy .button')
            cta.scroll_into_view_if_needed()
            for delay in [0, 120, 400, 1100]:
                page.wait_for_timeout(delay)
                geometry = cta.evaluate('''el => {
                  const button=el.getBoundingClientRect();
                  const paragraph=el.previousElementSibling.getBoundingClientRect();
                  const heading=el.parentElement.querySelector('h2').getBoundingClientRect();
                  const hit=document.elementFromPoint(button.x+button.width/2,button.y+button.height/2);
                  return {flow:button.top>=paragraph.bottom+8 && paragraph.top>=heading.bottom+8,
                    hit:hit===el||el.contains(hit),opacity:getComputedStyle(el).opacity};
                }''')
                check(geometry['flow'] and geometry['hit'] and geometry['opacity']=='1', f'{engine}/{width}/{delay}ms: spotlight CTA clear, opaque, and hit-testable')
            check(page.locator('.author-coda h2').count()==1, f'{engine}/{width}: single author heading')
            check('working life' not in page.locator('.author-coda h2').inner_text().lower(), f'{engine}/{width}: revised author heading')
            paragraphs = page.locator('.coda-biography p').all_text_contents()
            check(len(paragraphs)==len(set(paragraphs))==1, f'{engine}/{width}: concise, unduplicated author summary')
            finale = page.locator('.story-finale')
            finale.locator('.button').scroll_into_view_if_needed()
            page.wait_for_timeout(1200)
            final_geometry = finale.evaluate('''el => {
              const button=el.querySelector('.button');const r=button.getBoundingClientRect();
              const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
              const title=el.querySelector('h2').getBoundingClientRect();
              const copy=el.querySelector('.finale-copy').getBoundingClientRect();
              return {hit:hit===button||button.contains(hit), flow:copy.top>=title.bottom,
                overflow:document.documentElement.scrollWidth>innerWidth};
            }''')
            check(final_geometry['hit'] and final_geometry['flow'] and not final_geometry['overflow'], f'{engine}/{width}: finale CTA accessible in unclipped layout')
            if width in [390,1440]:
                for selector, label in [('.memoir-feature','spotlight'),('.author-coda','author'),('.story-finale','finale')]:
                    page.locator(selector).scroll_into_view_if_needed()
                    page.wait_for_timeout(1100)
                    page.screenshot(path=str(OUT / f'{engine}-{label}-{width}.png'))
        page.set_viewport_size({'width':1440,'height':900})
        page.goto(URL, wait_until='networkidle')
        page.wait_for_timeout(1900)
        supports = page.evaluate('CSS.supports("animation-timeline: view()")')
        features[engine] = {'scrollTimeline':supports}
        before = page.locator('.hero-portrait picture').evaluate('(el)=>getComputedStyle(el).transform')
        page.evaluate('window.scrollTo({top:350,behavior:"instant"})')
        page.wait_for_timeout(300)
        after = page.locator('.hero-portrait picture').evaluate('(el)=>getComputedStyle(el).transform')
        page.wait_for_timeout(400)
        held = page.locator('.hero-portrait picture').evaluate('(el)=>getComputedStyle(el).transform')
        check((not supports or before!=after) and after==held, f'{engine}: parallax follows scroll and stops when scrolling stops (or has static fallback)')
        page.emulate_media(reduced_motion='reduce')
        check(not page.evaluate('document.getAnimations().some(a=>a.playState==="running")'), f'{engine}: reduced motion cancels CSS and native animations')
        page.emulate_media(reduced_motion='no-preference')
        page.goto(URL+'authors.html',wait_until='networkidle')
        biography=[re.sub(r'\s+',' ',text).strip() for text in page.locator('.bio-chapter p').all_text_contents()]
        check(len(biography)==len(set(biography))==4, f'{engine}: four unique biography paragraphs')
        page.goto(URL+'what-we-write.html',wait_until='networkidle')
        original = re.sub(r'\s+',' ',page.locator('[data-word-reveal]').text_content()).strip()
        for unused in range(3):
            page.locator('[data-word-reveal]').scroll_into_view_if_needed()
            page.wait_for_timeout(250)
            page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
        final=re.sub(r'\s+',' ',page.locator('[data-word-reveal]').text_content()).strip()
        check(original==final and page.locator('.word .word').count()==0, f'{engine}: repeated scrolls do not duplicate text or nest word wrappers')
        for width in [320,1440]:
            page.set_viewport_size({'width':width,'height':900})
            page.emulate_media(reduced_motion='reduce')
            for slug in ['index','authors','books','what-we-write','faq','contact','privacy','terms','404']:
                page.goto(URL+slug+'.html',wait_until='networkidle')
                page.add_style_tag(content='html {font-size:200% !important}')
                page.wait_for_timeout(150)
                zoom = page.evaluate('''() => ({overflow:document.documentElement.scrollWidth>innerWidth,
                  heroClear:!document.querySelector('.hero-copy') || document.querySelector('.hero-copy').getBoundingClientRect().bottom<=document.querySelector('#story').getBoundingClientRect().top})''')
                check(not zoom['overflow'] and zoom['heroClear'], f'{engine}/{width}/{slug}: 200% text remains in flow without horizontal overflow')
        browser.close()

report={'checks':len(checks),'failures':failures,'features':features,'passed':len(checks)-len(failures)}
(OUT/'scene-report.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report,indent=2))
raise SystemExit(bool(failures))
