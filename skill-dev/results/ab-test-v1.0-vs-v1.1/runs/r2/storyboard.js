// Audio-aligned storyboard (data). Fill one entry per scene; scenes must be
// contiguous from 0 to AUDIO_DURATION. tools/storyboard.mjs validates this and
// writes docs/STORYBOARD.md. Fields: id, start, end, title, concept, visual,
// characters, drawing, hand, animation, english[], arabic[], camera,
// transition, sync, review (optional: anything the user must confirm).
// Cuts sit in the middle of measured pauses: 17.87–18.95, 33.16–33.93, 46.64–47.29.
// Cast (same all through): BOY = "I / you", GIRL = second member of "they" and the
// one who asks "Did you play football?".
// English strings use only pen-font glyphs (A–Z . , ? ! ' - / ( ) : + = _); arrows,
// ✓ and ✗ are drawn marks (A.arrow / pair / A.check / A.cross), noted in brackets.
window.STORYBOARD = [
  {
    id: 'S01', start: 0, end: 18.41, title: 'Was / were: questions without "did"',
    concept: 'Recap of was/were (negative example "They weren\'t happy"), then the question: was/were moves in front of the subject; no "did" with was/were, unlike other verbs.',
    visual: 'Top: boy and girl side by side, both frowning — "THEY WEREN\'T HAPPY." written under them. Middle: formula boxes [WAS / WERE] + [SUBJECT] ... ? with a curved arrow lifting WAS / WERE in front of the SUBJECT box. Then the example sentence; the boy yawns with tired eyes beside a small calendar labelled YESTERDAY. Bottom: "WAS / WERE" with "DID" written next to it and struck out in red (narration: we don\'t use did with was/were), and a small label "OTHER VERBS → DID" in green as the contrast.',
    characters: 'Boy (you), girl (with boy = they); props: calendar, zzz.',
    drawing: '1) boy + girl outlines (0.0–1.0) → 2) "THEY WEREN\'T HAPPY." 1.0–2.2 → 3) formula boxes WAS/WERE + SUBJECT 2.7–5.9, arrow at "على الفاعل" ≈5.0 → 4) "WERE YOU TIRED YESTERDAY?" 7.5–9.0 (WERE in green) → 5) yawning pose + calendar during "يعني كنت تعبان مبارح" 9.4–11.3, Arabic gloss revealed → 6) "WAS / WERE" + "DID" with red strike 12.0–15.0 → 7) "OTHER VERBS → DID" 15.5–17.9.',
    hand: 'Enters from the right on the characters, writes each sentence left→right on its spoken time, glides between items (gaps ≤ 1.4 s); leaves the frame 17.9–18.4 during the pause.',
    animation: 'Both characters settle into a frown at 1.1 s; boy turns to "ask" pose on WERE (7.6), then yawns (mouth yawn, eyes tired) at 9.5 with zzz; at 12.0 boy shakes head ("no" preset) as DID is struck.',
    english: ["THEY WEREN'T HAPPY.", 'WERE', 'SUBJECT', 'WERE YOU TIRED YESTERDAY?', 'YESTERDAY', 'WAS / WERE', 'DID (red strike + cross mark)', 'OTHER VERBS (drawn arrow) DID'],
    arabic: ['السؤال: was / were قبل الفاعل', 'كنت تعبان مبارح؟', 'ما منستخدم did مع was / were'],
    camera: 'Starts on a wide home frame; slow push-in (≤1.05) to the question sentence at 7.5; back to home at 11.9 to show the DID rule.',
    transition: 'Opening: hand draws on a blank page (no transition in).',
    sync: '"They weren\'t happy" 1.06–2.07 · "was أو were على الفاعل" 2.66–5.85 · "Were you tired yesterday?" 7.54–8.86 · Arabic gloss 9.41–11.24 · "ما منستخدم did" 11.96–17.87 (DID struck ≈13.9).',
    review: 'Clip starts mid-lesson ("أو they weren\'t happy"): the earlier example it continues from is not in this recording. "على الفاعل" vs "على الفعل" at 2.66–5.85 is inferred — if the speaker said "الفعل" (verb) the visual still shows WERE before the subject, which is the correct rule.',
  },
  {
    id: 'S02', start: 18.41, end: 33.55, title: 'Quick review: past simple + affirmative',
    concept: 'Past simple = something that happened and finished in the past. Affirmative sentence: the verb goes into its past form.',
    visual: 'New page headed "QUICK REVIEW" (Arabic: أهم الأفكار). A timeline PAST ←—|—→ NOW; a dot on the past side gets a start mark and an end mark with a green ✓ ("صار وانتهى"). "PAST SIMPLE" written large under the timeline. Then a "+" box: "VERB → PAST FORM". Example: the boy kicks the ball while "I PLAYED FOOTBALL." is written; under it PLAY → PLAYED with ED in green.',
    characters: 'Boy (I); props: ball, clock with hands running backwards next to PAST.',
    drawing: '1) "QUICK REVIEW" heading 19.0–20.6 → 2) timeline line + NOW tick + PAST label 21.9–23.5 → 3) event dot, start/end marks, ✓ 23.5–25.2 → 4) "PAST SIMPLE" 25.5–27.0 → 5) "+" box and "VERB → PAST FORM" 27.7–30.6 → 6) boy + ball 30.6–32.0 (during "مثلاً") → 7) "I PLAYED FOOTBALL." 32.1–33.3 → 8) PLAY → PLAYED green ending 33.2–33.5.',
    hand: 'Writes heading, draws the timeline left→right, taps the event; draws the boy part by part, then writes the sentence while the ball flies.',
    animation: 'Clock hands spin backwards 21.9–25.2. Boy "kick" pose at 32.2 ("played"), ball arcs off to the right (A.anim), boy grins.',
    english: ['QUICK REVIEW', 'PAST', 'NOW', 'PAST SIMPLE', '+', 'VERB (drawn arrow) PAST FORM', 'I PLAYED FOOTBALL.', 'PLAY (pair arrow) PLAYED, ED green'],
    arabic: ['أهم الأفكار', 'صار وانتهى', 'الجملة المثبتة: الفعل بصيغة الماضي'],
    camera: 'Home frame; small pan down 30.5 to make room for the boy and example.',
    transition: 'Pan right to a new page (18.41–19.3, inside the pause).',
    sync: '"نراجع أهم الأفكار" 18.95–21.18 · "صار وانتهى بالماضي" 21.88–25.17 · "past simple" 25.48–26.96 · "الفعل بصيغة الماضي" 27.65–30.62 · "I played football" 32.17–33.16 ("played" ≈32.4).',
  },
  {
    id: 'S03', start: 33.55, end: 46.97, title: 'Negative and question with did',
    concept: 'Negative: didn\'t + base verb. Question: Did + subject + base verb.',
    visual: 'Same page structure, two stacked rows. Row 1 "−" box: [DIDN\'T] + [BASE VERB] with "PLAY" ringed in green; example "I DIDN\'T PLAY FOOTBALL." — the boy stands still with a flat mouth, the ball beside him crossed out in red (he did not do it). Row 2 "?" formula boxes [DID] + [SUBJECT] + [BASE VERB] ?; the girl asks the boy in a speech bubble "DID YOU PLAY FOOTBALL?", the boy shrugs.',
    characters: 'Boy (I / you), girl (asks the question); props: ball, speech bubble.',
    drawing: '1) "−" label + DIDN\'T box 33.9–35.8 (DIDN\'T in red) → 2) + BASE VERB box 36.0–37.4 → 3) "I DIDN\'T PLAY FOOTBALL." 38.0–39.7, ring on PLAY 39.7 → 4) ball + red ✗ 39.7–40.2 → 5) "?" label + DID box 40.2–42.2 → 6) SUBJECT box 42.3–43.5, BASE VERB box 43.5–44.8 → 7) girl + bubble 44.8–45.5 → 8) "DID YOU PLAY FOOTBALL?" in bubble 45.5–46.7.',
    hand: 'Writes formula boxes on their spoken words; after the negative sentence it draws the crossed ball; for the question it draws the girl quickly then writes inside the bubble.',
    animation: 'Boy shakes head ("no") at 38.4; girl "ask" pose + talk mouth 45.5; boy "shrug" at 46.6.',
    english: ['-', "DIDN'T", 'BASE VERB', "I DIDN'T PLAY FOOTBALL.", '?', 'DID', 'SUBJECT', 'DID YOU PLAY FOOTBALL?'],
    arabic: ['النفي', 'السؤال', 'الفعل الأصلي'],
    camera: 'Home on row 1; camTo row 2 at 40.0; slight zoom (1.04) on the bubble 45.4–46.9.',
    transition: 'Pan down from S02 (33.55–34.3, inside the pause).',
    sync: '"didn\'t" 33.93–35.83 · "الفعل الأصلي" 36.05–37.36 · "I didn\'t play football" 38.08–39.51 · "did" 40.23–42.15 · "الفاعل … الفعل الأصلي" 42.32–44.82 · "Did you play football?" 45.54–46.64.',
    review: 'Only the correct forms are shown (no "didn\'t played"): the narration does not present a wrong form here.',
  },
  {
    id: 'S04', start: 46.97, end: 57.0, title: 'Regular (+ED / +D) and irregular verbs',
    concept: 'Regular verbs usually add -ED or -D depending on spelling rules; irregular verbs have to be learned.',
    visual: 'Split page. Left column "REGULAR": PLAY → PLAYED (ED in green, reusing the lesson\'s own verb), then "+ED / +D" with a small pencil note "SPELLING" (Arabic: حسب قواعد الإملاء). Right column "IRREGULAR": a zig-zag arrow and a book; the boy holds the book with a thought bubble containing a question mark, then a lightbulb as "we must learn them" is said.',
    characters: 'Boy; props: book, thought bubble, bulb.',
    drawing: '1) "REGULAR" 47.3–48.9 → 2) PLAY → PLAYED with ED green 49.0–51.0 (ED at "ED" ≈50.4) → 3) "+ED / +D" 50.4–52.0 → 4) "SPELLING" + Arabic note 52.0–53.6 → 5) "IRREGULAR" + zig-zag arrow 54.2–55.9 → 6) boy + book 55.9–56.6 → 7) bulb 56.6–57.0.',
    hand: 'Writes the left column, then crosses to the right column; the hand is still drawing when the audio ends (no outro available).',
    animation: 'Boy "holdL" pose with the book, eyes look up ("think") then bulb fades on at 56.6.',
    english: ['REGULAR', 'PLAY (pair arrow) PLAYED, ED green', '+ED / +D', 'SPELLING', 'IRREGULAR'],
    arabic: ['الأفعال المنتظمة', 'حسب قواعد الإملاء', 'الأفعال غير المنتظمة', 'فلازم نتعلّم'], // only the certain words of the cut-off last sentence
    camera: 'Home frame; small drift right toward IRREGULAR at 54.0.',
    transition: 'Wipe-erase in place (hand wipes S03\'s page 46.97–47.6), then new drawing on the same page.',
    sync: '"الأفعال المنتظمة" 47.29–49.89 · "ED" ≈50.0–51.5 · "أو D حسب قواعد الإملاء" 51.67–53.61 · "غير المنتظمة" 54.18–55.90 · "فلازم نتعلّم…" 56.02–57.00 (audio ends mid-speech).',
    review: 'The recording ends mid-word at 57.00 s, so this scene (and the video) stops abruptly with no closing beat. Confirm whether a longer recording exists. No example irregular verbs are shown because the narration gives none in this clip. Last word "شكلها"/"شكراً" is inferred.',
  },
];
