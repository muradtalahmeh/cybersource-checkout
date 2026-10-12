// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio.
// Method: ffmpeg silencedetect spans (scripts/detect_speech.py) → Whisper-small
// ONNX, Arabic pass over sentence spans, English re-decode of the example spans,
// phrase-level re-decode where needed, candidate scoring (score_candidates.py),
// then hand correction of Levantine dialect / ASR spelling. Times are measured.
window.TRANSCRIPT = [
  { s: 0.40, e: 2.07, en: "Oh, they weren't happy.",
    flag: 'The recording starts mid-lesson: this answer belongs to an example whose question is not in the clip. First word scored best as "Oh" (alternative "No").' },
  { s: 2.66, e: 5.85, ar: 'وبالسؤال منقدّم was أو were على الفاعل،',
    flag: '"على الفاعل" (before the subject) vs "على الفعل" (before the verb) score almost equally in ASR; "الفاعل" chosen because it is the correct rule and matches 40.2 s. Please confirm.' },
  { s: 6.41, e: 7.02, ar: 'مثلاً:' },
  { s: 7.54, e: 8.86, en: 'Were you tired yesterday?' },
  { s: 9.41, e: 11.24, ar: 'يعني: كنت تعبان مبارح؟' },
  { s: 11.96, e: 17.87, ar: 'إذن مع was و were ما منستخدم did بنفس الطريقة اللي استخدمناها مع باقي الأفعال.' },
  { s: 18.95, e: 21.18, ar: 'خلّينا نراجع أهم الأفكار بسرعة.' },
  { s: 21.88, e: 25.17, ar: 'إذا بدك تحكي عن إشي صار وانتهى بالماضي،' },
  { s: 25.48, e: 26.96, ar: 'استخدم الـ past simple.' },
  { s: 27.65, e: 30.62, ar: 'بالجملة المثبتة استخدم الفعل بصيغة الماضي.' },
  { s: 31.31, e: 31.98, ar: 'مثلاً:' },
  { s: 32.17, e: 33.17, en: 'I played football.' },
  { s: 33.93, e: 35.83, ar: "بالنفي استخدم didn't" },
  { s: 36.05, e: 37.38, ar: 'وبعدها الفعل الأصلي.' },
  { s: 38.08, e: 39.51, en: "I didn't play football.",
    flag: 'Arabic pass looped (garbage); English re-decode gives "I didn\'t play football." (scored far above "didn\'t played"). Narration presents it as correct.' },
  { s: 40.23, e: 42.15, ar: 'وبالسؤال استخدم did' },
  { s: 42.32, e: 46.64, ar: 'وبعدها الفاعل، وبعدها الفعل الأصلي.' },
  { s: 47.29, e: 49.89, ar: 'وتذكّر: مع الأفعال المنتظمة' },
  { s: 50.04, e: 53.61, ar: 'غالباً منضيف ed أو d حسب قواعد الإملاء.',
    flag: 'Phrase 51.00–51.53 ("ed") was decoded as unrelated words at phrase level; the whole-sentence decode gives "E-D أو D". Inferred: ed.' },
  { s: 54.18, e: 57.00, ar: 'أما الأفعال غير المنتظمة فلازم نتعلّم…',
    flag: 'The audio ends mid-speech at 57.00 s (still speaking in the last 100 ms). ASR hears the last word as "شكراً" (best score) — "شكلها" (their form) scores close and fits the meaning better. Last word left unwritten on screen; please confirm, or send the rest of the recording.' },
];
window.AUDIO_DURATION = 57.000000;
