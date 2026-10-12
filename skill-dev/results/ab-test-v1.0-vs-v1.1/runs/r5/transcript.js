// Reviewed, timestamped transcript of the narration (data).
// Entries: { s, e, ar?, en?, flag? } — `ar` = narration-language text,
// `en` = an English example spoken in this span, `flag` = anything uncertain
// that the user must confirm. Seconds are measured from the audio.
// Method: ffmpeg silencedetect spans (detect_speech.py) → Whisper-small ONNX,
// greedy, per span (transcribe.py, --lang ar), English examples re-decoded with
// --lang en, doubtful words compared with score_candidates.py, then corrected by
// hand from context (Levantine Arabic). Times are sentence/phrase regions.
window.TRANSCRIPT = [
  { s: 0.00, e: 1.88, ar: 'هلّأ خلّينا ننتقل للنفي.', flag: '"للنفي" inferred from context (topic = negation); ASR heard "لنا فيه", acoustically almost identical' },
  { s: 2.55, e: 6.07, ar: 'إذا بدّك تحكي إنّك ما عملت إشي بالماضي، منستخدم كلمة' },
  { s: 6.28, e: 6.86, en: "didn't" },
  { s: 7.26, e: 8.02, ar: 'وهي اختصار' },
  { s: 8.18, e: 8.93, en: 'did not' },
  { s: 9.59, e: 10.75, ar: 'والقاعدة هون بسيطة:' },
  { s: 11.30, e: 11.94, ar: 'الفاعل،', flag: 'sentence-level pass heard "الفاعل", phrase-level pass "الفعل"; forced scoring prefers "الفاعل", which is also what the rule needs (subject comes first)' },
  { s: 12.25, e: 13.11, ar: 'بعده', en: "didn't" },
  { s: 13.37, e: 15.05, ar: 'وبعده الفعل بصيغته الأصلية.' },
  { s: 15.93, e: 16.44, ar: 'مثلاً:' },
  { s: 16.82, e: 19.49, en: "I didn't watch TV yesterday." },
  { s: 20.29, e: 22.83, ar: 'يعني ما حضرت تلفزيون مبارح.' },
  { s: 23.66, e: 25.06, ar: 'انتبه منيح: بعد', flag: '"انتبه منيح" (pay close attention) inferred; ASR heard "انت بهم نيح" / "انت بهم نير"' },
  { s: 25.23, e: 25.94, en: "didn't" },
  { s: 26.20, e: 27.49, ar: 'الفعل برجع لأصله.' },
  { s: 28.23, e: 29.25, ar: 'يعني ما نحكي' },
  { s: 29.50, e: 31.73, en: "I didn't watched TV", flag: 'INFERRED wrong form. Whisper writes "I didn\'t watch TV" here, but the narration calls this sentence wrong ("لأنه هذا خطأ") and then gives "I didn\'t watch TV" as the correct one. Forced scoring: watch beats watched by only 2.7 here vs 8.1 on the correct repeat (34.66 s) and 7.2 on 16.82 s, consistent with an audible -ed that the model autocorrects. Please confirm by listening.' },
  { s: 32.41, e: 33.18, ar: 'لأنّه هذا خطأ.' },
  { s: 33.72, e: 34.52, ar: 'الصحيح:' },
  { s: 34.66, e: 36.65, en: "I didn't watch TV." },
  { s: 37.43, e: 39.32, ar: 'ونفس الإشي مع الأفعال غير المنتظمة.' },
  { s: 39.88, e: 40.38, ar: 'منحكي:' },
  { s: 40.60, e: 42.63, en: "She didn't go to school." },
  { s: 43.27, e: 43.64, ar: 'مش' },
  { s: 43.85, e: 45.87, en: "she didn't went to school." },
  { s: 46.82, e: 47.30, ar: 'ليش؟' },
  { s: 47.46, e: 48.24, ar: 'لأنّه كلمة' },
  { s: 48.36, e: 48.95, en: 'did', flag: 'confirmed "did" (not "didn\'t") by forced scoring: -2.1 vs -9.2' },
  { s: 49.26, e: 50.74, ar: 'هي اللي بتحمل معنى الماضي،' },
  { s: 51.25, e: 54.58, ar: 'وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية.' },
  { s: 55.47, e: 55.87, ar: 'ممتاز.' },
  { s: 56.52, e: 56.80, ar: 'هلّأ…', flag: 'last word of the clip, apparently the start of a next part cut off by the 57 s end; ASR "هلا" (could be "هلّأ" = now, or "هلا"); scores too close to decide' },
];
window.AUDIO_DURATION = 57.000000;
