// Frame-exact export: N Playwright workers each render a contiguous frame range
// (window.renderAt(i / fps)) and pipe JPEG frames into their own ffmpeg (libx264).
// Segments are concatenated without re-encoding and the ORIGINAL audio stream is
// muxed with -c:a copy, so frame i always shows audio time i / fps.
//   node tools/render.mjs --project ref-fitness [--workers 4] [--from s] [--to s] [--out file.mp4] [--crf 18]
import { spawn, execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium } from './pw.mjs';
import { serve, ROOT } from './serve.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const project = opt('project', 'ref-fitness');
const pdir = path.join(ROOT, 'projects', project);
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/identity.json'), 'utf8'));
const sb = JSON.parse(fs.readFileSync(path.join(pdir, 'storyboard.json'), 'utf8'));
const fps = sb.fps || cfg.canvas.fps;
const W = cfg.canvas.width, H = cfg.canvas.height;
const workers = +opt('workers', 4), crf = opt('crf', '18');
const audio = path.join(pdir, 'audio/original.m4a');
const audioDur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).toString();
const from = +opt('from', 0), to = Math.min(audioDur, +opt('to', audioDur));
const f0 = Math.round(from * fps), f1 = Math.ceil(to * fps); // [f0, f1)
const out = path.resolve(opt('out', path.join(pdir, 'output', 'final.mp4')));
fs.mkdirSync(path.dirname(out), { recursive: true });
const tmp = path.join(path.dirname(out), `.parts-${Date.now()}`);
fs.mkdirSync(tmp, { recursive: true });

const { srv, port } = await serve();
const browser = await chromium.launch();
const url = `http://127.0.0.1:${port}/engine/index.html?project=${project}&render=1`;
console.log(`audio ${audioDur.toFixed(3)} s · ${W}x${H} @${fps} fps · frames ${f0}..${f1 - 1} (${f1 - f0}) · ${workers} workers`);
const started = Date.now();
let done = 0; const errors = [];
const per = Math.ceil((f1 - f0) / workers);
async function worker(w) {
  const a = f0 + w * per, b = Math.min(f1, a + per);
  if (a >= b) return null;
  const file = path.join(tmp, `part${w}.mp4`);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.evaluate(() => window.videoReady);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', crf, '-pix_fmt', 'yuv420p', '-r', String(fps), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const finished = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  for (let i = a; i < b; i++) {
    await page.evaluate((t) => window.renderAt(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94, clip: { x: 0, y: 0, width: W, height: H } });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (++done % 200 === 0) {
      const el = (Date.now() - started) / 1000;
      console.log(`${done}/${f1 - f0} frames · ${el.toFixed(0)} s · ~${((f1 - f0 - done) * el / done).toFixed(0)} s left`);
    }
  }
  ff.stdin.end();
  await finished;
  await page.close();
  return file;
}
const parts = (await Promise.all([...Array(workers).keys()].map(worker))).filter(Boolean);
await browser.close(); srv.close();
if (errors.length) { console.error('PAGE ERRORS during render:\n' + errors.join('\n')); process.exit(1); }

const list = path.join(tmp, 'list.txt');
fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
const video = path.join(tmp, 'video.mp4');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video]);
const partial = from > 0 || to < audioDur;
const aArgs = partial ? ['-ss', String(f0 / fps), '-t', String((f1 - f0) / fps)] : [];
// Full renders copy the original AAC stream untouched; partial renders must trim, which re-encodes.
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, ...aArgs, '-i', audio, '-map', '0:v:0', '-map', '1:a:0',
  '-c:v', 'copy', ...(partial ? ['-c:a', 'aac', '-b:a', '160k'] : ['-c:a', 'copy']), '-movflags', '+faststart', '-shortest', out]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`wrote ${out} in ${((Date.now() - started) / 1000).toFixed(0)} s (${partial ? 'audio trimmed + re-encoded' : 'original audio stream copied'})`);
