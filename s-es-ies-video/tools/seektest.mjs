// Determinism check: the same time must give identical pixels whatever
// order frames were rendered in (forward, backward, random jumps).
import { chromium } from './pw.mjs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { serve } from './serve.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { srv, port } = await serve(root);
const aspect = process.argv[2] || 'v';
const [W, H] = aspect === 'h' ? [1920, 1080] : [1080, 1920];
const b = await chromium.launch();
const pageAt = async () => { const p = await b.newPage({ viewport: { width: W, height: H } }); await p.goto(`http://127.0.0.1:${port}/index.html?render=1&aspect=${aspect}`); await p.evaluate(() => window.videoReady); return p; };
const hash = async (p, t) => { await p.evaluate((t) => window.renderAt(t), t); return crypto.createHash('md5').update(await p.screenshot()).digest('hex'); };
const A = await pageAt(), B = await pageAt();
const dur = await A.evaluate(() => window.AUDIO_DURATION);
const probes = [0.07, 0.19, 0.31, 0.43, 0.57, 0.69, 0.81, 0.95].map((k) => +(k * dur).toFixed(2));
let ok = 0;
for (const t of probes) {
  const h1 = await hash(A, t);                                   // direct seek
  for (const j of [dur - 0.1, 0.5, Math.min(dur, t + 30), Math.max(0, t - 40)]) await B.evaluate((j) => window.renderAt(j), j);
  const h2 = await hash(B, t);                                   // after jumping around
  console.log(t.toFixed(2).padStart(7), h1 === h2 ? 'identical' : 'DIFFERENT');
  if (h1 === h2) ok++;
}
// timing
const t0 = Date.now(); for (let i = 0; i < 60; i++) await A.evaluate((t) => window.renderAt(t), dur * 0.3 + i / 30); const tr = (Date.now() - t0) / 60;
const t1 = Date.now(); for (let i = 0; i < 20; i++) { await A.evaluate((t) => window.renderAt(t), dur * 0.5 + i / 30); await A.screenshot({ type: 'jpeg', quality: 92 }); } const ts = (Date.now() - t1) / 20;
console.log(`${ok}/${probes.length} identical; render ${tr.toFixed(1)} ms/frame, render+capture ${ts.toFixed(0)} ms/frame`);
await b.close();
srv.close();
