# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 4 scenes, 27 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:15.50 | Negation in the past: DIDN'T = DID NOT + the rule |
| S02 | 0:15.50 | 0:37.05 | I DIDN'T WATCH TV YESTERDAY — WATCH, not WATCHED |
| S03 | 0:37.05 | 0:46.35 | Irregular verbs too: SHE DIDN'T GO TO SCHOOL |
| S04 | 0:46.35 | 0:57.00 | Why? DID already carries the past |

## S01 · Negation in the past: DIDN'T = DID NOT + the rule

**0:00.00 → 0:15.50** (15.5 s)

**Narration**

- `0:00.00–0:01.88` ‏هلأ خلينا ننتقل للنفي ⚠️ "للنفي" inferred: ASR heard "لنا فيه" (scored slightly higher than "للنفي"); chosen from context (the clip is about negation).
- `0:02.55–0:06.07` ‏إذا بدك تحكي إنك ما عملت إشي بالماضي، منستخدم كلمة
- `0:06.28–0:06.86` *didn't*
- `0:07.26–0:08.93` ‏وهي اختصار — *did not*
- `0:09.59–0:11.94` ‏والقاعدة هون بسيطة: الفاعل
- `0:12.25–0:13.11` ‏بعده — *didn't*
- `0:13.37–0:15.05` ‏وبعده الفعل بصيغته الأصلية

| | |
|---|---|
| Educational concept | To say you did NOT do something in the past, use didn't (short for did not). Rule: subject + didn't + verb in its base form. |
| Visual situation | Clean cream page. Arabic heading "النفي" at the top with a small backwards-running clock (the past). Big DIDN'T in the middle, then "= DID NOT" under it with the apostrophe ringed. Lower third: three formula boxes [الفاعل] + [DIDN'T] + [الفعل بصيغته الأصلية]. |
| Characters & objects | Boy (the "I" of the clip) drawn at bottom-left from 2.6 s, pose think → point toward the boxes. Prop: clock with hands running backwards. |
| Drawing sequence | 0.0–1.9 "النفي" heading (Arabic reveal) · 1.9–2.5 clock outline · 2.6–4.4 boy (head → body → limbs) · 6.2–6.9 DIDN'T (red) · 7.3–8.9 "= DID NOT", ring the apostrophe at 8.6 · 9.6–10.8 three empty boxes · 11.3–11.9 label "الفاعل" in box 1 · 12.25–13.1 "DIDN'T" in box 2 · 13.4–15.05 "الفعل بصيغته الأصلية" in box 3 (green) · "+" signs between boxes. |
| Hand movement | Writes the heading, sketches clock and boy, then writes each formula label exactly as it is spoken; leaves the frame in the 15.05–15.5 pause. |
| Character animation | Clock hands spin backwards 1.9–6.0 s. Boy: think pose at "ما عملت إشي بالماضي" (3–6 s), point pose at the boxes from 9.6 s, small nod at 15.0 s. |
| English text | DIDN'T · = DID NOT · DIDN'T (formula box) |
| Arabic text | النفي · الفاعل · الفعل بصيغته الأصلية |
| Camera | Home framing; slow push-in (≤1.05) on DIDN'T = DID NOT 6.2–9.0, back to home for the formula at 9.5. |
| Transition | Opening: fade from blank paper (hand enters from the right). |
| Synchronization | "النفي" 0.0–1.9 · DIDN'T written 6.28–6.86 · "did not" 8.18–8.93 · boxes at "القاعدة هون بسيطة" 9.59 · الفاعل 11.30 · didn't 12.25 · الفعل بصيغته الأصلية 13.37–15.05. |
| Review note | "للنفي" at 0–1.9 is inferred (ASR heard "لنا فيه"). The clip starts with "هلأ خلينا ننتقل" — it looks like the middle of a longer lesson. |

## S02 · I DIDN'T WATCH TV YESTERDAY — WATCH, not WATCHED

**0:15.50 → 0:37.05** (21.5 s)

**Narration**

- `0:15.93–0:16.44` ‏مثلاً
- `0:16.81–0:19.49` *I didn't watch TV yesterday.*
- `0:20.29–0:22.83` ‏يعني ما حضرت تلفزيون مبارح ⚠️ Spelling of "مبارح": ASR wrote "بارح" (both mean yesterday); minor.
- `0:23.66–0:24.54` ‏انتبه منيح ⚠️ Inferred: ASR output "انت بهم نيح"; read as "انتبه منيح" (pay close attention), best-scoring real-word candidate.
- `0:24.71–0:27.49` ‏بعد didn't الفعل برجع لأصله
- `0:28.23–0:29.25` ‏يعني ما نحكي
- `0:29.50–0:31.73` *I didn't watched TV* ⚠️ Deliberately wrong example, INFERRED. Whisper autocorrects it to "watch"; forced scoring gap watch-vs-watched is only 3.0 here vs 7.9 on the correct repeat at 34.66, and the teacher says "لأنه هذا خطأ" right after. Please confirm "watched".
- `0:32.41–0:33.18` ‏لأنه هذا خطأ
- `0:33.72–0:34.52` ‏الصحيح
- `0:34.66–0:36.65` *I didn't watch TV.*

| | |
|---|---|
| Educational concept | Worked example: after didn't the verb goes back to its base form; I didn't watched TV is wrong, I didn't watch TV is right. |
| Visual situation | New page to the right. Boy beside a TV that is switched off with a red ✗ over the screen and a small calendar page "yesterday". Top: the sentence. Middle: arrow from DIDN'T to WATCH with Arabic note "الفعل برجع لأصله". Lower half (after a wipe-erase of the note): the wrong sentence in red, struck through with ✗, then the correct one with a green ✓. |
| Characters & objects | Boy (same as S01). Props: tv({on:false}) with red cross, calendar. |
| Drawing sequence | 15.9–16.5 small "مثلاً" tag · 16.6–19.7 "I DIDN'T WATCH TV YESTERDAY." (DIDN'T red, WATCH green) · 19.7–20.3 TV outline · 20.3–22.9 cross on the TV screen + calendar + Arabic "ما حضرت تلفزيون مبارح" under the sentence · 23.7–24.5 ring DIDN'T · 24.7–27.5 arrow DIDN'T → WATCH and Arabic "الفعل برجع لأصله" · 28.2–29.2 wipe-erase the Arabic note area · 29.5–31.8 "I DIDN'T WATCHED TV" with ED in red · 32.4–33.2 red strike-through + ✗ · 33.7–34.5 Arabic "الصحيح" · 34.66–36.7 "I DIDN'T WATCH TV." + green ✓ at 36.7. |
| Hand movement | Writes each English sentence while it is spoken; rings DIDN'T and draws the arrow on "بعد didn't الفعل برجع لأصله"; wipes the note at 28.2; strikes the wrong sentence on "هذا خطأ"; ticks the correct one, then leaves the frame in the 36.7–37.05 pause. |
| Character animation | Boy sits/stands with arms crossed (no) next to the dark TV, shaking head at 20.3–22.8; frown at 32.4 (wrong form); smile/grin and thumbs-up style point at 36.7 (correct). |
| English text | I DIDN'T WATCH TV YESTERDAY. · I DIDN'T WATCHED TV (struck, ✗) · I DIDN'T WATCH TV. (✓) |
| Arabic text | مثلاً · ما حضرت تلفزيون مبارح · الفعل برجع لأصله · الصحيح |
| Camera | Pan right onto the new page 15.5–16.5. Close-up zoom on DIDN'T → WATCH 24.7–27.5, back out at 28.0 for the wrong/right pair. |
| Transition | Pan right (S01 → S02); in-scene wipe-erase of the Arabic note at 28.2. |
| Synchronization | Example sentence 16.81–19.49 · Arabic meaning 20.29–22.83 · ring at "انتبه منيح" 23.66 · arrow 24.71–27.49 · wrong sentence 29.50–31.73 · strike at "هذا خطأ" 32.41 · "الصحيح" 33.72 · correct sentence 34.66–36.65. |
| Review note | The wrong example "I didn't watched TV" (29.5–31.7) is inferred — Whisper autocorrects it to "watch"; confirm the teacher says "watched". "انتبه منيح" (23.7) is inferred from garbled ASR. |

## S03 · Irregular verbs too: SHE DIDN'T GO TO SCHOOL

**0:37.05 → 0:46.35** (9.3 s)

**Narration**

- `0:37.43–0:39.32` ‏ونفس الشي مع الأفعال غير المنتظمة ⚠️ ASR: "نفس الأشياء مع الأفعال غير المنطمئ"; corrected to "غير المنتظمة" (irregular verbs) from context.
- `0:39.88–0:40.38` ‏منحكي:
- `0:40.60–0:42.63` *She didn't go to school.*
- `0:43.27–0:43.64` ‏مش
- `0:43.85–0:45.87` *she didn't went to school.* ⚠️ Deliberately wrong example (marked by "مش"); Whisper decoded "went" directly, high confidence.

| | |
|---|---|
| Educational concept | The same rule applies to irregular verbs: She didn't go to school, not She didn't went to school. |
| Visual situation | New page below. Arabic heading "الأفعال غير المنتظمة". Girl at the left, school on the right, a dashed path between them crossed out in red (she did not go). Sentence 1 with green ✓; sentence 2 with WENT in red, struck through with ✗. |
| Characters & objects | Girl (= "she"). Props: school, dashed path with a red cross. |
| Drawing sequence | 37.4–39.4 Arabic heading "الأفعال غير المنتظمة" · 39.3–40.4 girl (quick) · 40.6–42.8 "SHE DIDN'T GO TO SCHOOL." (DIDN'T red, GO green) · school + dashed path + red cross drawn over 42.6–43.2 · green ✓ at 43.3 on "مش" · 43.85–45.9 "SHE DIDN'T WENT TO SCHOOL." with WENT in red · strike + ✗ 45.9–46.3. |
| Hand movement | Writes the heading, draws the girl, writes both sentences as spoken, ticks and crosses, then leaves the frame. |
| Character animation | Girl: stays home, shrug / "no" pose at 41.0; frown at the wrong sentence 45.9. |
| English text | SHE DIDN'T GO TO SCHOOL. (✓) · SHE DIDN'T WENT TO SCHOOL. (struck, ✗) |
| Arabic text | الأفعال غير المنتظمة |
| Camera | Pan down to the new page 37.05–38.0; holds. |
| Transition | Pan down (S02 → S03). |
| Synchronization | Heading 37.43–39.32 · "منحكي" 39.88 · correct sentence 40.60–42.63 · "مش" 43.27 · wrong sentence 43.85–45.87 · strike in the 45.87–46.35 pause. |
| Review note | "الأفعال غير المنتظمة" corrected from ASR "غير المنطمئ". The ✓/✗ and the red WENT come from the narration's "مش". |

## S04 · Why? DID already carries the past

**0:46.35 → 0:57.00** (10.6 s)

**Narration**

- `0:46.82–0:47.30` ‏ليش؟
- `0:47.46–0:50.74` ‏لأنه كلمة did هي اللي بتحمل معنى الماضي ⚠️ Phrase 47.46–48.24 looped in the phrase-level decode; sentence-level decode gives "كلمة دد". "did" scored above "didn't" — confirm the teacher says "did".
- `0:51.25–0:54.58` ‏وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية
- `0:55.47–0:55.87` ‏ممتاز
- `0:56.52–0:56.80` ‏هلأ… ⚠️ Last word is cut off at the end of the recording ("هلأ/هلا", the start of a next sentence). Kept as audio; no visual content attached.

| | |
|---|---|
| Educational concept | Why: did is the word that carries the past meaning, so the verb after it must stay in its base form. |
| Visual situation | New page. Big "?" with Arabic "ليش؟". DIDN'T written large; DID ringed in green and linked to the backwards clock (the past). An arrow from DIDN'T down to two base verbs, WATCH and GO, labelled "بصيغته الأصلية". Boy and girl at the bottom cheer at "ممتاز". |
| Characters & objects | Boy and girl (both from earlier scenes). Prop: clock with hands running backwards, star. |
| Drawing sequence | 46.4–47.3 big "?" + Arabic "ليش؟" · 47.4–48.3 DIDN'T large · 48.3–48.9 ring DID (green) · 49.3–50.7 clock + arrow DID → clock + Arabic "تحمل معنى الماضي" · 51.3–52.0 arrow from DIDN'T down · 52.0–53.0 WATCH · GO (green) with the label "بصيغته الأصلية" · 53.0–54.2 boy · 54.2–55.4 girl (fills fade after) · 55.5 star above them. |
| Hand movement | Writes "?" and DIDN'T, rings DID, draws clock, arrows and the two characters; leaves the frame at 55.4 for the cheer and stays out for the cut-off "هلأ" at 56.5. |
| Character animation | Clock spins backwards 49.3–50.7. Boy and girl (drawn 53.0–55.4) cheer at "ممتاز" 55.47, hold to the end. |
| English text | DIDN'T (DID ringed) · WATCH · GO |
| Arabic text | ليش؟ · تحمل معنى الماضي · بصيغته الأصلية |
| Camera | Pan right to the new page 46.35–47.0; close-up zoom on DID 48.2–50.8; slow zoom-out 54.8–56.5 to frame both characters cheering. |
| Transition | Pan right (S03 → S04); ends on a held frame (end of recording). |
| Synchronization | "ليش؟" 46.82 · "كلمة did" ~48.4 · "بتحمل معنى الماضي" 49.26–50.74 · "الفعل اللي بعدها … بصيغته الأصلية" 51.25–54.58 · "ممتاز" 55.47 · cut-off "هلأ" 56.52–56.80. |
| Review note | WATCH and GO are reused from the narration's own examples as "base forms" (not newly invented examples). The recording ends on a cut-off "هلأ" — the user may want to trim/extend the clip; the audio is kept unaltered. "did" at ~48.4 is inferred (looped phrase decode). |

