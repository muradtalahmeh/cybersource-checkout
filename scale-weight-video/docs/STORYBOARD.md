# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 1:12.61 (72.610204 s) · 24 kHz mono PCM. 7 scenes, 27 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:08.03 | The scale says +1 kg |
| S02 | 0:08.03 | 0:18.20 | What 1 kg of real fat costs |
| S03 | 0:18.20 | 0:28.01 | In one single day |
| S04 | 0:28.01 | 0:35.10 | Did you really eat all that? |
| S05 | 0:35.10 | 0:48.45 | It is water, not fat |
| S06 | 0:48.45 | 0:57.88 | The number moves every day |
| S07 | 0:57.88 | 1:12.61 | Comment «حاجز» |

## S01 · The scale says +1 kg

**0:00.00 → 0:08.03** (8.0 s)

**Narration**

- `0:00.00–0:02.17` ‏محتارة ليش الميزان زاد كيلو
- `0:02.26–0:04.10` ‏فجأة؟ وخايفة؟ تعالي
- `0:04.23–0:06.44` ‏نفهم الموضوع بكل راحة
- `0:06.66–0:07.96` ‏وبدون أي قلق

| | |
|---|---|
| Educational concept | Hook: the viewer is confused and worried because the scale jumped a kilo overnight. |
| Visual situation | A bathroom scale is drawn; its display reads +1 with "كيلو"; the girl stands beside it worried (question marks, an exclamation on "فجأة"); then she relaxes as "بدون أي قلق" is written. |
| Characters & objects | Girl (the viewer). Objects: bathroom scale. |
| Drawing sequence | Scale → +1 → كيلو → girl → ? ? → ! → بدون أي قلق. |
| Hand movement | Draws the scale while “محتارة ليش الميزان زاد” is said; writes +1 on “كيلو”. |
| Character animation | Girl worried (frown, hands up), then smiles on “بدون أي قلق”. |
| English text | +1 |
| Arabic text | كيلو · بدون أي قلق |
| Camera | Static, slight push-in. |
| Transition | Pan right to the calorie page. |
| Synchronization | +1 on “كيلو” (≈1.6 s); “!” on “فجأة” (2.3 s); smile + text 6.66–7.96 s. |

## S02 · What 1 kg of real fat costs

**0:08.03 → 0:18.20** (10.2 s)

**Narration**

- `0:08.09–0:11.84` ‏عشان جسمك يزيد كيلو دهون حقيقي، إنتي بحاجة تستهلكي
- `0:11.90–0:12.75` ‏ما يقارب من
- `0:12.82–0:18.17` ‏7000 لـ 7800 سعرة حرارية زيادة فوق احتياجك اليومي

| | |
|---|---|
| Educational concept | To gain 1 kg of real fat the body needs about 7000–7800 kcal above the daily need. |
| Visual situation | A block of fat labelled "1" + "كيلو دهون"; below it the surplus "+7000 - 7800" with "سعرة حرارية"; an arrow from the calories to the fat block; "زيادة فوق احتياجك اليومي". |
| Characters & objects | Girl (small, pointing). |
| Drawing sequence | Fat block → label → +7000 - 7800 → سعرة حرارية → arrow → زيادة فوق احتياجك اليومي. |
| Hand movement | Writes the numbers exactly while they are spoken (12.8–15 s). |
| Character animation | Girl is drawn after “كيلو دهون” and points at the number as it is written. |
| English text | 1 · +7000 - 7800 |
| Arabic text | كيلو دهون · سعرة حرارية · زيادة فوق احتياجك اليومي |
| Camera | Static. |
| Transition | Pan down to the example. |
| Synchronization | Fat block on “كيلو دهون حقيقي” (9–11 s); numbers 12.8–15.2 s. |

## S03 · In one single day

**0:18.20 → 0:28.01** (9.8 s)

**Narration**

- `0:18.23–0:23.35` ‏يعني لو احتياجك اليومي للثبات مثلاً 2000 سعرة، فإنتي بحاجة تستهلكي من 9000 لـ ⚠️ “2000” scored best (−55.5 vs 3000 −72.3).
- `0:23.41–0:26.80` ‏9800 سعرة حرارية في يوم واحد عشان تزيدي ⚠️ “9800” (تسعتلاف وتمنمية) scored best spoken as words (−57.8 vs عشرتلاف وتمنمية −69.3); a digit-form test had preferred 10800. 2000 + 7000–7800 = 9000–9800.
- `0:26.88–0:27.97` ‏كيلو دهون واحد

| | |
|---|---|
| Educational concept | Example: with a daily need of 2000 kcal she would have to eat 9000–9800 kcal in one day to gain one kilo of fat. |
| Visual situation | Equation 2000 + 7000-7800 = 9000 - 9800; a growing mountain of burger plates; "في يوم واحد!" circled. |
| Characters & objects | None (the equation and the food carry it; the girl returns in S04). |
| Drawing sequence | 2000 → + → 7000 - 7800 → = 9000 - 9800 → plates ×3 → في يوم واحد → circle. |
| Hand movement | Writes 2000 on “ألفين”, the result on “9000 لـ 9800”. |
| Character animation | Plates pile up one after another on “في يوم واحد”. |
| English text | 2000 + 7000 - 7800 · = 9000 - 9800 |
| Arabic text | في يوم واحد |
| Camera | Static. |
| Transition | Wipe-erase in place. |
| Synchronization | 2000 at 20.0 s; = 9000 - 9800 at 22.3–25.5 s; في يوم واحد at 25.6 s. |
| Review note | “9800” inferred from scoring (see transcript flag). |

## S04 · Did you really eat all that?

**0:28.01 → 0:35.10** (7.1 s)

**Narration**

- `0:28.06–0:29.66` ‏هل عن جد أكلتي
- `0:29.82–0:31.37` ‏كل هالسعرات بيوم واحد؟
- `0:32.02–0:32.88` ‏أكيد لا
- `0:32.99–0:34.92` ‏طيب شو اللي زاد؟ ⚠️ Inferred: decode looped; “طيب شو اللي زاد” (−41.2) ≈ “طيب ليش زاد الوزن” (−42.8).

| | |
|---|---|
| Educational concept | Of course not — so what did increase? |
| Visual situation | The food mountain stays; the girl thinks; on “أكيد لا” a big red ✗ over the plates; then a scale with a question mark. |
| Characters & objects | Girl (thinking → shaking head). |
| Drawing sequence | Thought bubble → ? → red ✗ → small scale → ?. |
| Hand movement | Strikes the plates fast on “أكيد لا”. |
| Character animation | Think pose, then “no” head shake. |
| English text | ? |
| Arabic text | أكيد لا |
| Camera | Close-up on the scale at 33 s. |
| Transition | Pan right. |
| Synchronization | ✗ at 32.0 s; “?” on “طيب شو اللي زاد” 33.0–34.9 s. |

## S05 · It is water, not fat

**0:35.10 → 0:48.45** (13.4 s)

**Narration**

- `0:35.29–0:37.55` ‏الوزن اللي زاد غالباً مَيّ
- `0:37.79–0:39.03` ‏وسوائل محبوسة
- `0:39.30–0:42.41` ‏مش دهون… مَيّ في مَيّ. والخلاصة بكل حب:
- `0:42.61–0:47.11` ‏طالما ما أكلتي هذا الكم الهائل من السعرات، لا تحتاري أبداً
- `0:47.17–0:48.26` ‏ولا تقلقي

| | |
|---|---|
| Educational concept | The extra weight is mostly water and retained fluids, not fat; as long as you did not eat that huge amount, don’t worry. |
| Visual situation | Scale +1 filled with water drops; "مَيّ وسوائل محبوسة"; the fat block crossed out with "مش دهون"; a heart for "بكل حب"; the girl relaxes and smiles. |
| Characters & objects | Girl (relieved). |
| Drawing sequence | Drops → مَيّ وسوائل محبوسة → fat block → ✗ → مش دهون → heart → لا تقلقي. |
| Hand movement | Draws drops on “مَيّ”, crosses the fat on “مش دهون”. |
| Character animation | Girl smiles, then cheers on “ولا تقلقي”. |
| English text | +1 |
| Arabic text | مَيّ وسوائل محبوسة · مش دهون · لا تقلقي |
| Camera | Static. |
| Transition | Pan down. |
| Synchronization | Drops 35.3–37.5 s; ✗ 39.3 s; heart 41 s; cheer 47.2 s. |

## S06 · The number moves every day

**0:48.45 → 0:57.88** (9.4 s)

**Narration**

- `0:48.64–0:49.35` ‏من الزيادة ⚠️ Short unclear span; “من الزيادة” scored best (−12.6).
- `0:49.46–0:54.46` ‏رقم الميزان طبيعي جداً إنه يتغير من يوم لآخر
- `0:54.54–0:57.69` ‏إذا وزنك ثابت ومش عارفة كيف تكسري هذا الوزن

| | |
|---|---|
| Educational concept | It is normal for the scale number to change from day to day; but if your weight is stuck… |
| Visual situation | A day-by-day chart with a zig-zag line and a ✓ "طبيعي"; then a flat line hitting a barrier (wall) for a stuck weight; girl shrugs. |
| Characters & objects | Girl (shrug). |
| Drawing sequence | Axes → zig-zag → ✓ طبيعي → flat line → wall. |
| Hand movement | Draws the zig-zag while “يتغير من يوم لآخر” is said, then the girl. |
| Character animation | Shrug on “مش عارفة كيف تكسري”. |
| English text | — |
| Arabic text | طبيعي · ثابت |
| Camera | Static. |
| Transition | Pan right to the phone. |
| Synchronization | Zig-zag 50–54.4 s; flat line + wall 54.6–57.6 s. |

## S07 · Comment «حاجز»

**0:57.88 → 1:12.61** (14.7 s)

**Narration**

- `0:58.07–1:01.52` ‏عليكِ بكلمة «حاجز» ويوصلك فيديو مجاني ⚠️ Decode looped; text from the sentence-level pass + scoring (“عليكي بكلمة حاجز” −29.2).
- `1:01.63–1:02.99` ‏بشرحلك كيف تكسري هذا الثبات
- `1:03.15–1:06.97` ‏من خلال فيديو يوتيوب، بشرحلك فيه بكل تفاصيله
- `1:07.23–1:10.32` ‏عليكِ بكلمة «حاجز» عشان يوصلك الفيديو فوراً
- `1:10.70–1:11.48` ‏على الخاص ⚠️ A first-pass “وتابعوني في القناة” at 72.06 s is a Whisper hallucination on near-silence (scored −27.5 vs −0.9).

| | |
|---|---|
| Educational concept | Call to action: comment the word «حاجز» to receive a free video that explains how to break the plateau. |
| Visual situation | A phone with a comment bubble «حاجز»; a play-button video screen with the flat line breaking through the wall; arrow to a private-message envelope; girl cheers. |
| Characters & objects | Girl (cheering). |
| Drawing sequence | Phone → comment bubble → حاجز → video screen → line breaks the wall → envelope → arrow. |
| Hand movement | Writes «حاجز» exactly on both mentions. |
| Character animation | Girl waves/cheers at the end. |
| English text | — |
| Arabic text | حاجز · فيديو مجاني · على الخاص |
| Camera | Static, gentle pull-back at the end. |
| Transition | End. |
| Synchronization | «حاجز» at 58.1 s and 67.3 s; envelope on “على الخاص” 70.7 s. |
| Review note | This CTA belongs to the original creator; publishing needs their permission. |

