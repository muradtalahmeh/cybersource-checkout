// Frame-exact video export.
//   node tools/render.mjs [--aspect v|h] [--fps 30] [--workers 4] [--from s] [--to s] [--captions] [--out file.mp4]
// Each worker opens the page in render mode, calls window.renderAt(i / fps)
// for its contiguous frame range and pipes JPEG frames into its own ffmpeg
// (libx264). Segments are concatenated without re-encoding and the ORIGINAL
// narration WAV is muxed as the audio track, so sync is exact by
// construction: frame i always shows audio time i / fps.
import { spawn, execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from './pw.mjs';
import { serve } from './serve.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => { const [k, ...v] = s.trim().split(/\s+/); return [k, v.join(' ') || true]; }));
const aspect = args.aspect === 'h' ? 'h' : 'v';
const fps = +(args.fps || 30);
const workers = +(args.workers || 4);
const [W, H] = aspect === 'h' ? [1920, 1080] : [1080, 1920];
const audio = path.join(root, 'assets/audio/narration.wav');
const audioDur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).toString();
const from = +(args.from || 0), to = Math.min(audioDur, +(args.to || audioDur));
const f0 = Math.round(from * fps), f1 = Math.ceil(to * fps); // [f0, f1)
const out = path.resolve(args.out || path.join(root, 'output', `past-simple-${aspect === 'v' ? '9x16' : '16x9'}.mp4`));
const tmp = path.join(path.dirname(out), `.parts-${aspect}`);
fs.mkdirSync(tmp, { recursive: true });

const { srv, port } = await serve(root);
const browser = await chromium.launch();
const url = `http://127.0.0.1:${port}/index.html?render=1&aspect=${aspect}${args.captions ? '&captions=1' : ''}`;
console.log(`audio ${audioDur.toFixed(3)} s · ${aspect} ${W}x${H} @${fps} fps · frames ${f0}..${f1 - 1} (${f1 - f0}) · ${workers} workers`);

const per = Math.ceil((f1 - f0) / workers);
let done = 0;
const started = Date.now();
async function worker(w) {
  const a = f0 + w * per, b = Math.min(f1, a + per);
  if (a >= b) return null;
  const file = path.join(tmp, `part${w}.mp4`);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.goto(url);
  await page.evaluate(() => window.videoReady);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const finished = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  for (let i = a; i < b; i++) {
    await page.evaluate((t) => window.renderAt(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (++done % 300 === 0) {
      const el = (Date.now() - started) / 1000;
      console.log(`${done}/${f1 - f0} frames · ${el.toFixed(0)} s elapsed · ~${((f1 - f0 - done) * el / done).toFixed(0)} s left`);
    }
  }
  ff.stdin.end();
  await finished;
  await page.close();
  return file;
}
const parts = (await Promise.all([...Array(workers).keys()].map(worker))).filter(Boolean);
await browser.close();
srv.close();

const list = path.join(tmp, 'list.txt');
fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
const video = path.join(tmp, 'video.mp4');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video]);
// mux the original narration (trimmed to the rendered range for partial renders)
const aArgs = from > 0 || to < audioDur ? ['-ss', String(f0 / fps), '-t', String((f1 - f0) / fps)] : [];
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, ...aArgs, '-i', audio, '-map', '0:v:0', '-map', '1:a:0',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', '-t', String((f1 - f0) / fps), out]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`wrote ${out} in ${((Date.now() - started) / 1000).toFixed(0)} s`);
