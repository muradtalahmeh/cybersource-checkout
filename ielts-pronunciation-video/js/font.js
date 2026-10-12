// Single-stroke "marker" font. Every glyph is a list of pen strokes (SVG path
// data) inside a box whose cap height is 100 units (y=0 top, y=100 baseline).
// Because each stroke is a real pen path, text can be written progressively
// and the drawing hand can follow the exact stroke being drawn.
(function (global) {
  const G = {
    A: [70, ['M0 100 L35 0 L70 100', 'M14 62 L56 62']],
    B: [60, ['M0 100 L0 0', 'M0 0 L30 0 C58 0 58 48 30 48 L0 48', 'M30 48 C64 48 64 100 30 100 L0 100']],
    C: [64, ['M62 18 C52 -4 18 -4 6 22 C-4 44 -2 70 10 86 C24 104 54 102 64 82']],
    D: [62, ['M0 100 L0 0', 'M0 0 L24 0 C70 0 70 100 24 100 L0 100']],
    E: [52, ['M52 0 L0 0 L0 100 L52 100', 'M0 50 L42 50']],
    F: [50, ['M50 0 L0 0 L0 100', 'M0 48 L40 48']],
    G: [68, ['M64 18 C54 -4 18 -4 6 22 C-4 44 -2 70 10 86 C24 104 58 104 66 80 L66 56 L40 56']],
    H: [60, ['M0 0 L0 100', 'M60 0 L60 100', 'M0 50 L60 50']],
    I: [24, ['M0 0 L24 0', 'M12 0 L12 100', 'M0 100 L24 100']],
    J: [46, ['M46 0 L46 70 C46 104 4 106 0 76']],
    K: [58, ['M0 0 L0 100', 'M58 0 L0 60', 'M18 44 L60 100']],
    L: [48, ['M0 0 L0 100 L48 100']],
    M: [76, ['M0 100 L0 0 L38 64 L76 0 L76 100']],
    N: [60, ['M0 100 L0 0 L60 100 L60 0']],
    O: [72, ['M36 0 C6 0 0 30 0 50 C0 74 10 100 36 100 C62 100 72 74 72 50 C72 30 66 0 36 0']],
    P: [56, ['M0 100 L0 0', 'M0 0 L30 0 C62 0 62 54 30 54 L0 54']],
    Q: [74, ['M36 0 C6 0 0 30 0 50 C0 74 10 100 36 100 C62 100 72 74 72 50 C72 30 66 0 36 0', 'M44 72 L74 106']],
    R: [60, ['M0 100 L0 0', 'M0 0 L30 0 C62 0 62 52 30 52 L0 52', 'M28 52 L60 100']],
    S: [56, ['M54 16 C46 -4 6 -6 4 22 C2 48 54 46 56 74 C58 104 10 106 0 82']],
    T: [60, ['M0 0 L60 0', 'M30 0 L30 100']],
    U: [60, ['M0 0 L0 66 C0 106 60 106 60 66 L60 0']],
    V: [66, ['M0 0 L33 100 L66 0']],
    W: [90, ['M0 0 L22 100 L45 30 L68 100 L90 0']],
    X: [60, ['M0 0 L60 100', 'M60 0 L0 100']],
    Y: [62, ['M0 0 L31 50 L62 0', 'M31 50 L31 100']],
    Z: [58, ['M0 0 L58 0 L0 100 L58 100']],
    0: [56, ['M28 0 C4 0 0 30 0 50 C0 74 6 100 28 100 C50 100 56 74 56 50 C56 30 52 0 28 0']],
    1: [32, ['M2 20 L24 0 L24 100']],
    2: [56, ['M2 22 C6 -6 52 -6 52 24 C52 50 0 70 0 100 L56 100']],
    3: [54, ['M2 12 C14 -6 52 -4 50 24 C48 44 30 48 20 48 C60 48 58 102 26 100 C10 100 2 92 0 84']],
    4: [60, ['M44 100 L44 0 L0 70 L60 70']],
    5: [56, ['M52 0 L8 0 L4 44 C30 30 58 42 56 70 C54 104 12 104 0 86']],
    6: [58, ['M50 6 C20 -8 0 24 0 60 C0 92 20 100 30 100 C48 100 58 86 58 68 C58 48 44 38 30 38 C16 38 4 46 0 60']],
    7: [56, ['M0 0 L56 0 L18 100']],
    8: [56, ['M28 48 C4 44 4 0 28 0 C52 0 52 44 28 48 C0 52 0 100 28 100 C56 100 56 52 28 48']],
    9: [56, ['M56 40 C52 54 40 60 28 60 C10 60 0 48 0 30 C0 12 12 0 28 0 C46 0 56 14 56 40 C56 74 44 100 10 94']],
    '.': [10, ['M3 94 L7 100']],
    ',': [10, ['M7 90 L2 110']],
    '?': [50, ['M2 22 C4 -6 48 -6 48 22 C48 46 24 46 24 72', 'M22 92 L26 100']],
    '!': [12, ['M6 0 L6 72', 'M4 92 L8 100']],
    "'": [10, ['M6 0 L3 28']],
    '-': [32, ['M0 56 L32 56']],
    '/': [44, ['M44 0 L0 100']],
    '(': [24, ['M24 -6 C0 30 0 70 24 106']],
    ')': [24, ['M0 -6 C24 30 24 70 0 106']],
    ':': [10, ['M3 30 L7 36', 'M3 92 L7 98']],
    '+': [44, ['M0 50 L44 50', 'M22 28 L22 72']],
    '=': [44, ['M0 38 L44 38', 'M0 62 L44 62']],
    '_': [70, ['M0 104 L70 104']],
    ' ': [34, []],
  };
  const SPACING = 16;

  // Deterministic PRNG so the slight hand-made wobble is identical on every
  // render (required for seeking and frame-accurate export).
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  function measure(text, size) {
    const k = size / 100;
    let w = 0;
    for (const ch of text) w += ((G[ch] || G[' '])[0] + SPACING) * k;
    return w - SPACING * k;
  }

  // Returns [{d, transform, char, index}] — one entry per pen stroke, already
  // placed. `x,y` is the top-left of the cap height box.
  function layout(text, x, y, size, seed) {
    const k = size / 100;
    const r = rng(seed ?? hashStr(text));
    const out = [];
    let cx = x;
    [...text].forEach((ch, i) => {
      const g = G[ch] || G[' '];
      const jy = (r() - 0.5) * 4 * k;
      const rot = (r() - 0.5) * 3;
      const tr = `translate(${(cx).toFixed(2)} ${(y + jy).toFixed(2)}) rotate(${rot.toFixed(2)} ${(g[0] * k / 2).toFixed(2)} ${(50 * k).toFixed(2)}) scale(${k.toFixed(4)})`;
      g[1].forEach((d) => out.push({ d, transform: tr, char: ch, index: i }));
      cx += (g[0] + SPACING) * k;
    });
    return { strokes: out, width: cx - x - SPACING * k };
  }

  global.PenFont = { glyphs: G, measure, layout, rng, hashStr, SPACING };
})(window);
