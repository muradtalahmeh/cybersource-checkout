# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 4 scenes, 20 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:18.40 | was / were: negative and questions (no did) |
| S02 | 0:18.40 | 0:33.55 | Quick review: when + affirmative |
| S03 | 0:33.55 | 0:46.95 | Negative and question with did |
| S04 | 0:46.95 | 0:57.00 | Regular (+ed / +d) vs irregular verbs |

## S01 · was / were: negative and questions (no did)

**0:00.00 → 0:18.40** (18.4 s)

**Narration**

- `0:00.40–0:00.69` ‏أو ⚠️ Clip starts mid-lesson; first word heard as "أو" (or) — forced-decode score favours it over "و"
- `0:01.06–0:02.07` *They weren't happy.*
- `0:02.66–0:05.85` ‏وبالسؤال منقدّم was أو were على الفاعل ⚠️ "على الفاعل" (before the subject) inferred from the rule and the example; ASR heard "على الفعل" (before the verb) — the two scored almost equal
- `0:06.41–0:07.02` ‏مثلاً
- `0:07.54–0:08.86` *Were you tired yesterday?*
- `0:09.41–0:11.24` ‏يعني كنت تعبان مبارح؟ ⚠️ Arabic gloss reconstructed from ASR "كنت عبان بارح" / "Kuntaban Mbarah"
- `0:11.96–0:17.87` ‏إذن مع was و were ما منستخدم did بنفس الطريقة التي استخدمناها مع باقي الأفعال

| | |
|---|---|
| Educational concept | Past of "be": the negative "weren't", then the question form — was/were moves in front of the subject — and, unlike other verbs, no "did". |
| Visual situation | Boy and girl stand side by side with sad faces while "THEY WEREN'T HAPPY." is written above them. A formula row appears: [WAS / WERE] + [subject] + … ? with a curved arrow showing WERE jumping in front of YOU. The boy yawns (tired eyes) next to a small calendar with "yesterday" circled while the girl asks "WERE YOU TIRED YESTERDAY?" in a bubble; Arabic gloss underneath. Finally a small "DID" is written beside WAS / WERE and struck through in red. |
| Characters & objects | Boy (= I / you), Girl (with the boy = they); props: speech bubble, calendar, zzz. |
| Drawing sequence | 1) boy + girl outlines (0.4–2.0) and "THEY WEREN'T HAPPY." with WEREN'T in red (1.0–2.3); 2) formula boxes [WAS/WERE] [SUBJECT] [… ?] (2.7–5.9), arrow from WERE to the front at "على الفاعل" (≈4.8); 3) girl's bubble with "WERE YOU TIRED YESTERDAY?" (7.4–9.1), calendar + ring on yesterday (8.4–9.0); 4) Arabic "كنت تعبان مبارح؟" under the bubble (9.4–11.3); 5) "DID" + red strike + ✗ next to the WAS/WERE box (12.4–14.5); 6) green underline under WAS / WERE (15.5–17.6). |
| Hand movement | Writes the sentence over the characters, travels left-to-right along the formula, sweeps the arrow, then writes in the bubble; leaves the frame briefly at 6.4–7.4 (pause before the example). |
| Character animation | Boy and girl frown (mouth frown, brows down) when "weren't" is said (1.5); at 8.0 the boy switches to tired eyes + yawn and a zzz floats up; at 15 the girl nods (head tilt). |
| English text | THEY WEREN'T HAPPY. · WAS / WERE + SUBJECT … ? · WERE YOU TIRED YESTERDAY? · DID (struck through) |
| Arabic text | كنت تعبان مبارح؟ · مع was و were ما منستخدم did |
| Camera | 9:16: home view, slight push-in (1.04×) on the question bubble at 7.5–11.5, back home for the DID strike. 16:9: characters left, formula + bubble right, no zoom. |
| Transition | Opens directly on the page (audio starts mid-lesson; no title card). |
| Synchronization | "weren't" written 1.3–1.8; WERE arrow at "على الفاعل" (4.6–5.4); question written 7.5–8.9 as spoken; Arabic gloss 9.4–11.2; DID struck exactly while "did" is said (≈14.3–14.8, phrase 13.93–17.87). |
| Review note | Clip begins mid-lesson with "أو" — the preceding example is not in the audio. "على الفاعل" is inferred (ASR: "على الفعل"). The "DID ✗" mark visualises "we don't use did with was/were"; no wrong sentence is written. |

## S02 · Quick review: when + affirmative

**0:18.40 → 0:33.55** (15.1 s)

**Narration**

- `0:18.95–0:21.19` ‏خلّينا نراجع أهم الأفكار بسرعة
- `0:21.88–0:25.17` ‏إذا بدك تحكي عن إشي صار وانتهى بالماضي
- `0:25.48–0:26.96` ‏استخدم الـ past simple
- `0:27.65–0:30.64` ‏بالجملة المثبتة استخدم الفعل بصيغة الماضي
- `0:31.31–0:31.98` ‏مثلاً
- `0:32.17–0:33.17` *I played football.*

| | |
|---|---|
| Educational concept | Past Simple is for something that happened and finished in the past; in an affirmative sentence the verb takes its past form. |
| Visual situation | Heading "QUICK REVIEW" with Arabic "خلّينا نراجع أهم الأفكار". A timeline: PAST ← \| NOW with a green dot + ✓ on the past side ("happened and finished"), then "PAST SIMPLE" written above it. A green "+" row: PLAY → PLAYED with the ED in green. The boy kicks the ball across the page while "I PLAYED FOOTBALL." is written. |
| Characters & objects | Boy (= I); props: ball, clock running backwards (past) beside the timeline. |
| Drawing sequence | 1) heading + Arabic (19.0–21.2); 2) timeline line, NOW tick, PAST label, dot + ✓ (21.9–25.1), backwards clock fades in; 3) "PAST SIMPLE" (25.5–27.0); 4) "+" sign, PLAY → PLAYED pair, ED green (27.7–30.6); 5) boy drawn part by part (30.6–32.0), ball; 6) "I PLAYED FOOTBALL." with ED green (32.1–33.3). |
| Hand movement | Writes heading, draws the timeline right-to-left from NOW to PAST, writes the pair, draws the boy, writes the example; exits at 33.3. |
| Character animation | Clock hands spin backwards 22–25; boy kick pose at "played" (≈32.5), ball arcs to the right (anim 32.5–33.5); boy cheers at the end. |
| English text | QUICK REVIEW · PAST · NOW · PAST SIMPLE · PLAY → PLAYED · I PLAYED FOOTBALL. |
| Arabic text | خلّينا نراجع أهم الأفكار · صار وانتهى بالماضي · الجملة المثبتة |
| Camera | 9:16: heading at top, timeline middle, example lower third; camera drifts down 0.6× page between 27 and 30. 16:9: timeline across the top, example + boy below, static. |
| Transition | Pan right from S01 starting at 18.4 (in the 17.87–18.95 pause), panDur 0.9. |
| Synchronization | Heading 19.0–21.2; ✓ on the dot at "انتهى" (≈24.0); PAST SIMPLE at 25.5; PLAYED at "بصيغة الماضي" (≈29.5); kick at "played" in "I played football" (32.4). |
| Review note | Labels PAST / NOW / QUICK REVIEW are added as aids (not spoken in English). PLAY → PLAYED reuses the narration's own example. |

## S03 · Negative and question with did

**0:33.55 → 0:46.95** (13.4 s)

**Narration**

- `0:33.93–0:37.38` ‏بالنفي استخدم didn't وبعدها الفعل الأصلي
- `0:38.08–0:39.52` *I didn't play football.* ⚠️ Arabic pass looped here; English pass + forced scoring clearly favour "didn't play" over "didn't played"
- `0:40.23–0:44.82` ‏وبالسؤال استخدم did وبعدها الفاعل وبعدها الفعل الأصلي ⚠️ "وبعدها الفاعل" (then the subject) inferred: ASR heard "الفعل … الفعل الأصلي" twice, and the two readings scored almost equal; the rule and the example "Did you play…" support "الفاعل"
- `0:45.54–0:46.64` *Did you play football?*

| | |
|---|---|
| Educational concept | Negative: didn't + base verb. Question: Did + subject + base verb. |
| Visual situation | Two formula rows under the S02 example. Red "−" row: [DIDN'T] + [base verb] → "I DIDN'T PLAY FOOTBALL." while the boy sits with arms crossed and the ball is crossed out in red. "?" row: [DID] + [subject] + [base verb] → the girl asks "DID YOU PLAY FOOTBALL?" in a bubble; the boy shrugs. |
| Characters & objects | Boy (= I / you), Girl (asks the question); props: ball (crossed out), speech bubble. |
| Drawing sequence | 1) "−" + boxes DIDN'T \| VERB (base) (33.9–37.4), arrow from DIDN'T to PLAY; 2) "I DIDN'T PLAY FOOTBALL." with DIDN'T red, PLAY underlined (38.0–39.6); ball + red ✗ (39.6–40.2); 3) "?" + boxes DID \| SUBJECT \| VERB (base) labelled at their spoken times (40.2–44.8); 4) girl drawn part by part 41.7–42.9, in the gap between the DID and SUBJECT labels so no two pen strokes overlap; bubble "DID YOU PLAY FOOTBALL?" (45.4–46.8). |
| Hand movement | Writes formula boxes left-to-right in the order spoken and each example; after the DID label it hops right to draw the girl, comes back for SUBJECT / VERB, then writes her bubble; leaves at 46.8. |
| Character animation | Boy: no / arms-crossed pose and frown at 38.5; girl: ask pose at 45.5; boy: shrug at 46.4. |
| English text | DIDN'T + VERB · I DIDN'T PLAY FOOTBALL. · DID + SUBJECT + VERB ? · DID YOU PLAY FOOTBALL? |
| Arabic text | النفي · السؤال · الفعل الأصلي |
| Camera | 9:16: camera moves down to the new rows (panDown within the scene) at 33.6–34.4, slight zoom on PLAY (1.05×) at 36.5–37.5, then home. 16:9: two rows stacked left, characters right. |
| Transition | Pan down from S02 at 33.55 (pause 33.17–33.93), panDur 0.8. |
| Synchronization | DIDN'T box written at "didn't" (≈34.6); "الفعل الأصلي" → VERB box 36.1–37.3; example 38.1–39.5; DID box at "did" (≈41.3), SUBJECT box at "الفاعل" (≈43.0), VERB box at "الفعل الأصلي" (≈44.2); question 45.5–46.6. |
| Review note | Formula "DID + SUBJECT + VERB" relies on the inferred word "الفاعل" (ASR heard "الفعل" twice). No wrong form is shown: the narration does not present one here. |

## S04 · Regular (+ed / +d) vs irregular verbs

**0:46.95 → 0:57.00** (10.0 s)

**Narration**

- `0:47.29–0:53.62` ‏وتذكّر، مع الأفعال المنتظمة غالباً منضيف ed أو d حسب قواعد الإملاء ⚠️ "وتذكّر" heard as "وإذكر/ويدكر"; "ed" heard as "إيه … ID" (51.0–51.5 decoded as unrelated words)
- `0:54.18–0:55.90` ‏أما الأفعال غير المنتظمة
- `0:56.02–0:57.00` ‏فلازم نتعلّم… ⚠️ Recording ends mid-sentence (speech still at −18 dB in the last 0.2 s). ASR added "شكراً", likely a Whisper end-of-clip hallucination; the rest of the sentence is not in the audio

| | |
|---|---|
| Educational concept | Regular verbs usually add -ed or -d according to spelling rules; irregular verbs have to be learned. |
| Visual situation | The page splits in two columns. Left: "REGULAR" with two green stamps "+ED" and "+D" and the reused example PLAY → PLAYED. Right: "IRREGULAR" with a stack of books; the boy sits reading/studying a book with a light bulb above him. |
| Characters & objects | Boy (studying); props: book, bulb. |
| Drawing sequence | 1) divider line + "REGULAR" (47.3–49.0); 2) "+ED" (50.0–50.9), "OR", "+D" (51.0–52.2) in green; PLAY → PLAYED small under it (52.2–53.6) with Arabic "حسب قواعد الإملاء"; 3) "IRREGULAR" (54.2–55.4); 4) book + boy outline (55.4–56.9), bulb fades at 56.6. |
| Hand movement | Draws the divider, writes the left column, crosses to the right column, draws the book; still on the page when the audio ends (the clip ends mid-sentence). |
| Character animation | Boy turns a page (arm key) at 56.5; bulb glow fades in at 56.7. |
| English text | REGULAR · +ED · +D · PLAY → PLAYED · IRREGULAR |
| Arabic text | الأفعال المنتظمة · حسب قواعد الإملاء · الأفعال غير المنتظمة · لازم نتعلّمها |
| Camera | 9:16: columns stacked (REGULAR top, IRREGULAR bottom) instead of side by side; 16:9: side by side. Static; last frame holds to 57.0. |
| Transition | Diagonal zoom-out (diag) from S03 at 46.95 (pause 46.64–47.29), panDur 1.0 — "new chapter" feel for the spelling note. |
| Synchronization | "+ED" at "ed" (≈50.5), "+D" at "d" (≈51.8), "IRREGULAR" at "غير المنتظمة" (≈55.0), book/boy during "فلازم نتعلّم" (56.0–57.0). |
| Review note | Audio is cut mid-sentence at 57.0 ("فلازم نتعلّم…"), so there is no natural outro — the video will end abruptly. No example of +D or of an irregular verb is spoken, so none is invented; the Arabic "لازم نتعلّمها" label assumes the cut sentence means "we must learn them". User may want to supply the rest of the recording or approve an end card. |

