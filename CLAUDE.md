# Project memory

This repository holds hand-drawn whiteboard videos made from the user's audio narrations, and the development copy of the skill that makes them. (`cybersource-checkout.zip` is an unrelated original upload; leave it alone.)

## Decision in force (2026-10-12) — use skill v1.0 for production
- **Produce videos with the installed account skill `audio-whiteboard-animation` v1.0, unchanged.** It is byte-identical to commit `a611ae6` (`skill-dev/audio-whiteboard-animation/` at that commit). Its description still says "typically an Arabic lesson explaining English" — that is how to recognise it.
- **v1.1 is parked, not in production.** `skill-dev/audio-whiteboard-animation/` (commit `ba6bbd7`) is v1.1: general workflow in `SKILL.md` + `references/domains/education-language.md`, no code change. Packaged at `skill-dev/dist/audio-whiteboard-animation-v1.1.skill`. Do not install it, ship it, or produce videos with it unless the user asks.
- Why: Phase 1 regression showed identical rendering/export (`skill-dev/results/phase1-vs-baseline.md`), but the A/B storyboard experiment was inconclusive — one v1.1 run dropped a spoken English example (`skill-dev/results/ab-test-v1.0-vs-v1.1/README.md`).
- **Further development of the skill happens later, only when the user asks**, in steps, each with the user's approval: next candidates are the mixed-language re-decode rule from the A/B README, then (per the agreed plan) image/SVG commands, domain packs (fitness, marketing, story, religious). Do not start any of it on your own.

## Making a new video (the user's next work: more educational videos with v1.0)
Follow the installed v1.0 skill exactly. Practical notes from earlier productions:
- Put each video in its own folder at the repo root (like `past-simple-video/`, `ielts-pronunciation-video/`), created with the skill's `scripts/new_project.sh`.
- The Whisper-small ONNX model downloads from the npm registry via `asr_setup.sh` (HuggingFace/GitHub downloads are blocked here). Re-decode every span that may contain English with `--lang en`; check deliberately wrong examples with `score_candidates.py` and flag them.
- Cut audio excerpts with `-af atrim=start=…:end=…` (an input `-ss` + `-to` combination double-seeked once). Verify any cut by cross-correlating with the original.
- Verify before reporting: `tools/seektest.mjs` 8/8, ffprobe frame count, clean decode, audio offset 0 ms vs the original, frames at spoken moments.
- Full-quality MP4 masters can exceed GitHub's 100 MB limit (git-ignore them, commit a 720p preview); files sent in chat must be ≤ 30 MB.
- Audio that is not the user's own (e.g. another creator's video): don't draw the real person; remind the user about publishing rights.

## Regression harness (for any future change to the skill)
`skill-dev/regression/run.sh <skill-dir> <out-dir>` rebuilds both existing videos from a skill folder and checks scenes, golden frames, determinism and MP4/audio/picture timing (~8 min); compare with `python3 skill-dev/regression/compare.py skill-dev/results/baseline-v1.0 <out-dir>`. Baseline description: `skill-dev/BASELINE.md`. Golden frames are only comparable on Chromium build 1194.

## Videos in this repo
- `past-simple-video/` — Past Simple lesson, 7:00, 20 scenes, both aspect ratios (previews in `output/`; masters regenerate with `node tools/render.mjs --aspect v|h`).
- `ielts-pronunciation-video/` — 25 s IELTS pronunciation challenge, both aspect ratios.
- `scale-weight-video/` — 72.6 s fitness Reel ("ليش الميزان زاد كيلو؟", another creator's audio with a «حاجز» call to action), 9:16 only, 7 scenes. Claude Artifact (player, scenes, timed transcript, MP4): https://claude.ai/artifact/GfHPiWrKqJUik88qvJ9aBm — rebuild its page with `sh tools/artifact_facts.sh` and republish `artifact/index.html` with the same `files` (js/*.js except player.js, thumbs/, audio/narration.wav, video/…720p.mp4). Artifacts don't serve .flac and block page downloads (no in-browser export).
- `s-es-ies-video/` — 9:28.7 lesson on adding -s / -es / -ies (TTS narration, teacher «مرام القيق», «مركز آرام التعليمي» — names inferred), 23 scenes, both aspect ratios. This project's `js/font.js` adds lowercase single-stroke glyphs plus `→` and `·`, and its word helpers are case-aware, so English is written in natural case (the v1.0 template is uppercase-only; the skill itself is unchanged). Scene parts were assembled from `/tmp` during production; `js/scenes.js` is the source of truth.
