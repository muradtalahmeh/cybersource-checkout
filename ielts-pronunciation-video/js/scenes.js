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
          const re = new RegExp(`(^|[^A-Z'])(${w.replace(/[.?]/g, '\\$&')})(?![A-Z'])`);
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
          const okL = i === 0 || !/[A-Z']/.test(str[i - 1]);
          const okR = i + word.length >= str.length || !/[A-Z']/.test(str[i + word.length]);
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
        const ra = A.text(a, { x: o.x, y: o.y, size, t: o.t, dur: o.da });
        const y1 = o.y + size + 30, y2 = y1 + size * 1.1;
        A.arrow(o.x, y1, o.x, y2, { t: ra.end + 0.08, dur: 0.25, bend: 0.06, head: size * 0.25, w: 8, color: C.green });
        const nb = b.length, ending = o.ending ?? 0;
        const rb = A.text(b, { x: o.x, y: y2 + 30, size, t: o.tb, dur: o.db, colorAt: (k) => (k >= nb - ending ? C.green : o.colorB || C.ink) });
        ra.str = a; rb.str = b;
        return { ra, rb, end: rb.end };
      }
      const wa = PF.measure(a, size), wb = PF.measure(b, size), aw = size * 1.2, gap = size * 0.35;
      const total = wa + gap * 2 + aw + wb;
      const x0 = o.x - total / 2;
      const ra = A.text(a, { x: x0, y: o.y, size, t: o.t, dur: o.da, anchor: 'start' });
      const ay = o.y + size / 2;
      const ar = A.arrow(x0 + wa + gap, ay, x0 + wa + gap + aw, ay, { t: o.tArrow ?? ra.end + 0.08, dur: 0.22, bend: 0.05, head: size * 0.28, w: 7, color: C.green });
      const nb = b.length;
      const ending = o.ending ?? 0;
      const rb = A.text(b, { x: x0 + wa + gap * 2 + aw, y: o.y, size, t: o.tb ?? ar.end + 0.08, dur: o.db, anchor: 'start', colorAt: (k) => (k >= nb - ending ? C.green : o.colorB || C.ink) });
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
        const r = Art.box(A, { x, y: o.y, w: bw, h: o.h, t: cur, dur: o.bdur ?? 0.38, color: L.color });
        cur = r.end + 0.04;
        if (i < n - 1 && o.plus !== false) {
          const px = x + bw + gap / 2, py = o.y + o.h / 2;
          A.path(`M${px - 9} ${py} L${px + 9} ${py} M${px} ${py - 9} L${px} ${py + 9}`, { t: cur, dur: 0.12, w: 5 });
          cur += 0.16;
        }
        out.push({ x, y: o.y, w: bw, h: o.h, cx: x + bw / 2, cy: o.y + o.h / 2 });
      });
      labels.forEach((L, i) => {
        const b = out[i];
        if (L.t == null) return;
        if (L.en) b.label = A.text(L.en, { x: b.cx, y: b.cy - (o.en ?? 46) / 2, size: o.en ?? 46, t: L.t, dur: L.dur ?? 0.6, color: L.color });
        if (L.ar) b.label = A.ar(L.ar, { x: b.cx, y: b.cy + (o.ar ?? 40) * 0.38, size: o.ar ?? 40, t: L.t, dur: L.dur ?? 0.7, color: L.color, wGuess: b.w * 0.8 });
      });
      return { boxes: out, end: cur };
    }
    // ================================================================
    // SCENES — pronunciation challenge. One page (no camera moves): the
    // header, the score dots and the learner persist; each word card is
    // wiped by the hand before the next word.
    // ================================================================
    const RED = C.red, GREEN = C.green;
    const L = {
      head: [pk(560, 960), pk(330, 112)], headSize: pk(60, 56),
      flame: [pk(85, 1440), pk(290, 70)],
      dotsY: pk(450, 196), dotGap: pk(92, 74),
      wordY: pk(570, 262), wordMaxW: pk(960, 1250), wordMax: pk(160, 140),
      rowX: pk(150, 470), textX: pk(590, 960),
      wrongY: pk(900, 560), okY: pk(1080, 700),
      erase: pk([20, 540, 1040, 600], [300, 250, 1320, 500]),
      boy: [pk(540, 1660), pk(1760, 1010), pk(1.0, 0.6)],
      arBad: pk(78, 60), arOk: pk(92, 70), mark: pk(72, 60),
    };
    const PS = PF.SPACING;
    const chars = (res, word, from, n) => {
      const sz = res.size;
      const x = res.x + (from ? PF.measure(word.slice(0, from), sz) + PS * sz / 100 : 0);
      const w = PF.measure(word.slice(from, from + n), sz);
      return { x, w, y: res.y, h: sz, cx: x + w / 2, cy: res.y + sz / 2 };
    };
    const arWidth = (r, fallback) => { try { const b = r.text.getBBox(); return b.width > 0 ? b : null; } catch (e) { return null; } };
    let page;

    const WORDS = [
      { id: 'S02', w: 'ENTREPRENEUR', write: [2.36, 0.72], bad: 'إنتر برنجر', badT: [3.1, 0.22], no: 3.36, flame: true,
        okT: 4.05, ok: 'أونْتْرَبْرَنير', okA: [4.2, 0.85], mark: { kind: 'under', from: 8, n: 4, t: 5.08 }, dot: 5.16, erase: 5.32 },
      { id: 'S03', w: 'COLLEAGUE', write: [5.88, 0.85], bad: 'كولاج', badT: [6.9, 0.7], no: 7.65,
        okT: 8.4, ok: 'كُولِيغ', okA: [8.58, 0.62], mark: { kind: 'slash', from: 7, n: 2, t: 9.22 }, dot: 9.36, erase: 9.46 },
      { id: 'S04', w: 'SCHEDULE', write: [9.98, 0.8], bad: 'سكتشول', badT: [11.0, 0.62], no: 11.92,
        okT: 12.6, ok: 'سْكِجُول', okA: [12.8, 0.6], mark: { kind: 'ring', from: 0, n: 3, t: 13.42 }, dot: 13.58, erase: 13.66 },
      { id: 'S05', w: 'DEVELOP', write: [14.08, 0.6], bad: 'دفلوب', badT: [14.72, 0.3], no: 15.3,
        okT: 15.75, ok: 'دِڤِيلَب', okA: [15.95, 0.55], mark: { kind: 'under', from: 2, n: 3, t: 16.52 }, dot: 16.68, erase: 16.76 },
      { id: 'S06', w: 'CLIENT', write: [17.27, 0.55], bad: 'كلينت', badT: [17.86, 0.45], no: 18.55,
        okT: 19.05, ok: 'كْلايِنْت', okA: [19.27, 0.55], mark: { kind: 'ring', from: 2, n: 1, t: 19.86 }, dot: 20.0, erase: 20.08 },
      { id: 'S07', w: 'VEHICLE', write: [20.6, 0.55], bad: 'ڤيهيكل', badT: [21.17, 0.65], no: 22.2, slashH: 22.52,
        okT: 22.68, ok: 'ڤِيِكِل', okA: [22.82, 0.7], mark: { kind: 'under', from: 0, n: 2, t: 24.02 }, dot: 24.26 },
    ];

    // learner's reactions for every word, built once for the whole video
    const boyKeys = [{ t: 2.45, brows: 1, mouth: 'smile' }];
    WORDS.forEach((k, i) => {
      boyKeys.push({ t: k.badT[0], mouth: 'talk', head: -6, aR: [40, -20], brows: 0, dur: 0.25 });
      boyKeys.push({ t: k.no + 0.05, ...Art.P.shrug, mouth: 'frown', brows: -0.6, dur: 0.25 });
      if (i < WORDS.length - 1) {
        boyKeys.push({ t: k.okA[0] + 0.25, ...Art.P.pointUp, mouth: 'grin', eyes: 'happy', dur: 0.3 });
        boyKeys.push({ t: k.dot + 0.3, mouth: 'smile', aR: [14, 8], aL: [14, 8], head: 0, brows: 0, dur: 0.3 });
      } else {
        boyKeys.push({ t: k.okA[0] + 0.25, ...Art.P.pointUp, mouth: 'grin', eyes: 'happy', dur: 0.3 });
        boyKeys.push({ t: 24.05, ...Art.P.cheer, dur: 0.3 });
        boyKeys.push({ t: 24.4, ...Art.P.cheer, dy: 0, dur: 0.2 });
        boyKeys.push({ t: 24.7, ...Art.P.cheer, dur: 0.2 });
      }
    });

    scene('S01', { scene: { keepUntil: Infinity } }, (A) => {
      page = A;
      A.ar('أتحداك تنطق هذي الكلمات صح', { x: L.head[0], y: L.head[1], size: L.headSize, t: 0.12, dur: 1.05 });
      Art.character(A, { kind: 'boy', x: L.boy[0], y: L.boy[1], scale: L.boy[2], t: 1.22, dur: 1.08, keys: boyKeys });
      // score dots outlines appear with the first card
    });

    let prevCard = null;
    WORDS.forEach((k, i) => {
      scene(k.id, { scene: { keepUntil: Infinity } }, (A) => {
        if (prevCard) A.erase(prevCard, ...L.erase, WORDS[i - 1].erase, WORDS[i - 1].erase === 13.66 ? 0.4 : 0.5);
        const card = A.group({});
        prevCard = card;
        if (i === 0) {
          // flame next to the heading + the 6 empty score dots, drawn in the pause after "لا"
          const [fx, fy] = L.flame, fs = pk(0.75, 0.6);
          const fl = `M${fx} ${fy + 50 * fs} C${fx - 40 * fs} ${fy + 30 * fs} ${fx - 30 * fs} ${fy - 20 * fs} ${fx} ${fy - 60 * fs} C${fx + 4 * fs} ${fy - 25 * fs} ${fx + 30 * fs} ${fy - 25 * fs} ${fx + 26 * fs} ${fy - 5 * fs} C${fx + 38 * fs} ${fy - 12 * fs} ${fx + 40 * fs} ${fy - 24 * fs} ${fx + 38 * fs} ${fy - 34 * fs} C${fx + 62 * fs} ${fy - 4 * fs} ${fx + 52 * fs} ${fy + 40 * fs} ${fx} ${fy + 50 * fs} Z`;
          const inner = `M${fx} ${fy + 42 * fs} C${fx - 18 * fs} ${fy + 30 * fs} ${fx - 12 * fs} ${fy + 8 * fs} ${fx + 2 * fs} ${fy - 8 * fs} C${fx + 14 * fs} ${fy + 10 * fs} ${fx + 22 * fs} ${fy + 28 * fs} ${fx} ${fy + 42 * fs} Z`;
          Art.fillShape(A, A.scene.g, fl, '#e8743b', 3.8, 0.25);
          Art.fillShape(A, A.scene.g, inner, '#f2c94c', 3.85, 0.25);
          A.draw([{ d: fl }, { d: inner, w: 4 }], { t: 3.62, dur: 0.32, w: 6 });
        }
        // the word, sized to fit
        const size = Math.min(L.wordMax, Math.floor(L.wordMaxW / PF.measure(k.w, 100) * 100));
        const word = A.text(k.w, { x: L.head[0], y: L.wordY, size, t: k.write[0], dur: k.write[1], parent: card });
        word.str = k.w;
        // the mistake (red) — revealed while it is said, struck on "لا"
        const bad = A.ar(k.bad, { x: L.textX, y: L.wrongY, size: L.arBad, t: k.badT[0], dur: k.badT[1], color: RED, parent: card });
        const bb = arWidth(bad) || { x: L.textX - 140, width: 280, y: L.wrongY - 50, height: 70 };
        const sy = bb.y + bb.height * 0.55;
        A.path(`M${bb.x - 20} ${sy + 6} Q${bb.x + bb.width / 2} ${sy - 8} ${bb.x + bb.width + 20} ${sy}`, { t: k.no, dur: 0.12, color: RED, w: 9, parent: card });
        A.cross(L.rowX - L.mark / 2, L.wrongY - L.mark * 0.95, L.mark, L.mark, { t: k.no + 0.15, dur: 0.08, parent: card });
        if (k.slashH) {
          const h = chars(word, k.w, 2, 1);
          A.path(`M${h.x - 8} ${h.y + h.h + 10} L${h.x + h.w + 8} ${h.y - 10}`, { t: k.slashH, dur: 0.12, color: RED, w: 10, parent: card });
        }
        // the correct pronunciation (green)
        A.check(L.rowX, L.okY - L.mark * 0.5, L.mark, { t: k.okT, dur: 0.14, parent: card });
        A.ar(k.ok, { x: L.textX, y: L.okY, size: L.arOk, t: k.okA[0], dur: k.okA[1], color: GREEN, parent: card });
        // the tricky part of the spelling
        const m = k.mark, b = chars(word, k.w, m.from, m.n);
        if (m.kind === 'under') A.underline(b.x - 4, b.x + b.w + 4, b.y + b.h + 16, { t: m.t, dur: m.t > 24 ? 0.2 : 0.14, color: GREEN, parent: card });
        if (m.kind === 'ring') A.loop(b.cx, b.cy, b.w / 2 + 16, b.h / 2 + 14, { t: m.t, dur: 0.16, color: GREEN, w: 7, parent: card });
        if (m.kind === 'slash') A.path(`M${b.x - 6} ${b.y + b.h + 12} L${b.x + b.w + 6} ${b.y - 12}`, { t: m.t, dur: 0.12, color: RED, w: 9, parent: card });
        // score: dot i fills
        const dx = L.head[0] + (i - 2.5) * L.dotGap, dy = L.dotsY;
        A.loop(dx, dy, pk(24, 20), pk(24, 20), { t: k.dot, dur: 0.08, color: GREEN, w: 6 });
        const f = Whiteboard.el('circle', { cx: dx, cy: dy, r: pk(22, 18), fill: GREEN }, A.scene.g);
        A.fade(f, k.dot + 0.08, 0.15);
        if (i === WORDS.length - 1) {
          Art.star(A, { x: pk(190, 1300), y: pk(1380, 860), s: 1.1, t: 24.42, dur: 0.18 });
          Art.star(A, { x: pk(890, 1880), y: pk(1440, 820), s: 0.9, t: 24.65, dur: 0.16 });
        }
      });
    });

    E.finalize();
  };
})(window);
