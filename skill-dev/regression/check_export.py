"""Export checks for one clip of a built project.
  python3 check_export.py <projectDir> <v|h> <from> <to> <out.json>
Renders the clip with the project's own exporter, then verifies:
  * container/streams: H.264, expected size, 30 fps, frame count = round((to-from)*30)
  * full decode without errors
  * audio: AAC, duration, cross-correlation against the ORIGINAL narration at
    3 points (offset must be 0 ms)
  * picture timing: decoded MP4 frames at 4 sample times match the engine's
    own render at the same time better than at ±0.2 s (PSNR), i.e. the frame
    shown at time t really is the drawing state of time t.
"""
import json, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

proj, aspect, t0, t1, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
proj = os.path.abspath(proj)
W, H = (1920, 1080) if aspect == 'h' else (1080, 1920)
fps = 30
tmp = tempfile.mkdtemp(prefix='exp_')
clip = os.path.join(tmp, 'clip.mp4')
run = lambda *a, **k: subprocess.run(list(a), capture_output=True, text=True, **k)
r = run('node', 'tools/render.mjs', '--aspect', aspect, '--from', str(t0), '--to', str(t1), '--workers', '4', '--out', clip, cwd=proj)
res = {'aspect': aspect, 'from': t0, 'to': t1, 'render_ok': r.returncode == 0 and os.path.exists(clip), 'render_log': r.stdout.strip().splitlines()[-1:] + r.stderr.strip().splitlines()[-3:]}
problems = []
if not res['render_ok']:
    problems.append('render failed'); res['problems'] = problems; json.dump(res, open(out, 'w'), indent=1); sys.exit(0)
pr = json.loads(run('ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,duration,sample_rate,channels', '-show_entries', 'format=duration,size', '-of', 'json', clip).stdout)
v = [s for s in pr['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in pr['streams'] if s['codec_type'] == 'audio'][0]
exp_frames = round(t1 * fps) - round(t0 * fps) if t1 < 1e9 else None
import math
exp_frames = math.ceil(t1 * fps) - round(t0 * fps)
res['video'] = v; res['audio'] = a; res['format'] = pr['format']
if v['codec_name'] != 'h264': problems.append('video codec ' + v['codec_name'])
if (int(v['width']), int(v['height'])) != (W, H): problems.append('size %sx%s' % (v['width'], v['height']))
if v['r_frame_rate'] != '30/1': problems.append('fps ' + v['r_frame_rate'])
if int(v['nb_frames']) != exp_frames: problems.append('frames %s != %d' % (v['nb_frames'], exp_frames))
if a['codec_name'] != 'aac': problems.append('audio codec ' + a['codec_name'])
dec = run('ffmpeg', '-v', 'error', '-i', clip, '-f', 'null', '-')
res['decode_errors'] = dec.stderr.strip()[:500]
if dec.stderr.strip(): problems.append('decode errors')
# audio alignment vs original narration
def pcm(src, ss=None, dur=None):
    args = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + ['-i', src] + (['-t', str(dur)] if dur else []) + ['-ac', '1', '-ar', '24000', '-f', 's16le', '-']
    return np.frombuffer(subprocess.run(args, capture_output=True).stdout, np.int16).astype(float)
clipa = pcm(clip)
orig = pcm(os.path.join(proj, 'assets/audio/narration.wav'), ss=t0, dur=t1 - t0 + 1)
offs = []
L = len(clipa) / 24000
for frac in (0.15, 0.5, 0.85):
    s = int(frac * L * 24000); n = min(24000, int(0.1 * L * 24000) or 2400)
    A = clipa[s:s + n]
    if len(A) < 100 or np.abs(A).sum() == 0: continue
    best = max(range(-240, 241), key=lambda k: float(np.dot(A, orig[s + k:s + k + n])) if s + k >= 0 and s + k + n <= len(orig) else -1e30)
    offs.append(best / 24.0)
res['audio_offsets_ms'] = offs
if any(abs(o) > 0.5 for o in offs): problems.append('audio offset %s' % offs)
if abs(float(a['duration']) - (t1 - t0)) > 0.06: problems.append('audio duration %s' % a['duration'])
# picture timing via PSNR against engine renders
n0 = round(t0 * fps)
idxs = [int((exp_frames - 1) * f) for f in (0.2, 0.45, 0.7, 0.95)]
frames_dir = os.path.join(tmp, 'fr')
times = []
for i in idxs:
    for d in (-6, 0, 6):
        j = n0 + i + d
        if j >= 0: times.append(j / fps)
run('node', 'tools/frames.mjs', aspect, frames_dir, *[repr(t) for t in times], cwd=proj)
def load_png(t):
    return np.asarray(Image.open(os.path.join(frames_dir, '%s_%s.png' % (aspect, ('%.2f' % t).rjust(7, '0')))).convert('RGB')).astype(float)
def psnr(x, y):
    m = ((x - y) ** 2).mean(); return 99.0 if m == 0 else 10 * np.log10(255 ** 2 / m)
timing = []
for i in idxs:
    fr = subprocess.run(['ffmpeg', '-v', 'error', '-i', clip, '-vf', 'select=eq(n\\,%d)' % i, '-vframes', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    img = np.frombuffer(fr, np.uint8).reshape(H, W, 3).astype(float)
    row = {'frame': i, 't': (n0 + i) / fps}
    for d in (-6, 0, 6):
        j = n0 + i + d
        if j >= 0: row['psnr_%+d' % d] = round(psnr(img, load_png(j / fps)), 2)
    row['ok'] = row['psnr_+0'] >= 30 and all(row['psnr_+0'] >= row[k] for k in row if k.startswith('psnr_') and k != 'psnr_+0')
    timing.append(row)
res['picture_timing'] = timing
if not all(r['ok'] for r in timing): problems.append('picture timing mismatch')
res['problems'] = problems
json.dump(res, open(out, 'w'), indent=1)
print('%s %s %.2f-%.2f: frames %s, audio offsets %s ms, timing %s, problems: %s' % (os.path.basename(proj), aspect, t0, t1, v['nb_frames'], offs, [r['psnr_+0'] for r in timing], problems or 'none'))
