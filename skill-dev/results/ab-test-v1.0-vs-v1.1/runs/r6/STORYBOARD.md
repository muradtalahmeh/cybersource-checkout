# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 5 scenes, 30 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:15.50 | Negation in the past: DIDN'T = DID NOT, and the rule |
| S02 | 0:15.50 | 0:27.90 | Example: I DIDN'T WATCH TV YESTERDAY |
| S03 | 0:27.90 | 0:37.20 | Wrong vs right: I DIDN'T WATCHED TV ✗ → I DIDN'T WATCH TV ✓ |
| S04 | 0:37.20 | 0:46.60 | Same with irregular verbs: SHE DIDN'T GO TO SCHOOL ✓ / WENT ✗ |
| S05 | 0:46.60 | 0:57.00 | Why? DID carries the past, so the verb stays in its base form |

## S01 · Negation in the past: DIDN'T = DID NOT, and the rule

**0:00.00 → 0:15.50** (15.5 s)

**Narration**

- `0:00.00–0:01.88` ‏هلأ خلينا ننتقل للنفي. ⚠️ "للنفي" inferred: ASR heard "لنا فيه" (scored higher, −4.0 vs −6.0); chosen from context because the clip teaches negation with didn't.
- `0:02.55–0:06.07` ‏إذا بدك تحكي إنك ما عملت إشي بالماضي، منستخدم كلمة
- `0:06.28–0:06.86` *didn't*
- `0:07.26–0:08.02` ‏وهي اختصار
- `0:08.18–0:08.93` *did not*
- `0:09.59–0:10.75` ‏والقاعدة هون بسيطة:
- `0:11.30–0:11.94` ‏الفاعل ⚠️ "الفاعل" (subject) vs "الفعل" (verb) scored the same (−1.54 / −1.56); "الفاعل" chosen because the rule continues "بعده didn't وبعده الفعل".
- `0:12.25–0:13.11` ‏بعده — *didn't*
- `0:13.37–0:15.05` ‏وبعده الفعل بصيغته الأصلية.

| | |
|---|---|
| Educational concept | To say you did NOT do something in the past, use DIDN'T (short for DID NOT). Rule: subject + didn't + verb in its base form. |
| Visual situation | Upper half of the page: Arabic heading 'النفي'; the BOY shrugging (did nothing) with a thought bubble holding a clock whose hands run backwards (the past); big red DIDN'T, then '= DID NOT' under it with an arrow from N'T to NOT. At 'القاعدة بسيطة' the camera slides down to the lower half, where three formula boxes are drawn and labelled as each part is spoken: [الفاعل] + [DIDN'T] + [الفعل بصيغته الأصلية]. |
| Characters & objects | BOY (role "I", reused in S02/S03/S05); thought bubble; clock (backwards = past); formula boxes. |
| Drawing sequence | 1) 'النفي' heading 0.20–1.70. 2) BOY 2.60–4.10 (head → body → arms). 3) Thought bubble + backwards clock 4.15–5.60 (on 'بالماضي'). 4) 'DIDN'T' big red 6.15–6.95. 5) '= DID NOT' 8.10–8.95, arrow N'T→NOT 8.95–9.35. 6) Camera down 9.45–10.05. 7) Three empty boxes + plus signs 10.05–11.25. 8) 'الفاعل' in box 1 11.30–11.95. 9) 'DIDN'T' red in box 2 12.25–13.10. 10) 'الفعل بصيغته الأصلية' in box 3 (base-verb box outlined green) 13.40–15.10. |
| Hand movement | Writes the heading right→left, draws the boy part by part, then the bubble and clock; writes DIDN'T and DID NOT left→right; glides down with the camera and draws the boxes, then fills each label as it is spoken. Leaves the frame in the pause after 15.10. |
| Character animation | BOY: rest → shrug at 'ما عملت إشي' (≈4.2) and back; blinks. Clock hands spin backwards 4.6–6.0. Small nod/point toward DIDN'T at 6.3. |
| English text | DIDN'T · DID NOT |
| Arabic text | النفي · الفاعل · الفعل بصيغته الأصلية |
| Camera | Starts on the upper half (home); slides down to the formula area at 9.45–10.05 ("والقاعدة هون بسيطة"). 16:9: no slide — heading, boy and DIDN'T = DID NOT on the left/top, formula row across the bottom of the same frame. |
| Transition | Opening scene (paper already on screen; first line drawn at 0.20). |
| Synchronization | النفي ↔ 'للنفي' (0.0–1.9) · shrug ↔ 'ما عملت إشي' (≈3.8–4.6) · clock ↔ 'بالماضي' (≈4.6–5.4) · DIDN'T ↔ 'didn't' 6.28 · DID NOT ↔ 8.18 · box labels ↔ 'الفاعل' 11.30, 'didn't' 12.25, 'الفعل بصيغته الأصلية' 13.37. |
| Review note | Heading 'النفي' depends on the inferred word 'للنفي' at 0:00 (ASR heard 'لنا فيه'). 'الفاعل' vs 'الفعل' at 11.30 was a tie in scoring; the formula needs 'الفاعل' (subject). |

## S02 · Example: I DIDN'T WATCH TV YESTERDAY

**0:15.50 → 0:27.90** (12.4 s)

**Narration**

- `0:15.93–0:16.44` ‏مثلاً:
- `0:16.81–0:19.49` *I didn't watch TV yesterday.*
- `0:20.29–0:22.83` ‏يعني ما حضرت تلفزيون مبارح.
- `0:23.66–0:24.54` ‏انتبه منيح: ⚠️ Uncertain: ASR heard "انت بهم نير" (English pass: "You understand?"). "انتبه منيح" (pay close attention) is a best guess from context; please confirm.
- `0:24.71–0:25.94` ‏بعد — *didn't*
- `0:26.20–0:27.49` ‏الفعل برجع لأصله.

| | |
|---|---|
| Educational concept | The rule applied: 'I didn't watch TV yesterday' = ما حضرت تلفزيون مبارح. After didn't, the verb goes back to its base form (WATCH). |
| Visual situation | New page: the BOY next to a TV that is switched off. The sentence is written as spoken with DIDN'T in red and WATCH in green, the Arabic meaning under it. In the pause a red ✗ is drawn over the TV (he did not watch). On 'انتبه منيح' the boy raises a finger; then DIDN'T is underlined red and an arrow runs from DIDN'T to WATCH, which gets a green ring (the verb returns to its base). |
| Characters & objects | BOY (same as S01); TV (off). |
| Drawing sequence | 1) BOY 15.55–16.70 (quick redraw on the new page, during 'مثلاً'). 2) Sentence 'I DIDN'T WATCH TV YESTERDAY.' 16.75–19.75 (DIDN'T red, WATCH green). 3) TV (switched off) 19.80–20.25. 4) 'ما حضرت تلفزيون مبارح' 20.30–22.90. 5) Red ✗ over the TV 22.95–23.55. 6) Underline DIDN'T red 25.20–25.90. 7) Arrow DIDN'T→WATCH + green ring on WATCH 26.20–27.30. |
| Hand movement | Draws the boy, writes the English sentence word by word with the voice, draws the TV, travels the Arabic baseline right→left, crosses the TV, rests out of frame during "انتبه منيح" (the boy gestures), returns to underline, arrow and ring. |
| Character animation | BOY: points at the TV at 'watch TV' (≈18.3); frown + 'no' head shake with the ✗ (≈23.1); pointUp on 'انتبه منيح' (23.7–24.5); smile at the green ring (≈27.0). |
| English text | I DIDN'T WATCH TV YESTERDAY. |
| Arabic text | ما حضرت تلفزيون مبارح |
| Camera | Static on the new page. 16:9: boy + TV on the left third, sentence and Arabic on the right two-thirds. |
| Transition | Pan right to a new page, 15.50–16.40 (move: right). |
| Synchronization | boy ↔ 'مثلاً' 15.93 · sentence ↔ 16.81–19.49 · Arabic ↔ 20.29–22.83 · ✗ on TV in the pause 22.83–23.66 · finger up ↔ 'انتبه منيح' 23.66 · underline ↔ 'didn't' 25.23 · ring WATCH ↔ 'الفعل برجع لأصله' 26.20–27.49. |
| Review note | 'انتبه منيح' at 23.66 is a guess (ASR: 'انت بهم نير'); it is only acted (finger up), not written, so a different word does not change the drawing. 'مبارح' written for the spoken 'بارح/مبارح' (yesterday). |

## S03 · Wrong vs right: I DIDN'T WATCHED TV ✗ → I DIDN'T WATCH TV ✓

**0:27.90 → 0:37.20** (9.3 s)

**Narration**

- `0:28.23–0:29.25` ‏يعني ما نحكي
- `0:29.50–0:31.73` *I didn't watched TV* ⚠️ Deliberately wrong example, inferred: ASR autocorrected it to "watch". Forced scoring: "watched" is only 3.0 below "watch" here vs 7.9 below at the correct repeat (34.66 s), and the narration says "لأنه هذا خطأ".
- `0:32.41–0:33.18` ‏لأنه هذا خطأ.
- `0:33.72–0:34.52` ‏الصحيح:
- `0:34.66–0:36.65` *I didn't watch TV.*

| | |
|---|---|
| Educational concept | Common mistake: putting the past form after didn't. 'I didn't watched TV' is wrong; 'I didn't watch TV' is correct. |
| Visual situation | Same page as S02: the hand wipe-erases the sentence, Arabic line and marks, keeping the BOY and the crossed-out TV. Line 1: 'I DIDN'T WATCHED TV' with -ED in red, then a red strike-through and a red ✗ on 'هذا خطأ'. Line 2 (on 'الصحيح'): 'I DIDN'T WATCH TV' with WATCH in green and a green ✓. |
| Characters & objects | BOY (same); TV with ✗ (kept from S02). |
| Drawing sequence | 1) Wipe-erase of S02's text block 27.95–28.70. 2) 'I DIDN'T WATCHED TV' 29.45–31.85 (ED red). 3) Red strike-through 32.40–32.80 + ✗ 32.80–33.20. 4) 'I DIDN'T WATCH TV' 34.60–36.70 (WATCH green). 5) Green ✓ 36.72–37.15. |
| Hand movement | Zig-zag erase over the text region, then writes the wrong sentence, strikes it and crosses it on 'هذا خطأ', writes the correct sentence under it and ticks it. |
| Character animation | BOY: frown + 'no' shake on 'هذا خطأ' (32.4–33.2); cheer with grin on the ✓ (≈36.9). |
| English text | I DIDN'T WATCHED TV · I DIDN'T WATCH TV |
| Arabic text | — |
| Camera | Static (same page as S02). 16:9: the two lines stacked on the right, boy + TV unchanged on the left. |
| Transition | Wipe-erase in place (no camera move) at 27.95. |
| Synchronization | erase in the pause 27.49–28.23 / 'يعني ما نحكي' · wrong sentence ↔ 29.50–31.73 · strike + ✗ ↔ 'لأنه هذا خطأ' 32.41–33.18 · correct sentence ↔ 34.66–36.65 · ✓ in the pause 36.65–37.43. |
| Review note | The wrong form 'WATCHED' is inferred: the ASR autocorrected it to 'watch'; forced scoring + the narrator's 'هذا خطأ' indicate 'watched'. This is the only deliberately wrong English shown in this scene; please confirm it is what you said. |

## S04 · Same with irregular verbs: SHE DIDN'T GO TO SCHOOL ✓ / WENT ✗

**0:37.20 → 0:46.60** (9.4 s)

**Narration**

- `0:37.43–0:39.32` ‏ونفس الإشي مع الأفعال غير المنتظمة.
- `0:39.88–0:40.38` ‏منحكي:
- `0:40.60–0:42.63` *She didn't go to school.*
- `0:43.27–0:43.64` ‏مش
- `0:43.85–0:45.87` *she didn't went to school.* ⚠️ Deliberately wrong example (introduced by "مش"); decoded as "went" by ASR and confirmed by scoring (−4.0 vs −8.1 for "go").

| | |
|---|---|
| Educational concept | Irregular verbs follow the same rule: 'She didn't go to school', not 'She didn't went to school'. |
| Visual situation | New page below: Arabic heading 'الأفعال غير المنتظمة'. The GIRL (she) stands turned away from a school, arms crossed — she did not go. 'SHE DIDN'T GO TO SCHOOL.' with GO in green and a green ✓; on 'مش', 'SHE DIDN'T WENT TO SCHOOL.' under it with WENT in red, then struck through with a red ✗. |
| Characters & objects | GIRL (role "she", new); school. |
| Drawing sequence | 1) 'الأفعال غير المنتظمة' 37.50–39.30. 2) GIRL 39.35–40.50 (on 'منحكي'). 3) 'SHE DIDN'T GO TO SCHOOL.' 40.55–42.70 (GO green). 4) ✓ 42.72–43.05 (immediately after the line). 5) School 43.10–43.80 (behind the girl). 6) 'SHE DIDN'T WENT TO SCHOOL.' 43.85–46.00 (WENT red). 7) Strike-through + ✗ 46.00–46.50. |
| Hand movement | Writes the heading right→left, draws the girl, writes the correct sentence and ticks it, sketches the school, writes the wrong sentence, strikes and crosses it. |
| Character animation | GIRL: 'no' head shake on 'didn't go' (≈41.3), stays turned away from the school; frown on the wrong sentence (≈45.5). |
| English text | SHE DIDN'T GO TO SCHOOL. · SHE DIDN'T WENT TO SCHOOL. |
| Arabic text | الأفعال غير المنتظمة |
| Camera | Static after the pan. 16:9: heading across the top, girl + school on the left, the two sentences on the right. |
| Transition | Pan down to a new page, 37.20–38.10 (move: down). |
| Synchronization | heading ↔ 'الأفعال غير المنتظمة' 37.43–39.32 · girl ↔ 'منحكي' 39.88 · correct sentence ↔ 40.60–42.63 · 'مش' 43.27 → wrong sentence ↔ 43.85–45.87 · strike + ✗ in the pause 45.87–46.82. |
| Review note | Timing is tight: the school is drawn just after the correct sentence (43.10–43.80), not before it, because the girl and the sentence take all the time up to 42.70. Check in the prototype that the girl reads as 'not going' before the school appears. |

## S05 · Why? DID carries the past, so the verb stays in its base form

**0:46.60 → 0:57.00** (10.4 s)

**Narration**

- `0:46.82–0:47.30` ‏ليش؟
- `0:47.46–0:50.74` ‏لأنه كلمة did هي اللي بتحمل معنى الماضي.
- `0:51.25–0:54.58` ‏وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية.
- `0:55.47–0:55.87` ‏ممتاز.
- `0:56.52–0:56.80` ‏هلأ… ⚠️ The recording ends here: this is the first word of a next sentence, cut off at 57.00 s.

| | |
|---|---|
| Educational concept | DID is the word that carries the past meaning; that is why the verb after it must be in its base form. |
| Visual situation | New page: Arabic 'ليش؟' big. 'DID' written big in red; the backwards clock from S01 is drawn above it and an arrow joins the clock to DID (DID holds the past). An arrow from DID to the green box 'الفعل بصيغته الأصلية' containing 'WATCH / GO' (the two base verbs of the lesson). On 'ممتاز' the camera zooms out over the whole board: BOY and GIRL on their pages cheer. Final 'هلأ…' (cut off): the hand leaves; hold. |
| Characters & objects | BOY and GIRL (seen again in the zoom-out); clock (backwards = past); base-verb box. |
| Drawing sequence | 1) 'ليش؟' 46.85–47.40. 2) 'DID' big red 48.30–49.00. 3) Clock 49.25–50.20. 4) Arrow clock→DID 50.20–50.75. 5) Arrow DID→box 51.30–51.90. 6) Box (green) 51.90–52.60. 7) 'الفعل بصيغته الأصلية' in the box 52.60–54.00. 8) 'WATCH / GO' green 54.00–54.60. |
| Hand movement | Writes 'ليش؟', DID, draws the clock and arrows, the box, writes the label and the verbs; leaves the frame at 54.6 for the zoom-out. |
| Character animation | Clock hands spin backwards 50.0–51.2. Zoom-out 54.80–55.90; BOY and GIRL cheer + grin on 'ممتاز' (55.47–56.0) and stay happy to the end. |
| English text | DID · WATCH / GO |
| Arabic text | ليش؟ · الفعل بصيغته الأصلية |
| Camera | Static on the new page, push-in on DID (zoom ≈1.05) 48.3–50.7, back to home 50.8–51.3; diagonal zoom-out 54.80–55.90 to show all five pages (≈0.4×), held to 57.00. 16:9: same, DID centre-left, box right. |
| Transition | Diagonal zoom-out/zoom-in to a new page, 46.60–47.60 (move: diag). |
| Synchronization | 'ليش؟' ↔ 46.82 · DID ↔ 'did' (≈48.36–48.95) · clock + arrow ↔ 'بتحمل معنى الماضي' 49.26–50.74 · box + label ↔ 'الفعل اللي بعدها لازم يكون بصيغته الأصلية' 51.25–54.58 · cheer ↔ 'ممتاز' 55.47 · hold through 'هلأ…' 56.52–57.00. |
| Review note | The recording stops on 'هلأ…' (start of a next sentence, cut off at 57.00), so the video ends on the overview without that sentence's content. 'WATCH / GO' is a recap of the lesson's own examples, not new content. |

