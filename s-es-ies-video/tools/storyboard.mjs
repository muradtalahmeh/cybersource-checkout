// Generate docs/STORYBOARD.md from js/storyboard.js + js/transcript.js and
// check that the scenes cover the whole recording without gaps.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['js/transcript.js', 'js/storyboard.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
const { STORYBOARD: SB, TRANSCRIPT: TR, AUDIO_DURATION: DUR } = ctx.window;
const fmt = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`;
const problems = [];
if (SB[0].start !== 0) problems.push('first scene does not start at 0');
SB.forEach((s, i) => { if (i && Math.abs(SB[i - 1].end - s.start) > 1e-6) problems.push(`gap/overlap ${SB[i - 1].id}→${s.id}`); });
if (Math.abs(SB[SB.length - 1].end - DUR) > 1e-6) problems.push('last scene does not end at audio end');
const orphan = TR.filter((seg) => !SB.some((s) => seg.s >= s.start - 0.05 && seg.s < s.end));
if (orphan.length) problems.push(`${orphan.length} transcript segments not in any scene`);

let md = `# Storyboard (audio-aligned)\n\nAudio: \`assets/audio/narration.wav\` · ${fmt(DUR)} (${DUR} s) · 24 kHz mono PCM. ${SB.length} scenes, ${TR.length} narration segments.\n\n`;
md += `Coverage check: ${problems.length ? '**' + problems.join('; ') + '**' : 'scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.'}\n\n`;
md += `Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see \`js/transcript.js\`). Scene builders in \`js/scenes.js\` place every stroke on this clock.\n\n`;
md += '| # | Start | End | Title |\n|---|---|---|---|\n' + SB.map((s) => `| ${s.id} | ${fmt(s.start)} | ${fmt(s.end)} | ${s.title} |`).join('\n') + '\n\n';
for (const s of SB) {
  const segs = TR.filter((seg) => seg.s >= s.start - 0.05 && seg.s < s.end);
  md += `## ${s.id} · ${s.title}\n\n**${fmt(s.start)} → ${fmt(s.end)}** (${(s.end - s.start).toFixed(1)} s)\n\n`;
  md += `**Narration**\n\n` + segs.map((g) => `- \`${fmt(g.s)}–${fmt(g.e)}\` ${g.ar ? '‏' + g.ar : ''}${g.en ? (g.ar ? ' — ' : '') + '*' + g.en + '*' : ''}${g.flag ? ` ⚠️ ${g.flag}` : ''}`).join('\n') + '\n\n';
  const rows = [['Educational concept', s.concept], ['Visual situation', s.visual], ['Characters & objects', s.characters], ['Drawing sequence', s.drawing], ['Hand movement', s.hand], ['Character animation', s.animation],
    ['English text', s.english.join(' · ') || '—'], ['Arabic text', s.arabic.join(' · ') || '—'], ['Camera', s.camera], ['Transition', s.transition], ['Synchronization', s.sync]];
  if (s.review) rows.push(['Review note', s.review]);
  md += '| | |\n|---|---|\n' + rows.map(([k, v]) => `| ${k} | ${String(v).replace(/\|/g, '\\|')} |`).join('\n') + '\n\n';
}
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/STORYBOARD.md'), md);
console.log(problems.length ? 'PROBLEMS: ' + problems.join('; ') : `OK: ${SB.length} scenes cover 0–${DUR}s, all ${TR.length} segments assigned`);
