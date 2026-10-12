# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 4 scenes, 16 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:18.41 | was / were: negative and question (no did) |
| S02 | 0:18.41 | 0:33.55 | Recap: past simple and the affirmative |
| S03 | 0:33.55 | 0:46.97 | Negative with didn't, question with Did |
| S04 | 0:46.97 | 0:57.00 | Regular (-ed / -d) vs irregular verbs |

## S01 · was / were: negative and question (no did)

**0:00.00 → 0:18.41** (18.4 s)

**Narration**

- `0:00.40–0:02.07` ‏أو — *They weren't happy.* ⚠️ Opening 0.3 s word is unclear: English 'Oh,' or Arabic 'أو' (or). The clip appears to start mid-lesson, right after an earlier example.
- `0:02.66–0:05.85` ‏والسؤال منقدّم was أو were على الفاعل ⚠️ 'الفاعل' (subject) inferred from the grammar; ASR heard 'الفعل' (verb) and the two score almost equally.
- `0:06.41–0:08.86` ‏مثلاً — *Were you tired yesterday?*
- `0:09.41–0:11.24` ‏يعني: كنت تعبان مبارح؟
- `0:11.96–0:17.87` ‏إذن مع was و were ما منستخدم did بنفس الطريقة اللي استخدمناها مع باقي الأفعال ⚠️ 'مع' (with) vs 'ما' at 11.96 s: chose 'مع' from context and the sentence-level decode.

| | |
|---|---|
| Educational concept | Negative with weren't; questions put was/were before the subject; with was/were we do not use did like other verbs. |
| Visual situation | Left: two kids with frowning faces under the sentence "They weren't happy." Right: a question formula box Was/Were → subject → …?, then the BOY yawning with heavy eyelids and "Were you tired yesterday?" written under him, the Arabic gloss كنت تعبان مبارح؟ beneath. Finally the word "did" is written next to Was/Were and crossed with a red ✗ (the narration says we don't use did here). |
| Characters & objects | Two kids (they) · BOY (you) · formula box |
| Drawing sequence | 0.40 kids outline, faces turn to frowns → 1.06–2.07 write "They weren't happy." (weren't underlined) → 2.66–5.85 formula box: WAS / WERE drawn first, arrow, SUBJECT → 6.41–8.86 BOY drawn part by part, "Were you tired yesterday?" written word by word, 'Were' green → 9.41–11.24 Arabic gloss revealed → 11.96–13.71 'was / were' re-circled in the box → 13.93–17.87 write 'did' beside the box, red strike-through + ✗. |
| Hand movement | Hand draws the kids, then moves right to the formula box, down to the BOY, then up to the box to cross out did; leaves frame in the pause after 17.87. |
| Character animation | Kids frown (mouth curve flips) as "weren't" is said; BOY yawns, eyelids droop on "tired"; small zZ. |
| English text | They weren't happy. · Was / Were + subject …? · Were you tired yesterday? · did ✗ |
| Arabic text | كنت تعبان مبارح؟ |
| Camera | Wide framing of the board; slow push-in on the formula box at 2.66 s; slight pan down to the BOY at 6.4 s. |
| Transition | Open on blank paper (first stroke at 0.40 s). Out: wipe-erase in place during the 17.87–18.95 pause. |
| Synchronization | "weren't" written 1.06–2.07; box built 2.66–5.85 (was/were on 'was أو were', subject on 'على الفاعل'); question sentence 7.54–8.86; gloss 10.08–11.24; 'did' + ✗ 13.93–17.87 (✗ lands on 'ما منستخدم'). |
| Review note | Clip opens mid-lesson: "They weren't happy." is shown without the earlier explanation that led to it. Subject word 'الفاعل' is inferred (see transcript flags). |

## S02 · Recap: past simple and the affirmative

**0:18.41 → 0:33.55** (15.1 s)

**Narration**

- `0:18.95–0:21.19` ‏خلّينا نراجع أهم الأفكار بسرعة
- `0:21.88–0:26.96` ‏إذا بدّك تحكي عن إشي صار وانتهى بالماضي، استخدم الـ past simple
- `0:27.65–0:30.64` ‏بالجملة المثبتة استخدم الفعل بصيغة الماضي
- `0:31.31–0:33.17` ‏مثلاً — *I played football.*

| | |
|---|---|
| Educational concept | Quick recap: use the past simple for something that happened and finished in the past; in the affirmative the verb is in its past form. |
| Visual situation | Header "Past simple" with a timeline: NOW on the right, PAST on the left, an X on the past part that is closed off (finished). Then the affirmative row: the BOY kicks the FOOTBALL and "I played football." is written with ED in green (PLAY→PLAYED). |
| Characters & objects | BOY (I) · FOOTBALL · timeline |
| Drawing sequence | 18.95–21.19 title "Past simple" (review badge) → 21.88–25.17 timeline line, PAST / NOW labels, X on the past segment with a closing bracket → 25.48–26.96 "past simple" underlined → 27.65–30.64 label "+" row with verb box (verb → past form) → 31.31–33.17 BOY + ball drawn, then "I played football." with -ed in green. |
| Hand movement | Writes the title, draws the timeline left→right, moves down to the + row, draws the BOY and the ball, writes the sentence; lifts off as the ball flies. |
| Character animation | BOY kicks the ball on "played" (32.4 s); the ball arcs off to the right. |
| English text | Past simple · PAST · NOW · + · I played football. |
| Arabic text | — |
| Camera | Pan right onto fresh paper at the scene start; small close-up zoom on "played" at 32.4 s, then back out. |
| Transition | In: pan right (the wiped board slides out). Out: pan down to the next rows in the 33.17–33.93 pause. |
| Synchronization | Title on "خلينا نراجع" (18.95); timeline on "صار وانتهى بالماضي" (21.88–25.17); "past simple" written on 25.48–26.96; + row 27.65–30.64; sentence 32.17–33.17. |

## S03 · Negative with didn't, question with Did

**0:33.55 → 0:46.97** (13.4 s)

**Narration**

- `0:33.93–0:37.38` ‏بالنفي استخدم didn't وبعدها الفعل الأصلي
- `0:38.08–0:39.52` *I didn't play football.* ⚠️ Arabic decode looped (garbage, not marked LOOP by the tool); English re-decode is clear and scores far above alternatives.
- `0:40.23–0:44.82` ‏وبالسؤال استخدم Did وبعدها الفاعل وبعدها الفعل الأصلي ⚠️ 'الفاعل' (subject) after Did: sentence decode heard 'الفاعل', phrase decode 'الفعل'; near-equal scores, chosen from the grammar.
- `0:45.54–0:46.64` *Did you play football?*

| | |
|---|---|
| Educational concept | Negative: didn't + base verb. Question: Did + subject + base verb. |
| Visual situation | Two rows under the + row: "–" row with formula didn't + verb (base) and the BOY standing still, ball crossed out, "I didn't play football."; "?" row with formula Did + subject + verb (base) and the BOY with a question bubble, "Did you play football?". The base verb 'play' is boxed in both to show the original form. |
| Characters & objects | BOY (I / you) · FOOTBALL |
| Drawing sequence | 33.93–35.83 '–' sign + 'didn't' box → 36.05–37.38 '+ verb' box, label 'base' → 38.08–39.52 crossed-out ball + "I didn't play football." (play boxed) → 40.23–42.15 '?' sign + 'Did' box → 42.32–44.82 '+ subject + verb' boxes → 45.54–46.64 BOY with ? bubble + "Did you play football?". |
| Hand movement | Writes each formula box, then the example under it; leaves the frame briefly at 46.64 before the cut. |
| Character animation | BOY shakes head on "didn't"; on the question he shrugs with a ? bubble popping. |
| English text | didn't + verb · I didn't play football. · Did + subject + verb …? · Did you play football? |
| Arabic text | — |
| Camera | Pan down from the + row to the – row; then pan down again to the ? row at 40.2 s. |
| Transition | In: pan down. Out: diagonal zoom-out showing the three rows (+, –, ?) together, in the 46.64–47.29 pause. |
| Synchronization | 'didn't' written on 33.93–35.83; base-verb box on 'الفعل الأصلي' (36.05–37.38); negative sentence 38.08–39.52; 'Did' on 40.23–42.15; subject/verb boxes 42.32–44.82; question 45.54–46.64. |
| Review note | Order 'Did + subject + verb' depends on the inferred word 'الفاعل' at 42.3 s. |

## S04 · Regular (-ed / -d) vs irregular verbs

**0:46.97 → 0:57.00** (10.0 s)

**Narration**

- `0:47.29–0:49.89` ‏وتذكّر مع الأفعال المنتظمة ⚠️ 'وتذكّر' (and remember) from context and the English gloss; acoustically 'ويذكر' scored slightly higher.
- `0:50.04–0:53.62` ‏غالباً منضيف ed أو d حسب قواعد الإملاء ⚠️ Endings heard as 'E-D / D'; 'ed أو d' is the best-scoring candidate.
- `0:54.18–0:57.00` ‏أما الأفعال غير المنتظمة فلازم نتعلّم شكل… ⚠️ Recording ends mid-word at 57.00 s (speech still at -18 dB in the last 0.2 s). ASR wrote 'شكراً', a typical Whisper end-of-audio hallucination; most likely 'شكلها' (their form) cut off. Unverified.

| | |
|---|---|
| Educational concept | Regular verbs usually add -ed or -d depending on spelling rules; irregular verbs must be learned. |
| Visual situation | Split board: left column 'Regular' with the ending '+ed / +d' in green, the existing word 'played' re-used to show PLAY+ED; right column 'Irregular' with a book/brain doodle and a question mark (forms to learn). No new example verbs are written because the narration gives none. |
| Characters & objects | BOY (thinking pose, beside the Irregular column) · book doodle |
| Drawing sequence | 47.29–49.89 heading 'Regular' → 50.04–51.53 '+ed' in green, arrow from 'played' → 51.67–53.62 '/ +d' and a small 'spelling' note → 54.18–55.90 heading 'Irregular' → 56.02–57.00 BOY + book doodle; the drawing is mid-stroke when the audio ends. |
| Hand movement | Writes Regular column, then crosses to the Irregular column; is still drawing at 57.00 (audio ends mid-sentence). |
| Character animation | BOY scratches head under "Irregular"; book pages flutter. |
| English text | Regular · +ed / +d · played · Irregular |
| Arabic text | — |
| Camera | Zoom back in from the overview onto a clean area; static. |
| Transition | In: zoom in after the diagonal zoom-out. Out: none — the recording ends at 57.00 s mid-word; final frame holds. |
| Synchronization | 'Regular' on 'الأفعال المنتظمة' (48.3 s); '+ed' on 'منضيف ed' (50.04–51.53); '+d' on 'أو d' (51.67); 'Irregular' on 'غير المنتظمة' (54.18–55.90). |
| Review note | The recording stops mid-sentence ('فلازم نتعلّم شكل…'): there is no closing beat. Last word uncertain (ASR: 'شكراً'). User should confirm the clip is complete or supply the rest. |

