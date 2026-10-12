"""Find speech spans in the narration with ffmpeg silencedetect.

  python3 detect_speech.py narration.wav --out spans.json

Writes {"duration", "sentences": [[s,e],...], "phrases": [[s,e],...]}:
  sentences — silence ≥ 0.30 s at -35 dB, merged to ≤ 12 s (decode units)
  phrases   — silence ≥ 0.12 s at -38 dB (use for word/phrase timing inside
              a sentence, e.g. when exactly "played" or an example starts)
Tune --db / --min-sil if the recording is noisy or very fast.
"""
import argparse, json, re, subprocess


def silences(path, db, d):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', f'silencedetect=noise={db}dB:d={d}', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    ev = re.findall(r'silence_(start|end): ([0-9.]+)', out)
    sil, cur = [], None
    for k, v in ev:
        if k == 'start': cur = float(v)
        else: sil.append((cur if cur is not None else 0.0, float(v)))
    return sil


def regions(sil, dur):
    regs, t = [], 0.0
    for s, e in sil:
        if s > t + 0.02: regs.append([round(t, 2), round(s, 2)])
        t = e
    if t < dur - 0.02: regs.append([round(t, 2), round(dur, 2)])
    return regs


ap = argparse.ArgumentParser()
ap.add_argument('audio'); ap.add_argument('--out', required=True)
ap.add_argument('--db', type=float, default=-35); ap.add_argument('--min-sil', type=float, default=0.3)
ap.add_argument('--max-span', type=float, default=12)
a = ap.parse_args()
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.audio]))
sent = regions(silences(a.audio, a.db, a.min_sil), dur)
merged = []
for r in sent:  # glue very short bits to their neighbour, keep spans decodable
    if merged and (r[1] - r[0] < 1.2 or r[0] - merged[-1][1] < 0.32) and r[1] - merged[-1][0] <= a.max_span:
        merged[-1][1] = r[1]
    else: merged.append(list(r))
phr = regions(silences(a.audio, a.db - 3, 0.12), dur)
json.dump({'duration': dur, 'sentences': merged, 'phrases': phr}, open(a.out, 'w'), indent=1)
print(f'duration {dur:.2f}s · {len(merged)} sentence spans · {len(phr)} phrase regions → {a.out}')
