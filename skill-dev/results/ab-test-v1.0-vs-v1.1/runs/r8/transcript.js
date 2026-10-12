// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio
// (detect_speech.py phrase regions; Whisper-small ONNX, ar + en passes,
// score_candidates.py for disputed wording; reviewed by hand).
window.TRANSCRIPT = [
  { s: 0.00, e: 1.88, ar: 'هلأ خلينا ننتقل للنفي', flag: '"للنفي" inferred: ASR heard "لنا فيه" (scored slightly higher than "للنفي"); chosen from context (the clip is about negation).' },
  { s: 2.55, e: 6.07, ar: 'إذا بدك تحكي إنك ما عملت إشي بالماضي، منستخدم كلمة' },
  { s: 6.28, e: 6.86, en: "didn't" },
  { s: 7.26, e: 8.93, ar: 'وهي اختصار', en: 'did not' },
  { s: 9.59, e: 11.94, ar: 'والقاعدة هون بسيطة: الفاعل' },
  { s: 12.25, e: 13.11, ar: 'بعده', en: "didn't" },
  { s: 13.37, e: 15.05, ar: 'وبعده الفعل بصيغته الأصلية' },
  { s: 15.93, e: 16.44, ar: 'مثلاً' },
  { s: 16.81, e: 19.49, en: "I didn't watch TV yesterday." },
  { s: 20.29, e: 22.83, ar: 'يعني ما حضرت تلفزيون مبارح', flag: 'Spelling of "مبارح": ASR wrote "بارح" (both mean yesterday); minor.' },
  { s: 23.66, e: 24.54, ar: 'انتبه منيح', flag: 'Inferred: ASR output "انت بهم نيح"; read as "انتبه منيح" (pay close attention), best-scoring real-word candidate.' },
  { s: 24.71, e: 27.49, ar: "بعد didn't الفعل برجع لأصله" },
  { s: 28.23, e: 29.25, ar: 'يعني ما نحكي' },
  { s: 29.50, e: 31.73, en: "I didn't watched TV", flag: 'Deliberately wrong example, INFERRED. Whisper autocorrects it to "watch"; forced scoring gap watch-vs-watched is only 3.0 here vs 7.9 on the correct repeat at 34.66, and the teacher says "لأنه هذا خطأ" right after. Please confirm "watched".' },
  { s: 32.41, e: 33.18, ar: 'لأنه هذا خطأ' },
  { s: 33.72, e: 34.52, ar: 'الصحيح' },
  { s: 34.66, e: 36.65, en: "I didn't watch TV." },
  { s: 37.43, e: 39.32, ar: 'ونفس الشي مع الأفعال غير المنتظمة', flag: 'ASR: "نفس الأشياء مع الأفعال غير المنطمئ"; corrected to "غير المنتظمة" (irregular verbs) from context.' },
  { s: 39.88, e: 40.38, ar: 'منحكي:' },
  { s: 40.60, e: 42.63, en: "She didn't go to school." },
  { s: 43.27, e: 43.64, ar: 'مش' },
  { s: 43.85, e: 45.87, en: "she didn't went to school.", flag: 'Deliberately wrong example (marked by "مش"); Whisper decoded "went" directly, high confidence.' },
  { s: 46.82, e: 47.30, ar: 'ليش؟' },
  { s: 47.46, e: 50.74, ar: 'لأنه كلمة did هي اللي بتحمل معنى الماضي', flag: 'Phrase 47.46–48.24 looped in the phrase-level decode; sentence-level decode gives "كلمة دد". "did" scored above "didn\'t" — confirm the teacher says "did".' },
  { s: 51.25, e: 54.58, ar: 'وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية' },
  { s: 55.47, e: 55.87, ar: 'ممتاز' },
  { s: 56.52, e: 56.80, ar: 'هلأ…', flag: 'Last word is cut off at the end of the recording ("هلأ/هلا", the start of a next sentence). Kept as audio; no visual content attached.' },
];
window.AUDIO_DURATION = 57.000000;
