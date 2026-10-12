// Scene-level checks + golden frame hashes for one built project.
//   node check_scenes.mjs <projectDir> <v|h> <out.json>
// Records: page/console errors and failed requests, scene/storyboard
// consistency, per-scene drawing state at its end, pen-stroke overlaps,
// audio duration agreement, and md5 of frames at fixed times (mid + end of
// every scene) so two builds can be compared frame by frame.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';
const [, , proj, aspect, out] = process.argv;
const root = path.resolve(proj);
const { chromium } = await import(pathToFileURL(path.join(root, 'tools/pw.mjs')));
const { serve } = await import(pathToFileURL(path.join(root, 'tools/serve.mjs')));
const [W, H] = aspect === 'h' ? [1920, 1080] : [1080, 1920];
const { srv, port } = await serve(root);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
const errors = [], failed = [];
p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
p.on('requestfailed', (r) => failed.push(r.url()));
p.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
await p.goto(`http://127.0.0.1:${port}/index.html?render=1&aspect=${aspect}`);
await p.evaluate(() => window.videoReady);

const audioDur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(root, 'assets/audio/narration.wav')]).toString();
const info = await p.evaluate(() => {
  const E = window.E, SB = window.STORYBOARD;
  const pen = E.strokes.filter((s) => !s.hidden);
  let overlaps = 0;
  const sorted = [...pen].sort((a, b) => a.t0 - b.t0);
  for (let i = 1; i < sorted.length; i++) if (sorted[i].t0 < sorted[i - 1].t0 + sorted[i - 1].dur - 0.05) overlaps++;
  return {
    audioDurationDeclared: window.AUDIO_DURATION,
    storyboardIds: SB.map((s) => s.id),
    sceneIds: E.scenes.map((s) => s.id),
    strokes: E.strokes.length, penStrokes: pen.length, fades: E.fades.length, anims: E.anims.length, camKeys: E.camKeys.length,
    penOverlaps: overlaps,
    lastStrokeEnd: Math.max(...E.strokes.map((s) => s.t0 + s.dur)),
    perScene: E.scenes.map((s) => ({ id: s.id, start: s.start, end: s.end, strokes: s.strokes.length,
      drawnAfterHidden: s.strokes.filter((k) => k.t0 + k.dur > s.until + 1e-6).length })),
  };
});
// per-scene state at the end of the scene: visible and has finished ink
info.sceneEndState = [];
for (const sc of info.perScene) {
  const t = Math.max(sc.start, sc.end - 0.35);
  await p.evaluate((t) => window.renderAt(t), t);
  info.sceneEndState.push(await p.evaluate(({ id, t }) => {
    const s = window.E.scenes.find((x) => x.id === id);
    const done = s.strokes.filter((k) => !k.hidden && t >= k.t0 + k.dur).length;
    const hand = document.getElementById('drawingHand').getAttribute('transform');
    return { id, t, visible: !!s.vis, finishedPenStrokes: done, handOk: !/NaN/.test(hand) };
  }, { id: sc.id, t }));
}
// golden frames
const times = [0.5];
for (const sc of info.perScene) times.push(+(sc.start + (sc.end - sc.start) * 0.6).toFixed(3), +Math.max(sc.start, sc.end - 0.35).toFixed(3));
const golden = {};
for (const t of times) {
  await p.evaluate((t) => window.renderAt(t), t);
  golden[t.toFixed(3)] = crypto.createHash('md5').update(await p.screenshot()).digest('hex');
}
await b.close(); srv.close();
const problems = [];
if (Math.abs(audioDur - info.audioDurationDeclared) > 0.02) problems.push(`AUDIO_DURATION ${info.audioDurationDeclared} != file ${audioDur}`);
if (JSON.stringify(info.storyboardIds) !== JSON.stringify(info.sceneIds)) problems.push('scene ids differ from storyboard');
for (const s of info.perScene) if (!s.strokes) problems.push(`${s.id} has no strokes`);
for (const s of info.sceneEndState) { if (!s.visible) problems.push(`${s.id} not visible at its end`); if (!s.finishedPenStrokes) problems.push(`${s.id} has no finished ink at its end`); if (!s.handOk) problems.push(`${s.id} hand NaN`); }
if (info.lastStrokeEnd > audioDur + 0.05) problems.push(`drawing continues after audio end (${info.lastStrokeEnd})`);
if (errors.length) problems.push(`${errors.length} page errors`);
const res = { aspect, audioDurationFile: audioDur, ...info, errors, failedRequests: [...new Set(failed)], golden, problems };
fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log(`${path.basename(root)} ${aspect}: ${info.sceneIds.length} scenes, ${info.strokes} strokes, ${Object.keys(golden).length} golden frames, problems: ${problems.length ? problems.join('; ') : 'none'}`);
