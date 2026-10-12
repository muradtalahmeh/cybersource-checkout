---
name: audio-whiteboard-animation
description: Turn a recorded narration (any language, any topic; specialized guidance for language lessons) into a complete hand-drawn whiteboard animation video synchronized to that exact audio. The workflow transcribes the audio with measured timestamps, picks the content domain, builds an audio-aligned storyboard, progressively draws SVG strokes with a drawing hand that follows the active stroke, and adds doodle characters, a preview player, and a frame-exact MP4 export in 9:16 (Reels/TikTok) and 16:9. Use this skill whenever the user uploads or mentions a voice-over, narration, lesson recording, podcast clip or audio explanation and wants a video, animation, explainer, whiteboard/doodle/sketch video, Reel or TikTok made from it, even if they don't say "whiteboard". This includes Arabic requests such as "حوّل التسجيل الصوتي إلى فيديو", "فيديو رسوم متحركة للدرس", "فيديو وايت بورد", "اعمل فيديو تعليمي من الصوت", "رسم باليد مع الشرح". Also use it to extend, re-time, restyle or re-export a project made this way.
---

# Audio → hand-drawn whiteboard video

The user has already recorded the narration. The job is to make the audio *visible*: every scene shows the meaning of what is being said at the moment it is said. The voice is drawn out by a hand, with characters acting out the examples. It is not a slideshow and not subtitles.

Three commitments drive every decision below:
1. **The audio is the master clock and is never altered.** No re-voicing, trimming or rewriting. Every visual time comes from measured timestamps.
2. **Never claim what you have not verified.** If you could not transcribe, don't invent a transcript; if you inferred a word, flag it; if you didn't render, don't say "exported".
3. **Real drawing, not fades.** Lines are revealed along their path and the pen tip sits on the point being drawn, using the same progress value.

Everything reusable is bundled. Don't rewrite the engine; write the lesson.

```
template/            copy-ready project (engine, hand, pen font, characters, player, exporter)
scripts/             new_project.sh · asr_setup.sh · detect_speech.py · transcribe.py ·
                     score_candidates.py · contact_sheet.py
references/engine-api.md          API for writing scenes (read before Phase 4)
references/example-past-simple/   a full 7-minute, 20-scene production to imitate
```

Domain guidance lives in `references/domains/` and is chosen in Phase 2b. This file is the workflow for every domain; a domain file only adds checks and design rules for its kind of content.

## Phase 1 — Inspect (report findings before building)

- Find the audio and any reference image the user mentions. If they mention a reference image that isn't there, say so explicitly and continue with the written brief (cream paper, black line art, beige, dark green). Don't silently pretend you followed it.
- `ffprobe` the audio: codec, sample rate, channels, exact duration.
- Check capabilities: `ffmpeg -encoders | grep -E "libx264|aac"`, Playwright + Chromium (`npm root -g`, `/opt/pw-browsers`), Python. Tell the user which of preview, MP4 export and transcription are actually possible here.
- Create the project: `bash <skill>/scripts/new_project.sh <audio> <project-dir> "<Title>"`. The audio is copied byte-exact and its sha256 printed, so you can prove it's unchanged.

## Phase 2 — Analyze the recording

```bash
MODEL=$(bash <skill>/scripts/asr_setup.sh small | tail -1)
python3 <skill>/scripts/detect_speech.py <dir>/assets/audio/narration.wav --out spans.json
python3 -I <skill>/scripts/transcribe.py --audio … --spans spans.json --key sentences --model-dir "$MODEL" --lang ar --out ar.json
```
(Use `--lang` for the narration language.)

Then:
1. **English (or other second-language) examples.** When forced to the narration language, Whisper *translates* embedded English sentences into it. Typical signs are an odd Arabic phrase where an example should be, or "مثلاً" followed by nonsense. Re-decode those spans with `--lang en` (write them as a JSON list of `[s,e]`).
2. **Repetition loops / garbage** (`LOOP` in the output): re-decode just that span at phrase level (`--key phrases` subset) or with the other language.
3. **Exact moments** (when "played" is said, when the answer starts): use the `phrases` regions from `spans.json`.
4. **Domain checks.** Choose the domain now (Phase 2b) and apply the transcript checks of its domain file before you finalise the text.
5. **Review the text yourself**, correcting dialect and ASR errors from context. Write `js/transcript.js` as `{s, e, ar?, en?, flag?}` entries. Timestamps stay measured; only wording is corrected.
6. **Check the content.** Read the explanation as a teacher. If the narration teaches something incorrect, flag it for the user and don't illustrate a contradiction. Never "fix" the audio.

If no ASR is possible (no model reachable, install refused), stop and ask the user for a transcript with timestamps. Don't guess. If a sandbox/permission layer blocks installing a package, a safer route that has worked is downloading the npm tarball **as data** (what `asr_setup.sh` does, checking that it only contains .onnx/.json/.txt) and running it with the official `onnxruntime`. If that is refused too, tell the user what you need.

Useful environment facts: huggingface.co and github.com downloads are often blocked in sandboxes, while registry.npmjs.org and PyPI usually work. Whisper-small handles Levantine/Gulf/Egyptian Arabic acceptably once hand-corrected.

## Phase 2b — Choose the domain

1. If the user named the kind of content ("درس قواعد", "فيديو تسويقي", "domain: …"), use that.
2. Otherwise decide from the reviewed transcript: what is the narration trying to do (teach a language, explain a concept, sell, tell a story, …)?
3. Read the matching domain file **completely** before writing the storyboard, and follow it together with this file:

| domain | signals in the narration | guidance |
|---|---|---|
| Language lessons (grammar, vocabulary, pronunciation) | explains a rule of a language, contrasts correct/incorrect forms, gives and translates example sentences, asks the viewer to say or translate something | `references/domains/education-language.md` |
| Anything else | — | no domain file yet: follow this file only |

4. If the content fits no domain file, say so to the user ("no specialized guidance exists yet for this kind of content") and use the general rules below only. Don't borrow another domain's conventions (for example grammar formula boxes or red ✗ strike-throughs) unless they genuinely fit the content.
5. State the chosen domain together with the scene table in Phase 3, so the user can correct it before anything is drawn.

## Phase 3 — Storyboard (`js/storyboard.js`)

Map the narration into scenes of roughly 10–30 s, cut at idea boundaries that fall on real pauses. Scenes must be contiguous from 0 to the audio's end. Fill every field (concept, visual, characters, drawing order, hand, animation, English text, Arabic text, camera, transition, sync, review). Then run `node tools/storyboard.mjs`: it checks coverage and writes `docs/STORYBOARD.md` with the exact narration per scene. Show the user the scene table.

Design rules for every domain:
- Every drawing must show something the narration says at that moment. If no sentence needs it, it is decoration: cut it.
- Keep the same characters and objects for the same roles throughout, so the video reads as one story.
- Write only text that is in the narration (short labels are fine when they genuinely help). Never invent examples or facts.
- Vary transitions: pan right, pan down, diagonal zoom-out, wipe-erase in place, close-up zoom on a word.
- Pauses are for finishing drawings, reactions (cheer, frown), and letting the viewer think (quiz: the hand leaves the frame).

Then apply the storyboard design rules of the chosen domain file.

## Phase 4 — Prototype, then build

Read `references/engine-api.md` first. Glance at the example's scenes.js for the scene type you're making (hook dialogue, timeline, transformation rows, formula boxes, right/wrong pairs, Q&A, quiz).

1. Build the first scene only. Serve with `npx http-server -p 8765 -s -c-1 . &` (or any static server), then `node tools/frames.mjs v /tmp/fr <times…>` and `python3 <skill>/scripts/contact_sheet.py /tmp/fr sheet.png`. Look at the sheet: is the pen tip on the stroke, are characters drawn part by part, are words written while spoken? Check the browser console output for errors.
2. Build all scenes for 9:16, then capture **the end frame of every scene** (t = end − 0.35) as contact sheets and fix overflow, collisions, crops and long bubble tails. Then capture **mid-transition** frames (pans, erases, walking) for a second pass.
3. Repeat for 16:9 (`frames.mjs h …`). It's a separate composition via `pk(v, h)`, not a crop.
4. `node tools/seektest.mjs v` must report all probes identical (frames don't depend on seek order).
5. Check every on-screen text for spelling and correctness, then run the build checks of the chosen domain file.

## Phase 5 — Export and verify

```bash
node tools/render.mjs --aspect v --workers 4      # ≈ 14 fps on 4 cores: 7 min of video ≈ 12 min
node tools/render.mjs --aspect h --workers 4
node tools/render.mjs --aspect v --from 0 --to 18 --out clip.mp4   # quick sync test first
```
Run long renders in the background. Then verify, and report the numbers:
- `ffprobe`: codec, resolution, fps, frame count = ceil(duration × fps), audio duration = original.
- `ffmpeg -v error -i out.mp4 -f null -` decodes with no errors.
- Audio alignment: cross-correlate the MP4's decoded audio with the original WAV at the start, middle and end; expect 0 ms.
- Pull 2–3 frames at known spoken moments and confirm the word is being written.

Delivery: files sent in chat are capped (~30 MB), so make a 720p preview (`-crf 30 -preset slow`, AAC 96k) for sending and keep the full master. GitHub rejects files > 100 MB, so git-ignore masters and commit previews and source.

## Final report to the user

State plainly what was done and verified: audio duration and hash unchanged, scene count and coverage, transcript method, output files with their verified properties, sync check result. Then give an explicit list of what needs their review:
- flagged transcript words,
- a missing reference image,
- the vector hand (no finger articulation),
- Arabic revealed rather than stroked,
- AAC in the MP4,
- any content concerns.

Offer next steps (match a reference image, change characters, burn in captions with `--captions`).
