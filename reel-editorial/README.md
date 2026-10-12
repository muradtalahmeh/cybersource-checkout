# reel-editorial — Dark Tech Neo-Editorial Reel pipeline

Standalone hybrid editing pipeline: takes a recorded presenter video (real voice,
never altered) and produces a 9:16 1080x1920 reel with synced Arabic kinetic
text, a glowing presenter frame, a blurred backdrop, cream editorial cards and a
closing/CTA only when the audio itself contains one.

Engine: HTML/CSS/SVG rendered frame-by-frame in Chromium (Playwright, resolved
from the global npm root) + ffmpeg. Every frame is a pure function of audio
time, so preview and export match and seek order never matters.

```
config/identity.json      colours, fonts, sizes, layout rects, motion timings
engine/                   index.html (preview + render page), css/, js/engine.js, js/player.js
tools/
  detect_speech.py        silence-based speech spans (sentence / phrase / fine)
  transcribe.py           Whisper-small ONNX (CPU) per span, measured timings
  storyboard-check.mjs    coverage + words-in-transcript + assets → docs/STORYBOARD.md
  frames.mjs              contact sheets at chosen times / scene ends
  seektest.mjs            determinism probe
  render.mjs              parallel frame-exact export, original audio stream copied
  qa.mjs                  measured QA report → qa/QA_REPORT.md
  serve.mjs · pw.mjs      static server · Playwright resolver
assets/fonts (Cairo, OFL) · assets/svg (generated icons) · assets/sfx (empty)
projects/<name>/          source/ audio/ frames/src/ spans.json transcript.json storyboard.json output/ qa/ docs/
```

## Workflow (per project)
```bash
P=projects/<name>
ffmpeg -i $P/source/original.mp4 -vn -c:a copy $P/audio/original.m4a
ffmpeg -i $P/source/original.mp4 -vn -ac 1 -ar 16000 $P/audio/analysis-16k.wav
ffmpeg -i $P/source/original.mp4 -vf "fps=30,scale=1080:1920:flags=lanczos" -q:v 3 $P/frames/src/%05d.jpg
echo "{\"count\": $(ls $P/frames/src | wc -l), \"fps\": 30}" > $P/frames/meta.json
python3 -I tools/detect_speech.py $P/audio/analysis-16k.wav --out $P/spans.json
python3 -I tools/transcribe.py --audio $P/audio/analysis-16k.wav --spans $P/spans.json \
        --model-dir ~/.cache/reel-editorial/whisper-small/package/models/Xenova/whisper-small --lang ar --timestamps --out $P/transcript_raw_ts.json
# → review into $P/transcript.json, then write $P/storyboard.json
node tools/storyboard-check.mjs --project <name>
node tools/frames.mjs --project <name> --scene-ends
node tools/seektest.mjs --project <name>
node tools/render.mjs --project <name> --workers 4
node tools/qa.mjs --project <name>
```
Preview in a browser: `node tools/serve.mjs 8765` → `http://127.0.0.1:8765/engine/index.html?project=<name>`.

Speech model: Whisper-small ONNX cached under `~/.cache/reel-editorial/` (downloaded as data from the npm registry).
