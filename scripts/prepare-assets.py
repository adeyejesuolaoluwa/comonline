"""Optional asset regeneration; requires Pillow. Original photographs stay intact."""
from pathlib import Path
from urllib.request import urlretrieve
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / 'assets/img'
FONTS = ROOT / 'assets/fonts'
FONTS.mkdir(exist_ok=True)
fonts = {
    'cormorant-garamond': ('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2', 'cormorantgaramond'),
    'manrope': ('https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2', 'manrope'),
}
for name, (url, directory) in fonts.items():
    urlretrieve(url, FONTS / f'{name}-latin.woff2')
    urlretrieve(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{directory}/OFL.txt', FONTS / f'{name}-OFL.txt')
    license_path = FONTS / f'{name}-OFL.txt'
    license_path.write_text('\n'.join(line.rstrip() for line in license_path.read_text(encoding='utf-8').splitlines()) + '\n', encoding='utf-8')

portrait = Image.open(IMAGES / 'author-portrait.jpg')
for width in (540, 900, 1080):
    resized = portrait.resize((width, round(portrait.height * width / portrait.width)), Image.Resampling.LANCZOS)
    resized.save(IMAGES / f'author-portrait-{width}.webp', quality=82, method=6)

cover = Image.open(IMAGES / '81pFcztlgCL._SY425_.jpg').convert('RGB')

social = Image.new('RGB', (1200, 630), '#f6f4ef')
draw = ImageDraw.Draw(social)
serif = 'C:/Windows/Fonts/georgia.ttf'
sans = 'C:/Windows/Fonts/segoeui.ttf'
draw.text((64, 58), 'A MEMOIR BY P.J. RAY', font=ImageFont.truetype(sans, 20), fill='#253eb9')
draw.text((58, 154), 'Living', font=ImageFont.truetype(serif, 100), fill='#20211f')
draw.text((58, 270), 'with Bipolar.', font=ImageFont.truetype(serif, 100), fill='#253eb9')
draw.text((64, 502), 'A life before diagnosis. A way forward after it.', font=ImageFont.truetype(sans, 22), fill='#62635f')
draw.rectangle((792, 0, 1200, 630), fill='#181818')
small = cover.resize((267, 425), Image.Resampling.LANCZOS)
social.paste(small, (862, 102))
social.save(IMAGES / 'social.jpg', quality=90, optimize=True)
print('Prepared local fonts, responsive portraits and 1200 × 630 sharing image.')
