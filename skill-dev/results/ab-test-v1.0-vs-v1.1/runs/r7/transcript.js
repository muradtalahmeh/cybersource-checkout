// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio.
//
// Method: ffmpeg silencedetect spans (scripts/detect_speech.py) → Whisper-small
// ONNX decode per span, --lang ar (sentences + phrase regions) and --lang en
// for the English examples; ambiguous spans compared with score_candidates.py;
// wording then corrected by hand (Levantine Arabic). Times are never edited.
window.TRANSCRIPT = [
  { s: 0.00, e: 1.88, ar: 'هلأ خلينا ننتقل للنفي.',
    flag: '"للنفي" (to negation) is inferred from context: ASR heard "لنا فيه", which means nothing here. Please confirm.' },
  { s: 2.55, e: 6.07, ar: 'إذا بدك تحكي إنك ما عملت إشي بالماضي، منستخدم كلمة' },
  { s: 6.28, e: 6.86, en: "didn't" },
  { s: 7.26, e: 8.02, ar: 'وهي اختصار' },
  { s: 8.18, e: 8.93, en: 'did not' },
  { s: 9.59, e: 10.75, ar: 'والقاعدة هون بسيطة:' },
  { s: 11.30, e: 11.94, ar: 'الفاعل،' },
  { s: 12.25, e: 13.11, ar: "بعده didn't،", en: "didn't" },
  { s: 13.37, e: 15.05, ar: 'وبعده الفعل بصيغته الأصلية.' },
  { s: 15.93, e: 16.44, ar: 'مثلاً:' },
  { s: 16.81, e: 19.49, en: "I didn't watch TV yesterday." },
  { s: 20.29, e: 22.83, ar: 'يعني ما حضرت تلفزيون مبارح.',
    flag: 'ASR wrote "بارح"; written as Levantine "مبارح" (yesterday). Same meaning; confirm the spelling you prefer.' },
  { s: 23.66, e: 24.54, ar: 'انتبه منيح:',
    flag: 'ASR wrote "انت بهم نيح"; read as "انتبه منيح" (pay close attention) from context. Please confirm.' },
  { s: 24.71, e: 27.49, ar: "بعد didn't الفعل برجع لأصله." },
  { s: 28.23, e: 29.25, ar: 'يعني ما نحكي' },
  { s: 29.50, e: 31.73, en: "I didn't watched TV",
    flag: 'Deliberately wrong example. Whisper autocorrects it to "I didn\'t watch TV"; "watched" is inferred: the narrator calls it a mistake (هذا خطأ) and then gives "I didn\'t watch TV" as the correct form, the phrase decode heard "watch it" (an extra syllable), and forced scoring puts "watched" much closer here (gap 3.0) than on the correct repeats (gaps 7.0–7.9). Please confirm.' },
  { s: 32.41, e: 33.18, ar: 'لأنه هذا خطأ.' },
  { s: 33.72, e: 34.52, ar: 'الصحيح:' },
  { s: 34.66, e: 36.65, en: "I didn't watch TV." },
  { s: 37.43, e: 39.32, ar: 'ونفس الإشي مع الأفعال غير المنتظمة.',
    flag: 'ASR wrote "غير المنطمئ"; read as "غير المنتظمة" (irregular verbs), which fits go/went and scored best.' },
  { s: 39.88, e: 40.38, ar: 'منحكي:' },
  { s: 40.60, e: 42.63, en: "She didn't go to school." },
  { s: 43.27, e: 43.64, ar: 'مش' },
  { s: 43.85, e: 45.87, en: "she didn't went to school.",
    flag: 'Deliberately wrong example (introduced by "مش" = not). Heard directly by ASR and confirmed by scoring; no inference needed.' },
  { s: 46.82, e: 47.30, ar: 'ليش؟' },
  { s: 47.46, e: 48.24, ar: 'لأنه كلمة' },
  { s: 48.36, e: 48.95, en: 'did' },
  { s: 49.26, e: 50.74, ar: 'هي اللي بتحمل معنى الماضي،' },
  { s: 51.25, e: 54.58, ar: 'وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية.' },
  { s: 55.47, e: 55.87, ar: 'ممتاز.' },
  { s: 56.52, e: 56.80, ar: 'هلأ…',
    flag: 'Last word, cut off at the end of the recording (ASR: "هلا"). Probably the start of the next part ("now…"); the recording ends here.' },
];
window.AUDIO_DURATION = 57.000000;
