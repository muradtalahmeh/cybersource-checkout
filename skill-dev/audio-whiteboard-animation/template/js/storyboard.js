// Audio-aligned storyboard (data). Fill one entry per scene; scenes must be
// contiguous from 0 to AUDIO_DURATION. tools/storyboard.mjs validates this and
// writes docs/STORYBOARD.md. Fields: id, start, end, title, concept, visual,
// characters, drawing, hand, animation, english[], arabic[], camera,
// transition, sync, review (optional: anything the user must confirm).
window.STORYBOARD = [
  {
    id: 'S01', start: 0, end: window.AUDIO_DURATION, title: 'Demo scene (replace)',
    concept: '—', visual: '—', characters: '—', drawing: '—', hand: '—', animation: '—',
    english: [], arabic: [], camera: '—', transition: '—', sync: '—',
  },
];
