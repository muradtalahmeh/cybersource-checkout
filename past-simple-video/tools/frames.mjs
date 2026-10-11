// Capture still frames at given times: node tools/frames.mjs v out_dir t1 t2 ...
import { chromium } from './pw.mjs';
const [, , aspect = 'v', out = 'frames', ...times] = process.argv;
const [W, H] = aspect === 'h' ? [1920, 1080] : [1080, 1920];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`http://127.0.0.1:${process.env.PORT || 8765}/index.html?render=1&aspect=${aspect}`);
await p.evaluate(() => window.videoReady);
const fs = await import('fs'); fs.mkdirSync(out, { recursive: true });
for (const t of times) {
  await p.evaluate((t) => window.renderAt(+t), t);
  await p.screenshot({ path: `${out}/${aspect}_${String(t).padStart(7, '0')}.png` });
}
await b.close();
