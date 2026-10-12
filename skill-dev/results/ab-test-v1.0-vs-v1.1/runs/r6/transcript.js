// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio.
//
// Method: ffmpeg silencedetect spans (detect_speech.py) → Whisper-small ONNX
// decode per span (--lang ar, sentence + phrase level), English spans
// re-decoded with --lang en, doubtful words compared with score_candidates.py,
// then hand-reviewed (Levantine/Jordanian dialect). Times are phrase-region
// boundaries from spans.json; only the wording was corrected.
window.TRANSCRIPT = [
  { s: 0.00, e: 1.88, ar: 'هلأ خلينا ننتقل للنفي.', flag: '"للنفي" inferred: ASR heard "لنا فيه" (scored higher, −4.0 vs −6.0); chosen from context because the clip teaches negation with didn\'t.' },
  { s: 2.55, e: 6.07, ar: 'إذا بدك تحكي إنك ما عملت إشي بالماضي، منستخدم كلمة' },
  { s: 6.28, e: 6.86, en: "didn't" },
  { s: 7.26, e: 8.02, ar: 'وهي اختصار' },
  { s: 8.18, e: 8.93, en: 'did not' },
  { s: 9.59, e: 10.75, ar: 'والقاعدة هون بسيطة:' },
  { s: 11.30, e: 11.94, ar: 'الفاعل', flag: '"الفاعل" (subject) vs "الفعل" (verb) scored the same (−1.54 / −1.56); "الفاعل" chosen because the rule continues "بعده didn\'t وبعده الفعل".' },
  { s: 12.25, e: 13.11, ar: 'بعده', en: "didn't" },
  { s: 13.37, e: 15.05, ar: 'وبعده الفعل بصيغته الأصلية.' },
  { s: 15.93, e: 16.44, ar: 'مثلاً:' },
  { s: 16.81, e: 19.49, en: "I didn't watch TV yesterday." },
  { s: 20.29, e: 22.83, ar: 'يعني ما حضرت تلفزيون مبارح.' },
  { s: 23.66, e: 24.54, ar: 'انتبه منيح:', flag: 'Uncertain: ASR heard "انت بهم نير" (English pass: "You understand?"). "انتبه منيح" (pay close attention) is a best guess from context; please confirm.' },
  { s: 24.71, e: 25.94, ar: 'بعد', en: "didn't" },
  { s: 26.20, e: 27.49, ar: 'الفعل برجع لأصله.' },
  { s: 28.23, e: 29.25, ar: 'يعني ما نحكي' },
  { s: 29.50, e: 31.73, en: "I didn't watched TV", flag: 'Deliberately wrong example, inferred: ASR autocorrected it to "watch". Forced scoring: "watched" is only 3.0 below "watch" here vs 7.9 below at the correct repeat (34.66 s), and the narration says "لأنه هذا خطأ".' },
  { s: 32.41, e: 33.18, ar: 'لأنه هذا خطأ.' },
  { s: 33.72, e: 34.52, ar: 'الصحيح:' },
  { s: 34.66, e: 36.65, en: "I didn't watch TV." },
  { s: 37.43, e: 39.32, ar: 'ونفس الإشي مع الأفعال غير المنتظمة.' },
  { s: 39.88, e: 40.38, ar: 'منحكي:' },
  { s: 40.60, e: 42.63, en: "She didn't go to school." },
  { s: 43.27, e: 43.64, ar: 'مش' },
  { s: 43.85, e: 45.87, en: "she didn't went to school.", flag: 'Deliberately wrong example (introduced by "مش"); decoded as "went" by ASR and confirmed by scoring (−4.0 vs −8.1 for "go").' },
  { s: 46.82, e: 47.30, ar: 'ليش؟' },
  { s: 47.46, e: 50.74, ar: 'لأنه كلمة did هي اللي بتحمل معنى الماضي.' },
  { s: 51.25, e: 54.58, ar: 'وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية.' },
  { s: 55.47, e: 55.87, ar: 'ممتاز.' },
  { s: 56.52, e: 56.80, ar: 'هلأ…', flag: 'The recording ends here: this is the first word of a next sentence, cut off at 57.00 s.' },
];
window.AUDIO_DURATION = 57.000000;
