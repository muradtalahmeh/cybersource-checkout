// Capture still frames for review:  node tools/frames.mjs v|h <out_dir> t1 t2 ...
// Starts its own static server; prints page errors so nothing fails silently.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from './pw.mjs';
import { serve } from './serve.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [, , aspect = 'v', out = 'frames', ...times] = process.argv;
const [W, H] = aspect === 'h' ? [1920, 1080] : [1080, 1920];
const { srv, port } = await serve(root);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`http://127.0.0.1:${port}/index.html?render=1&aspect=${aspect}`);
await p.evaluate(() => window.videoReady);
fs.mkdirSync(out, { recursive: true });
for (const t of times) {
  await p.evaluate((t) => window.renderAt(+t), t);
  await p.screenshot({ path: path.join(out, `${aspect}_${(+t).toFixed(2).padStart(7, '0')}.png`) });
}
await b.close();
srv.close();
console.log(`${times.length} frames → ${out}`);
