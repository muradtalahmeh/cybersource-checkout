# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 4 scenes, 23 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:18.41 | Was / were: questions without "did" |
| S02 | 0:18.41 | 0:33.55 | Quick review: past simple + affirmative |
| S03 | 0:33.55 | 0:46.97 | Negative and question with did |
| S04 | 0:46.97 | 0:57.00 | Regular (+ED / +D) and irregular verbs |

## S01 · Was / were: questions without "did"

**0:00.00 → 0:18.41** (18.4 s)

**Narration**

- `0:00.40–0:00.69` ‏أو ⚠️ The clip starts mid-lesson. First word heard as "أو" (or); "Oh" scored lower but is possible.
- `0:01.06–0:02.07` *They weren't happy.*
- `0:02.66–0:05.85` ‏والسؤال منقدّم was أو were على الفاعل ⚠️ Last word inferred: "الفاعل" (subject). ASR heard "الفعل" (verb) and scored it slightly higher; "before the subject" is what the example shows. Please confirm what was said.
- `0:06.41–0:07.02` ‏مثلاً
- `0:07.54–0:08.86` *Were you tired yesterday?*
- `0:09.41–0:11.24` ‏يعني: كنت تعبان مبارح؟
- `0:11.96–0:17.87` ‏إذن مع was و were ما منستخدم did بنفس الطريقة اللي استخدمناها مع باقي الأفعال

| | |
|---|---|
| Educational concept | Recap of was/were (negative example "They weren't happy"), then the question: was/were moves in front of the subject; no "did" with was/were, unlike other verbs. |
| Visual situation | Top: boy and girl side by side, both frowning — "THEY WEREN'T HAPPY." written under them. Middle: formula boxes [WAS / WERE] + [SUBJECT] ... ? with a curved arrow lifting WAS / WERE in front of the SUBJECT box. Then the example sentence; the boy yawns with tired eyes beside a small calendar labelled YESTERDAY. Bottom: "WAS / WERE" with "DID" written next to it and struck out in red (narration: we don't use did with was/were), and a small label "OTHER VERBS → DID" in green as the contrast. |
| Characters & objects | Boy (you), girl (with boy = they); props: calendar, zzz. |
| Drawing sequence | 1) boy + girl outlines (0.0–1.0) → 2) "THEY WEREN'T HAPPY." 1.0–2.2 → 3) formula boxes WAS/WERE + SUBJECT 2.7–5.9, arrow at "على الفاعل" ≈5.0 → 4) "WERE YOU TIRED YESTERDAY?" 7.5–9.0 (WERE in green) → 5) yawning pose + calendar during "يعني كنت تعبان مبارح" 9.4–11.3, Arabic gloss revealed → 6) "WAS / WERE" + "DID" with red strike 12.0–15.0 → 7) "OTHER VERBS → DID" 15.5–17.9. |
| Hand movement | Enters from the right on the characters, writes each sentence left→right on its spoken time, glides between items (gaps ≤ 1.4 s); leaves the frame 17.9–18.4 during the pause. |
| Character animation | Both characters settle into a frown at 1.1 s; boy turns to "ask" pose on WERE (7.6), then yawns (mouth yawn, eyes tired) at 9.5 with zzz; at 12.0 boy shakes head ("no" preset) as DID is struck. |
| English text | THEY WEREN'T HAPPY. · WERE · SUBJECT · WERE YOU TIRED YESTERDAY? · YESTERDAY · WAS / WERE · DID (red strike + cross mark) · OTHER VERBS (drawn arrow) DID |
| Arabic text | السؤال: was / were قبل الفاعل · كنت تعبان مبارح؟ · ما منستخدم did مع was / were |
| Camera | Starts on a wide home frame; slow push-in (≤1.05) to the question sentence at 7.5; back to home at 11.9 to show the DID rule. |
| Transition | Opening: hand draws on a blank page (no transition in). |
| Synchronization | "They weren't happy" 1.06–2.07 · "was أو were على الفاعل" 2.66–5.85 · "Were you tired yesterday?" 7.54–8.86 · Arabic gloss 9.41–11.24 · "ما منستخدم did" 11.96–17.87 (DID struck ≈13.9). |
| Review note | Clip starts mid-lesson ("أو they weren't happy"): the earlier example it continues from is not in this recording. "على الفاعل" vs "على الفعل" at 2.66–5.85 is inferred — if the speaker said "الفعل" (verb) the visual still shows WERE before the subject, which is the correct rule. |

## S02 · Quick review: past simple + affirmative

**0:18.41 → 0:33.55** (15.1 s)

**Narration**

- `0:18.95–0:21.18` ‏خلّينا نراجع أهم الأفكار بسرعة
- `0:21.88–0:25.17` ‏إذا بدك تحكي عن إشي صار وانتهى بالماضي
- `0:25.48–0:26.96` ‏استخدم الـ past simple
- `0:27.65–0:30.62` ‏بالجملة المثبتة استخدم الفعل بصيغة الماضي
- `0:31.31–0:31.98` ‏مثلاً
- `0:32.17–0:33.16` *I played football.*

| | |
|---|---|
| Educational concept | Past simple = something that happened and finished in the past. Affirmative sentence: the verb goes into its past form. |
| Visual situation | New page headed "QUICK REVIEW" (Arabic: أهم الأفكار). A timeline PAST ←—\|—→ NOW; a dot on the past side gets a start mark and an end mark with a green ✓ ("صار وانتهى"). "PAST SIMPLE" written large under the timeline. Then a "+" box: "VERB → PAST FORM". Example: the boy kicks the ball while "I PLAYED FOOTBALL." is written; under it PLAY → PLAYED with ED in green. |
| Characters & objects | Boy (I); props: ball, clock with hands running backwards next to PAST. |
| Drawing sequence | 1) "QUICK REVIEW" heading 19.0–20.6 → 2) timeline line + NOW tick + PAST label 21.9–23.5 → 3) event dot, start/end marks, ✓ 23.5–25.2 → 4) "PAST SIMPLE" 25.5–27.0 → 5) "+" box and "VERB → PAST FORM" 27.7–30.6 → 6) boy + ball 30.6–32.0 (during "مثلاً") → 7) "I PLAYED FOOTBALL." 32.1–33.3 → 8) PLAY → PLAYED green ending 33.2–33.5. |
| Hand movement | Writes heading, draws the timeline left→right, taps the event; draws the boy part by part, then writes the sentence while the ball flies. |
| Character animation | Clock hands spin backwards 21.9–25.2. Boy "kick" pose at 32.2 ("played"), ball arcs off to the right (A.anim), boy grins. |
| English text | QUICK REVIEW · PAST · NOW · PAST SIMPLE · + · VERB (drawn arrow) PAST FORM · I PLAYED FOOTBALL. · PLAY (pair arrow) PLAYED, ED green |
| Arabic text | أهم الأفكار · صار وانتهى · الجملة المثبتة: الفعل بصيغة الماضي |
| Camera | Home frame; small pan down 30.5 to make room for the boy and example. |
| Transition | Pan right to a new page (18.41–19.3, inside the pause). |
| Synchronization | "نراجع أهم الأفكار" 18.95–21.18 · "صار وانتهى بالماضي" 21.88–25.17 · "past simple" 25.48–26.96 · "الفعل بصيغة الماضي" 27.65–30.62 · "I played football" 32.17–33.16 ("played" ≈32.4). |

## S03 · Negative and question with did

**0:33.55 → 0:46.97** (13.4 s)

**Narration**

- `0:33.93–0:35.83` ‏بالنفي استخدم didn't
- `0:36.05–0:37.36` ‏وبعدها الفعل الأصلي
- `0:38.08–0:39.51` *I didn't play football.*
- `0:40.23–0:42.15` ‏وبالسؤال استخدم did
- `0:42.32–0:44.82` ‏وبعدها الفاعل وبعدها الفعل الأصلي ⚠️ First "الفاعل" vs "الفعل" nearly tied in scoring (−3.29 vs −3.35); "الفاعل" fits the rule Did + subject + base verb.
- `0:45.54–0:46.64` *Did you play football?*

| | |
|---|---|
| Educational concept | Negative: didn't + base verb. Question: Did + subject + base verb. |
| Visual situation | Same page structure, two stacked rows. Row 1 "−" box: [DIDN'T] + [BASE VERB] with "PLAY" ringed in green; example "I DIDN'T PLAY FOOTBALL." — the boy stands still with a flat mouth, the ball beside him crossed out in red (he did not do it). Row 2 "?" formula boxes [DID] + [SUBJECT] + [BASE VERB] ?; the girl asks the boy in a speech bubble "DID YOU PLAY FOOTBALL?", the boy shrugs. |
| Characters & objects | Boy (I / you), girl (asks the question); props: ball, speech bubble. |
| Drawing sequence | 1) "−" label + DIDN'T box 33.9–35.8 (DIDN'T in red) → 2) + BASE VERB box 36.0–37.4 → 3) "I DIDN'T PLAY FOOTBALL." 38.0–39.7, ring on PLAY 39.7 → 4) ball + red ✗ 39.7–40.2 → 5) "?" label + DID box 40.2–42.2 → 6) SUBJECT box 42.3–43.5, BASE VERB box 43.5–44.8 → 7) girl + bubble 44.8–45.5 → 8) "DID YOU PLAY FOOTBALL?" in bubble 45.5–46.7. |
| Hand movement | Writes formula boxes on their spoken words; after the negative sentence it draws the crossed ball; for the question it draws the girl quickly then writes inside the bubble. |
| Character animation | Boy shakes head ("no") at 38.4; girl "ask" pose + talk mouth 45.5; boy "shrug" at 46.6. |
| English text | - · DIDN'T · BASE VERB · I DIDN'T PLAY FOOTBALL. · ? · DID · SUBJECT · DID YOU PLAY FOOTBALL? |
| Arabic text | النفي · السؤال · الفعل الأصلي |
| Camera | Home on row 1; camTo row 2 at 40.0; slight zoom (1.04) on the bubble 45.4–46.9. |
| Transition | Pan down from S02 (33.55–34.3, inside the pause). |
| Synchronization | "didn't" 33.93–35.83 · "الفعل الأصلي" 36.05–37.36 · "I didn't play football" 38.08–39.51 · "did" 40.23–42.15 · "الفاعل … الفعل الأصلي" 42.32–44.82 · "Did you play football?" 45.54–46.64. |
| Review note | Only the correct forms are shown (no "didn't played"): the narration does not present a wrong form here. |

## S04 · Regular (+ED / +D) and irregular verbs

**0:46.97 → 0:57.00** (10.0 s)

**Narration**

- `0:47.29–0:49.89` ‏واذكر مع الأفعال المنتظمة
- `0:50.04–0:53.61` ‏غالباً منضيف ED أو D حسب قواعد الإملاء
- `0:54.18–0:55.90` ‏أما الأفعال غير المنتظمة
- `0:56.02–0:57.00` ‏فلازم نتعلّم شكلها… ⚠️ Recording ends mid-speech at 57.00 s (still voiced in the last 150 ms). Last word uncertain: ASR heard "شكراً" (thanks), "شكلها" (their form) scored close behind and fits the sentence. Is this the full recording?

| | |
|---|---|
| Educational concept | Regular verbs usually add -ED or -D depending on spelling rules; irregular verbs have to be learned. |
| Visual situation | Split page. Left column "REGULAR": PLAY → PLAYED (ED in green, reusing the lesson's own verb), then "+ED / +D" with a small pencil note "SPELLING" (Arabic: حسب قواعد الإملاء). Right column "IRREGULAR": a zig-zag arrow and a book; the boy holds the book with a thought bubble containing a question mark, then a lightbulb as "we must learn them" is said. |
| Characters & objects | Boy; props: book, thought bubble, bulb. |
| Drawing sequence | 1) "REGULAR" 47.3–48.9 → 2) PLAY → PLAYED with ED green 49.0–51.0 (ED at "ED" ≈50.4) → 3) "+ED / +D" 50.4–52.0 → 4) "SPELLING" + Arabic note 52.0–53.6 → 5) "IRREGULAR" + zig-zag arrow 54.2–55.9 → 6) boy + book 55.9–56.6 → 7) bulb 56.6–57.0. |
| Hand movement | Writes the left column, then crosses to the right column; the hand is still drawing when the audio ends (no outro available). |
| Character animation | Boy "holdL" pose with the book, eyes look up ("think") then bulb fades on at 56.6. |
| English text | REGULAR · PLAY (pair arrow) PLAYED, ED green · +ED / +D · SPELLING · IRREGULAR |
| Arabic text | الأفعال المنتظمة · حسب قواعد الإملاء · الأفعال غير المنتظمة · فلازم نتعلّم |
| Camera | Home frame; small drift right toward IRREGULAR at 54.0. |
| Transition | Wipe-erase in place (hand wipes S03's page 46.97–47.6), then new drawing on the same page. |
| Synchronization | "الأفعال المنتظمة" 47.29–49.89 · "ED" ≈50.0–51.5 · "أو D حسب قواعد الإملاء" 51.67–53.61 · "غير المنتظمة" 54.18–55.90 · "فلازم نتعلّم…" 56.02–57.00 (audio ends mid-speech). |
| Review note | The recording ends mid-word at 57.00 s, so this scene (and the video) stops abruptly with no closing beat. Confirm whether a longer recording exists. No example irregular verbs are shown because the narration gives none in this clip. Last word "شكلها"/"شكراً" is inferred. |

