// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio.
// Method: ffmpeg silencedetect spans (detect_speech.py) → Whisper-small ONNX,
// Arabic pass (sentences + phrases) and English pass (sentences + phrases);
// English examples and doubtful words checked with score_candidates.py;
// wording hand-corrected for Levantine dialect. Times are the measured
// phrase regions (spans.json "phrases"); only wording was edited.
window.TRANSCRIPT = [
  { s: 0.40, e: 0.69, ar: 'أو', flag: 'Clip starts mid-lesson; first word heard as "أو" (or) — forced-decode score favours it over "و"' },
  { s: 1.06, e: 2.07, en: "They weren't happy." },
  { s: 2.66, e: 5.85, ar: 'وبالسؤال منقدّم was أو were على الفاعل', flag: '"على الفاعل" (before the subject) inferred from the rule and the example; ASR heard "على الفعل" (before the verb) — the two scored almost equal' },
  { s: 6.41, e: 7.02, ar: 'مثلاً' },
  { s: 7.54, e: 8.86, en: 'Were you tired yesterday?' },
  { s: 9.41, e: 11.24, ar: 'يعني كنت تعبان مبارح؟', flag: 'Arabic gloss reconstructed from ASR "كنت عبان بارح" / "Kuntaban Mbarah"' },
  { s: 11.96, e: 17.87, ar: 'إذن مع was و were ما منستخدم did بنفس الطريقة التي استخدمناها مع باقي الأفعال' },
  { s: 18.95, e: 21.19, ar: 'خلّينا نراجع أهم الأفكار بسرعة' },
  { s: 21.88, e: 25.17, ar: 'إذا بدك تحكي عن إشي صار وانتهى بالماضي' },
  { s: 25.48, e: 26.96, ar: 'استخدم الـ past simple' },
  { s: 27.65, e: 30.64, ar: 'بالجملة المثبتة استخدم الفعل بصيغة الماضي' },
  { s: 31.31, e: 31.98, ar: 'مثلاً' },
  { s: 32.17, e: 33.17, en: 'I played football.' },
  { s: 33.93, e: 37.38, ar: 'بالنفي استخدم didn\'t وبعدها الفعل الأصلي' },
  { s: 38.08, e: 39.52, en: "I didn't play football.", flag: 'Arabic pass looped here; English pass + forced scoring clearly favour "didn\'t play" over "didn\'t played"' },
  { s: 40.23, e: 44.82, ar: 'وبالسؤال استخدم did وبعدها الفاعل وبعدها الفعل الأصلي', flag: '"وبعدها الفاعل" (then the subject) inferred: ASR heard "الفعل … الفعل الأصلي" twice, and the two readings scored almost equal; the rule and the example "Did you play…" support "الفاعل"' },
  { s: 45.54, e: 46.64, en: 'Did you play football?' },
  { s: 47.29, e: 53.62, ar: 'وتذكّر، مع الأفعال المنتظمة غالباً منضيف ed أو d حسب قواعد الإملاء', flag: '"وتذكّر" heard as "وإذكر/ويدكر"; "ed" heard as "إيه … ID" (51.0–51.5 decoded as unrelated words)' },
  { s: 54.18, e: 55.90, ar: 'أما الأفعال غير المنتظمة' },
  { s: 56.02, e: 57.00, ar: 'فلازم نتعلّم…', flag: 'Recording ends mid-sentence (speech still at −18 dB in the last 0.2 s). ASR added "شكراً", likely a Whisper end-of-clip hallucination; the rest of the sentence is not in the audio' },
];
window.AUDIO_DURATION = 57.000000;
