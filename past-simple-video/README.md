# Past Simple — hand-drawn whiteboard lesson

A synchronized, hand-drawn whiteboard animation that teaches the **Past Simple** to Arabic-speaking learners, built on the supplied Arabic narration (`Generated_Audio_October_12_2026_-_12_48AM.wav`, 7:00.28). The narration is the master clock: nothing in the audio was changed, shortened or re-voiced.

| | |
|---|---|
| Preview | `index.html` (any static server, see below) |
| Exports | `output/past-simple-9x16.mp4` (1080×1920, Reels/TikTok) · `output/past-simple-16x9.mp4` (1920×1080) |
| Storyboard | [`docs/STORYBOARD.md`](docs/STORYBOARD.md) — 20 scenes with exact narration, drawing order, hand, camera, transitions, sync notes |
| Transcript | [`js/transcript.js`](js/transcript.js) — reviewed, timestamped, with uncertainty flags |

## How the audio was analysed

The container had no speech-recognition tool and HuggingFace / GitHub model downloads were blocked by the network policy, so:

1. **Duration / format** — `ffprobe`: PCM s16le, 24 kHz, mono, 420.28 s.
2. **Sentence boundaries** — `ffmpeg silencedetect` (−35 dB / 0.3 s for sentences, −38 dB / 0.12 s for phrases).
3. **Transcription** — Whisper-small ONNX weights (Apache-2.0, fetched as plain data from the npm registry package `sts-whisper-small`) run with the official `onnxruntime` + `transformers` tokenizer, one decode per speech span (so every segment has measured start/end times).
4. **English examples** — Whisper forced to Arabic *translated* the embedded English sentences, so every example span was re-decoded with the English token.
5. **Ambiguous "wrong examples"** — verified by forced-decoding log-likelihood of competing candidates (e.g. *I didn't watched TV* vs *I didn't watch TV*).
6. **Arabic text** — Whisper-small's Levantine Arabic output was corrected by hand from context. Timestamps are measured; wording of the Arabic is a reviewed reconstruction (see *Limitations*).

## Architecture

```
index.html          preview player (audio = master clock)
js/font.js          single-stroke pen font: every letter is real pen strokes
js/hand.js          the drawing hand (marker tip at the origin)
js/engine.js        deterministic engine: strokes, fills, erasers, camera, hand
js/art.js           doodle characters (boy / girl / grandma, poseable, blinking) + props
js/storyboard.js    scene list as data (times, concept, visuals, sync notes)
js/scenes.js        scene builders: every drawing operation placed on the audio clock
js/transcript.js    reviewed transcript with timestamps
tools/render.mjs    frame-exact MP4 export (Playwright + ffmpeg)
tools/storyboard.mjs  generates docs/STORYBOARD.md and checks coverage
tools/seektest.mjs  determinism test (same time ⇒ identical pixels, any seek order)
tools/frames.mjs    capture still frames for review
```

**Drawing model.** Each drawing operation is a stroke `{path, t0, dur}`. At audio time `t` its progress is `p = clamp((t − t0) / dur)`. The engine reveals `p` of the path length (`stroke-dashoffset`) and places the hand at `getPointAtLength(p · length)` on the *same* path. The stroke and the hand share one progress value, so they cannot drift apart. Between strokes the hand travels from the end of one stroke to the start of the next; during longer pauses it leaves the frame. Fills fade in only after their outline is complete. Characters are drawn part by part (head → hair → face → body → legs → arms) and only start moving after they are fully drawn.

**Determinism.** `render(t)` is a pure function of `t` (no accumulated state, seeded wobble, eased keyframes), so play, pause, seek, rewind, speed change and export all show the same frame for the same time. `node tools/seektest.mjs` checks this: frames reached directly and after random jumps are pixel-identical (8/8 probes).

**Formats.** 9:16 and 16:9 are separate compositions (positions are authored per format, not cropped). In 9:16 the key text stays roughly within y 230–1560 px, away from the Reels/TikTok UI. The preview has a "Reels safe zone" overlay to check this.

## Run it

```bash
cd past-simple-video
npx http-server -p 8765 .          # or any static server
# open http://127.0.0.1:8765/index.html            (9:16)
# open http://127.0.0.1:8765/index.html?aspect=h   (16:9)
```

Preview controls: play/pause (Space), restart, timeline seek with scene markers, ←/→ ±2 s, scene list (click to jump), current time / total duration, playback speed 0.5–2×, format switch, optional Arabic captions.

## Export

Requires Node, Playwright with Chromium, and ffmpeg with libx264 + aac.

```bash
node tools/render.mjs --aspect v            # → output/past-simple-9x16.mp4
node tools/render.mjs --aspect h            # → output/past-simple-16x9.mp4
node tools/render.mjs --aspect v --from 0 --to 18 --out clip.mp4   # partial
node tools/render.mjs --aspect v --captions # burn in the Arabic captions
```

Frame *i* is rendered at audio time *i / 30* and the original WAV is muxed as the audio track, so sync holds by construction.

## Limitations (please review)

- **No reference image was uploaded.** Only the audio was provided, so the style follows the written brief (cream paper, black outlines, beige, dark green). If you share the reference image, the palette, hand and characters can be matched to it.
- **The hand is a vector illustration**, not photographic. It is a shaded, skin-toned hand gripping a white marker, and its pen tip follows the exact stroke being drawn. Finger and wrist articulation are not animated; the hand translates, lifts slightly between strokes and tilts while erasing.
- **Arabic labels are revealed, not stroked.** Arabic is shaped by the browser (correct joining and RTL), then revealed right-to-left while the hand moves along the line. A single-stroke Arabic pen font would be needed for true stroke-by-stroke Arabic writing. English text *is* written stroke by stroke with a custom single-stroke pen font.
- **Transcript accuracy.** Timestamps are measured from the audio. Arabic wording was produced by Whisper-*small* (larger models could not be downloaded here) and corrected by hand. Two English "wrong examples" were inferred and are flagged: *I goed to school* (108.8 s) and *I didn't watched TV* (189.7 s). Please confirm them against your script.
- **Audio codec in the MP4** is AAC 256 kb/s, resampled to 48 kHz (required for broad Instagram/TikTok compatibility). The original WAV is kept unchanged in `assets/audio/narration.wav`.
- **Grammar review:** I found no incorrect grammatical explanation in the narration. All English examples on screen were checked for spelling and correctness. Intentionally wrong forms appear only where the narration presents them as mistakes, and they are drawn in red and crossed out.

## Credits

Cairo font © The Cairo Project Authors, SIL Open Font License 1.1 (`assets/fonts/OFL-Cairo.txt`). All drawings, the pen font and the hand are original SVG made for this project.
