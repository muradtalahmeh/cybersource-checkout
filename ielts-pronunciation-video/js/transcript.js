// Reviewed, timestamped transcript (Gulf Arabic + English words).
// Timestamps: silence detection (sentence + fine phrase level) and an energy
// envelope inside 12.8–15.0 s; text: Whisper-small decoded in Arabic and in
// English per span, mispronunciations checked by forced-decoding scores.
window.TRANSCRIPT = [
  { s: 0.11, e: 1.93, ar: 'أتحداك تنطق هذي الكلمات صح' },
  { s: 2.41, e: 3.15, ar: 'إنتر برنجر؟', en: 'Entrepreneur — the common mistake', flag: 'Exact wrong form inferred (“انتر برنجر” scored best, “انتر برنر” close).' },
  { s: 3.35, e: 3.6, ar: 'لا' },
  { s: 4.12, e: 5.08, en: 'Entrepreneur' },
  { s: 5.16, e: 6.21, ar: 'وهذي الكلمة' },
  { s: 6.84, e: 7.77, ar: 'مو كولاج' },
  { s: 7.98, e: 8.31, ar: 'هي' },
  { s: 8.59, e: 9.21, en: 'Colleague' },
  { s: 9.29, e: 10.32, ar: 'وهذي الكلمة' },
  { s: 11.05, e: 11.66, ar: 'سكتشول؟', en: 'Schedule — the common mistake' },
  { s: 11.98, e: 12.16, ar: 'لا' },
  { s: 12.82, e: 13.53, en: 'Schedule' },
  { s: 13.6, e: 14.3, ar: 'وهذي', flag: 'Boundary inside a continuous span, estimated from the energy envelope.' },
  { s: 14.3, e: 14.98, ar: 'دفلوب؟', en: 'Develop — the common mistake', flag: 'Exact wrong form inferred (“دفلوب” ≈ “ديفلوب”).' },
  { s: 15.36, e: 15.6, ar: 'لا' },
  { s: 16.07, e: 16.51, en: 'Develop' },
  { s: 16.63, e: 17.47, ar: 'وهذي' },
  { s: 17.86, e: 18.36, ar: 'كلينت؟', en: 'Client — the common mistake', flag: '“كلينت” scored only slightly above “كلاينت”.' },
  { s: 18.6, e: 18.88, ar: 'لا' },
  { s: 19.32, e: 19.79, en: 'Client' },
  { s: 20.09, e: 20.95, ar: 'وهذي' },
  { s: 21.17, e: 21.86, ar: 'ڤيهيكل؟', en: 'Vehicle — the common mistake (H pronounced)' },
  { s: 22.23, e: 22.46, ar: 'لا' },
  { s: 22.81, e: 23.57, en: 'Vehicle' },
  { s: 24.01, e: 24.72, en: 'Vehicle' },
];
window.AUDIO_DURATION = 24.987188;
