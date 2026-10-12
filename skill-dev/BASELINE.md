# Baseline — audio-whiteboard-animation v1.0 (before Phase 1)

Recorded before any change to the skill, so every later change can be checked against it.

## What was frozen
- `skill-dev/audio-whiteboard-animation/` — byte-identical copy of the installed skill (30 files; `diff -r` against the installed copy: no differences).
- `regression/inventory-v1.0.json` — every instruction unit (45 bullets/paragraphs, ≥ 26 chars) and the description of the v1.0 `SKILL.md`. Later versions must still contain each unit verbatim, or the report must name it.
- `results/baseline-v1.0/` — full regression run (see below). `results/baseline-v1.0-repeat/` — a second run of the same version, proving the harness is repeatable.
- Environment: see `results/baseline-v1.0/env.txt` (golden-frame hashes are only comparable on the same Chromium build).

## Fixtures (the existing videos)
| fixture | project | audio | scenes | strokes | clips exported |
|---|---|---|---|---|---|
| past-simple | `past-simple-video/` | narration.wav, 420.28 s | 20 | 2584 | 9:16 0–20 s, 16:9 186–196 s |
| ielts | `ielts-pronunciation-video/` | original.mp3, 24.99 s | 7 | 166 | 9:16 and 16:9, full |

Each fixture is rebuilt from scratch from the skill (`scripts/new_project.sh` + the fixture's own `scenes.js`, `storyboard.js`, `transcript.js`), so the test exercises the skill's template, scripts and tools — not the committed copies.

## Tests (`regression/run.sh <skill> <out>`, ~8 min)
1. **Skill static checks** — frontmatter, every referenced path exists, sha256 of all template/scripts files, instruction inventory.
2. **Storyboard coverage** — scenes contiguous over the whole audio, every narration segment assigned.
3. **Scene checks (9:16 and 16:9)** — no page/console errors or failed requests; scene ids = storyboard; every scene has strokes, is visible and has finished ink at its end; hand never NaN; nothing drawn after the audio ends; AUDIO_DURATION = file duration; stroke/fade/animation/camera counts; pen-stroke overlaps.
4. **Golden frames** — md5 of frames at mid and end of every scene (41 + 15 per format).
5. **Determinism** — `tools/seektest.mjs` (same time ⇒ identical pixels whatever the seek order).
6. **Export** — real MP4 clips via `tools/render.mjs`: H.264, size, 30 fps, exact frame count, clean full decode, AAC duration, audio offset vs the original narration at 3 points, and picture timing (decoded frame at t matches the engine render at t, PSNR, better than at ±0.2 s).

## Baseline results (v1.0)
- Skill: 25 code files, 0 missing paths.
- past-simple: 20 scenes, no problems, seektest 8/8 (both formats); clips: 600 and 300 frames, audio offsets 0.0 ms ×3, picture timing PSNR 40.4–42.7 dB at t vs 14.7–22.4 dB at ±0.2 s.
- ielts: 7 scenes, no problems, seektest 8/8 (both formats); clips: 750 frames each, audio offsets 0.0 ms ×3, PSNR 39.3–40.1 dB.
- Repeat run of the same version: golden frames 56/56 identical per format, identical structure and export results → **the harness is repeatable**.
- Template build vs the committed projects: 41/41 and 15/15 identical frames → the template reproduces the existing videos exactly.

Compare any run with: `python3 regression/compare.py results/baseline-v1.0 <run-dir>`.
