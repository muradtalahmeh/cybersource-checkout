# IELTS pronunciation challenge — whiteboard video

Made with the `audio-whiteboard-animation` skill from the supplied 25 s narration (Gulf Arabic, six English words: entrepreneur, colleague, schedule, develop, client, vehicle). The original MP3 is kept byte-for-byte in `assets/audio/original.mp3`; `narration.wav` is its lossless decode, used as the master clock.

- Preview: serve this folder (`npx http-server .`) and open `index.html` (`?aspect=h` for 16:9).
- Exports: `output/video-9x16.mp4`, `output/video-16x9.mp4` (750 frames @30 fps, 0 ms audio offset verified).
- Storyboard: `docs/STORYBOARD.md`; transcript with uncertainty flags: `js/transcript.js`.
- Re-export: `node tools/render.mjs --aspect v|h`.
