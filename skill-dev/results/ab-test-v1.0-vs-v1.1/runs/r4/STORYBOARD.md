# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 4 scenes, 20 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:18.40 | Was / were: negative and question |
| S02 | 0:18.40 | 0:33.55 | Review: when to use past simple + affirmative |
| S03 | 0:33.55 | 0:46.95 | Negative with didn't, question with did |
| S04 | 0:46.95 | 0:57.00 | Regular (-ed / -d) and irregular verbs |

## S01 · Was / were: negative and question

**0:00.00 → 0:18.40** (18.4 s)

**Narration**

- `0:00.40–0:02.07` *Oh, they weren't happy.* ⚠️ The recording starts mid-lesson: this answer belongs to an example whose question is not in the clip. First word scored best as "Oh" (alternative "No").
- `0:02.66–0:05.85` ‏وبالسؤال منقدّم was أو were على الفاعل، ⚠️ "على الفاعل" (before the subject) vs "على الفعل" (before the verb) score almost equally in ASR; "الفاعل" chosen because it is the correct rule and matches 40.2 s. Please confirm.
- `0:06.41–0:07.02` ‏مثلاً:
- `0:07.54–0:08.86` *Were you tired yesterday?*
- `0:09.41–0:11.24` ‏يعني: كنت تعبان مبارح؟
- `0:11.96–0:17.87` ‏إذن مع was و were ما منستخدم did بنفس الطريقة اللي استخدمناها مع باقي الأفعال.

| | |
|---|---|
| Educational concept | With was/were the negative is weren't, and the question puts was/were before the subject (Were you tired yesterday?). Did is NOT used with was/were the way it is with other verbs. |
| Visual situation | Top: the sentence "THEY WEREN'T HAPPY." with two frowning kids. Middle: a formula [WAS / WERE] + [الفاعل] + ? . Below: the example question written while spoken, the boy yawning (tired), Arabic meaning under it. Bottom: two small columns — WAS / WERE with DID crossed out in red, and باقي الأفعال with DID and a green ✓. |
| Characters & objects | BOY (= you) and GIRL (together = they), standing left/right below the first sentence; ZZZ prop over the boy for "tired". |
| Drawing sequence | 1) THEY WEREN'T HAPPY. (WEREN'T red) 0.35–2.15 · 2) boy then girl, outline only, 2.15–3.45 (frown) · 3) box WAS / WERE (green) ≈3.6–4.7 while "منقدّم was أو were" · 4) "+" and box الفاعل ≈4.8–5.9 while "على الفاعل" · 5) "?" 5.9–6.3 · 6) short arrow down 6.4–7.0 ("مثلاً") · 7) WERE YOU TIRED YESTERDAY? 7.45–9.0 (WERE green, ring around YOU to echo the box order) · 8) zzz over the boy 9.0–9.4 · 9) Arabic يعني: كنت تعبان مبارح؟ revealed 9.45–11.35 · 10) WAS / WERE 12.0–13.6 · 11) DID 13.95–14.6 then red cross 14.6–15.0 · 12) to the right: Arabic label باقي الأفعال 15.6–16.9, then DID 16.95–17.5 and a green ✓ 17.5–17.75 (did belongs with the other verbs). |
| Hand movement | Enters at 0.35 on the first word; glides (gaps < 1.4 s) between all items; after the red cross it writes the last label and leaves the frame at ≈17.7 so the pause before the review is clean. |
| Character animation | Kids fade in fills after outlines; both reach mouth:frown at 2.2 (they weren't happy). Boy: pose tired + mouth:yawn + eyes:tired at 8.9 (Were you tired?). Boy: pose no (head shake) at 14.7 when DID is crossed; back to rest at 17.9. |
| English text | THEY WEREN'T HAPPY. · WAS / WERE · ? · WERE YOU TIRED YESTERDAY? · DID (crossed out) · DID (✓) |
| Arabic text | الفاعل · يعني: كنت تعبان مبارح؟ · باقي الأفعال |
| Camera | 9:16: page 1 laid out top→bottom (sentence y≈260, kids y≈520–760 feet, formula y≈900, question y≈1100, Arabic y≈1230, WAS/WERE ✗DID y≈1380). Slow camTo push down: home until 7.0, then local centre on the question area 7.0–8.0 (zoom 1.0), back home at 11.8. 16:9: two columns — left: sentence + kids; right: formula, question, Arabic, crossed DID; no push. |
| Transition | Opening: the page is blank cream paper at 0; the hand enters (no camera move). Out: diag zoom-out into S02 (new chapter: review). |
| Synchronization | "they weren't happy" 1.06–2.07 → sentence 0.35–2.15. "was أو were" inside 2.66–5.85 → WAS/WERE box; "على الفاعل" → second box (refine the split with a phrase-level check when building). "مثلاً" 6.41–7.02 → arrow. English 7.54–8.86 → question 7.45–9.0. Arabic 9.41–11.24 → reveal 9.45–11.35. "مع was و were" 11.96–13.71 → WAS/WERE; "ما منستخدم did" starts 13.93 → DID + cross by 15.0. "مع باقي الأفعال" ≈16.5–17.87 → باقي الأفعال + DID ✓ (refine with a phrase check; the label may need to start later). |
| Review note | The clip opens mid-lesson with an answer ("they weren't happy") whose question is not in the recording — it is shown as a standalone example. "على الفاعل" vs "على الفعل" was ambiguous in ASR (see transcript flag). The DID ✓ under باقي الأفعال visualises "بنفس الطريقة اللي استخدمناها مع باقي الأفعال" (did is used with the other verbs). |

## S02 · Review: when to use past simple + affirmative

**0:18.40 → 0:33.55** (15.1 s)

**Narration**

- `0:18.95–0:21.18` ‏خلّينا نراجع أهم الأفكار بسرعة.
- `0:21.88–0:25.17` ‏إذا بدك تحكي عن إشي صار وانتهى بالماضي،
- `0:25.48–0:26.96` ‏استخدم الـ past simple.
- `0:27.65–0:30.62` ‏بالجملة المثبتة استخدم الفعل بصيغة الماضي.
- `0:31.31–0:31.98` ‏مثلاً:
- `0:32.17–0:33.17` *I played football.*

| | |
|---|---|
| Educational concept | Quick review: use past simple for something that happened and finished in the past. Affirmative: the verb in its past form — I played football. |
| Visual situation | Heading "مراجعة سريعة". A timeline arrow with a finished event dot labelled PAST (with a green ✓ = "صار وانتهى"), then the big title PAST SIMPLE. Below: a "+" box "الفعل بصيغة الماضي", and the boy kicking a football while I PLAYED FOOTBALL. is written with ED in green. |
| Characters & objects | BOY (= I) with the FOOTBALL at his foot, lower left of the page. |
| Drawing sequence | 1) Arabic heading مراجعة سريعة 19.0–21.0 · 2) timeline arrow 22.0–23.4 · 3) event dot + small green ✓ 23.5–24.4 ("صار وانتهى") · 4) PAST under the dot 24.5–25.15 ("بالماضي") · 5) PAST SIMPLE (green, large) 25.5–27.0 · 6) "+" sign 27.7–28.2, Arabic label جملة مثبتة 28.2–29.1 · 7) box الفعل بصيغة الماضي 29.1–30.7 · 8) boy (outline) + ball 30.75–32.05 ("مثلاً") · 9) I PLAYED FOOTBALL. 32.1–33.4, ED in green. |
| Hand movement | Writes continuously; glides between items; leaves the frame briefly in the 21.18–21.88 pause and the 26.96–27.65 pause (for the viewer to read PAST SIMPLE); stays in for the boy and sentence; exits at 33.45 before the pan. |
| Character animation | Boy: kick pose reached at 32.75 (on "played"), ball A.anim flies right in an arc 32.75–33.5 and lands; boy pose cheer + mouth:grin at 33.5 during the 33.17–33.93 pause. |
| English text | PAST · PAST SIMPLE · + · I PLAYED FOOTBALL. (ED in green) |
| Arabic text | مراجعة سريعة · جملة مثبتة · الفعل بصيغة الماضي |
| Camera | 9:16: heading y≈280, timeline y≈480, PAST SIMPLE y≈640, "+" row y≈880, boy feet y≈1420 left, sentence y≈1180 (maxW 960). Camera push-in (zoom ≈1.04) toward the sentence 31.9–33.4, home at 33.5. 16:9: left half = heading, timeline, PAST SIMPLE; right half = "+" box, boy and sentence. |
| Transition | In: diag zoom-out from S01 (pan starts 18.4, 1.0 s, lands before the heading at 19.0). Out: pan right to S03 at 33.55. |
| Synchronization | "خلّينا نراجع … بسرعة" 18.95–21.18 → heading. "إشي صار وانتهى" ≈22–24.3 → timeline + dot + ✓; "بالماضي" ≈24.4–25.17 → PAST. "استخدم الـ past simple" 25.48–26.96 → title. "بالجملة المثبتة" ≈27.65–29.0 → "+" label; "الفعل بصيغة الماضي" ≈29–30.62 → box. "مثلاً" 31.31–31.98 → boy appears. English 32.17–33.17 → sentence 32.1–33.4, ED written ≈33.0. |
| Review note | Labels مراجعة سريعة, جملة مثبتة and PAST are short labels taken from the narration ("نراجع … بسرعة", "بالجملة المثبتة", "بالماضي"). |

## S03 · Negative with didn't, question with did

**0:33.55 → 0:46.95** (13.4 s)

**Narration**

- `0:33.93–0:35.83` ‏بالنفي استخدم didn't
- `0:36.05–0:37.38` ‏وبعدها الفعل الأصلي.
- `0:38.08–0:39.51` *I didn't play football.* ⚠️ Arabic pass looped (garbage); English re-decode gives "I didn't play football." (scored far above "didn't played"). Narration presents it as correct.
- `0:40.23–0:42.15` ‏وبالسؤال استخدم did
- `0:42.32–0:46.64` ‏وبعدها الفاعل، وبعدها الفعل الأصلي.

| | |
|---|---|
| Educational concept | Negative: didn't + the base verb (I didn't play football). Question: Did + subject + base verb. |
| Visual situation | Row 1 (negative): red "−", box DIDN'T (red) + box الفعل الأصلي. Under it I DIDN'T PLAY FOOTBALL. with DIDN'T red and PLAY ringed green (no -ed), and the football with a red ✗. Row 2 (question): "?" sign and formula [DID] + [الفاعل] + [الفعل الأصلي] + ?. |
| Characters & objects | FOOTBALL (same prop as S02) with a red cross. No character drawn: the pauses are 0.6–0.7 s, too short to draw the boy again. |
| Drawing sequence | 1) red "−" 34.0–34.4, Arabic label النفي 34.4–35.0 · 2) box DIDN'T (red) 35.0–35.9 · 3) "+" and box الفعل الأصلي 36.05–37.45 · 4) I DIDN'T PLAY FOOTBALL. 38.0–39.65 · 5) green ring around PLAY 39.65–39.95 · 6) football 39.95–40.2 then red ✗ over it 40.2–40.5 (overlaps the start of the next sentence by 0.3 s — acceptable) · 7) "?" sign + Arabic السؤال 40.6–41.3 · 8) box DID (green) 41.3–42.2 · 9) "+" box الفاعل 42.4–43.6 · 10) "+" box الفعل الأصلي 45.5–46.7 · 11) "?" 46.7–46.9. |
| Hand movement | Writes continuously; glides; in the 44.82–45.54 gap it waits at the third box position (gap < 1.4 s); exits at 46.9. |
| Character animation | None beyond drawing; the ✗ on the ball is the reaction for "didn't". (Optional: ball wobbles via A.anim 40.5–40.9.) |
| English text | − · DIDN'T · I DIDN'T PLAY FOOTBALL. · ? · DID |
| Arabic text | النفي · الفعل الأصلي · السؤال · الفاعل · الفعل الأصلي |
| Camera | 9:16: negative row y≈330, sentence y≈560, ball y≈720; question row y≈980 (three boxes stacked 2 + 1 if they overflow 960 px). Camera stays home. 16:9: negative row + sentence on the top half, question formula on the bottom half, ball at right of the sentence. |
| Transition | In: pan right from S02 at 33.55 (0.8 s; arrives before 34.0). Out: pan down to S04 at 46.95. |
| Synchronization | "بالنفي" ≈33.93–34.6 → "−" + النفي; "استخدم didn't" ≈34.6–35.83 → DIDN'T box. "وبعدها الفعل الأصلي" 36.05–37.38 → box. English 38.08–39.51 → sentence 38.0–39.65. "وبالسؤال" ≈40.23–41.0 → "?" + السؤال; "استخدم did" ≈41.0–42.15 → DID box. "وبعدها الفاعل" ≈42.32–43.6 → الفاعل box. "الفعل الأصلي" 45.54–46.64 → last box. |
| Review note | The narration gives no example question with did, so none is written (no invented "Did you …?"). If you want one, tell us which sentence. Labels النفي / السؤال paraphrase "بالنفي" / "بالسؤال". |

## S04 · Regular (-ed / -d) and irregular verbs

**0:46.95 → 0:57.00** (10.0 s)

**Narration**

- `0:47.29–0:49.89` ‏وتذكّر: مع الأفعال المنتظمة
- `0:50.04–0:53.61` ‏غالباً منضيف ed أو d حسب قواعد الإملاء. ⚠️ Phrase 51.00–51.53 ("ed") was decoded as unrelated words at phrase level; the whole-sentence decode gives "E-D أو D". Inferred: ed.
- `0:54.18–0:57.00` ‏أما الأفعال غير المنتظمة فلازم نتعلّم… ⚠️ The audio ends mid-speech at 57.00 s (still speaking in the last 100 ms). ASR hears the last word as "شكراً" (best score) — "شكلها" (their form) scores close and fits the meaning better. Last word left unwritten on screen; please confirm, or send the rest of the recording.

| | |
|---|---|
| Educational concept | Regular verbs usually add -ed or -d, depending on spelling rules. Irregular verbs have to be learned. |
| Visual situation | Top: heading الأفعال المنتظمة (green). Under it PLAY → PLAYED with ED green (reusing the lesson's own example), then "+ED / +D" labels and a small Arabic note حسب قواعد الإملاء. Bottom: heading الأفعال غير المنتظمة with a wavy underline, and a book (to learn). |
| Characters & objects | No character (10 s, dense writing). BOOK prop for "نتعلّم". |
| Drawing sequence | 1) Arabic heading الأفعال المنتظمة 47.95–49.9 · 2) PLAY → 50.0–50.85 ("غالباً منضيف") · 3) PLAYED with ED green 50.9–51.6 ("ed") · 4) "/ +D" 51.7–52.25 ("أو d") · 5) Arabic حسب قواعد الإملاء 52.3–53.6 · 6) Arabic heading الأفعال غير المنتظمة 54.2–55.9 · 7) wavy underline 55.9–56.1 · 8) book 56.1–56.95. |
| Hand movement | Enters at 47.95 after the pan; continuous writing; does not leave (the audio ends while the hand finishes the book). |
| Character animation | None (no character). Optional: PLAYED's ED pulses once (scale 1.08) at 51.6. |
| English text | PLAY → PLAYED (ED in green) · +ED / +D |
| Arabic text | الأفعال المنتظمة · حسب قواعد الإملاء · الأفعال غير المنتظمة |
| Camera | 9:16: heading y≈320, PLAY → PLAYED y≈520 (stack on narrow frame), +ED / +D y≈720, Arabic note y≈830, irregular heading y≈1080, book y≈1300. Camera home. 16:9: regular verbs left column, irregular verbs + book right column. |
| Transition | In: pan down from S03 at 46.95 (0.9 s), arriving while "وتذكّر" is said. Out: none — the recording ends abruptly at 57.0 s; hold the last frame (no outro, since nothing may be added to the audio). |
| Synchronization | "وتذكّر مع الأفعال المنتظمة" 47.29–49.89 → heading 47.95–49.9. "غالباً منضيف" 50.04–50.87 → PLAY →. "ed" 51.00–51.53 → PLAYED. "أو d" ≈51.67–52.2 → +D. "حسب قواعد الإملاء" ≈52.3–53.62 → note. "أما الأفعال غير المنتظمة" 54.18–55.9 → heading. "فلازم نتعلّم…" 56.02–57.0 → book. |
| Review note | PLAY → PLAYED is the narration's own example from 32.2 s, reused here to show -ed; no -d example (e.g. LIKE → LIKED) is drawn because the narration gives none. The narration names no irregular verb, so none is written. The audio is cut mid-sentence at 57.0 s; the last word ("شكلها"? / "شكراً"?) is not written. |

