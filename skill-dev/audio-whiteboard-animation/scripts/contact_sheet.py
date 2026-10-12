"""Tile review frames into one image: python3 contact_sheet.py <frames_dir> <out.png> [--cols 7] [--w 270]"""
import argparse, glob, os
from PIL import Image
ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('out')
ap.add_argument('--cols', type=int, default=7); ap.add_argument('--w', type=int, default=270)
a = ap.parse_args()
fs = sorted(glob.glob(os.path.join(a.dir, '*.png')), key=lambda f: float(os.path.basename(f).split('_')[-1][:-4]))
ims = [Image.open(f) for f in fs]
if not ims: raise SystemExit('no frames')
# keep each frame's own aspect ratio (9:16 and 16:9 may be mixed)
sized = [im.resize((a.w, round(im.height * a.w / im.width))) for im in ims]
rows = [sized[i:i + a.cols] for i in range(0, len(sized), a.cols)]
H = sum(max(im.height for im in r) for r in rows)
sheet = Image.new('RGB', (a.w * min(a.cols, len(sized)), H), 'white')
y = 0
for r in rows:
    for j, im in enumerate(r): sheet.paste(im, (j * a.w, y))
    y += max(im.height for im in r)
sheet.save(a.out); print(f'{len(ims)} frames → {a.out}')
