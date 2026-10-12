// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio.
// Method: ffmpeg silencedetect spans + Whisper-small ONNX (greedy), decoded at
// sentence and phrase level in Arabic AND English, uncertain spans compared with
// score_candidates.py, wording corrected by hand (Levantine Arabic). Raw decodes
// are kept in docs/asr/.
window.TRANSCRIPT = [
  { s: 0.40, e: 2.07, ar: 'أو', en: "They weren't happy.",
    flag: "Opening 0.3 s word is unclear: English 'Oh,' or Arabic 'أو' (or). The clip appears to start mid-lesson, right after an earlier example." },
  { s: 2.66, e: 5.85, ar: 'والسؤال منقدّم was أو were على الفاعل',
    flag: "'الفاعل' (subject) inferred from the grammar; ASR heard 'الفعل' (verb) and the two score almost equally." },
  { s: 6.41, e: 8.86, ar: 'مثلاً', en: 'Were you tired yesterday?' },
  { s: 9.41, e: 11.24, ar: 'يعني: كنت تعبان مبارح؟' },
  { s: 11.96, e: 17.87, ar: 'إذن مع was و were ما منستخدم did بنفس الطريقة اللي استخدمناها مع باقي الأفعال',
    flag: "'مع' (with) vs 'ما' at 11.96 s: chose 'مع' from context and the sentence-level decode." },
  { s: 18.95, e: 21.19, ar: 'خلّينا نراجع أهم الأفكار بسرعة' },
  { s: 21.88, e: 26.96, ar: 'إذا بدّك تحكي عن إشي صار وانتهى بالماضي، استخدم الـ past simple' },
  { s: 27.65, e: 30.64, ar: 'بالجملة المثبتة استخدم الفعل بصيغة الماضي' },
  { s: 31.31, e: 33.17, ar: 'مثلاً', en: 'I played football.' },
  { s: 33.93, e: 37.38, ar: "بالنفي استخدم didn't وبعدها الفعل الأصلي" },
  { s: 38.08, e: 39.52, en: "I didn't play football.",
    flag: 'Arabic decode looped (garbage, not marked LOOP by the tool); English re-decode is clear and scores far above alternatives.' },
  { s: 40.23, e: 44.82, ar: 'وبالسؤال استخدم Did وبعدها الفاعل وبعدها الفعل الأصلي',
    flag: "'الفاعل' (subject) after Did: sentence decode heard 'الفاعل', phrase decode 'الفعل'; near-equal scores, chosen from the grammar." },
  { s: 45.54, e: 46.64, en: 'Did you play football?' },
  { s: 47.29, e: 49.89, ar: 'وتذكّر مع الأفعال المنتظمة',
    flag: "'وتذكّر' (and remember) from context and the English gloss; acoustically 'ويذكر' scored slightly higher." },
  { s: 50.04, e: 53.62, ar: 'غالباً منضيف ed أو d حسب قواعد الإملاء',
    flag: "Endings heard as 'E-D / D'; 'ed أو d' is the best-scoring candidate." },
  { s: 54.18, e: 57.00, ar: 'أما الأفعال غير المنتظمة فلازم نتعلّم شكل…',
    flag: "Recording ends mid-word at 57.00 s (speech still at -18 dB in the last 0.2 s). ASR wrote 'شكراً', a typical Whisper end-of-audio hallucination; most likely 'شكلها' (their form) cut off. Unverified." },
];
window.AUDIO_DURATION = 57.000000;
