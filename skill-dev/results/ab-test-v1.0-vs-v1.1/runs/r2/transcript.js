// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio.
// Method: ffmpeg silencedetect spans (sentences + phrases) → Whisper-small ONNX,
// greedy, per span, --lang ar; English examples re-decoded with --lang en;
// doubtful words compared with score_candidates.py; wording hand-corrected
// (Levantine Arabic). Times are the measured phrase/sentence boundaries.
window.TRANSCRIPT = [
  { s: 0.40, e: 0.69, ar: 'أو', flag: 'The clip starts mid-lesson. First word heard as "أو" (or); "Oh" scored lower but is possible.' },
  { s: 1.06, e: 2.07, en: "They weren't happy." },
  { s: 2.66, e: 5.85, ar: 'والسؤال منقدّم was أو were على الفاعل', flag: 'Last word inferred: "الفاعل" (subject). ASR heard "الفعل" (verb) and scored it slightly higher; "before the subject" is what the example shows. Please confirm what was said.' },
  { s: 6.41, e: 7.02, ar: 'مثلاً' },
  { s: 7.54, e: 8.86, en: 'Were you tired yesterday?' },
  { s: 9.41, e: 11.24, ar: 'يعني: كنت تعبان مبارح؟' },
  { s: 11.96, e: 17.87, ar: 'إذن مع was و were ما منستخدم did بنفس الطريقة اللي استخدمناها مع باقي الأفعال' },
  { s: 18.95, e: 21.18, ar: 'خلّينا نراجع أهم الأفكار بسرعة' },
  { s: 21.88, e: 25.17, ar: 'إذا بدك تحكي عن إشي صار وانتهى بالماضي' },
  { s: 25.48, e: 26.96, ar: 'استخدم الـ past simple' },
  { s: 27.65, e: 30.62, ar: 'بالجملة المثبتة استخدم الفعل بصيغة الماضي' },
  { s: 31.31, e: 31.98, ar: 'مثلاً' },
  { s: 32.17, e: 33.16, en: 'I played football.' },
  { s: 33.93, e: 35.83, ar: "بالنفي استخدم didn't" },
  { s: 36.05, e: 37.36, ar: 'وبعدها الفعل الأصلي' },
  { s: 38.08, e: 39.51, en: "I didn't play football." },
  { s: 40.23, e: 42.15, ar: 'وبالسؤال استخدم did' },
  { s: 42.32, e: 44.82, ar: 'وبعدها الفاعل وبعدها الفعل الأصلي', flag: 'First "الفاعل" vs "الفعل" nearly tied in scoring (−3.29 vs −3.35); "الفاعل" fits the rule Did + subject + base verb.' },
  { s: 45.54, e: 46.64, en: 'Did you play football?' },
  { s: 47.29, e: 49.89, ar: 'واذكر مع الأفعال المنتظمة' },
  { s: 50.04, e: 53.61, ar: 'غالباً منضيف ED أو D حسب قواعد الإملاء' },
  { s: 54.18, e: 55.90, ar: 'أما الأفعال غير المنتظمة' },
  { s: 56.02, e: 57.00, ar: 'فلازم نتعلّم شكلها…', flag: 'Recording ends mid-speech at 57.00 s (still voiced in the last 150 ms). Last word uncertain: ASR heard "شكراً" (thanks), "شكلها" (their form) scored close behind and fits the sentence. Is this the full recording?' },
];
window.AUDIO_DURATION = 57.000000;
