// Validate a storyboard against its transcript and write docs/STORYBOARD.md.
//   node tools/storyboard-check.mjs --project ref-fitness
// Checks: contiguous coverage 0..duration, text windows inside scene bounds,
// every on-screen Arabic word exists in the transcript (digits/badges exempt),
// kinetic lines ≤ 3 words, assets referenced exist on disk.
import fs from 'fs';
import path from 'path';
import { ROOT } from './serve.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const project = opt('project', 'ref-fitness');
const pdir = path.join(ROOT, 'projects', project);
const sb = JSON.parse(fs.readFileSync(path.join(pdir, 'storyboard.json'), 'utf8'));
const tr = JSON.parse(fs.readFileSync(path.join(pdir, sb.transcript || 'transcript.json'), 'utf8'));

const norm = (s) => s.replace(/[«»،,.؟?!:()"']/g, ' ').replace(/[ً-ْـ]/g, '')
  .replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').split(/\s+/).filter(Boolean);
const spoken = new Set(tr.sentences.flatMap((s) => norm(s.text)));
const problems = [], warnings = [];
let prevEnd = 0;
for (const sc of sb.scenes) {
  if (Math.abs(sc.start - prevEnd) > 0.002) problems.push(`${sc.id}: gap/overlap — starts ${sc.start} but previous ended ${prevEnd}`);
  prevEnd = sc.end;
  if (sc.end <= sc.start) problems.push(`${sc.id}: end <= start`);
  for (const t of sc.texts || []) {
    if (t.t0 < sc.start - 0.001 || t.t1 > sc.end + 0.001) problems.push(`${sc.id} "${t.text}": window ${t.t0}–${t.t1} outside scene ${sc.start}–${sc.end}`);
    if (t.t1 <= t.t0) problems.push(`${sc.id} "${t.text}": t1 <= t0`);
    const words = norm(t.text).filter((w) => !/^\d+$/.test(w));
    const ok = (w) => spoken.has(w) || spoken.has('و' + w) || (w.startsWith('و') && spoken.has(w.slice(1)));
    for (const w of words) if (!ok(w)) problems.push(`${sc.id} "${t.text}": word "${w}" not in transcript`);
    if (/^kinetic/.test(t.slot) && words.length > 3) warnings.push(`${sc.id} "${t.text}": kinetic line has ${words.length} words (>3)`);
  }
  for (const ic of sc.icons || []) if (!fs.existsSync(path.join(ROOT, 'assets/svg', ic.svg + '.svg'))) problems.push(`${sc.id}: missing assets/svg/${ic.svg}.svg`);
  if (sc.card) for (const v of Object.values(sc.card.icons || {})) for (const n of (Array.isArray(v) ? v : [v])) if (!fs.existsSync(path.join(ROOT, 'assets/svg', n + '.svg'))) problems.push(`${sc.id}: missing assets/svg/${n}.svg`);
}
if (Math.abs(prevEnd - sb.duration) > 0.002) problems.push(`last scene ends ${prevEnd}, duration is ${sb.duration}`);

// STORYBOARD.md
const md = [`# Storyboard — ${project}\n`, `Duration ${sb.duration}s · ${sb.scenes.length} scenes · ${sb.fps} fps\n`,
  ...sb.notes.map((n) => `- ${n}`), '',
  '| # | Start | End | Mode | Spoken words | Presenter | On-screen text (t0–t1, slot, font, color, anim) | Asset | In / Out | SFX cue | Review |', '|---|---|---|---|---|---|---|---|---|---|---|'];
for (const sc of sb.scenes) {
  const texts = (sc.texts || []).map((t) => `«${t.text}» ${t.t0}–${t.t1} · ${t.slot} · ${t.font} · ${t.color} · ${t.anim}`).join('<br>');
  md.push(`| ${sc.id} | ${sc.start.toFixed(2)} | ${sc.end.toFixed(2)} | ${sc.mode} | ${sc.words} | ${sc.presenter.rect} | ${texts || '—'} | ${sc.asset.type}${sc.asset.source ? ': ' + sc.asset.source : ''} | ${sc.transition_in} / ${sc.transition_out} | ${sc.sfx} | ${sc.review_notes || ''} |`);
}
md.push('', '## Per-scene details', '');
for (const sc of sb.scenes) {
  md.push(`### ${sc.id} (${sc.start}–${sc.end}) — ${sc.purpose}`, `- Framing: ${sc.framing}`, `- Audio overlap: ${sc.audio_overlap}`, `- Safe area: ${sc.safe_area}`, '');
}
md.push('## Check results', '', problems.length ? problems.map((p) => `- ❌ ${p}`).join('\n') : '- ✅ coverage contiguous, all text windows inside scenes, all on-screen words present in the transcript, all assets exist',
  warnings.length ? '\n' + warnings.map((w) => `- ⚠️ ${w}`).join('\n') : '');
fs.mkdirSync(path.join(pdir, 'docs'), { recursive: true });
fs.writeFileSync(path.join(pdir, 'docs/STORYBOARD.md'), md.join('\n'));
console.log(`scenes ${sb.scenes.length}, coverage 0–${prevEnd}s`);
for (const p of problems) console.log('❌ ' + p);
for (const w of warnings) console.log('⚠️ ' + w);
console.log(problems.length ? `${problems.length} problem(s)` : 'OK — wrote docs/STORYBOARD.md');
process.exit(problems.length ? 1 : 0);
