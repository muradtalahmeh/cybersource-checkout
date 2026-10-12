#!/usr/bin/env python3
"""Find speech spans in a mono 16 kHz WAV using ffmpeg silencedetect.

  python3 tools/detect_speech.py <audio.wav> --out spans.json
      [--sentence-db -30 --sentence-min 0.30 --max-span 12]
      [--phrase-db -34 --phrase-min 0.12]

Writes:
  {"duration": s, "sentences": [[s,e],...], "phrases": [[s,e],...]}

"sentences" are decode units for ASR (speech between pauses >= sentence-min,
merged so that no unit exceeds max-span seconds). "phrases" are finer regions
(short pauses) used to refine on-screen timing. All times are measured from the
audio itself; nothing is estimated.
"""
import argparse, json, re, subprocess


def silences(path, db, min_sil):
    err = subprocess.run(
        ['ffmpeg', '-hide_banner', '-i', path, '-af', f'silencedetect=noise={db}dB:d={min_sil}', '-f', 'null', '-'],
        capture_output=True, text=True).stderr
    events = re.findall(r'silence_(start|end): ([0-9.]+)', err)
    out, cur = [], None
    for kind, val in events:
        if kind == 'start':
            cur = float(val)
        else:
            out.append((cur if cur is not None else 0.0, float(val)))
            cur = None
    if cur is not None:
        out.append((cur, None))
    return out


def speech_regions(sil, duration):
    regs, t = [], 0.0
    for s, e in sil:
        if s > t + 0.02:
            regs.append([round(t, 3), round(s, 3)])
        t = duration if e is None else e
    if t < duration - 0.02:
        regs.append([round(t, 3), round(duration, 3)])
    return regs


def merge_short(regs, max_span, min_len=0.6):
    """Merge neighbouring regions until a unit would exceed max_span; attach
    very short regions (breaths, clicks) to a neighbour."""
    out = []
    for r in regs:
        if out and (r[1] - out[-1][0] <= max_span) and (r[0] - out[-1][1] < 0.6 or (r[1] - r[0]) < min_len):
            out[-1][1] = r[1]
        else:
            out.append(list(r))
    return out


def split_long(regs, gap_tiers, max_span):
    """Split any region longer than max_span at the latest pause (from the
    finer tiers, in order) that keeps the first part <= max_span. Falls back
    to a hard split when no pause exists at all."""
    out = []
    for r in regs:
        s, e = r
        while e - s > max_span:
            cut = None
            for gaps in gap_tiers:
                cands = [(gs, ge) for gs, ge in gaps if s + 1.0 < gs and gs <= s + max_span and ge < e]
                if cands:
                    cut = cands[-1]
                    break
            if cut is None:
                out.append([round(s, 3), round(s + max_span, 3)]); s = s + max_span
            else:
                out.append([round(s, 3), round(cut[0], 3)]); s = cut[1]
        out.append([round(s, 3), round(e, 3)])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('audio')
    ap.add_argument('--out', required=True)
    ap.add_argument('--sentence-db', type=float, default=-30)
    ap.add_argument('--sentence-min', type=float, default=0.30)
    ap.add_argument('--max-span', type=float, default=12)
    ap.add_argument('--phrase-db', type=float, default=-34)
    ap.add_argument('--phrase-min', type=float, default=0.12)
    ap.add_argument('--fine-db', type=float, default=-38)
    ap.add_argument('--fine-min', type=float, default=0.08)
    a = ap.parse_args()
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.audio],
                               capture_output=True, text=True).stdout.strip())
    sent_sil = silences(a.audio, a.sentence_db, a.sentence_min)
    phr_sil = [(s, e if e is not None else dur) for s, e in silences(a.audio, a.phrase_db, a.phrase_min)]
    fine_sil = [(s, e if e is not None else dur) for s, e in silences(a.audio, a.fine_db, a.fine_min)]
    sent = merge_short(speech_regions(sent_sil, dur), a.max_span)
    sent = split_long(sent, [phr_sil, fine_sil], a.max_span)
    phr = speech_regions(phr_sil, dur)
    fine = speech_regions(fine_sil, dur)
    res = {'duration': round(dur, 3), 'sentences': sent, 'phrases': phr, 'fine': fine,
           'params': {'sentence_db': a.sentence_db, 'sentence_min': a.sentence_min, 'max_span': a.max_span,
                      'phrase_db': a.phrase_db, 'phrase_min': a.phrase_min, 'fine_db': a.fine_db, 'fine_min': a.fine_min}}
    json.dump(res, open(a.out, 'w'), ensure_ascii=False, indent=1)
    print(f'duration {dur:.3f}s · {len(sent)} sentence units · {len(phr)} phrase regions')
    for s, e in sent:
        print(f'  {s:7.3f} – {e:7.3f}  ({e - s:5.2f}s)')


if __name__ == '__main__':
    main()
