// QA report for a rendered reel.
//   node tools/qa.mjs --project ref-fitness [--video projects/ref-fitness/output/final.mp4]
// Measures (never assumes): container/stream properties, frame count vs expected,
// decode errors, black frames, audio-stream identity (md5 of the packets vs the
// original), and audio alignment by cross-correlation at start / middle / end.
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ROOT } from './serve.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const project = opt('project', 'ref-fitness');
const pdir = path.join(ROOT, 'projects', project);
const video = path.resolve(opt('video', path.join(pdir, 'output/final.mp4')));
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/identity.json'), 'utf8'));
const sb = JSON.parse(fs.readFileSync(path.join(pdir, 'storyboard.json'), 'utf8'));
const orig = path.join(pdir, 'audio/original.m4a');
const results = [];
const check = (name, pass, detail) => { results.push({ name, pass, detail }); console.log(`${pass === null ? '—' : pass ? '✅' : '❌'} ${name}: ${detail}`); };
const sh = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 });

const probe = JSON.parse(sh('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-print_format', 'json', '-count_frames', video]));
const v = probe.streams.find((s) => s.codec_type === 'video'), a = probe.streams.find((s) => s.codec_type === 'audio');
check('resolution', v.width === cfg.canvas.width && v.height === cfg.canvas.height, `${v.width}x${v.height} (expected ${cfg.canvas.width}x${cfg.canvas.height})`);
check('aspect 9:16', Math.abs(v.width / v.height - 9 / 16) < 1e-3, `${(v.width / v.height).toFixed(4)}`);
const fps = eval(v.r_frame_rate);
check('fps', Math.abs(fps - (sb.fps || cfg.canvas.fps)) < 1e-6, `${v.r_frame_rate}`);
const audioDur = +sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', orig]).trim();
const expectFrames = Math.ceil(audioDur * fps);
check('frame count', Math.abs(+v.nb_read_frames - expectFrames) <= 1, `${v.nb_read_frames} frames (expected ceil(${audioDur.toFixed(3)}×${fps}) = ${expectFrames})`);
check('duration', Math.abs(+probe.format.duration - audioDur) < 0.1, `${(+probe.format.duration).toFixed(3)} s vs original audio ${audioDur.toFixed(3)} s`);
check('audio codec/rate/channels', !!a, a ? `${a.codec_name} ${a.profile || ''} ${a.sample_rate} Hz ${a.channels} ch` : 'no audio');
const dec = spawnSync('ffmpeg', ['-v', 'error', '-i', video, '-f', 'null', '-'], { encoding: 'utf8' });
check('decodes without errors', dec.status === 0 && !dec.stderr.trim(), dec.stderr.trim() || 'clean');
const black = spawnSync('ffmpeg', ['-i', video, '-vf', 'blackdetect=d=0.1:pic_th=0.98', '-an', '-f', 'null', '-'], { encoding: 'utf8' }).stderr.match(/black_start:[0-9.]+ black_end:[0-9.]+/g) || [];
const tail = black.filter((b) => +b.match(/black_end:([0-9.]+)/)[1] < audioDur - 0.5);
check('no unintended black frames', tail.length === 0, black.length ? black.join('; ') + (tail.length ? '' : ' (intended final fade only)') : 'none');
// audio stream identity: md5 of raw AAC packets
const md5 = (f) => sh('ffmpeg', ['-v', 'error', '-i', f, '-map', '0:a:0', '-c:a', 'copy', '-f', 'md5', '-']).trim();
const m1 = md5(orig), m2 = md5(video);
check('audio stream bit-identical to original', m1 === m2, `${m1} vs ${m2}`);
// alignment via cross-correlation (python/numpy)
const py = `
import subprocess, numpy as np, sys
def pcm(f):
    b = subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(b,np.int16).astype(np.float32)/32768
a, b = pcm(sys.argv[1]), pcm(sys.argv[2]); sr=16000; n=min(len(a),len(b))
out=[]
for name,c in [('start',3.0),('middle',n/sr/2),('end',n/sr-4.0)]:
    s=int(c*sr); w=a[s:s+sr*2]; seg=b[max(0,s-sr//2):s+sr*2+sr//2]
    if len(w)<sr or len(seg)<len(w): out.append(f'{name}: n/a'); continue
    cc=np.correlate(seg-seg.mean(), w-w.mean(), 'valid'); lag=int(cc.argmax())-(s-max(0,s-sr//2))
    out.append(f'{name}: {lag*1000/sr:+.1f} ms')
print(' | '.join(out))`;
const corr = spawnSync('python3', ['-I', '-c', py, orig, video], { encoding: 'utf8' });
const lags = (corr.stdout.match(/[+-][0-9.]+ ms/g) || []).map((x) => Math.abs(parseFloat(x)));
check('audio alignment (cross-correlation, 2 s windows)', lags.length === 3 && Math.max(...lags) <= 1.0, corr.stdout.trim() || corr.stderr.trim());
// text safe-area (static check of storyboard positions)
const zone = cfg.layout.kineticZone;
check('kinetic zone inside safe area', zone.y >= cfg.layout.presenterFull.y + cfg.layout.presenterFull.h && zone.y + zone.h <= cfg.canvas.height - cfg.layout.safeMargin + 24, `y ${zone.y}–${zone.y + zone.h}, frame bottom ${cfg.layout.presenterFull.y + cfg.layout.presenterFull.h}`);

const md = [`# QA report — ${project}`, '', `Video: \`${path.relative(ROOT, video)}\` · generated ${new Date().toISOString()}`, '', '| Check | Result | Detail |', '|---|---|---|',
  ...results.map((r) => `| ${r.name} | ${r.pass === null ? 'n/a' : r.pass ? 'PASS' : 'FAIL'} | ${r.detail.replace(/\|/g, '/')} |`), '',
  'Not measured automatically (visual review via contact sheets): text overlap with face, RTL correctness, element persistence after its information ends, colour consistency.'];
fs.mkdirSync(path.join(pdir, 'qa'), { recursive: true });
fs.writeFileSync(path.join(pdir, 'qa/QA_REPORT.md'), md.join('\n'));
const fails = results.filter((r) => r.pass === false).length;
console.log(fails ? `${fails} check(s) FAILED` : 'all measured checks passed');
process.exit(fails ? 1 : 0);
