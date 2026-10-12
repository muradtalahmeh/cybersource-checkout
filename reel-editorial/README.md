# reel-editorial — Dark Tech Neo-Editorial Reel pipeline

Standalone hybrid editing pipeline: takes a recorded presenter video (real voice,
never altered) and produces a 9:16 1080x1920 reel with synced Arabic kinetic
text, glowing presenter frame, blurred backdrop, cream editorial cards and a
closing/CTA only when the audio itself contains one.

Engine: HTML/CSS/SVG rendered frame-by-frame in Chromium (Playwright) + ffmpeg.
Every frame is a pure function of audio time, so preview and export match.

```
config/        identity.json (colours, fonts, sizes, safe areas), render.json
engine/        preview + render page (index.html, css/, js/)
tools/         inspect, detect_speech.py, transcribe.py, extract, render, qa
assets/        fonts (Cairo, OFL), sfx (none yet), svg
projects/<p>/  source/ audio/ frames/ spans.json transcript.json storyboard.json output/ qa/
```

Phases: A inspect → B transcription (reviewed by a human) → C semantic
segmentation → D storyboard → E assets → F compositing → G render → H QA.

Speech model: Whisper-small ONNX (CPU) cached under `~/.cache/reel-editorial/`.
