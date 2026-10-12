// Scene builders. Every scene reads its window from STORYBOARD and places its
// drawing operations on the audio clock. `v` = vertical 9:16 composition,
// otherwise 16:9 landscape; positions are authored separately for each.
(function (global) {
  const Art = global.Art;
  const C = Art.C;
  const PF = global.PenFont;

  global.buildVideo = function (E, aspect) {
    const v = aspect !== 'h';
    const W = E.W, H = E.H;
    const pk = (a, b) => (v ? a : b);
    const SB = Object.fromEntries(global.STORYBOARD.map((s) => [s.id, s]));
    let origin = [0, 0];
    const cam = { x: W / 2, y: H / 2, z: 1, r: 0 };
    const K = E.camKeys;
    const key = (t) => K.push({ t, ...cam });
    const camTo = (t0, t1, to) => { key(t0); Object.assign(cam, to); key(t1); };
    const home = () => ({ x: origin[0] + W / 2, y: origin[1] + H / 2, z: 1 });
    const local = (x, y, z = 1) => ({ x: origin[0] + x, y: origin[1] + y, z });
    const shared = {};
    key(0);

    function scene(id, opts, build) {
      const d = SB[id];
      const tp = opts.panDur || 1.0;
      const t0 = opts.panAt ?? d.start;
      if (opts.move === 'right') origin = [origin[0] + W + 500, origin[1]];
      else if (opts.move === 'down') origin = [origin[0], origin[1] + H + 500];
      else if (opts.move === 'diag') origin = [origin[0] + W + 500, origin[1] + H + 500];
      if (opts.move === 'diag') {
        const target = home();
        camTo(t0, t0 + tp * 0.5, { x: (cam.x + target.x) / 2, y: (cam.y + target.y) / 2, z: 0.42 });
        camTo(t0 + tp * 0.5, t0 + tp, target);
      } else if (opts.move) camTo(t0, t0 + tp, home());
      else if (opts.recenter) camTo(t0, t0 + tp, home());
      const s = E.addScene({ id, start: d.start, end: d.end, origin: [...origin], ...(opts.scene || {}) }, (A) => build(A, d));
      return s;
    }

    // ---------------------------------------------------------- helpers
    function words(map) {
      // colorAt for a string: {WORD: color} (first occurrence) or {index: color}
      return (str) => {
        const marks = [];
        for (const w in map) {
          const m = /^@(\d+)$/.exec(w);
          if (m) { marks.push([+m[1], +m[1] + 1, map[w]]); continue; }
          const re = new RegExp(`(^|[^A-Za-z'])(${w.replace(/[.?]/g, '\\$&')})(?![A-Za-z'])`);
          const mm = re.exec(str);
          if (mm) { const i = mm.index + mm[1].length; marks.push([i, i + w.length, map[w]]); }
        }
        return (k) => { for (const [a, b, c] of marks) if (k >= a && k < b) return c; return C.ink; };
      };
    }
    function say(A, str, o) {
      // write a sentence (wrapped) with optional colour marks
      const colorAt = o.marks ? words(o.marks)(str) : undefined;
      const r = A.para(str, { ...o, colorAt });
      r.lines.forEach((ln, i) => { ln.str = r.lineStrs[i]; });
      return r;
    }
    function find(r, word, nth = 0) {
      // bounding box of a word inside a para/text result
      let seen = 0;
      for (const ln of r.lines || [r]) {
        const str = ln.str;
        let from = 0, i;
        while ((i = str.indexOf(word, from)) !== -1) {
          const okL = i === 0 || !/[A-Za-z']/.test(str[i - 1]);
          const okR = i + word.length >= str.length || !/[A-Za-z']/.test(str[i + word.length]);
          if (okL && okR) {
            if (seen === nth) {
              const pre = i ? PF.measure(str.slice(0, i), ln.size) + PF.SPACING * ln.size / 100 : 0;
              const w = PF.measure(word, ln.size);
              return { x: ln.x + pre, w, y: ln.y, h: ln.size, cx: ln.x + pre + w / 2, cy: ln.y + ln.size / 2 };
            }
            seen++;
          }
          from = i + 1;
        }
      }
      throw new Error('word not found: ' + word);
    }
    function ring(A, b, t, o = {}) {
      return A.loop(b.cx, b.cy, b.w / 2 + (o.pad ?? 26), b.h / 2 + (o.padY ?? 24), { t, dur: o.dur ?? 0.55, color: o.color || C.green, w: o.w ?? 7 });
    }
    function strike(A, r, t, o = {}) {
      // red line through every line of a sentence
      let cur = t;
      for (const ln of r.lines || [r]) {
        const y = ln.y + ln.size * 0.52;
        cur = A.path(`M${ln.x - 14} ${y + 6} Q${ln.x + ln.w / 2} ${y - 10} ${ln.x + ln.w + 14} ${y - 2}`, { t: cur, dur: o.dur ?? 0.35, color: C.red, w: 9 }).end + 0.04;
      }
      return cur;
    }
    function under(A, b, t, color = C.green, dur = 0.35, parent) {
      return A.underline(b.x - 6, b.x + b.w + 6, b.y + b.h + 16, { t, dur, color, parent }).end;
    }
    // "A → B" transformation row; returns times and boxes
    function pair(A, a, b, o) {
      const size = o.size;
      if (o.stack) {
        // A above, arrow down, B below (used where a row would not fit)
        const ra = A.text(a, { x: o.x, y: o.y, size, t: o.t, dur: o.da, parent: o.parent });
        const y1 = o.y + size + 30, y2 = y1 + size * 1.1;
        A.arrow(o.x, y1, o.x, y2, { t: o.tArrow ?? ra.end + 0.08, dur: 0.25, bend: 0.06, head: size * 0.25, w: 8, color: C.green, parent: o.parent });
        const nb = b.length, ending = o.ending ?? 0;
        const rb = A.text(b, { x: o.x, y: y2 + 30, size, t: o.tb, dur: o.db, parent: o.parent, colorAt: (k) => (k >= nb - ending ? C.green : o.colorB || C.ink) });
        ra.str = a; rb.str = b;
        return { ra, rb, end: rb.end };
      }
      const wa = PF.measure(a, size), wb = PF.measure(b, size), aw = size * 1.2, gap = size * 0.35;
      const total = wa + gap * 2 + aw + wb;
      const x0 = o.x - total / 2;
      const ra = A.text(a, { x: x0, y: o.y, size, t: o.t, dur: o.da, anchor: 'start', parent: o.parent });
      const ay = o.y + size / 2;
      const ar = A.arrow(x0 + wa + gap, ay, x0 + wa + gap + aw, ay, { t: o.tArrow ?? ra.end + 0.08, dur: 0.22, bend: 0.05, head: size * 0.28, w: 7, color: C.green, parent: o.parent });
      const nb = b.length;
      const ending = o.ending ?? 0;
      const rb = A.text(b, { x: x0 + wa + gap * 2 + aw, y: o.y, size, t: o.tb ?? ar.end + 0.08, dur: o.db, anchor: 'start', parent: o.parent, colorAt: (k) => (k >= nb - ending ? C.green : o.colorB || C.ink) });
      ra.str = a; rb.str = b;
      return { ra, rb, end: rb.end };
    }
    function boxes(A, labels, o) {
      // formula boxes laid out in one row; labels: [{en?|ar?, color?, t}]
      const n = labels.length, gap = o.gap ?? 34, bw = (o.w - gap * (n - 1)) / n;
      const out = [];
      let cur = o.t;
      labels.forEach((L, i) => {
        const x = o.x + i * (bw + gap);
        const r = Art.box(A, { x, y: o.y, w: bw, h: o.h, t: cur, dur: o.bdur ?? 0.38, color: L.color, parent: o.parent });
        cur = r.end + 0.04;
        if (i < n - 1 && o.plus !== false) {
          const px = x + bw + gap / 2, py = o.y + o.h / 2;
          A.path(`M${px - 9} ${py} L${px + 9} ${py} M${px} ${py - 9} L${px} ${py + 9}`, { t: cur, dur: 0.12, w: 5, parent: o.parent });
          cur += 0.16;
        }
        out.push({ x, y: o.y, w: bw, h: o.h, cx: x + bw / 2, cy: o.y + o.h / 2 });
      });
      labels.forEach((L, i) => {
        const b = out[i];
        if (L.t == null) return;
        if (L.en) b.label = A.text(L.en, { x: b.cx, y: b.cy - (o.en ?? 46) / 2, size: o.en ?? 46, t: L.t, dur: L.dur ?? 0.6, color: L.color, parent: o.parent });
        if (L.ar) b.label = A.ar(L.ar, { x: b.cx, y: b.cy + (o.ar ?? 40) * 0.38, size: o.ar ?? 40, t: L.t, dur: L.dur ?? 0.7, color: L.color, wGuess: b.w * 0.8, parent: o.parent });
      });
      return { boxes: out, end: cur };
    }
    // ================================================================
    // SCENES — one scene() call per STORYBOARD entry, in order.
    // Every time below must come from the measured transcript.
    // The demo scene shows the typical pattern; replace it.
    // ================================================================

    // ---------------------------------------------------------- lesson props
    const GREEN = C.green, RED = C.red, GREY = '#8a7a62';
    const G = (A, x, y, s, parent) => A.group({ transform: `translate(${x} ${y}) scale(${s})` }, parent);
    function prop(A, o, specs, fills) {
      // specs: [d | {d, w, color}] drawn in order; fills: [[d, color]] faded in after
      const s = o.s || 1, g = G(A, o.x, o.y, s, o.parent);
      (fills || []).forEach(([d, c], i) => Art.fillShape(A, g, d, c, o.t + (o.dur ?? 0.6) * 0.7 + i * 0.05, 0.35));
      return { ...A.draw(specs.map((sp) => (typeof sp === 'string' ? { d: sp, parent: g } : { ...sp, parent: g })), { t: o.t, dur: o.dur ?? 0.6, w: o.w ?? 6, lenScale: s }), g };
    }
    const tangle = (A, o) => prop(A, { ...o, w: 5 }, [{ d: 'M-60 0 C-40 -50 10 -40 0 0 C-10 40 50 40 40 -10 C30 -60 -50 -30 -30 20 C-10 60 70 30 60 -20', color: RED }]);
    const heart = (A, o) => prop(A, o, ['M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z'], [['M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z', '#e07a6a']]);
    const toothbrush = (A, o) => prop(A, o, ['M-120 10 L60 -14 L64 6 L-116 30 Z', 'M60 -14 L130 -24 L134 -4 L64 6', 'M70 -26 L68 -44 M86 -28 L84 -46 M102 -30 L100 -48 M118 -32 L116 -50'],
      [['M-120 10 L60 -14 L64 6 L-116 30 Z', '#7fb3d5'], ['M60 -14 L130 -24 L134 -4 L64 6 Z', '#dfe9f0']]);
    const wrench = (A, o) => prop(A, o, ['M-110 -12 L40 -12 L40 12 L-110 12 Z', 'M40 -12 C40 -50 100 -60 110 -30 L80 -24 L80 22 L110 30 C100 60 40 50 40 12'],
      [['M-110 -12 L40 -12 L40 12 L-110 12 Z', '#b9b4aa']]);
    const camera = (A, o) => prop(A, o, ['M-110 -50 L110 -50 L110 80 L-110 80 Z', 'M-50 -50 L-34 -80 L34 -80 L50 -50', 'M0 -26 a44 44 0 1 0 0.1 0', 'M0 -2 a20 20 0 1 0 0.1 0', 'M70 -36 L90 -36'],
      [['M-110 -50 L110 -50 L110 80 L-110 80 Z', '#3b3a36'], ['M0 -26 a44 44 0 1 0 0.1 0', '#dfe9df']]);
    const radio = (A, o) => prop(A, o, ['M-130 -60 L130 -60 L130 80 L-130 80 Z', 'M-90 -60 L70 -130', 'M-70 10 a42 42 0 1 0 0.1 0', 'M40 -30 L100 -30 M40 0 L100 0 M40 30 L100 30', 'M-100 -36 L-40 -36'],
      [['M-130 -60 L130 -60 L130 80 L-130 80 Z', '#e3cfa8'], ['M-70 10 a42 42 0 1 0 0.1 0', '#5a5650']]);
    const frame = (A, o) => prop(A, o, ['M-100 -80 L100 -80 L100 80 L-100 80 Z', 'M-80 50 L-30 -10 L0 20 L40 -30 L80 50 Z', 'M50 -50 a14 14 0 1 0 0.1 0'],
      [['M-100 -80 L100 -80 L100 80 L-100 80 Z', '#fffaf0'], ['M-80 50 L-30 -10 L0 20 L40 -30 L80 50 Z', C.greenLight], ['M50 -50 a14 14 0 1 0 0.1 0', '#f2c94c']]);
    function buildings(A, o) {
      const B = [[-230, -170, 110], [-110, -260, 120], [20, -200, 100], [130, -310, 110]];
      const specs = [], fills = [];
      B.forEach(([x, h, w]) => {
        const d = `M${x} 0 L${x} ${h} L${x + w} ${h} L${x + w} 0`;
        specs.push(d); fills.push([d + ' Z', '#e3cfa8']);
        for (let yy = h + 30; yy < -30; yy += 55) specs.push({ d: `M${x + 22} ${yy} L${x + 42} ${yy} M${x + w - 42} ${yy} L${x + w - 22} ${yy}`, w: 4, color: GREY });
      });
      specs.push('M-260 0 L270 0');
      return prop(A, o, specs, fills);
    }
    const mouthWaves = (A, o) => prop(A, o, ['M-60 0 C-30 -40 30 -40 60 0 C30 40 -30 40 -60 0 Z', 'M-50 0 L50 0', { d: 'M90 -40 C110 -20 110 20 90 40', color: GREEN }, { d: 'M120 -64 C150 -30 150 30 120 64', color: GREEN }],
      [['M-60 0 C-30 -40 30 -40 60 0 C30 40 -30 40 -60 0 Z', '#e07a6a']]);
    const notebook = (A, o) => prop(A, o, ['M-120 -90 L120 -90 L120 90 L-120 90 Z', { d: 'M-80 -50 L80 -50 M-80 -10 L80 -10 M-80 30 L40 30', w: 3, color: GREY }, 'M-120 -70 L-138 -70 M-120 -30 L-138 -30 M-120 10 L-138 10 M-120 50 L-138 50', { d: 'M80 70 L150 -40 L166 -30 L96 80 L76 88 Z', color: C.ink }],
      [['M-120 -90 L120 -90 L120 90 L-120 90 Z', '#fffaf0'], ['M80 70 L150 -40 L166 -30 L96 80 L76 88 Z', '#f2c94c']]);
    const badge = (A, n, x, y, t, parent, size = 76) => {
      const r = A.loop(x, y, size * 0.62, size * 0.62, { t, dur: 0.3, color: GREEN, w: 7, parent });
      return A.text(String(n), { x, y: y - size / 2, size, t: r.end + 0.03, dur: 0.25, color: GREEN, parent });
    };
    // "word → word" with the new ending in green; returns {ra, rb, end}
    const ends = (a, b) => { let k = 0; while (k < a.length && a[k] === b[k]) k++; return b.length - k; };
    const conj = (A, a, b, o) => pair(A, a, b, { ending: ends(a, b), ...o });

    // centre x and width of character i of a pen-font string; lowercase centre y ≈ y + 0.72·size
    const charX = (str, x, size, i, anchor = 'middle') => {
      const w = PF.measure(str, size), x0 = anchor === 'start' ? x : x - w / 2;
      const pre = i ? PF.measure(str.slice(0, i), size) + PF.SPACING * size / 100 : 0, cw = PF.measure(str[i], size);
      return { cx: x0 + pre + cw / 2, w: cw };
    };
    const ringChar = (A, r, str, i, t, color = GREEN, o = {}) => {
      const c = charX(str, r.x, r.size, i, 'start');
      return A.loop(c.cx, r.y + r.size * 0.72, Math.max(c.w / 2 + 16, r.size * 0.3), r.size * 0.36, { t, dur: o.dur ?? 0.35, color, w: o.w ?? 6, parent: o.parent });
    };

    // ================================================================ S01 hook
    scene('S01', {}, (A) => {
      camTo(0.2, 13.2, { ...home(), z: 1.03 });
      const boy = Art.character(A, { kind: 'boy', x: pk(270, 330), y: pk(1720, 1000), scale: pk(0.85, 0.62), t: 0.1, dur: 1.15,
        keys: [{ t: 1.6, ...Art.P.think }, { t: 9.6, mouth: 'flat', aR: [14, 8], head: 0 }, { t: 12.4, ...Art.P.shrug, mouth: 'frown' }] });
      A.text('?', { x: pk(150, 200), y: pk(1240, 330), size: 100, t: 1.32, dur: 0.22, color: GREY });
      A.text('?', { x: pk(420, 470), y: pk(1200, 300), size: 80, t: 1.58, dur: 0.2, color: GREY });
      const cx = pk(560, 1180);
      A.text('+ s ?', { x: cx, y: pk(250, 110), size: pk(130, 120), t: 2.15, dur: 0.75, colorAt: (k) => (k === 2 ? GREEN : C.ink) });
      A.text('+ es ?', { x: cx, y: pk(470, 300), size: pk(130, 120), t: 4.25, dur: 0.75, colorAt: (k) => (k === 2 || k === 3 ? GREEN : C.ink) });
      A.text('y → ies ?', { x: cx, y: pk(690, 490), size: pk(130, 120), t: 6.4, dur: 2.4, colorAt: (k) => (k === 0 ? RED : k >= 4 && k <= 6 ? GREEN : C.ink) });
      A.ar('كيف منعرف أي قاعدة نستخدم؟', { x: pk(560, 1180), y: pk(1010, 790), size: pk(60, 62), t: 10.5, dur: 1.5 });
      tangle(A, { x: pk(560, 1180), y: pk(1150, 900), s: 1.3, t: 12.15, dur: 0.6 });
    });

    // ================================================================ S02 teacher
    scene('S02', { move: 'right', panDur: 0.9 }, (A) => {
      const girl = Art.character(A, { kind: 'girl', x: pk(300, 1460), y: pk(1720, 1000), scale: pk(0.88, 0.64), t: 14.2, dur: 1.4,
        keys: [{ t: 16.2, ...Art.P.point }, { t: 23.0, ...Art.P.wave }, { t: 24.6, mouth: 'smile', aR: [14, 8] }, { t: 27.25, ...Art.P.cheer }] });
      Art.book(A, { x: pk(540, 600), y: pk(470, 330), s: 2.1, t: 16.3, dur: 0.9 });
      Art.bulb(A, { x: pk(830, 880), y: pk(300, 180), s: 1.0, t: 17.4, dur: 0.6 });
      A.ar('أمثلة سهلة وواضحة', { x: pk(540, 600), y: pk(740, 590), size: pk(70, 64), t: 18.25, dur: 1.4, color: GREEN });
      A.check(pk(860, 980), pk(860, 690), 70, { t: 21.3 });
      A.ar('المعلمة مرام القيق', { x: pk(640, 600), y: pk(1080, 820), size: pk(64, 62), t: 23.0, dur: 1.3 });
      A.ar('مركز آرام التعليمي', { x: pk(640, 600), y: pk(1200, 930), size: pk(58, 56), t: 24.45, dur: 1.3, color: GREEN });
      A.ar('يلا نبلّش!', { x: pk(660, 600), y: pk(1420, 1030), size: 60, t: 26.95, dur: 0.75, color: GREEN });
    });

    // ================================================================ S03 the three endings
    scene('S03', { move: 'down', panDur: 0.9 }, (A) => {
      A.ar('أهم قاعدة', { x: pk(540, 960), y: pk(330, 170), size: pk(84, 80), t: 29.55, dur: 0.9 });
      A.underline(pk(370, 800), pk(710, 1120), pk(360, 200), { t: 30.5, dur: 0.3, color: GREEN });
      boxes(A, [{ en: 's', color: GREEN, t: 36.95, dur: 0.3 }, { en: 'es', color: GREEN, t: 38.75, dur: 0.45 }, { en: 'y → ies', color: GREEN, t: 41.2, dur: 1.9 }],
        { x: pk(60, 330), y: pk(470, 300), w: pk(960, 1260), h: pk(210, 190), t: 35.15, bdur: 0.3, en: pk(62, 80), plus: false, gap: pk(30, 60) });
      const boy = Art.character(A, { kind: 'boy', x: pk(300, 520), y: pk(1720, 1000), scale: pk(0.85, 0.6), t: 44.0, dur: 1.4,
        keys: [{ t: 47.0, ...Art.P.hold, mouth: 'smile' }, { t: 50.2, ...Art.P.hold, mouth: 'grin', eyes: 'happy' }, { t: 52.4, ...Art.P.cheer }] });
      notebook(A, { x: pk(690, 1180), y: pk(1100, 760), s: 1.3, t: 46.55, dur: 0.9 });
      A.ar('بشكل صحيح', { x: pk(690, 1180), y: pk(1420, 990), size: 64, t: 48.25, dur: 1.1, color: GREEN });
      A.check(pk(900, 1460), pk(1330, 890), 80, { t: 49.5 });
    });

    // ================================================================ S04 basic rule
    const s04 = scene('S04', { move: 'right', panDur: 0.9 }, (A) => {
      const g = A.group({}); shared.s04 = g;
      A.ar('أولاً: القاعدة الأساسية', { x: pk(540, 960), y: pk(320, 150), size: pk(70, 68), t: 53.7, dur: 2.1, parent: g });
      boxes(A, [{ en: 'verb', t: 60.7, dur: 0.6 }, { en: 's', color: GREEN, t: 63.35, dur: 0.3 }],
        { x: pk(190, 610), y: pk(420, 220), w: pk(700, 700), h: pk(180, 160), t: 57.0, bdur: 0.4, en: pk(84, 80), gap: 70, parent: g });
      A.ar('يعمل / يشتغل', { x: pk(540, 520), y: pk(860, 650), size: 58, t: 65.55, dur: 1.2, parent: g });
      A.text('work', { x: pk(540, 520), y: pk(650, 460), size: pk(110, 100), t: 66.9, dur: 0.55, parent: g });
      conj(A, 'run', 'runs', { x: pk(540, 1380), y: pk(1000, 460), size: pk(110, 100), t: 69.55, da: 0.5, tArrow: 74.95, tb: 75.75, db: 0.6, parent: g });
      A.ar('يركض', { x: pk(540, 1380), y: pk(1200, 660), size: 56, t: 70.3, dur: 0.6, parent: g });
      A.text('he', { x: pk(230, 1080), y: pk(1330, 760), size: 90, t: 72.6, dur: 0.4, color: GREEN, parent: g });
      A.loop(pk(230, 1080), pk(1375, 805), 70, 58, { t: 73.05, dur: 0.3, color: GREEN, w: 6, parent: g });
      const run = [];
      for (let i = 0; i < 8; i++) run.push({ t: 71.9 + i * 0.32, dur: 0.3, lL: i % 2 ? [-25, 30] : [25, 0], lR: i % 2 ? [25, 0] : [-25, 30], aL: i % 2 ? [-30, 60] : [30, 60], aR: i % 2 ? [30, 60] : [-30, 60], x: i * 14, mouth: 'grin' });
      Art.character(A, { kind: 'boy', x: pk(560, 1400), y: pk(1720, 1010), scale: pk(0.8, 0.56), t: 70.95, dur: 0.85, parent: g,
        keys: [...run, { t: 74.7, x: 112, mouth: 'smile', aL: [14, 8], aR: [14, 8], lL: [5, 0], lR: [5, 0] }] });
    });

    // ================================================================ S05 play → plays; not always s
    scene('S05', { scene: { showFrom: 76.67 } }, (A) => {
      s04.keepUntil = 78.2;
      A.erase(shared.s04, 0, pk(160, 60), W, H - pk(160, 60), 76.75, 0.9);
      conj(A, 'play', 'plays', { x: pk(540, 960), y: pk(260, 110), size: pk(120, 110), t: 77.55, da: 0.5, tArrow: 81.2, tb: 81.95, db: 0.55 });
      A.ar('يلعب', { x: pk(540, 960), y: pk(480, 300), size: 58, t: 78.35, dur: 0.6 });
      const bx = pk(300, 420), by = pk(1160, 1000);
      Art.character(A, { kind: 'boy', x: bx, y: by, scale: pk(0.8, 0.6), t: 78.95, dur: 1.0,
        keys: [{ t: 80.15, ...Art.P.kick, dur: 0.3 }, { t: 81.1, mouth: 'grin', eyes: 'happy', aL: [40, 10], aR: [40, 10] }, { t: 92.1, ...Art.P.think }] });
      const ball = Art.ball(A, { x: bx + pk(130, 100), y: by - 22, s: 0.85, t: 79.98, dur: 0.15 });
      A.anim((t) => {
        const k = Math.max(0, Math.min(1, (t - 80.2) / 0.8)), e = 1 - Math.pow(1 - k, 2);
        ball.g.setAttribute('transform', `translate(${(bx + pk(130, 100) + e * pk(230, 260)).toFixed(1)} ${(by - 22 - Math.sin(k * Math.PI) * 160 + e * 0).toFixed(1)}) rotate(${(k * 540).toFixed(0)}) scale(0.85)`);
      });
      A.text('!', { x: pk(900, 1700), y: pk(560, 240), size: 120, t: 83.3, dur: 0.3, color: RED });
      A.ar('مش كل الأفعال', { x: pk(540, 1370), y: pk(1330, 520), size: 64, t: 84.45, dur: 1.4, color: RED });
      const sy = pk(1420, 620), sx = pk(330, 1180), ex = pk(720, 1560);
      A.text('s', { x: sx, y: sy, size: 150, t: 86.3, dur: 0.3 });
      A.cross(sx - 60, sy + 20, 120, 120, { t: 86.75 });
      A.arrow(sx + 90, sy + 75, ex - 120, sy + 75, { t: 89.55, dur: 0.3, color: GREEN, w: 7, bend: -0.1 });
      A.text('es', { x: ex, y: sy, size: 150, t: 89.95, dur: 0.6, color: GREEN });
      A.text('?', { x: ex + pk(150, 150), y: sy, size: 150, t: 92.9, dur: 0.35, color: GREY });
      camTo(92.4, 93.5, local(pk(560, 1380), sy + 160, pk(1.12, 1.25)));
    });

    // ================================================================ S06 case 1: ch
    scene('S06', { move: 'down', panDur: 0.9 }, (A) => {
      badge(A, 1, pk(190, 200), pk(300, 150), 96.75);
      A.ar('الحالة الأولى', { x: pk(560, 520), y: pk(340, 185), size: 66, t: 97.1, dur: 0.8 });
      A.text('ch', { x: pk(380, 360), y: pk(430, 270), size: 160, t: 100.2, dur: 0.95 });
      A.underline(pk(300, 280), pk(470, 450), pk(610, 450), { t: 103.4, dur: 0.3, color: GREEN });
      A.text('+ es', { x: pk(750, 720), y: pk(460, 300), size: 120, t: 106.1, dur: 0.75, color: GREEN });
      Art.tv(A, { x: pk(330, 360), y: pk(890, 700), s: pk(0.8, 0.85), on: true, t: 107.65, dur: 0.95 });
      conj(A, 'watch', 'watches', { x: pk(540, 1380), y: pk(1110, 200), size: pk(92, 92), t: 108.75, da: 0.6, tArrow: 112.85, tb: 113.62, db: 0.75 });
      A.ar('يشاهد', { x: pk(590, 1380), y: pk(1050, 390), size: 56, t: 109.5, dur: 0.6 });
      Art.character(A, { kind: 'boy', x: pk(800, 680), y: pk(1040, 1010), scale: pk(0.55, 0.5), t: 110.2, dur: 1.0, flip: true,
        keys: [{ t: 113.7, mouth: 'grin', eyes: 'happy' }] });
      conj(A, 'teach', 'teaches', { x: pk(540, 1380), y: pk(1330, 520), size: pk(92, 92), t: 115.75, da: 0.6, tArrow: 117.95, tb: 118.62, db: 0.7 });
      A.ar('يعلّم', { x: pk(800, 1380), y: pk(1550, 710), size: 56, t: 116.5, dur: 0.5 });
      Art.character(A, { kind: 'girl', x: pk(240, 1080), y: pk(1760, 1010), scale: pk(0.62, 0.48), t: 117.0, dur: 0.85,
        keys: [{ t: 118.5, ...Art.P.pointUp, mouth: 'talk' }, { t: 120.2, mouth: 'smile', aR: [14, 8] }] });
      A.loop(pk(380, 360), pk(510, 350), 120, 100, { t: 121.6, dur: 0.45, color: RED, w: 7 });
      A.loop(pk(750, 720), pk(520, 360), 170, 90, { t: 123.95, dur: 0.45, color: GREEN, w: 7 });
    });

    // ================================================================ S07 case 2: sh
    scene('S07', { move: 'right', panDur: 0.9 }, (A) => {
      badge(A, 2, pk(190, 200), pk(300, 150), 126.9);
      A.ar('الحالة الثانية', { x: pk(560, 520), y: pk(340, 185), size: 66, t: 127.25, dur: 0.8 });
      A.text('sh', { x: pk(380, 360), y: pk(430, 270), size: 160, t: 129.95, dur: 0.85 });
      A.underline(pk(290, 270), pk(470, 450), pk(610, 450), { t: 134.85, dur: 0.3, color: GREEN });
      A.text('+ es', { x: pk(750, 720), y: pk(460, 300), size: 120, t: 136.6, dur: 0.7, color: GREEN });
      toothbrush(A, { x: pk(300, 330), y: pk(800, 660), s: 1.2, t: 137.95, dur: 0.6 });
      conj(A, 'brush', 'brushes', { x: pk(540, 1380), y: pk(940, 200), size: pk(92, 92), t: 138.85, da: 0.6, tArrow: 141.35, tb: 142.02, db: 0.75 });
      Art.character(A, { kind: 'boy', x: pk(820, 600), y: pk(830, 1010), scale: pk(0.5, 0.5), t: 139.75, dur: 1.0, keys: [{ t: 142.6, mouth: 'grin' }] });
      A.ar('يفرّش', { x: pk(540, 1380), y: pk(1150, 380), size: 56, t: 140.85, dur: 0.45 });
      conj(A, 'wish', 'wishes', { x: pk(540, 1380), y: pk(1260, 520), size: pk(92, 92), t: 143.75, da: 0.5, tArrow: 146.05, tb: 146.7, db: 0.65 });
      Art.star(A, { x: pk(250, 1000), y: pk(1530, 790), s: 1.4, t: 144.35, dur: 0.5 });
      A.ar('يتمنّى', { x: pk(540, 1380), y: pk(1470, 700), size: 56, t: 144.95, dur: 0.55 });
      Art.character(A, { kind: 'girl', x: pk(800, 1680), y: pk(1770, 1010), scale: pk(0.6, 0.5), t: 145.0, dur: 0.95, keys: [{ t: 146.6, ...Art.P.pointUp, mouth: 'smile' }] });
      A.ar('قاعدتين', { x: pk(540, 1380), y: pk(1680, 880), size: 60, t: 149.0, dur: 0.7, color: GREEN });
    });

    // ================================================================ S08 recap + case 3: x
    scene('S08', { move: 'down', panDur: 0.9 }, (A) => {
      const ry = pk(230, 80), sz = pk(110, 96);
      A.text('ch', { x: pk(200, 640), y: ry, size: sz, t: 152.2, dur: 0.5 });
      A.text('sh', { x: pk(400, 840), y: ry, size: sz, t: 154.85, dur: 0.5 });
      A.arrow(pk(500, 950), ry + sz / 2, pk(650, 1100), ry + sz / 2, { t: 156.3, dur: 0.3, color: GREEN, w: 7, bend: -0.08 });
      A.text('es', { x: pk(790, 1240), y: ry, size: sz, t: 156.85, dur: 0.5, color: GREEN });
      badge(A, 3, pk(190, 200), pk(560, 400), 158.1);
      A.ar('الحالة الثالثة', { x: pk(560, 520), y: pk(600, 435), size: 66, t: 158.45, dur: 0.75 });
      A.text('x', { x: pk(380, 360), y: pk(690, 520), size: 160, t: 160.95, dur: 0.4 });
      A.underline(pk(320, 300), pk(440, 420), pk(870, 700), { t: 163.45, dur: 0.25, color: GREEN });
      A.text('+ es', { x: pk(740, 700), y: pk(720, 550), size: 120, t: 165.3, dur: 0.6, color: GREEN });
      wrench(A, { x: pk(300, 1200), y: pk(1060, 440), s: 1.2, t: 166.7, dur: 0.6 });
      conj(A, 'fix', 'fixes', { x: pk(540, 1350), y: pk(1300, 600), size: pk(100, 100), t: 168.1, da: 0.45, tArrow: 170.6, tb: 171.12, db: 0.65 });
      Art.character(A, { kind: 'boy', x: pk(800, 1720), y: pk(1200, 1010), scale: pk(0.6, 0.5), t: 168.6, dur: 0.95, keys: [{ t: 171.6, ...Art.P.cheer }] });
      A.ar('يصلّح', { x: pk(540, 1350), y: pk(1500, 800), size: 58, t: 169.65, dur: 0.6 });
    });

    // ================================================================ S09 not only s; case 4: ss
    scene('S09', { move: 'right', panDur: 0.9 }, (A) => {
      const ty = pk(220, 70);
      A.text('s', { x: pk(330, 260), y: ty, size: 100, t: 174.4, dur: 0.3 });
      A.arrow(pk(400, 330), ty + 50, pk(560, 490), ty + 50, { t: 175.4, dur: 0.3, color: GREEN, w: 7, bend: -0.1 });
      A.text('es', { x: pk(680, 610), y: ty, size: 100, t: 176.5, dur: 0.5, color: GREEN });
      badge(A, 4, pk(190, 200), pk(520, 380), 177.9);
      A.ar('الحالة الرابعة', { x: pk(560, 520), y: pk(560, 415), size: 66, t: 178.2, dur: 0.7 });
      A.text('ss', { x: pk(380, 360), y: pk(640, 500), size: 160, t: 180.35, dur: 0.65 });
      A.underline(pk(270, 250), pk(490, 470), pk(820, 680), { t: 183.6, dur: 0.3, color: GREEN });
      A.text('+ es', { x: pk(740, 700), y: pk(670, 530), size: 120, t: 185.2, dur: 0.6, color: GREEN });
      const mp = conj(A, 'miss', 'misses', { x: pk(540, 1350), y: pk(950, 200), size: pk(100, 100), t: 187.95, da: 0.55, tArrow: 190.45, tb: 191.05, db: 0.65 });
      A.ar('يفتقد', { x: pk(540, 1350), y: pk(1150, 390), size: 58, t: 189.45, dur: 0.6 });
      const girl = Art.character(A, { kind: 'girl', x: pk(280, 1120), y: pk(1760, 1010), scale: pk(0.75, 0.55), t: 192.45, dur: 1.15,
        keys: [{ t: 193.8, mouth: 'frown', brows: 1, head: -6 }, { t: 196.4, mouth: 'smile', brows: 0, head: 0 }] });
      Art.thought(A, { x: pk(440, 1270), y: pk(1250, 530), w: pk(560, 520), h: pk(300, 260), tx: pk(360, 1180), ty: pk(1380, 690), t: 193.65, dur: 0.5 });
      heart(A, { x: pk(590, 1410), y: pk(1400, 660), s: 1.5, t: 194.9, dur: 0.4 });
      A.ar('يشتاق', { x: pk(820, 1640), y: pk(1430, 690), size: 58, t: 195.35, dur: 0.5, color: RED });
      A.loop(mp.rb.x + mp.rb.w / 2, mp.rb.y + mp.rb.h * 0.55, mp.rb.w / 2 + 28, mp.rb.h * 0.62, { t: 197.4, dur: 0.45, color: GREEN, w: 6 });
    });

    // ================================================================ S10 all es endings; case 5: o
    scene('S10', { move: 'down', panDur: 0.9 }, (A) => {
      const ry = pk(230, 80), sz = pk(100, 90);
      [['ch', pk(190, 640), 204.6], ['sh', pk(400, 840), 205.75], ['x', pk(580, 1020), 206.85], ['ss', pk(780, 1200), 207.55]].forEach(([s, x, t]) =>
        A.text(s, { x, y: ry, size: sz, t, dur: 0.4 }));
      const by = ry + sz + 30, bx0 = pk(130, 580), bx1 = pk(850, 1270);
      A.path(`M${bx0} ${by} Q${bx0} ${by + 30} ${(bx0 + bx1) / 2 - 30} ${by + 30} L${(bx0 + bx1) / 2} ${by + 55} L${(bx0 + bx1) / 2 + 30} ${by + 30} Q${bx1} ${by + 30} ${bx1} ${by}`, { t: 208.05, dur: 0.35, w: 6, color: GREEN });
      A.text('es', { x: (bx0 + bx1) / 2, y: by + 75, size: pk(84, 76), t: 208.45, dur: 0.4, color: GREEN });
      badge(A, 5, pk(190, 200), pk(650, 420), 208.95);
      A.ar('الحالة الخامسة', { x: pk(560, 520), y: pk(690, 455), size: 66, t: 209.3, dur: 0.75 });
      A.text('o', { x: pk(380, 360), y: pk(770, 540), size: 160, t: 211.85, dur: 0.35 });
      Art.character(A, { kind: 'boy', x: pk(250, 1100), y: pk(1760, 1010), scale: pk(0.6, 0.5), t: 212.3, dur: 0.95, keys: (() => {
        const k = []; for (let i = 0; i < 7; i++) k.push({ t: 219.7 + i * 0.3, dur: 0.28, lL: i % 2 ? [-18, 20] : [18, 0], lR: i % 2 ? [18, 0] : [-18, 20], x: (i + 1) * pk(40, 45), mouth: 'smile' });
        return k.concat([{ t: 222.0, x: pk(280, 315), lL: [5, 0], lR: [5, 0], mouth: 'grin' }]);
      })() });
      A.underline(pk(330, 310), pk(430, 410), pk(940, 710), { t: 214.6, dur: 0.25, color: GREEN });
      A.text('+ es', { x: pk(740, 700), y: pk(800, 570), size: 120, t: 216.15, dur: 0.6, color: GREEN });
      conj(A, 'go', 'goes', { x: pk(540, 1420), y: pk(1030, 380), size: pk(100, 96), t: 218.95, da: 0.35, tArrow: 221.05, tb: 221.62, db: 0.5 });
      Art.school(A, { x: pk(840, 1760), y: pk(1700, 1000), s: pk(0.6, 0.5), t: 219.4, dur: 0.75 });
      A.ar('يذهب', { x: pk(540, 1420), y: pk(1220, 560), size: 56, t: 220.25, dur: 0.5 });
      conj(A, 'do', 'does', { x: pk(540, 1420), y: pk(1310, 650), size: pk(100, 96), t: 223.15, da: 0.35, tArrow: 225.3, tb: 225.83, db: 0.45 });
      A.ar('يفعل', { x: pk(540, 1420), y: pk(1500, 830), size: 56, t: 224.55, dur: 0.5 });
      A.text('!', { x: pk(940, 1820), y: pk(1310, 640), size: 120, t: 227.35, dur: 0.3, color: RED });
    });

    // ================================================================ S11 photo → photos, radio → radios
    scene('S11', { move: 'right', panDur: 0.9 }, (A) => {
      A.ar('مش كل كلمة', { x: pk(540, 660), y: pk(320, 150), size: 70, t: 229.8, dur: 1.0, color: RED });
      A.text('o + s', { x: pk(540, 1200), y: pk(380, 60), size: pk(120, 110), t: 234.85, dur: 0.6, colorAt: (k) => (k === 4 ? GREEN : C.ink) });
      frame(A, { x: pk(540, 330), y: pk(680, 400), s: 1.0, t: 236.2, dur: 0.6 });
      conj(A, 'photo', 'photos', { x: pk(540, 1100), y: pk(820, 340), size: pk(96, 100), t: 236.85, da: 0.55, tArrow: 237.9, tb: 238.48, db: 0.65 });
      radio(A, { x: pk(540, 330), y: pk(1100, 700), s: pk(0.85, 0.95), t: 239.15, dur: 0.45 });
      conj(A, 'radio', 'radios', { x: pk(540, 1100), y: pk(1240, 650), size: pk(96, 100), t: 239.9, da: 0.55, tArrow: 240.85, tb: 241.35, db: 0.7 });
      Art.character(A, { kind: 'girl', x: pk(230, 1700), y: pk(1770, 1010), scale: pk(0.7, 0.55), t: 242.5, dur: 1.1, keys: [{ t: 243.9, ...Art.P.pointUp, mouth: 'talk', brows: 1 }, { t: 246.8, mouth: 'smile', aR: [14, 8], brows: 0 }] });
      A.ar('ننتبه للكلمة نفسها', { x: pk(640, 1100), y: pk(1480, 860), size: 58, t: 243.65, dur: 1.0, color: GREEN });
      A.ar('وما نعمّم', { x: pk(640, 1100), y: pk(1600, 970), size: 58, t: 245.0, dur: 0.8, color: RED });
    });

    // ================================================================ S12 case 6: y after a consonant (study)
    scene('S12', { move: 'down', panDur: 0.9 }, (A) => {
      badge(A, 6, pk(190, 200), pk(300, 150), 249.3);
      A.ar('الحالة السادسة', { x: pk(560, 520), y: pk(340, 185), size: 66, t: 249.65, dur: 0.6 });
      A.text('y', { x: pk(540, 360), y: pk(400, 230), size: 160, t: 251.75, dur: 0.35 });
      A.text('!', { x: pk(700, 470), y: pk(400, 230), size: 140, t: 253.55, dur: 0.3, color: RED });
      const fy = pk(640, 430), lx = pk(290, 200), rx = pk(790, 520);
      A.arrow(pk(500, 330), fy, lx + 40, fy + 90, { t: 256.6, dur: 0.3, w: 6, bend: 0.1 });
      A.arrow(pk(580, 390), fy, rx - 40, fy + 90, { t: 257.0, dur: 0.3, w: 6, bend: -0.1 });
      A.text('?', { x: rx, y: fy + 110, size: 90, t: 257.4, dur: 0.3, color: GREY });
      A.text('consonant', { x: lx, y: fy + 110, size: pk(60, 50), t: 261.65, dur: 0.95 });
      A.ar('حرف ساكن', { x: lx, y: fy + pk(240, 210), size: 46, t: 262.65, dur: 0.45 });
      A.text('y → ies', { x: lx, y: fy + pk(270, 240), size: pk(80, 66), t: 263.4, dur: 2.9, colorAt: (k) => (k === 0 ? RED : k >= 4 ? GREEN : C.ink) });
      // example: study → studies
      const ex = pk(540, 1300), ey = pk(1140, 200), es = pk(130, 130);
      const st = A.text('study', { x: ex, y: ey, size: es, t: 268.95, dur: 0.55 });
      st.size = es;
      A.ar('يدرس', { x: pk(880, 1660), y: ey + pk(110, 100), size: 56, t: 270.25, dur: 0.5 });
      ringChar(A, st, 'study', 3, 273.9, RED);
      const d = charX('study', st.x, es, 3, 'start');
      A.ar('حرف ساكن', { x: d.cx, y: ey - 12, size: 42, t: 275.0, dur: 0.6, color: RED });
      const y4 = charX('study', st.x, es, 4, 'start');
      A.cross(y4.cx - 40, ey + es * 0.45, 80, 80, { t: 277.4 });
      A.arrow(ex, ey + es + 50, ex, ey + es + 140, { t: 279.0, dur: 0.3, w: 7, color: GREEN, bend: 0.05 });
      A.text('studies', { x: ex, y: ey + es + 160, size: es, t: 280.6, dur: 0.6, colorAt: (k) => (k >= 4 ? GREEN : C.ink) });
      Art.character(A, { kind: 'boy', x: pk(880, 1680), y: pk(1760, 1010), scale: pk(0.65, 0.5), t: 266.9, dur: 0.95, keys: [{ t: 269.6, ...Art.P.hold, mouth: 'smile' }] });
      Art.book(A, { x: pk(880, 1680) + 46 * pk(0.65, 0.5), y: pk(1760, 1010) - 100 * pk(0.65, 0.5), s: pk(0.6, 0.48), t: 269.7, dur: 0.5 });
    });

    // ================================================================ S13 city → cities
    scene('S13', { move: 'right', panDur: 0.9 }, (A) => {
      const ex = pk(540, 1250), ey = pk(820, 200), es = 130;
      buildings(A, { x: pk(540, 450), y: pk(650, 640), s: 1.2, t: 284.05, dur: 0.9 });
      const ct = A.text('city', { x: ex, y: ey, size: es, t: 283.3, dur: 0.5 }); ct.size = es;
      A.ar('مدينة', { x: pk(850, 1640), y: ey + 110, size: 56, t: 285.0, dur: 0.4 });
      ringChar(A, ct, 'city', 2, 287.0, RED);
      const tt = charX('city', ct.x, es, 2, 'start');
      A.ar('حرف ساكن', { x: tt.cx, y: ey - 12, size: 42, t: 287.9, dur: 0.6, color: RED });
      const y3 = charX('city', ct.x, es, 3, 'start');
      A.cross(y3.cx - 40, ey + es * 0.45, 80, 80, { t: 290.3 });
      A.arrow(ex, ey + es + 50, ex, ey + es + 140, { t: 292.0, dur: 0.3, w: 7, color: GREEN, bend: 0.05 });
      A.text('cities', { x: ex, y: ey + es + 160, size: es, t: 293.4, dur: 0.6, colorAt: (k) => (k >= 3 ? GREEN : C.ink) });
      A.text('consonant + y → ies', { x: pk(540, 960), y: pk(1420, 800), size: pk(62, 70), t: 296.3, dur: 3.6, colorAt: (k) => (k === 12 ? RED : k >= 16 ? GREEN : C.ink) });
      A.underline(pk(170, 600), pk(910, 1320), pk(1520, 900), { t: 300.0, dur: 0.3, color: GREEN });
    });

    // ================================================================ S14 y after a vowel: a e i o u, play
    scene('S14', { move: 'down', panDur: 0.9 }, (A) => {
      A.text('!', { x: pk(150, 600), y: pk(250, 70), size: 110, t: 301.3, dur: 0.25, color: RED });
      A.ar('الحالة التانية', { x: pk(540, 960), y: pk(330, 140), size: 66, t: 301.6, dur: 0.9 });
      const vy = A.text('vowel + y', { x: pk(440, 820), y: pk(420, 200), size: 90, t: 305.6, dur: 1.2, colorAt: (k) => (k === 8 ? GREEN : C.ink) });
      A.text('+ s', { x: pk(860, 1220), y: pk(430, 210), size: 90, t: 308.15, dur: 0.45, color: GREEN });
      const yc = charX('vowel + y', vy.x, 90, 8, 'start');
      A.check(yc.cx, pk(420, 200) + pk(160, 140), 50, { t: 309.85 });
      A.ar('الحروف المتحركة', { x: pk(540, 960), y: pk(690, 430), size: 58, t: 311.3, dur: 1.0 });
      const vx = (i) => pk(190 + i * 175, 560 + i * 200), vyy = pk(720, 455);
      ['a', 'e', 'i', 'o', 'u'].forEach((c, i) => A.text(c, { x: vx(i), y: vyy, size: 130, t: [313.15, 313.95, 314.75, 315.6, 316.35][i], dur: 0.3, color: GREEN }));
      Art.character(A, { kind: 'girl', x: pk(220, 260), y: pk(1760, 1010), scale: pk(0.75, 0.55), t: 302.6, dur: 1.15,
        keys: [{ t: 313.2, ...Art.P.pointUp, mouth: 'talk' }, { t: 316.6, ...Art.P.point, mouth: 'smile' }, { t: 322.9, ...Art.P.pointUp, mouth: 'smile' }] });
      const ex = pk(540, 1100), ey = pk(1000, 660), es = 140;
      const pl = A.text('play', { x: ex, y: ey, size: es, t: 318.9, dur: 0.55 }); pl.size = es;
      A.ar('يلعب', { x: pk(870, 1460), y: ey + 120, size: 56, t: 320.2, dur: 0.5 });
      ringChar(A, pl, 'play', 2, 322.9, GREEN);
      const a2 = charX('play', pl.x, es, 2, 'start');
      A.ar('حرف متحرك', { x: a2.cx, y: ey + es * 1.62, size: 46, t: 324.0, dur: 0.6, color: GREEN });
      const y3 = charX('play', pl.x, es, 3, 'start');
      A.check(y3.cx + 70, ey + es * 0.5, 56, { t: 327.0 });
    });

    // ================================================================ S15 plays, boy → boys
    scene('S15', { move: 'right', panDur: 0.8 }, (A) => {
      conj(A, 'play', 'plays', { x: pk(540, 960), y: pk(280, 100), size: pk(120, 110), t: 328.95, da: 0.5, tArrow: 330.4, tb: 331.15, db: 0.55 });
      const bp = conj(A, 'boy', 'boys', { x: pk(540, 960), y: pk(640, 380), size: pk(140, 130), t: 333.2, da: 0.45, tArrow: 342.5, tb: 343.6, db: 0.55 });
      const sz = pk(140, 130);
      Art.character(A, { kind: 'boy', x: pk(330, 640), y: pk(1720, 1010), scale: pk(0.75, 0.55), t: 333.75, dur: 0.9, keys: [{ t: 343.9, ...Art.P.wave }] });
      A.ar('ولد', { x: pk(540, 960), y: pk(1000, 700), size: 60, t: 334.75, dur: 0.4 });
      ringChar(A, bp.ra, 'boy', 1, 336.9, GREEN);
      const o1 = charX('boy', bp.ra.x, sz, 1, 'start');
      A.ar('حرف متحرك', { x: o1.cx, y: pk(640, 380) + sz * 1.62, size: 44, t: 338.35, dur: 0.6, color: GREEN });
      Art.character(A, { kind: 'boy', x: pk(750, 1280), y: pk(1720, 1010), scale: pk(0.75, 0.55), t: 339.05, dur: 0.85, shirt: '#b5523b', keys: [{ t: 344.0, ...Art.P.waveL }] });
    });

    // ================================================================ S16 y summary; the three endings; notes
    scene('S16', { move: 'down', panDur: 0.9 }, (A) => {
      Art.character(A, { kind: 'boy', x: pk(830, 1640), y: pk(1760, 1010), scale: pk(0.7, 0.55), t: 345.15, dur: 1.1,
        keys: [{ t: 352.0, ...Art.P.think }, { t: 359.9, ...Art.P.cheer }, { t: 360.6, ...Art.P.cheer, dy: 0 }, { t: 361.3, mouth: 'grin', aL: [14, 8], aR: [14, 8], dy: 0 }] });
      A.text('y', { x: pk(540, 960), y: pk(240, 70), size: pk(140, 120), t: 346.35, dur: 0.35 });
      const fy = pk(430, 230), lx = pk(290, 600), rx = pk(790, 1320);
      A.arrow(pk(500, 920), fy, lx + 40, fy + 80, { t: 346.8, dur: 0.25, w: 6, bend: 0.1 });
      A.arrow(pk(580, 1000), fy, rx - 40, fy + 80, { t: 347.15, dur: 0.25, w: 6, bend: -0.1 });
      A.text('consonant', { x: lx, y: fy + 110, size: pk(60, 56), t: 348.2, dur: 0.95 });
      A.text('y → ies', { x: lx, y: fy + pk(220, 200), size: pk(80, 76), t: 350.2, dur: 2.4, colorAt: (k) => (k === 0 ? RED : k >= 4 ? GREEN : C.ink) });
      A.text('vowel', { x: rx, y: fy + 110, size: pk(60, 56), t: 354.3, dur: 0.6 });
      A.text('y', { x: rx - pk(90, 86), y: fy + pk(220, 200), size: pk(80, 76), t: 355.8, dur: 0.3, color: GREEN });
      A.text('+ s', { x: rx - pk(36, 34), y: fy + pk(220, 200), size: pk(80, 76), t: 358.05, dur: 0.45, color: GREEN, anchor: 'start' });
      Art.star(A, { x: pk(540, 960), y: pk(900, 520), s: 1.3, t: 359.7, dur: 0.4 });
      boxes(A, [{ en: 's', color: GREEN, t: 364.65, dur: 0.3 }, { en: 'es', color: GREEN, t: 365.3, dur: 0.45 }, { en: 'ies', color: GREEN, t: 366.45, dur: 0.6 }],
        { x: pk(90, 460), y: pk(1040, 610), w: pk(900, 1000), h: pk(160, 140), t: 362.0, bdur: 0.3, en: pk(80, 76), plus: false, gap: 40 });
      notebook(A, { x: pk(300, 330), y: pk(1420, 900), s: 0.85, t: 368.4, dur: 0.8 });
      A.ar('ملاحظات مهمة', { x: pk(420, 760), y: pk(1620, 930), size: 64, t: 370.9, dur: 1.0, color: RED });
    });

    // ================================================================ S17 note 1: he / she / it
    scene('S17', { move: 'right', panDur: 0.9 }, (A) => {
      const cx = pk(540, 480);
      A.text('s · es · ies', { x: cx, y: pk(230, 70), size: pk(90, 80), t: 377.2, dur: 2.4, color: GREEN });
      A.text('Present Simple', { x: cx, y: pk(380, 190), size: pk(96, 90), t: 381.95, dur: 1.45 });
      A.ar('المضارع البسيط', { x: cx, y: pk(560, 360), size: 54, t: 383.45, dur: 0.8 });
      [['he', pk(300, 260), 384.8, 0.3], ['she', pk(540, 480), 386.1, 0.4], ['it', pk(780, 700), 387.6, 0.25]].forEach(([s, x, t, d]) =>
        A.text(s, { x, y: pk(620, 420), size: 100, t, dur: d, color: GREEN }));
      A.ar('شخص واحد · حيوان · إشي مفرد', { x: cx, y: pk(820, 610), size: pk(46, 42), t: 389.3, dur: 3.8 });
      Art.character(A, { kind: 'girl', x: pk(400, 470), y: pk(1860, 1010), scale: pk(0.5, 0.45), t: 393.45, dur: 0.9,
        keys: [{ t: 401.6, mouth: 'grin', eyes: 'happy', head: 6 }] });
      Art.character(A, { kind: 'boy', x: pk(170, 240), y: pk(1860, 1010), scale: pk(0.5, 0.45), t: 394.4, dur: 0.9,
        keys: [{ t: 397.7, ...Art.P.kick, dur: 0.3 }, { t: 398.6, mouth: 'grin', eyes: 'happy' }] });
      const ex = pk(540, 1400), sz = pk(84, 80);
      A.text('He plays.', { x: ex, y: pk(900, 110), size: sz, t: 396.6, dur: 1.0, colorAt: (k) => (k === 7 ? GREEN : C.ink) });
      A.ar('هو بيلعب', { x: ex, y: pk(1060, 270), size: 50, t: 398.5, dur: 0.7 });
      A.text('She watches.', { x: ex, y: pk(1110, 330), size: sz, t: 399.75, dur: 0.95, colorAt: (k) => (k === 9 || k === 10 ? GREEN : C.ink) });
      Art.tv(A, { x: pk(790, 720), y: pk(1770, 930), s: pk(0.5, 0.42), on: true, t: 400.75, dur: 0.75 });
      A.ar('هي بتشاهد', { x: ex, y: pk(1270, 490), size: 50, t: 401.55, dur: 0.85 });
      A.text('It works.', { x: ex, y: pk(1320, 550), size: sz, t: 403.2, dur: 0.8, colorAt: (k) => (k === 7 ? GREEN : C.ink) });
      const b = Art.bulb(A, { x: pk(930, 1800), y: pk(1330, 580), s: 0.9, t: 404.05, dur: 0.5 });
      A.ar('هو بيشتغل', { x: ex, y: pk(1480, 710), size: 50, t: 404.65, dur: 0.8 });
      A.text('!', { x: pk(950, 1800), y: pk(1490, 800), size: 110, t: 408.55, dur: 0.3, color: RED });
      A.ar('مش مع كل اسم جمع', { x: pk(540, 1400), y: pk(1575, 900), size: 54, t: 412.9, dur: 1.6, color: RED });
    });

    // ================================================================ S18 I / you / we / they vs he / she / it
    scene('S18', { move: 'down', panDur: 0.9 }, (A) => {
      [['I', pk(250, 690), 417.0, 0.2], ['you', pk(450, 870), 417.75, 0.45], ['we', pk(640, 1060), 418.55, 0.4], ['they', pk(850, 1260), 419.45, 0.55]].forEach(([s, x, t, d]) =>
        A.text(s, { x, y: pk(240, 70), size: 80, t, dur: d }));
      Art.character(A, { kind: 'girl', x: pk(300, 190), y: pk(1760, 1010), scale: pk(0.7, 0.5), t: 420.4, dur: 0.9, keys: [{ t: 426.4, ...Art.P.point, mouth: 'talk' }, { t: 429.6, mouth: 'smile', aR: [14, 8] }] });
      Art.character(A, { kind: 'boy', x: pk(780, 1740), y: pk(1760, 1010), scale: pk(0.7, 0.5), t: 421.35, dur: 0.9, flip: true, keys: [{ t: 431.0, ...Art.P.pointUp, mouth: 'grin' }] });
      A.ar('بدون s', { x: pk(540, 960), y: pk(450, 260), size: 64, t: 422.9, dur: 0.8, color: RED });
      const lx = pk(280, 640), rx = pk(800, 1280), y0 = pk(540, 330), dy = pk(120, 115);
      A.path(`M${pk(540, 960)} ${y0 - 10} L${pk(540, 960)} ${y0 + dy * 4}`, { t: 424.4, dur: 0.3, w: 5, color: GREY });
      [['I play', 425.25, 0.6], ['You play', 426.35, 0.6], ['We play', 427.55, 0.6], ['They play', 428.7, 0.65]].forEach(([s, t, d], i) =>
        A.text(s, { x: lx, y: y0 + i * dy, size: 76, t, dur: d }));
      A.text('he · she · it', { x: rx, y: y0, size: 70, t: 430.75, dur: 1.6, color: GREEN });
      A.text('+ s', { x: rx, y: y0 + dy, size: 76, t: 432.85, dur: 0.4, color: GREEN });
      A.text('+ es', { x: rx, y: y0 + dy * 2, size: 76, t: 434.55, dur: 0.45, color: GREEN });
      A.text('y → ies', { x: rx, y: y0 + dy * 3, size: 76, t: 437.1, dur: 0.95, colorAt: (k) => (k === 0 ? RED : k >= 4 ? GREEN : C.ink) });
    });

    // ================================================================ S19 note 2: why es?
    scene('S19', { move: 'right', panDur: 0.9 }, (A) => {
      A.ar('ليش es بدل s؟', { x: pk(540, 960), y: pk(330, 140), size: 70, t: 441.7, dur: 2.3 });
      Art.character(A, { kind: 'girl', x: pk(250, 300), y: pk(1000, 1010), scale: pk(0.7, 0.55), t: 444.9, dur: 1.0, keys: [{ t: 446.2, mouth: 'talk', ...Art.P.ask }, { t: 449.2, mouth: 'smile', aR: [14, 8], head: 0 }] });
      mouthWaves(A, { x: pk(620, 420), y: pk(600, 470), s: 1.4, t: 446.15, dur: 0.75 });
      A.ar('أسهل في النطق', { x: pk(650, 420), y: pk(860, 710), size: 62, t: 447.3, dur: 1.2, color: GREEN });
      const ry = pk(1060, 230), sz = pk(100, 96);
      [['ch', pk(190, 1000), 454.25, 0.45], ['sh', pk(400, 1200), 455.05, 0.45], ['ss', pk(610, 1400), 456.15, 0.5], ['x', pk(810, 1590), 457.55, 0.35]].forEach(([s, x, t, d]) =>
        A.text(s, { x, y: ry, size: sz, t, dur: d }));
      const by = ry + sz + 30, bx0 = pk(130, 940), bx1 = pk(870, 1650);
      A.path(`M${bx0} ${by} Q${bx0} ${by + 30} ${(bx0 + bx1) / 2 - 30} ${by + 30} L${(bx0 + bx1) / 2} ${by + 55} L${(bx0 + bx1) / 2 + 30} ${by + 30} Q${bx1} ${by + 30} ${bx1} ${by}`, { t: 457.95, dur: 0.3, w: 6, color: GREEN });
      A.text('es', { x: (bx0 + bx1) / 2, y: by + 75, size: pk(84, 76), t: 458.4, dur: 0.4, color: GREEN });
      boxes(A, [{ en: 's', t: 462.35, dur: 0.3 }, { en: 'es', color: GREEN, t: 464.6, dur: 0.45 }],
        { x: pk(150, 1000), y: pk(1440, 640), w: pk(780, 650), h: pk(170, 160), t: 460.0, bdur: 0.35, en: 90, plus: false, gap: pk(120, 90) });
      A.ar('نميّز', { x: pk(540, 1325), y: pk(1700, 900), size: 58, t: 460.9, dur: 0.6 });
    });

    // ================================================================ S20 note 3: have → has
    scene('S20', { move: 'down', panDur: 0.9 }, (A) => {
      A.text('!', { x: pk(860, 760), y: pk(220, 70), size: 130, t: 468.6, dur: 0.3, color: RED });
      A.text('have', { x: pk(540, 480), y: pk(230, 80), size: 160, t: 470.45, dur: 0.55 });
      A.text('he · she · it', { x: pk(540, 480), y: pk(470, 300), size: 64, t: 473.6, dur: 1.6, color: GREEN });
      const hv = A.text('haves', { x: pk(330, 300), y: pk(600, 420), size: 110, t: 476.85, dur: 0.7 });
      strike(A, hv, 477.65, { dur: 0.3 });
      const hs = A.text('has', { x: pk(760, 700), y: pk(600, 420), size: 110, t: 478.35, dur: 0.5, color: GREEN });
      A.check(pk(940, 860), pk(680, 500), 60, { t: 478.95 });
      const tx = pk(540, 1350), ty = pk(860, 120), tdy = pk(125, 150), tsz = pk(84, 90);
      A.text('I have', { x: tx, y: ty, size: tsz, t: 480.1, dur: 0.75 });
      [['He has', 481.95, 0.7], ['She has', 483.0, 0.6], ['It has', 484.05, 0.6]].forEach(([s, t, d], i) =>
        A.text(s, { x: tx, y: ty + (i + 1) * tdy, size: tsz, t, dur: d, colorAt: (k) => (k >= s.length - 3 ? GREEN : C.ink) }));
      A.ar('تصريف خاص', { x: pk(540, 480), y: pk(1430, 720), size: 62, t: 486.95, dur: 0.85, color: GREEN });
      A.loop(hs.x + hs.w / 2, hs.y + 110 * 0.72, hs.w / 2 + 30, 60, { t: 488.2, dur: 0.4, color: GREEN, w: 6 });
      const bxx = pk(780, 1700), byy = pk(1760, 1010), bs = pk(0.65, 0.5);
      Art.character(A, { kind: 'boy', x: bxx, y: byy, scale: bs, t: 489.0, dur: 1.0, keys: [{ t: 490.3, ...Art.P.hold, mouth: 'grin' }] });
      Art.ball(A, { x: bxx + 80 * bs, y: byy - 160 * bs, s: 0.6, t: 490.15, dur: 0.3 });
    });

    // ================================================================ S21 summary 1: es endings and o
    scene('S21', { move: 'right', panDur: 0.9 }, (A) => {
      A.ar('الخلاصة', { x: pk(540, 960), y: pk(300, 120), size: 76, t: 493.9, dur: 0.6, color: GREEN });
      Art.character(A, { kind: 'girl', x: pk(880, 300), y: pk(1800, 1010), scale: pk(0.6, 0.5), t: 494.6, dur: 1.1, flip: v,
        keys: [{ t: 498.6, ...Art.P.point, mouth: 'talk' }, { t: 509.0, ...Art.P.pointUp, mouth: 'talk' }, { t: 517.9, mouth: 'smile', aR: [14, 8] }] });
      const ry = pk(420, 240), sz = pk(96, 90);
      [['ch', pk(150, 210), 499.0], ['sh', pk(330, 380), 499.95], ['x', pk(490, 530), 500.85], ['ss', pk(640, 670), 501.6]].forEach(([s, x, t]) =>
        A.text(s, { x, y: ry, size: sz, t, dur: 0.4 }));
      A.arrow(pk(730, 750), ry + sz / 2, pk(840, 860), ry + sz / 2, { t: 503.2, dur: 0.25, w: 7, color: GREEN, bend: -0.08 });
      A.text('es', { x: pk(940, 960), y: ry, size: sz, t: 503.75, dur: 0.45, color: GREEN });
      const cx = pk(540, 1440);
      A.text('o + es', { x: cx, y: pk(640, 140), size: pk(100, 90), t: 505.95, dur: 1.9, colorAt: (k) => (k >= 4 ? GREEN : C.ink) });
      conj(A, 'go', 'goes', { x: cx, y: pk(820, 290), size: pk(92, 84), t: 509.0, da: 0.35, tArrow: 510.0, tb: 510.35, db: 0.5 });
      conj(A, 'do', 'does', { x: cx, y: pk(990, 430), size: pk(92, 84), t: 511.1, da: 0.3, tArrow: 511.9, tb: 512.3, db: 0.5 });
      A.text('o + s', { x: cx, y: pk(1160, 610), size: pk(100, 90), t: 514.35, dur: 0.8, colorAt: (k) => (k === 4 ? GREEN : C.ink) });
      conj(A, 'photo', 'photos', { x: cx, y: pk(1320, 760), size: pk(92, 84), t: 515.55, da: 0.55, tArrow: 516.65, tb: 517.1, db: 0.6 });
    });

    // ================================================================ S22 summary 2: y, and all other verbs
    scene('S22', { move: 'down', panDur: 0.9 }, (A) => {
      A.text('y', { x: pk(540, 960), y: pk(230, 70), size: pk(140, 120), t: 519.55, dur: 0.3 });
      const fy = pk(420, 230), lx = pk(290, 560), rx = pk(790, 1360);
      A.arrow(pk(500, 920), fy, lx + 40, fy + 80, { t: 520.6, dur: 0.25, w: 6, bend: 0.1 });
      A.arrow(pk(580, 1000), fy, rx - 40, fy + 80, { t: 520.95, dur: 0.25, w: 6, bend: -0.1 });
      const r1 = fy + 110, r2 = fy + pk(220, 190), r3 = fy + pk(370, 330);
      A.text('consonant', { x: lx, y: r1, size: pk(60, 56), t: 522.7, dur: 0.9 });
      A.text('y → ies', { x: lx, y: r2, size: pk(76, 72), t: 524.0, dur: 2.6, colorAt: (k) => (k === 0 ? RED : k >= 4 ? GREEN : C.ink) });
      conj(A, 'study', 'studies', { x: lx, y: r3, size: pk(70, 66), t: 527.4, da: 0.5, tArrow: 528.45, tb: 528.95, db: 0.6, stack: v });
      A.text('vowel', { x: rx, y: r1, size: pk(60, 56), t: 531.4, dur: 0.6 });
      A.text('y', { x: rx - pk(90, 86), y: r2, size: pk(76, 72), t: 532.95, dur: 0.3, color: GREEN });
      A.text('+ s', { x: rx - pk(36, 34), y: r2, size: pk(76, 72), t: 534.4, dur: 0.45, color: GREEN, anchor: 'start' });
      conj(A, 'play', 'plays', { x: rx, y: r3, size: pk(70, 66), t: 535.5, da: 0.45, tArrow: 536.55, tb: 536.95, db: 0.5, stack: v });
      A.ar('كل الأفعال العادية', { x: pk(540, 760), y: pk(1330, 860), size: 62, t: 539.0, dur: 1.4 });
      Art.character(A, { kind: 'boy', x: pk(840, 1700), y: pk(1760, 1010), scale: pk(0.65, 0.5), t: 540.5, dur: 0.9, keys: [{ t: 543.2, ...Art.P.cheer }] });
      A.text('+ s', { x: pk(540, 1150), y: pk(1380, 790), size: 110, t: 542.7, dur: 0.45, color: GREEN });
    });

    // ================================================================ S23 remember; practise
    scene('S23', { move: 'right', panDur: 0.9 }, (A) => {
      const cx = pk(540, 520);
      A.text('he · she · it', { x: cx, y: pk(260, 80), size: pk(84, 80), t: 545.9, dur: 1.5, color: GREEN });
      A.text('Present Simple', { x: cx, y: pk(420, 220), size: pk(84, 80), t: 548.3, dur: 1.3 });
      conj(A, 'have', 'has', { x: cx, y: pk(600, 380), size: pk(120, 110), t: 552.05, da: 0.5, tArrow: 552.95, tb: 553.4, db: 0.45 });
      A.text('s · es', { x: cx, y: pk(820, 570), size: pk(100, 90), t: 557.5, dur: 1.0, color: GREEN });
      notebook(A, { x: pk(300, 1350), y: pk(1120, 250), s: 1.0, t: 560.5, dur: 0.8 });
      A.ar('جرّبوا على كلمات جديدة', { x: pk(560, 1350), y: pk(1350, 480), size: 56, t: 561.45, dur: 1.6, color: GREEN });
      Art.character(A, { kind: 'boy', x: pk(300, 1200), y: pk(1760, 1010), scale: pk(0.7, 0.5), t: 564.3, dur: 0.95, keys: [{ t: 566.6, ...Art.P.cheer }, { t: 567.3, ...Art.P.cheer, dy: 0 }, { t: 568.0, ...Art.P.cheer }] });
      Art.character(A, { kind: 'girl', x: pk(780, 1600), y: pk(1760, 1010), scale: pk(0.7, 0.5), t: 565.3, dur: 0.95, keys: [{ t: 566.8, ...Art.P.wave }, { t: 567.5, ...Art.P.waveL }, { t: 568.2, ...Art.P.wave }] });
      Art.star(A, { x: pk(150, 980), y: pk(1450, 700), s: 1.0, t: 566.35, dur: 0.25 });
      Art.star(A, { x: pk(930, 1820), y: pk(1450, 650), s: 0.9, t: 566.7, dur: 0.25 });
      camTo(566.0, 568.6, { ...home(), z: 0.97 });
    });


    E.finalize();
  };
})(window);
