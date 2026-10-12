# QA report — ref-fitness

Video: `projects/ref-fitness/output/final.mp4` · generated 2026-10-12T16:54:39.228Z

| Check | Result | Detail |
|---|---|---|
| resolution | PASS | 1080x1920 (expected 1080x1920) |
| aspect 9:16 | PASS | 0.5625 |
| fps | PASS | 30/1 |
| frame count | PASS | 1816 frames (expected ceil(60.532×30) = 1816) |
| duration | PASS | 60.533 s vs original audio 60.532 s |
| audio codec/rate/channels | PASS | aac HE-AAC 44100 Hz 2 ch |
| decodes without errors | PASS | clean |
| no unintended black frames | PASS | none |
| audio stream bit-identical to original | PASS | MD5=fdc4fc0cdca6a8f389a9c481ed7c2d22 vs MD5=fdc4fc0cdca6a8f389a9c481ed7c2d22 |
| audio alignment (cross-correlation, 2 s windows) | PASS | start: +0.0 ms / middle: +0.0 ms / end: +0.0 ms |
| kinetic zone inside safe area | PASS | y 1560–1890, frame bottom 1536 |

Not measured automatically (visual review via contact sheets): text overlap with face, RTL correctness, element persistence after its information ends, colour consistency.