# Run r3: whiteboard storyboard for lesson-clip.wav

Skill: `<skill>` = `/tmp/claude-0/-home-user-cybersource-checkout/02dc74d1-9c1b-55a5-b058-a4018146d8f4/scratchpad/abtest/skills/kit-m`
Project: `<work>/project` (`<work>` = `.../scratchpad/abtest/runs/r3`)
Stopped after the storyboard phase as instructed. No scenes.js, frames or video were made.

## Skill files I read, in order
1. `<skill>/SKILL.md` (all of it)
2. `<skill>/scripts/new_project.sh`
3. `<skill>/scripts/asr_setup.sh`
4. `<skill>/template/js/storyboard.js`
5. `<skill>/template/js/transcript.js`
6. `<skill>/template/tools/storyboard.mjs`
7. `<skill>/scripts/detect_speech.py`
8. `<skill>/scripts/transcribe.py`
9. `<skill>/scripts/score_candidates.py`
10. `<skill>/references/engine-api.md`. SKILL.md says to read this before Phase 4. I read it early so the storyboard would only use characters, props, pen-font glyphs and timing rules the engine supports.

I also listed the skill folder's files with `find`. SKILL.md and engine-api.md both point to `references/example-past-simple/`, but that folder **is not in the skill**, so I could not look at it.

## Steps and commands
Phase 1 (inspect)
- `ffprobe` on the input: pcm_s16le, 24 kHz, mono, 16-bit, **57.000 s**.
- Capabilities: `ffmpeg -encoders` shows libx264 and aac. Node v22.22.0. Playwright is installed globally in `/opt/node22/lib/node_modules`, with Chromium 1194 in `/opt/pw-browsers`. Python 3.13. http-server is available. So preview, MP4 export and transcription are all possible here. Only transcription was used.
- `bash <skill>/scripts/new_project.sh <input>/lesson-clip.wav <work>/project "Whiteboard lesson"`. The audio was copied byte for byte: sha256 `6084973a4c89e4ed5bb016abea8f9b328c3d8bfa78d6be0db4a511aab10c25f0` for both the original and `project/assets/audio/narration.wav`. I then set the page title in `project/index.html` to "Past Simple – was/were & quick review" with `sed`.

Phase 2 (analyse)
- `bash <skill>/scripts/asr_setup.sh small`. It used the cached model at `~/.cache/awb-asr/small/.../whisper-small`.
- `python3 <skill>/scripts/detect_speech.py project/assets/audio/narration.wav --out asr/spans.json`: 13 sentence spans and 27 phrase regions.
- `transcribe.py --key sentences --lang ar`, giving `asr/ar.json`. Span 38.08–39.51 came out as a LOOP (repeated "أعطي").
- `transcribe.py --key sentences --lang en` (`asr/en_sent.json`) and `--key phrases --lang en` (`asr/en_phr.json`) to recover the English examples.
- `transcribe.py --key phrases --lang ar` (`asr/ar_phr.json`) for phrase-level Arabic and timing.
- `score_candidates.py --lang en` on `asr/cands_en.json`. Each winner beat the next candidate by at least 6 points:
  - "They weren't happy." −1.0, vs "They wasn't" −7.9
  - "Were you tired yesterday?" −0.3
  - "I didn't play football." −0.4, vs "didn't played" −9.7
  - "Did you play football?" −0.2, vs "Did you played" −9.2
- `score_candidates.py --lang ar` on `asr/cands_ar.json` to check الفاعل/الفعل, the last words, the first word and the Arabic gloss.
- `ffmpeg astats/volumedetect` on the last second of audio. Speech is still present at about −18 dB in the final 0.2 s, so the recording is **cut mid-sentence**.
- Wrote `project/js/transcript.js`: 20 entries with measured phrase timings. Only the wording was corrected (Levantine dialect and ASR errors).

Phase 3 (storyboard)
- Wrote `project/js/storyboard.js`: 4 scenes, with every field filled.
- `cd project && node tools/storyboard.mjs` printed `OK: 4 scenes cover 0–57s, all 20 segments assigned` and wrote `project/docs/STORYBOARD.md`.

## Content-domain and type decisions
- **Domain:** an English-grammar lesson in Levantine Arabic about the **Past Simple**. The clip starts at the end of a was/were section (negatives, then questions without "did") and then gives a quick review: when to use it, affirmative, negative with didn't, questions with Did, regular verbs with -ed/-d, and irregular verbs. So I built it as the skill's main case (Arabic narration explaining English) and used its Past-Simple design vocabulary: formula boxes, the green ED ending, a timeline, red for negation, and characters acting out the examples.
- **Characters:** the boy stands for "I/you", and the boy and girl together stand for "they". The same pair is used in every scene so it reads as one story.
- **Scene cuts** fall inside measured pauses: 18.4 (pause 17.87–18.95), 33.55 (33.17–33.93) and 46.95 (46.64–47.29). That gives scenes of 18.4, 15.2, 13.4 and 10.1 s.
- **Transitions:**
  - S01 opens directly on the page with no title card, because the audio starts mid-lesson.
  - S01→S02 pans right.
  - S02→S03 pans down.
  - S03→S04 uses a diagonal zoom-out.
- **Content check:** the teaching itself is correct (was/were questions without did; didn't + base verb; Did + subject + base verb; -ed/-d by spelling rules). I found nothing that needs flagging as wrong. The narration presents no deliberately wrong forms, so none appear on screen. "DID" next to WAS/WERE is struck through to show "we don't use did here", but no wrong sentence is written.
- **Invented examples:** none. The narration gives no example of a "+D" verb or of an irregular verb, so the storyboard shows only the rule plus the narration's own PLAY → PLAYED.

## What I would have told or asked the user
1. **No reference image** was attached. I would use the skill's written brief: cream paper, black line art, beige and dark green.
2. **Capabilities:** preview, MP4 (libx264 + AAC) and local transcription are all available here.
3. **The recording starts mid-lesson** with "أو … They weren't happy", so whatever came before is not in the clip. It also **ends mid-sentence** at 57.0 s with "أما الأفعال غير المنتظمة فلازم نتعلّم…". The video would end abruptly with no outro. Can they send the full recording, or should I add a visual end-hold or end card? The audio itself would not be altered.
4. **The scene table** (also in docs/STORYBOARD.md):

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:18.40 | was / were: negative and questions (no did) |
| S02 | 0:18.40 | 0:33.55 | Quick review: when + affirmative |
| S03 | 0:33.55 | 0:46.95 | Negative and question with did |
| S04 | 0:46.95 | 0:57.00 | Regular (+ed / +d) vs irregular verbs |

5. **Optional additions that need their approval:** an example for "+d" (such as like → liked) and for irregular verbs (such as go → went). The narration gives neither, so I added neither.
6. **On-screen labels not spoken in English:** QUICK REVIEW, PAST, NOW, REGULAR, IRREGULAR. These are aids; the user may want them removed.

### Flagged or inferred words (also stored as `flag` in transcript.js)
- **0.40 "أو" (or):** the first word of a clip that starts mid-lesson. Forced scoring prefers it over "و".
- **2.66–5.85 "على الفاعل" (before the subject):** inferred from the rule and the example. ASR heard "على الفعل" (before the verb), and the two scored almost equally (−28.2 vs −27.9).
- **9.41–11.24 "يعني كنت تعبان مبارح؟":** reconstructed from the ASR outputs "كنت عبان بارح" and "Kuntaban Mbarah".
- **38.08–39.52 "I didn't play football.":** the Arabic pass looped here. The English pass and forced scoring clearly support "play" over "played".
- **40.23–44.82 "وبعدها الفاعل وبعدها الفعل الأصلي":** ASR heard "الفعل" twice, and the two readings scored almost the same. I chose "الفاعل" because of the rule and the example "Did you play…". The S03 formula DID + SUBJECT + VERB depends on this choice.
- **47.29–53.62 "وتذكّر … ed أو d … الإملاء":** ASR heard "وإذكر/ويدكر", "إيه … ID" and "الإملاق". The decode of 51.0–51.5 was unrelated words, a hallucination, which I read as "ed".
- **56.02–57.00 "فلازم نتعلّم…":** the audio is cut here. ASR added "شكراً", probably Whisper's usual end-of-clip hallucination, and it scored lower than plain "فلازم نتعلم". I did not put it in the transcript.
- **Minor ASR spelling fixes, not flagged:** الباسط سيمبل → الـ past simple, المثبة → المثبتة, بصيرة → بصيغة, بائل → باقي, المنطظمة → المنتظمة.

### Items for the final review that apply later (not reached in this run)
The vector hand has no finger articulation. Arabic text is revealed rather than stroked. The MP4 audio would be AAC. The pen font has no "→" glyph, so arrows in pairs such as PLAY → PLAYED would come from the `pair()` helper and arrow strokes, not from text.

## What I could not do or did not do
- `references/example-past-simple/` is missing from the skill, so I could not imitate its scenes.
- By instruction I stopped after the storyboard: no scenes.js, prototype, frames, seek test, renders or export verification.
- The user was unavailable, so every question above was answered with my best judgement as described.

## Output files
- `<work>/project/js/transcript.js`
- `<work>/project/js/storyboard.js`
- `<work>/project/docs/STORYBOARD.md`
- ASR intermediates are in `<work>/asr/`: spans.json, ar.json, ar_phr.json, en_sent.json, en_phr.json, cands_en.json, cands_ar.json
