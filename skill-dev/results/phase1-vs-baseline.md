# Regression comparison

baseline: `results/baseline-v1.0`  
candidate: `results/phase1-v1.1`

## Skill
- code files (template/ + scripts/): 25; changed vs baseline: none
- missing referenced paths: none
- instruction units from the old SKILL.md present verbatim: 45/45

## ielts.scenes.h.json
- golden frames identical: 15/15
- scene structure: identical; problems: none; page errors: 0; failed requests: none

## ielts.scenes.v.json
- golden frames identical: 15/15
- scene structure: identical; problems: none; page errors: 0; failed requests: none

## past-simple.scenes.h.json
- golden frames identical: 41/41
- scene structure: identical; problems: none; page errors: 0; failed requests: none

## past-simple.scenes.v.json
- golden frames identical: 41/41
- scene structure: identical; problems: none; page errors: 0; failed requests: none
- ielts.seek.h.txt: 8/8 identical; render 9.7 ms/frame, render+capture 226 ms/frame
- ielts.seek.v.txt: 8/8 identical; render 7.2 ms/frame, render+capture 259 ms/frame
- past-simple.seek.h.txt: 8/8 identical; render 18.2 ms/frame, render+capture 107 ms/frame
- past-simple.seek.v.txt: 8/8 identical; render 19.7 ms/frame, render+capture 107 ms/frame

## ielts.export.0.json (v 0.0–24.987188 s)
- frames 750 (baseline 750), 1080x1920 h264 30/1; audio aac 24.987000 s
- audio offsets vs original: [0.0, 0.0, 0.0] ms (baseline [0.0, 0.0, 0.0])
- picture timing PSNR at t: [39.38, 39.85, 39.87, 39.34] (baseline [39.38, 39.85, 39.87, 39.34])
- problems: none

## ielts.export.1.json (h 0.0–24.987188 s)
- frames 750 (baseline 750), 1920x1080 h264 30/1; audio aac 24.987000 s
- audio offsets vs original: [0.0, 0.0, 0.0] ms (baseline [0.0, 0.0, 0.0])
- picture timing PSNR at t: [39.69, 40.07, 40.01, 39.62] (baseline [39.69, 40.07, 40.01, 39.62])
- problems: none

## past-simple.export.0.json (v 0.0–20.0 s)
- frames 600 (baseline 600), 1080x1920 h264 30/1; audio aac 20.000000 s
- audio offsets vs original: [0.0, 0.0, 0.0] ms (baseline [0.0, 0.0, 0.0])
- picture timing PSNR at t: [42.66, 41.42, 41.9, 40.36] (baseline [42.66, 41.42, 41.9, 40.36])
- problems: none

## past-simple.export.1.json (h 186.0–196.0 s)
- frames 300 (baseline 300), 1920x1080 h264 30/1; audio aac 10.000000 s
- audio offsets vs original: [0.0, 0.0, 0.0] ms (baseline [0.0, 0.0, 0.0])
- picture timing PSNR at t: [38.35, 40.39, 39.91, 39.89] (baseline [38.35, 40.39, 39.91, 39.89])
- problems: none

**Overall: PASS**
