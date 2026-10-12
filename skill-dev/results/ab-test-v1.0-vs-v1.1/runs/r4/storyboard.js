// Audio-aligned storyboard (data). Fill one entry per scene; scenes must be
// contiguous from 0 to AUDIO_DURATION. tools/storyboard.mjs validates this and
// writes docs/STORYBOARD.md. Fields: id, start, end, title, concept, visual,
// characters, drawing, hand, animation, english[], arabic[], camera,
// transition, sync, review (optional: anything the user must confirm).
// Domain: language lesson (Arabic/Levantine narration teaching English past
// simple) → references/domains/education-language.md.
// Cast (same roles throughout): BOY = "I / you"; BOY + GIRL = "they";
// FOOTBALL = the "play football" example. Colours: green = correct form /
// the past ending / fronted auxiliary; red = negation (weren't, didn't) and
// "not used" (crossed DID).
window.STORYBOARD = [
  {
    id: 'S01', start: 0, end: 18.40, title: 'Was / were: negative and question',
    concept: 'With was/were the negative is weren\'t, and the question puts was/were before the subject (Were you tired yesterday?). Did is NOT used with was/were the way it is with other verbs.',
    visual: 'Top: the sentence "THEY WEREN\'T HAPPY." with two frowning kids. Middle: a formula [WAS / WERE] + [الفاعل] + ? . Below: the example question written while spoken, the boy yawning (tired), Arabic meaning under it. Bottom: two small columns — WAS / WERE with DID crossed out in red, and باقي الأفعال with DID and a green ✓.',
    characters: 'BOY (= you) and GIRL (together = they), standing left/right below the first sentence; ZZZ prop over the boy for "tired".',
    drawing: '1) THEY WEREN\'T HAPPY. (WEREN\'T red) 0.35–2.15 · 2) boy then girl, outline only, 2.15–3.45 (frown) · 3) box WAS / WERE (green) ≈3.6–4.7 while "منقدّم was أو were" · 4) "+" and box الفاعل ≈4.8–5.9 while "على الفاعل" · 5) "?" 5.9–6.3 · 6) short arrow down 6.4–7.0 ("مثلاً") · 7) WERE YOU TIRED YESTERDAY? 7.45–9.0 (WERE green, ring around YOU to echo the box order) · 8) zzz over the boy 9.0–9.4 · 9) Arabic يعني: كنت تعبان مبارح؟ revealed 9.45–11.35 · 10) WAS / WERE 12.0–13.6 · 11) DID 13.95–14.6 then red cross 14.6–15.0 · 12) to the right: Arabic label باقي الأفعال 15.6–16.9, then DID 16.95–17.5 and a green ✓ 17.5–17.75 (did belongs with the other verbs).',
    hand: 'Enters at 0.35 on the first word; glides (gaps < 1.4 s) between all items; after the red cross it writes the last label and leaves the frame at ≈17.7 so the pause before the review is clean.',
    animation: 'Kids fade in fills after outlines; both reach mouth:frown at 2.2 (they weren\'t happy). Boy: pose tired + mouth:yawn + eyes:tired at 8.9 (Were you tired?). Boy: pose no (head shake) at 14.7 when DID is crossed; back to rest at 17.9.',
    english: ["THEY WEREN'T HAPPY.", 'WAS / WERE', '?', 'WERE YOU TIRED YESTERDAY?', 'DID (crossed out)', 'DID (✓)'],
    arabic: ['الفاعل', 'يعني: كنت تعبان مبارح؟', 'باقي الأفعال'],
    camera: '9:16: page 1 laid out top→bottom (sentence y≈260, kids y≈520–760 feet, formula y≈900, question y≈1100, Arabic y≈1230, WAS/WERE ✗DID y≈1380). Slow camTo push down: home until 7.0, then local centre on the question area 7.0–8.0 (zoom 1.0), back home at 11.8. 16:9: two columns — left: sentence + kids; right: formula, question, Arabic, crossed DID; no push.',
    transition: 'Opening: the page is blank cream paper at 0; the hand enters (no camera move). Out: diag zoom-out into S02 (new chapter: review).',
    sync: '"they weren\'t happy" 1.06–2.07 → sentence 0.35–2.15. "was أو were" inside 2.66–5.85 → WAS/WERE box; "على الفاعل" → second box (refine the split with a phrase-level check when building). "مثلاً" 6.41–7.02 → arrow. English 7.54–8.86 → question 7.45–9.0. Arabic 9.41–11.24 → reveal 9.45–11.35. "مع was و were" 11.96–13.71 → WAS/WERE; "ما منستخدم did" starts 13.93 → DID + cross by 15.0. "مع باقي الأفعال" ≈16.5–17.87 → باقي الأفعال + DID ✓ (refine with a phrase check; the label may need to start later).',
    review: 'The clip opens mid-lesson with an answer ("they weren\'t happy") whose question is not in the recording — it is shown as a standalone example. "على الفاعل" vs "على الفعل" was ambiguous in ASR (see transcript flag). The DID ✓ under باقي الأفعال visualises "بنفس الطريقة اللي استخدمناها مع باقي الأفعال" (did is used with the other verbs).',
  },
  {
    id: 'S02', start: 18.40, end: 33.55, title: 'Review: when to use past simple + affirmative',
    concept: 'Quick review: use past simple for something that happened and finished in the past. Affirmative: the verb in its past form — I played football.',
    visual: 'Heading "مراجعة سريعة". A timeline arrow with a finished event dot labelled PAST (with a green ✓ = "صار وانتهى"), then the big title PAST SIMPLE. Below: a "+" box "الفعل بصيغة الماضي", and the boy kicking a football while I PLAYED FOOTBALL. is written with ED in green.',
    characters: 'BOY (= I) with the FOOTBALL at his foot, lower left of the page.',
    drawing: '1) Arabic heading مراجعة سريعة 19.0–21.0 · 2) timeline arrow 22.0–23.4 · 3) event dot + small green ✓ 23.5–24.4 ("صار وانتهى") · 4) PAST under the dot 24.5–25.15 ("بالماضي") · 5) PAST SIMPLE (green, large) 25.5–27.0 · 6) "+" sign 27.7–28.2, Arabic label جملة مثبتة 28.2–29.1 · 7) box الفعل بصيغة الماضي 29.1–30.7 · 8) boy (outline) + ball 30.75–32.05 ("مثلاً") · 9) I PLAYED FOOTBALL. 32.1–33.4, ED in green.',
    hand: 'Writes continuously; glides between items; leaves the frame briefly in the 21.18–21.88 pause and the 26.96–27.65 pause (for the viewer to read PAST SIMPLE); stays in for the boy and sentence; exits at 33.45 before the pan.',
    animation: 'Boy: kick pose reached at 32.75 (on "played"), ball A.anim flies right in an arc 32.75–33.5 and lands; boy pose cheer + mouth:grin at 33.5 during the 33.17–33.93 pause.',
    english: ['PAST', 'PAST SIMPLE', '+', 'I PLAYED FOOTBALL. (ED in green)'],
    arabic: ['مراجعة سريعة', 'جملة مثبتة', 'الفعل بصيغة الماضي'],
    camera: '9:16: heading y≈280, timeline y≈480, PAST SIMPLE y≈640, "+" row y≈880, boy feet y≈1420 left, sentence y≈1180 (maxW 960). Camera push-in (zoom ≈1.04) toward the sentence 31.9–33.4, home at 33.5. 16:9: left half = heading, timeline, PAST SIMPLE; right half = "+" box, boy and sentence.',
    transition: 'In: diag zoom-out from S01 (pan starts 18.4, 1.0 s, lands before the heading at 19.0). Out: pan right to S03 at 33.55.',
    sync: '"خلّينا نراجع … بسرعة" 18.95–21.18 → heading. "إشي صار وانتهى" ≈22–24.3 → timeline + dot + ✓; "بالماضي" ≈24.4–25.17 → PAST. "استخدم الـ past simple" 25.48–26.96 → title. "بالجملة المثبتة" ≈27.65–29.0 → "+" label; "الفعل بصيغة الماضي" ≈29–30.62 → box. "مثلاً" 31.31–31.98 → boy appears. English 32.17–33.17 → sentence 32.1–33.4, ED written ≈33.0.',
    review: 'Labels مراجعة سريعة, جملة مثبتة and PAST are short labels taken from the narration ("نراجع … بسرعة", "بالجملة المثبتة", "بالماضي").',
  },
  {
    id: 'S03', start: 33.55, end: 46.95, title: 'Negative with didn\'t, question with did',
    concept: 'Negative: didn\'t + the base verb (I didn\'t play football). Question: Did + subject + base verb.',
    visual: 'Row 1 (negative): red "−", box DIDN\'T (red) + box الفعل الأصلي. Under it I DIDN\'T PLAY FOOTBALL. with DIDN\'T red and PLAY ringed green (no -ed), and the football with a red ✗. Row 2 (question): "?" sign and formula [DID] + [الفاعل] + [الفعل الأصلي] + ?.',
    characters: 'FOOTBALL (same prop as S02) with a red cross. No character drawn: the pauses are 0.6–0.7 s, too short to draw the boy again.',
    drawing: '1) red "−" 34.0–34.4, Arabic label النفي 34.4–35.0 · 2) box DIDN\'T (red) 35.0–35.9 · 3) "+" and box الفعل الأصلي 36.05–37.45 · 4) I DIDN\'T PLAY FOOTBALL. 38.0–39.65 · 5) green ring around PLAY 39.65–39.95 · 6) football 39.95–40.2 then red ✗ over it 40.2–40.5 (overlaps the start of the next sentence by 0.3 s — acceptable) · 7) "?" sign + Arabic السؤال 40.6–41.3 · 8) box DID (green) 41.3–42.2 · 9) "+" box الفاعل 42.4–43.6 · 10) "+" box الفعل الأصلي 45.5–46.7 · 11) "?" 46.7–46.9.',
    hand: 'Writes continuously; glides; in the 44.82–45.54 gap it waits at the third box position (gap < 1.4 s); exits at 46.9.',
    animation: 'None beyond drawing; the ✗ on the ball is the reaction for "didn\'t". (Optional: ball wobbles via A.anim 40.5–40.9.)',
    english: ['−', "DIDN'T", "I DIDN'T PLAY FOOTBALL.", '?', 'DID'],
    arabic: ['النفي', 'الفعل الأصلي', 'السؤال', 'الفاعل', 'الفعل الأصلي'],
    camera: '9:16: negative row y≈330, sentence y≈560, ball y≈720; question row y≈980 (three boxes stacked 2 + 1 if they overflow 960 px). Camera stays home. 16:9: negative row + sentence on the top half, question formula on the bottom half, ball at right of the sentence.',
    transition: 'In: pan right from S02 at 33.55 (0.8 s; arrives before 34.0). Out: pan down to S04 at 46.95.',
    sync: '"بالنفي" ≈33.93–34.6 → "−" + النفي; "استخدم didn\'t" ≈34.6–35.83 → DIDN\'T box. "وبعدها الفعل الأصلي" 36.05–37.38 → box. English 38.08–39.51 → sentence 38.0–39.65. "وبالسؤال" ≈40.23–41.0 → "?" + السؤال; "استخدم did" ≈41.0–42.15 → DID box. "وبعدها الفاعل" ≈42.32–43.6 → الفاعل box. "الفعل الأصلي" 45.54–46.64 → last box.',
    review: 'The narration gives no example question with did, so none is written (no invented "Did you …?"). If you want one, tell us which sentence. Labels النفي / السؤال paraphrase "بالنفي" / "بالسؤال".',
  },
  {
    id: 'S04', start: 46.95, end: 57.0, title: 'Regular (-ed / -d) and irregular verbs',
    concept: 'Regular verbs usually add -ed or -d, depending on spelling rules. Irregular verbs have to be learned.',
    visual: 'Top: heading الأفعال المنتظمة (green). Under it PLAY → PLAYED with ED green (reusing the lesson\'s own example), then "+ED / +D" labels and a small Arabic note حسب قواعد الإملاء. Bottom: heading الأفعال غير المنتظمة with a wavy underline, and a book (to learn).',
    characters: 'No character (10 s, dense writing). BOOK prop for "نتعلّم".',
    drawing: '1) Arabic heading الأفعال المنتظمة 47.95–49.9 · 2) PLAY → 50.0–50.85 ("غالباً منضيف") · 3) PLAYED with ED green 50.9–51.6 ("ed") · 4) "/ +D" 51.7–52.25 ("أو d") · 5) Arabic حسب قواعد الإملاء 52.3–53.6 · 6) Arabic heading الأفعال غير المنتظمة 54.2–55.9 · 7) wavy underline 55.9–56.1 · 8) book 56.1–56.95.',
    hand: 'Enters at 47.95 after the pan; continuous writing; does not leave (the audio ends while the hand finishes the book).',
    animation: 'None (no character). Optional: PLAYED\'s ED pulses once (scale 1.08) at 51.6.',
    english: ['PLAY → PLAYED (ED in green)', '+ED / +D'],
    arabic: ['الأفعال المنتظمة', 'حسب قواعد الإملاء', 'الأفعال غير المنتظمة'],
    camera: '9:16: heading y≈320, PLAY → PLAYED y≈520 (stack on narrow frame), +ED / +D y≈720, Arabic note y≈830, irregular heading y≈1080, book y≈1300. Camera home. 16:9: regular verbs left column, irregular verbs + book right column.',
    transition: 'In: pan down from S03 at 46.95 (0.9 s), arriving while "وتذكّر" is said. Out: none — the recording ends abruptly at 57.0 s; hold the last frame (no outro, since nothing may be added to the audio).',
    sync: '"وتذكّر مع الأفعال المنتظمة" 47.29–49.89 → heading 47.95–49.9. "غالباً منضيف" 50.04–50.87 → PLAY →. "ed" 51.00–51.53 → PLAYED. "أو d" ≈51.67–52.2 → +D. "حسب قواعد الإملاء" ≈52.3–53.62 → note. "أما الأفعال غير المنتظمة" 54.18–55.9 → heading. "فلازم نتعلّم…" 56.02–57.0 → book.',
    review: 'PLAY → PLAYED is the narration\'s own example from 32.2 s, reused here to show -ed; no -d example (e.g. LIKE → LIKED) is drawn because the narration gives none. The narration names no irregular verb, so none is written. The audio is cut mid-sentence at 57.0 s; the last word ("شكلها"? / "شكراً"?) is not written.',
  },
];
