from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=Path('artifacts/motion-polish'); out.mkdir(parents=True,exist_ok=True)
checks=[]
with sync_playwright() as p:
 for engine in ['chromium','firefox','webkit']:
  browser=getattr(p,engine).launch()
  page=browser.new_page(viewport={'width':1440,'height':1000})
  errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:8000/comonline/',wait_until='networkidle')
  page.wait_for_timeout(2000)
  assert page.evaluate('!window.gsap'), 'GSAP must not load with the opening'
  page.locator('.story-finale').evaluate('(e)=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight-600,behavior:"instant"})')
  page.wait_for_function('!!window.gsap && !!window.ScrollTrigger && ScrollTrigger.getAll().length > 0')
  assert page.evaluate('!!window.gsap && !!window.ScrollTrigger')
  page.locator('.finale-title').scroll_into_view_if_needed()
  page.wait_for_timeout(1200)
  assert page.locator('.finale-title').evaluate('(e)=>getComputedStyle(e).clipPath')=='none'
  page.screenshot(path=str(out/f'{engine}-finale.png'))
  page.emulate_media(reduced_motion='reduce')
  page.wait_for_function('ScrollTrigger.getAll().length === 0')
  assert page.evaluate('ScrollTrigger.getAll().length')==0
  page.goto('http://127.0.0.1:8000/comonline/authors.html',wait_until='networkidle')
  page.emulate_media(reduced_motion='no-preference')
  page.reload(wait_until='networkidle')
  page.locator('#business').evaluate('(e)=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-200,behavior:"instant"})')
  page.wait_for_timeout(1000)
  assert page.locator('.biography-index a[aria-current="location"]').get_attribute('href')=='#business'
  assert not errors,errors
  page.route('**/assets/js/vendor/**', lambda route: route.abort())
  page.set_viewport_size({'width':390,'height':844})
  page.goto('http://127.0.0.1:8000/comonline/',wait_until='networkidle')
  page.locator('.finale-title').scroll_into_view_if_needed()
  page.wait_for_timeout(1200)
  assert page.locator('.finale-title').evaluate('(e)=>getComputedStyle(e).clipPath')=='none'
  assert page.locator('.finale-actions .button').is_visible()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
  page.screenshot(path=str(out/f'{engine}-mobile-fallback.png'))
  checks.append({'browser':engine,'startup_without_gsap':True,'gsap_loaded_near_finale':True,'finale_cleared':True,'reduced_motion_reverted':True,'chapter_index':True,'mobile_vendor_failure_fallback':True,'runtime_errors':errors})
  browser.close()
(out/'motion-checks.json').write_text(json.dumps(checks,indent=2))
print(json.dumps(checks,indent=2))
