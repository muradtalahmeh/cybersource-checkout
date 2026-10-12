// Capture frames at given times and build a contact sheet for visual review.
//   node tools/frames.mjs --project ref-fitness --out projects/ref-fitness/qa/sheet.png --times 1.0 3.5 7.9 ...
//   node tools/frames.mjs --project ref-fitness --scene-ends          (end-0.35 of every scene)
//   node tools/frames.mjs --project ref-fitness --every 1.0            (one frame per second)
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium } from './pw.mjs';
import { serve, ROOT } from './serve.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const has = (k) => argv.includes('--' + k);
const project = opt('project', 'ref-fitness');
const sb = JSON.parse(fs.readFileSync(path.join(ROOT, 'projects', project, 'storyboard.json'), 'utf8'));
let times = [];
if (has('times')) { const i = argv.indexOf('--times'); times = argv.slice(i + 1).filter((x) => !x.startsWith('--')).map(Number); }
else if (has('scene-ends')) times = sb.scenes.map((s) => Math.max(s.start, s.end - 0.35));
else if (has('every')) { const e = +opt('every', 1); for (let t = 0; t < sb.duration; t += e) times.push(+t.toFixed(3)); }
const out = path.resolve(opt('out', path.join(ROOT, 'projects', project, 'qa', 'sheet.png')));
const cols = +opt('cols', 4), cellW = +opt('cellw', 270);
const dir = fs.mkdtempSync(path.join(path.dirname(out), '.fr-'));

const { srv, port } = await serve();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`http://127.0.0.1:${port}/engine/index.html?project=${project}&render=1`);
await page.evaluate(() => window.videoReady);
let n = 0;
for (const t of times) {
  await page.evaluate((t) => window.renderAt(t), t);
  await page.screenshot({ path: path.join(dir, `f${String(n++).padStart(3, '0')}.png`), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
}
await browser.close(); srv.close();
// label + tile with ffmpeg
const labels = times.map((t) => t.toFixed(2)).join('|');
const rows = Math.ceil(times.length / cols);
const vf = `scale=${cellW}:-1,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='%{eif\\:n\\:d}':fontcolor=yellow:fontsize=20:x=6:y=6:box=1:boxcolor=black@0.6,tile=${cols}x${rows}:padding=4:margin=4:color=#222222`;
const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '1', '-i', path.join(dir, 'f%03d.png'), '-vf', vf, '-frames:v', '1', out]);
if (r.status !== 0) console.error(r.stderr.toString());
fs.rmSync(dir, { recursive: true, force: true });
console.log(`wrote ${out}  (${times.length} frames; cell index → time: ${times.map((t, i) => `${i}=${t.toFixed(2)}`).join(' ')})`);
if (errors.length) { console.error('PAGE ERRORS:\n' + errors.join('\n')); process.exit(1); }
