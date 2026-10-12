// Determinism probe: render the same times in two different orders and
// compare the screenshots byte for byte. Frames must not depend on history.
//   node tools/seektest.mjs --project ref-fitness [--times 3.5 16.5 24.9 44 57]
import crypto from 'crypto';
import { chromium } from './pw.mjs';
import { serve } from './serve.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const project = opt('project', 'ref-fitness');
let times = [3.5, 8.2, 16.5, 21.2, 24.9, 33.0, 44.0, 47.2, 57.2];
if (argv.includes('--times')) times = argv.slice(argv.indexOf('--times') + 1).filter((x) => !x.startsWith('--')).map(Number);
const { srv, port } = await serve();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`http://127.0.0.1:${port}/engine/index.html?project=${project}&render=1`);
await page.evaluate(() => window.videoReady);
async function shot(t) { await page.evaluate((t) => window.renderAt(t), t); return crypto.createHash('sha1').update(await page.screenshot({ type: 'png' })).digest('hex'); }
const A = {}; for (const t of times) A[t] = await shot(t);
const B = {}; for (const t of [...times].reverse()) B[t] = await shot(t);
await browser.close(); srv.close();
let bad = 0;
for (const t of times) { const ok = A[t] === B[t]; if (!ok) bad++; console.log(`${ok ? '✅' : '❌'} t=${t}  ${A[t].slice(0, 12)} ${ok ? '==' : '!='} ${B[t].slice(0, 12)}`); }
console.log(bad ? `${bad} frame(s) differ by seek order` : 'all probes identical regardless of seek order');
process.exit(bad ? 1 : 0);
