# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 5 scenes, 31 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:16.62 | Negation in the past: DIDN'T = DID NOT, and the rule |
| S02 | 0:16.62 | 0:27.86 | Example: I DIDN'T WATCH TV YESTERDAY |
| S03 | 0:27.86 | 0:37.04 | Wrong: I DIDN'T WATCHED TV ✗ · Right: I DIDN'T WATCH TV ✓ |
| S04 | 0:37.04 | 0:46.34 | Irregular verbs: SHE DIDN'T GO TO SCHOOL ✓ · not WENT ✗ |
| S05 | 0:46.34 | 0:57.00 | Why? DID carries the past, so the verb stays in its base form |

## S01 · Negation in the past: DIDN'T = DID NOT, and the rule

**0:00.00 → 0:16.62** (16.6 s)

**Narration**

- `0:00.00–0:01.88` ‏هلأ خلينا ننتقل للنفي. ⚠️ "للنفي" (to negation) is inferred from context: ASR heard "لنا فيه", which means nothing here. Please confirm.
- `0:02.55–0:06.07` ‏إذا بدك تحكي إنك ما عملت إشي بالماضي، منستخدم كلمة
- `0:06.28–0:06.86` *didn't*
- `0:07.26–0:08.02` ‏وهي اختصار
- `0:08.18–0:08.93` *did not*
- `0:09.59–0:10.75` ‏والقاعدة هون بسيطة:
- `0:11.30–0:11.94` ‏الفاعل،
- `0:12.25–0:13.11` ‏بعده didn't، — *didn't*
- `0:13.37–0:15.05` ‏وبعده الفعل بصيغته الأصلية.
- `0:15.93–0:16.44` ‏مثلاً:

| | |
|---|---|
| Educational concept | To say you did NOT do something in the past, use DIDN'T, short for DID NOT. Rule: subject + DIDN'T + verb in its base form. |
| Visual situation | Cream page. Small Arabic heading at the top. The boy shakes his head next to a clock whose hands run backwards (= "didn't do anything in the past"). DIDN'T is written big in red, then "= DID NOT" beneath it with an arrow linking N'T to NOT. Bottom third: three formula boxes [الفاعل] + [DIDN'T] + [الفعل بصيغته الأصلية], labels written as each is spoken. 9:16: stacked top→bottom (heading, boy+clock, DIDN'T = DID NOT, formula). 16:9: boy+clock on the left third, DIDN'T = DID NOT and formula on the right two thirds. |
| Characters & objects | Boy (the "I" of every example; introduced here). Prop: clock with hands running backwards (= past). |
| Drawing sequence | 1) Arabic heading "النفي" (0.0–1.9). 2) Boy, part by part (2.6–4.3). 3) Clock beside him, outline then hands (4.4–5.6). 4) "DIDN'T" in red (6.2–6.9). 5) "= DID NOT" under it (8.1–9.0) and a short arrow N'T → NOT. 6) Formula box outlines (9.6–10.8). 7) Box labels at their spoken times: "الفاعل" (11.3), "DIDN'T" in red (12.25), "الفعل بصيغته الأصلية" in green (13.4–15.1). 8) A down-arrow under the formula at "مثلاً" (15.9–16.4). |
| Hand movement | Writes the heading, draws the boy and clock, writes DIDN'T exactly while it is spoken, then DID NOT, then sweeps along the box outlines and writes each label as it is said. Glides between strokes; leaves the frame only during the gap 1.9–2.55. |
| Character animation | Boy: drawn, then the "no" pose with a frown on "ما عملت إشي" (≈4.6). Clock hands spin backwards from 5.0 to 6.9. Boy points to DIDN'T at 6.3. |
| English text | DIDN'T · = DID NOT · DIDN'T (formula box) |
| Arabic text | النفي · الفاعل · الفعل بصيغته الأصلية |
| Camera | Static on the page. Small push-in (≤1.05) on DIDN'T = DID NOT at 6.2–9.0, back to home at 9.4 before the formula. |
| Transition | Opening scene (the hand draws onto an empty page). |
| Synchronization | "النفي" written 0.0–1.88 · boy shakes head on "ما عملت إشي بالماضي" (≈4.6) · DIDN'T written 6.28–6.86 · DID NOT 8.18–8.93 · "الفاعل" 11.30–11.94 · DIDN'T box 12.25–13.11 · verb box 13.37–15.05 · arrow on "مثلاً" 15.93–16.44. |
| Review note | The heading word "النفي" comes from an inferred transcript word (ASR heard "لنا فيه"). If it is wrong, the heading is dropped or replaced. |

## S02 · Example: I DIDN'T WATCH TV YESTERDAY

**0:16.62 → 0:27.86** (11.2 s)

**Narration**

- `0:16.81–0:19.49` *I didn't watch TV yesterday.*
- `0:20.29–0:22.83` ‏يعني ما حضرت تلفزيون مبارح. ⚠️ ASR wrote "بارح"; written as Levantine "مبارح" (yesterday). Same meaning; confirm the spelling you prefer.
- `0:23.66–0:24.54` ‏انتبه منيح: ⚠️ ASR wrote "انت بهم نيح"; read as "انتبه منيح" (pay close attention) from context. Please confirm.
- `0:24.71–0:27.49` ‏بعد didn't الفعل برجع لأصله.

| | |
|---|---|
| Educational concept | The first example and its meaning; after DIDN'T the verb goes back to its base form (WATCH). |
| Visual situation | New page to the right. The sentence is written across the page while spoken, DIDN'T in red and WATCH in green. Next to it a TV that is OFF, crossed out with a red ✗ (= didn't watch). The Arabic meaning beneath the sentence. The boy is drawn beside the TV and raises a finger on "انتبه منيح"; then an arrow runs from DIDN'T to WATCH, WATCH is ringed in green, and the short Arabic label "برجع لأصله" is written by the ring. 9:16: sentence upper third (maxW 960, two lines), TV + boy middle, Arabic below the sentence. 16:9: boy + TV left, sentence and Arabic right. |
| Characters & objects | Boy (same as S01). Prop: TV (off) with a red cross. No calendar: YESTERDAY is already written and there is no free time slot to draw one. |
| Drawing sequence | 1) Sentence "I DIDN'T WATCH TV YESTERDAY." (16.8–19.6), DIDN'T red, WATCH green. 2) TV outline + red ✗ in the pause (19.5–20.25). 3) Arabic "ما حضرت تلفزيون مبارح" (20.3–22.9). 4) Boy, fast (≈1.2 s), beside the TV (22.85–24.05). 5) Arrow DIDN'T → WATCH (24.7–25.3), green ring around WATCH (25.3–25.9). 6) Arabic label "برجع لأصله" (26.2–27.5). |
| Hand movement | Writes the English sentence word by word as spoken, draws the TV and its cross in the pause, writes the Arabic meaning right→left along the baseline, draws the boy, then the arrow, ring and label. Glides between strokes (all gaps ≤ 1.4 s). |
| Character animation | Boy: reaches "pointUp" (raised finger) at 24.3 on "انتبه منيح", then turns toward the sentence (head) for the arrow and ring. |
| English text | I DIDN'T WATCH TV YESTERDAY. |
| Arabic text | ما حضرت تلفزيون مبارح · برجع لأصله |
| Camera | Pan to the new page (1.0 s from 16.62). Static afterwards; close-up zoom on DIDN'T → WATCH at 24.6–27.4 (≤1.05 on 9:16, 1.15 on 16:9), back home at 27.5. |
| Transition | Pan right. |
| Synchronization | Sentence 16.81–19.49 (DIDN'T ≈17.2, WATCH ≈18.1, YESTERDAY ≈18.7) · TV + ✗ in the pause 19.49–20.29 · Arabic meaning 20.29–22.83 · boy drawn 22.85–24.05, raised finger by 24.3 ("انتبه منيح" 23.66–24.54) · arrow on "بعد didn't" 24.71–25.94 · ring + label on "الفعل برجع لأصله" 26.20–27.49. |

## S03 · Wrong: I DIDN'T WATCHED TV ✗ · Right: I DIDN'T WATCH TV ✓

**0:27.86 → 0:37.04** (9.2 s)

**Narration**

- `0:28.23–0:29.25` ‏يعني ما نحكي
- `0:29.50–0:31.73` *I didn't watched TV* ⚠️ Deliberately wrong example. Whisper autocorrects it to "I didn't watch TV"; "watched" is inferred: the narrator calls it a mistake (هذا خطأ) and then gives "I didn't watch TV" as the correct form, the phrase decode heard "watch it" (an extra syllable), and forced scoring puts "watched" much closer here (gap 3.0) than on the correct repeats (gaps 7.0–7.9). Please confirm.
- `0:32.41–0:33.18` ‏لأنه هذا خطأ.
- `0:33.72–0:34.52` ‏الصحيح:
- `0:34.66–0:36.65` *I didn't watch TV.*

| | |
|---|---|
| Educational concept | Common mistake: keeping the past form after DIDN'T. "I didn't watched TV" is wrong; "I didn't watch TV" is right. |
| Visual situation | Same page as S02: the Arabic meaning and the arrow/ring/label are wiped; the sentence, TV and boy stay. The wrong sentence is written with WATCHED, its "ED" in red; then a red strike-through and a red ✗. Below it the correct sentence with WATCH in green and a green ✓. |
| Characters & objects | Boy (same). TV remains from S02. |
| Drawing sequence | 1) Wipe-erase of the lower half of S02 (27.9–28.5). 2) "I DIDN'T WATCHED TV" (29.5–31.8), "ED" in red. 3) Red strike-through + ✗ (32.4–33.2). 4) "I DIDN'T WATCH TV" (34.6–36.7), WATCH green. 5) Green ✓ (36.7–37.0). |
| Hand movement | Wipes the old lines in a zig-zag, writes the wrong sentence while it is spoken, strikes it through on "لأنه هذا خطأ", writes the correct sentence on "الصحيح: …", ticks it. |
| Character animation | Boy: frown + "no" pose on "هذا خطأ" (32.4–33.2), smile + "cheer" (or nod) after the ✓ (36.7). |
| English text | I DIDN'T WATCHED TV (marked wrong) · I DIDN'T WATCH TV |
| Arabic text | — |
| Camera | Close-up zoom on "WATCHED" (31.0–32.3) so the red ED reads, then back home for the strike and the correction (32.4). |
| Transition | Wipe-erase in place (no camera move). |
| Synchronization | Erase in the pause 27.49–28.23 and under "يعني ما نحكي" (28.23–29.25) · wrong sentence 29.50–31.73 · strike + ✗ on "لأنه هذا خطأ" 32.41–33.18 · correct sentence 34.66–36.65 (after "الصحيح" 33.72–34.52) · ✓ and smile in the pause 36.65–37.04. |
| Review note | The wrong example "I didn't watched TV" is inferred (Whisper autocorrects it to "watch"); evidence in the transcript flag. Confirm before it is drawn. |

## S04 · Irregular verbs: SHE DIDN'T GO TO SCHOOL ✓ · not WENT ✗

**0:37.04 → 0:46.34** (9.3 s)

**Narration**

- `0:37.43–0:39.32` ‏ونفس الإشي مع الأفعال غير المنتظمة. ⚠️ ASR wrote "غير المنطمئ"; read as "غير المنتظمة" (irregular verbs), which fits go/went and scored best.
- `0:39.88–0:40.38` ‏منحكي:
- `0:40.60–0:42.63` *She didn't go to school.*
- `0:43.27–0:43.64` ‏مش
- `0:43.85–0:45.87` *she didn't went to school.* ⚠️ Deliberately wrong example (introduced by "مش" = not). Heard directly by ASR and confirmed by scoring; no inference needed.

| | |
|---|---|
| Educational concept | The same rule for irregular verbs: SHE DIDN'T GO, not SHE DIDN'T WENT. |
| Visual situation | New chapter page. Arabic heading "الأفعال غير المنتظمة". The girl stands at home, a school building beside her crossed out in red (she didn't go). Correct sentence with GO in green and ✓; under it the wrong sentence with WENT in red, struck through with ✗. 9:16: heading top, girl+school upper middle, the two sentences below. 16:9: girl+school left, heading and sentences right. |
| Characters & objects | Girl (= "she"; introduced here and kept for "she" only). Prop: school with a red ✗. |
| Drawing sequence | 1) Arabic heading "الأفعال غير المنتظمة" (37.4–39.3). 2) Girl part by part (39.3–40.5, she is drawn while "منحكي" is said). 3) "SHE DIDN'T GO TO SCHOOL." (40.6–42.7), GO green. 4) School outline + red ✗ + green ✓ by the sentence (42.7–43.25). 5) "SHE DIDN'T WENT TO SCHOOL." (43.85–45.9), WENT red. 6) Red strike-through + ✗ (45.9–46.3). |
| Hand movement | Writes the heading, draws the girl, writes each sentence as spoken, draws the school + marks in the short pauses. Stays on the page; the strike happens in the pause after the wrong sentence. |
| Character animation | Girl: "shrug" while "she didn't go to school" is said (≈41.5); frown + "no" pose on "مش" (43.3) and through the wrong sentence. |
| English text | SHE DIDN'T GO TO SCHOOL. · SHE DIDN'T WENT TO SCHOOL. (marked wrong) |
| Arabic text | الأفعال غير المنتظمة |
| Camera | Diagonal move with the 0.42× zoom-out mid-way (new chapter), then static. |
| Transition | Diagonal zoom-out to a new page. |
| Synchronization | Heading on "ونفس الإشي مع الأفعال غير المنتظمة" 37.43–39.32 · girl drawn 39.32–40.5 (covers "منحكي" 39.88–40.38) · correct sentence 40.60–42.63 · school/✓ 42.63–43.27 · girl frowns on "مش" 43.27–43.64 · wrong sentence 43.85–45.87 · strike + ✗ 45.87–46.34. |

## S05 · Why? DID carries the past, so the verb stays in its base form

**0:46.34 → 0:57.00** (10.7 s)

**Narration**

- `0:46.82–0:47.30` ‏ليش؟
- `0:47.46–0:48.24` ‏لأنه كلمة
- `0:48.36–0:48.95` *did*
- `0:49.26–0:50.74` ‏هي اللي بتحمل معنى الماضي،
- `0:51.25–0:54.58` ‏وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية.
- `0:55.47–0:55.87` ‏ممتاز.
- `0:56.52–0:56.80` ‏هلأ… ⚠️ Last word, cut off at the end of the recording (ASR: "هلا"). Probably the start of the next part ("now…"); the recording ends here.

| | |
|---|---|
| Educational concept | Reason: DID already carries the past meaning, so the verb after it must be in its base form. |
| Visual situation | New page below. Arabic "ليش؟" at the top. DIDN'T written big with DID ringed in green; an arrow from DID to the backwards-running clock (the same clock as S01) with the Arabic label "معنى الماضي". Then an arrow from DIDN'T to the two base verbs of the lesson, WATCH and GO, in green, with the Arabic "بصيغته الأصلية" beside them. On "ممتاز" a green star is drawn by the verbs. 9:16: vertical stack. 16:9: DID + clock on the left, verbs on the right. |
| Characters & objects | No character is redrawn here (no free time slot for a full figure; the boy and girl stay on their earlier pages, visible in the final zoom-out if the pages are adjacent). Props: the backwards clock from S01 (same design), a star on "ممتاز". |
| Drawing sequence | 1) "ليش؟" (46.8–47.3). 2) "DIDN'T" (47.5–48.3) then green ring around DID on the spoken "did" (48.36–48.95). 3) Clock + hands (49.3–50.0), arrow DID → clock and label "معنى الماضي" (50.0–50.8). 4) Arrow down to "WATCH" and "GO" in green (51.3–53.0), Arabic "بصيغته الأصلية" (53.0–54.6). 5) Star on "ممتاز" (55.5–55.9). |
| Hand movement | Writes "ليش؟", DIDN'T, rings DID as "did" is said, draws the clock, writes the verbs and the label; after "ممتاز" the hand leaves the frame and the final page holds to 57.0. |
| Character animation | Clock hands spin backwards 49.3–50.7. Star pops (drawn) on "ممتاز"; nothing else moves during the final hold. |
| English text | DIDN'T · DID (ringed) · WATCH · GO |
| Arabic text | ليش؟ · معنى الماضي · بصيغته الأصلية |
| Camera | Pan down to the new page (1.0 s from 46.34). Slow zoom-out on "ممتاز" (55.4–56.5) to show this page and, in 16:9, the edge of the S04 page with the girl. |
| Transition | Pan down. |
| Synchronization | "ليش؟" 46.82–47.30 · DIDN'T on "لأنه كلمة" 47.46–48.24 · ring DID on "did" 48.36–48.95 · clock + "معنى الماضي" 49.26–50.74 · base verbs + label 51.25–54.58 · star on "ممتاز" 55.47–55.87 · hold during "هلأ…" (56.52–56.80) to the end of the audio. |
| Review note | WATCH and GO are re-used from the narration's own examples as the "base form" (not newly invented). The recording ends on a cut-off "هلأ…", so the video simply holds the last page. |

