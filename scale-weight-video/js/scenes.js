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
    // SCENES — "why did the scale go up a kilo?" (9:16 Reels only)
    // ================================================================
    const RED = C.red, GREEN = C.green, WATER = '#7fb3d5', FAT = '#f2dfa7';
    const G = (A, x, y, s, parent) => A.group({ transform: `translate(${x} ${y}) scale(${s})` }, parent);

    // bathroom scale (front-top view); returns the display centre
    function scaleProp(A, o) {
      const g = G(A, o.x, o.y, o.s, o.parent);
      const top = 'M-150 -70 L150 -70 Q170 -70 176 -50 L196 40 L-196 40 L-176 -50 Q-170 -70 -150 -70 Z';
      const front = 'M-196 40 L196 40 L196 74 Q196 86 184 86 L-184 86 Q-196 86 -196 74 Z';
      const disp = 'M-62 -52 L62 -52 L66 -14 L-66 -14 Z';
      Art.fillShape(A, g, top, '#ece4d4', o.t + 0.4); Art.fillShape(A, g, front, '#d9cdb6', o.t + 0.4); Art.fillShape(A, g, disp, '#dfeee5', o.t + 0.5);
      A.draw([{ d: top, parent: g }, { d: front, parent: g }, { d: disp, parent: g, w: 5 },
        { d: 'M-120 0 C-120 -22 -70 -22 -70 0 C-70 22 -120 22 -120 0 M70 0 C70 -22 120 -22 120 0 C120 22 70 22 70 0', parent: g, w: 4, color: '#8a7a62' }],
        { t: o.t, dur: o.dur, w: 6, lenScale: o.s });
      return { x: o.x, y: o.y - 33 * o.s, g };
    }
    function fatBlock(A, o) {
      const g = G(A, o.x, o.y, o.s, o.parent);
      const d = 'M-90 -60 C-125 -62 -135 -18 -112 8 C-134 40 -104 72 -62 66 L62 66 C104 72 134 40 112 8 C135 -18 125 -62 90 -60 Z';
      Art.fillShape(A, g, d, FAT, o.t + 0.35);
      A.draw([{ d, parent: g }, { d: 'M-60 -30 Q-40 -42 -20 -30 M20 30 Q40 18 60 30', parent: g, w: 4, color: '#b59a55' }], { t: o.t, dur: o.dur, w: 6, lenScale: o.s });
      return g;
    }
    function drop(A, o) {
      const g = G(A, o.x, o.y, o.s, o.parent);
      const d = 'M0 -34 C10 -14 24 0 24 14 C24 28 13 36 0 36 C-13 36 -24 28 -24 14 C-24 0 -10 -14 0 -34 Z';
      Art.fillShape(A, g, d, WATER, o.t + 0.15, 0.3);
      return A.draw([{ d, parent: g }, { d: 'M-10 16 Q-10 26 0 28', parent: g, w: 3, color: '#ffffff' }], { t: o.t, dur: o.dur, w: 5, lenScale: o.s });
    }
    function heart(A, o) {
      const g = G(A, o.x, o.y, o.s, o.parent);
      const d = 'M0 26 C-46 -6 -36 -50 0 -24 C36 -50 46 -6 0 26 Z';
      Art.fillShape(A, g, d, '#d9776a', o.t + 0.2, 0.3);
      return A.draw([{ d, parent: g }], { t: o.t, dur: o.dur, w: 6, lenScale: o.s });
    }
    function wall(A, o) {
      const g = G(A, o.x, o.y, o.s, o.parent);
      const d = 'M-50 -110 L50 -110 L50 110 L-50 110 Z';
      Art.fillShape(A, g, d, '#c98d6a', o.t + 0.3);
      return A.draw([{ d, parent: g }, { d: 'M-50 -55 L50 -55 M-50 0 L50 0 M-50 55 L50 55 M0 -110 L0 -55 M-25 -55 L-25 0 M25 -55 L25 0 M0 0 L0 55 M-25 55 L-25 110 M25 55 L25 110', parent: g, w: 4 }], { t: o.t, dur: o.dur, w: 6, lenScale: o.s });
    }
    function screen(A, o) {
      const g = G(A, o.x, o.y, o.s, o.parent);
      const d = 'M-240 -140 L240 -140 Q260 -140 260 -120 L260 120 Q260 140 240 140 L-240 140 Q-260 140 -260 120 L-260 -120 Q-260 -140 -240 -140 Z';
      Art.fillShape(A, g, d, '#fffaf0', o.t + 0.3);
      const play = 'M-32 -40 L44 0 L-32 40 Z';
      Art.fillShape(A, g, play, RED, o.t + 0.5, 0.3);
      A.draw([{ d, parent: g }, { d: play, parent: g, color: RED }], { t: o.t, dur: o.dur, w: 6, lenScale: o.s });
      return g;
    }
    function envelope(A, o) {
      const g = G(A, o.x, o.y, o.s, o.parent);
      const d = 'M-80 -52 L80 -52 L80 52 L-80 52 Z';
      Art.fillShape(A, g, d, '#fffaf0', o.t + 0.3);
      return A.draw([{ d, parent: g }, { d: 'M-80 -52 L0 12 L80 -52', parent: g }], { t: o.t, dur: o.dur, w: 6, lenScale: o.s });
    }

    // ---------------------------------------------------------------- S01
    scene('S01', {}, (A) => {
      camTo(0.2, 7.9, { ...home(), z: 1.03 });
      const sc = scaleProp(A, { x: 540, y: 1060, s: 1.6, t: 0.1, dur: 1.25 });
      A.text('+1', { x: 740, y: 520, size: 190, t: 1.4, dur: 0.4, color: RED });
      A.ar('كيلو', { x: 400, y: 680, size: 110, t: 1.85, dur: 0.4, color: RED });
      A.text('!', { x: 930, y: 470, size: 170, t: 2.3, dur: 0.25, color: RED });
      A.arrow(560, 760, 545, sc.y - 70, { t: 2.6, dur: 0.3, bend: 0.1, color: RED, w: 7 });
      Art.character(A, { kind: 'girl', x: 290, y: 1760, scale: 0.85, t: 2.95, dur: 1.2,
        keys: [{ t: 4.3, ...Art.P.shrug, mouth: 'frown' }, { t: 6.7, mouth: 'smile', aL: [14, 8], aR: [14, 8], head: 0, brows: 0 }, { t: 7.4, ...Art.P.wave }] });
      [[170, 1300, 90], [430, 1330, 70]].forEach(([x, y, s], i) => A.text('?', { x, y, size: s, t: 4.25 + i * 0.25, dur: 0.22, color: '#8a7a62' }));
      A.ar('بدون أي قلق', { x: 740, y: 1470, size: 72, t: 6.7, dur: 1.0, color: GREEN });
      A.underline(560, 920, 1500, { t: 7.72, dur: 0.25, color: GREEN });
    });

    // ---------------------------------------------------------------- S02
    scene('S02', { move: 'right', panDur: 0.9 }, (A) => {
      fatBlock(A, { x: 540, y: 520, s: 1.6, t: 9.0, dur: 0.85 });
      A.text('1', { x: 540, y: 470, size: 110, t: 9.9, dur: 0.2 });
      A.ar('كيلو دهون', { x: 540, y: 760, size: 80, t: 10.15, dur: 0.85 });
      Art.character(A, { kind: 'girl', x: 230, y: 1760, scale: 0.78, t: 11.05, dur: 1.2,
        keys: [{ t: 13.3, ...Art.P.point }, { t: 16.6, mouth: 'smile', aL: [14, 8], aR: [14, 8] }] });
      A.text('+7000 - 7800', { x: 540, y: 900, size: 116, t: 12.85, dur: 2.2, colorAt: (k) => (k === 0 ? RED : C.ink) });
      A.ar('سعرة حرارية', { x: 540, y: 1150, size: 72, t: 15.15, dur: 0.75 });
      A.arrow(990, 850, 790, 545, { t: 15.95, dur: 0.4, bend: 0.12, color: RED, w: 7 });
      A.ar('زيادة فوق احتياجك اليومي', { x: 540, y: 1320, size: 60, t: 16.4, dur: 1.5, color: GREEN });
      A.underline(250, 830, 1350, { t: 17.92, dur: 0.22, color: GREEN });
    });

    // ---------------------------------------------------------------- S03
    const s03 = scene('S03', { move: 'down', panDur: 0.9 }, (A) => {
      const eq = A.group({}); shared.eq = eq; const plates = A.group({}); shared.plates = plates;
      A.ar('احتياجك اليومي', { x: 540, y: 290, size: 60, t: 19.15, dur: 0.75, parent: eq });
      A.text('2000', { x: 540, y: 330, size: 120, t: 19.95, dur: 0.55, parent: eq });
      A.text('+ 7000 - 7800', { x: 540, y: 520, size: 96, t: 20.6, dur: 1.2, parent: eq, colorAt: (k) => (k === 0 ? RED : C.ink) });
      A.path('M150 670 L930 670', { t: 21.9, dur: 0.25, w: 7, parent: eq });
      A.text('= 9000 - 9800', { x: 540, y: 710, size: 112, t: 22.25, dur: 2.35, color: GREEN, parent: eq });
      A.ar('في يوم واحد!', { x: 540, y: 960, size: 88, t: 24.75, dur: 0.8, color: RED, parent: eq });
      A.loop(540, 925, 270, 75, { t: 25.6, dur: 0.4, color: RED, w: 7, parent: eq });
      Art.food(A, { x: 300, y: 1290, s: 1.0, t: 26.05, dur: 0.55, parent: plates });
      Art.food(A, { x: 780, y: 1290, s: 1.0, t: 26.65, dur: 0.55, parent: plates });
      Art.food(A, { x: 540, y: 1180, s: 1.0, t: 27.25, dur: 0.55, parent: plates });
    });

    // ---------------------------------------------------------------- S04 (same page: wipe the equation, keep the plates)
    scene('S04', { scene: { showFrom: 28.01 } }, (A) => {
      s03.keepUntil = SB.S05.start + 2;
      A.erase(shared.eq, 60, 200, 960, 900, 28.05, 0.55);
      Art.character(A, { kind: 'girl', x: 230, y: 1760, scale: 0.78, t: 28.65, dur: 1.15,
        keys: [{ t: 30.0, ...Art.P.think }, { t: 32.15, ...Art.P.no, dur: 0.3 }, { t: 32.55, ...Art.P.no, head: 8 }, { t: 32.95, ...Art.P.no, head: -8 }, { t: 33.4, mouth: 'flat', aR: [14, 8], head: 0, brows: 1 }] });
      A.ar('كل هالسعرات بيوم واحد؟', { x: 540, y: 470, size: 68, t: 29.85, dur: 1.4 });
      A.text('?', { x: 540, y: 560, size: 170, t: 31.3, dur: 0.35, color: '#8a7a62' });
      A.cross(180, 1080, 720, 330, { t: 32.0, dur: 0.12 });
      A.ar('أكيد لا', { x: 540, y: 880, size: 92, t: 32.35, dur: 0.5, color: RED });
      const sc = scaleProp(A, { x: 760, y: 1700, s: 0.9, t: 33.0, dur: 0.85 });
      A.text('?', { x: sc.x, y: sc.y - 52, size: 60, t: 33.9, dur: 0.25, color: RED });
      camTo(33.1, 34.5, local(600, 1200, 1.1));
    });

    // ---------------------------------------------------------------- S05
    scene('S05', { move: 'right', panDur: 0.9 }, (A) => {
      const sc = scaleProp(A, { x: 540, y: 760, s: 1.3, t: 35.3, dur: 0.95 });
      A.text('+1', { x: 860, y: 430, size: 110, t: 36.3, dur: 0.3, color: RED });
      [[400, 450, 1.3], [540, 380, 1.5], [680, 450, 1.3]].forEach(([x, y, s], i) => drop(A, { x, y, s, t: 36.7 + i * 0.27, dur: 0.24 }));
      A.ar('مَيّ وسوائل محبوسة', { x: 540, y: 1030, size: 72, t: 37.6, dur: 1.35, color: '#2c6f99' });
      fatBlock(A, { x: 290, y: 1230, s: 0.9, t: 39.3, dur: 0.55 });
      A.cross(190, 1170, 200, 130, { t: 39.9, dur: 0.1 });
      A.ar('مش دهون', { x: 720, y: 1270, size: 80, t: 40.2, dur: 0.6, color: RED });
      heart(A, { x: 900, y: 1500, s: 1.3, t: 41.3, dur: 0.4 });
      Art.character(A, { kind: 'girl', x: 300, y: 1760, scale: 0.78, t: 42.6, dur: 1.3,
        keys: [{ t: 44.2, mouth: 'smile', eyes: 'happy' }, { t: 47.3, ...Art.P.cheer }, { t: 47.9, ...Art.P.cheer, dy: 0 }] });
      A.ar('لا تحتاري ولا تقلقي', { x: 560, y: 1400, size: 66, t: 45.4, dur: 1.5, color: GREEN });
    });

    // ---------------------------------------------------------------- S06
    scene('S06', { move: 'down', panDur: 0.9 }, (A) => {
      A.path('M150 330 L150 880 L950 880', { t: 49.4, dur: 0.5, w: 7 });
      A.ar('طبيعي', { x: 540, y: 300, size: 84, t: 49.95, dur: 0.55, color: GREEN });
      const pts = [[190, 640], [290, 560], [390, 700], [490, 600], [590, 720], [690, 580], [790, 680], [890, 620]];
      A.path('M' + pts.map((p) => p.join(' ')).join(' L'), { t: 50.6, dur: 2.4, w: 7, color: GREEN });
      Art.character(A, { kind: 'girl', x: 250, y: 1760, scale: 0.78, t: 53.05, dur: 0.85,
        keys: [{ t: 56.2, ...Art.P.shrug, mouth: 'frown' }] });
      A.check(900, 400, 80, { t: 53.95, dur: 0.3 });
      A.path('M150 1250 L700 1250', { t: 54.6, dur: 0.7, w: 8 });
      wall(A, { x: 780, y: 1200, s: 1.0, t: 55.35, dur: 0.9 });
      A.ar('ثابت', { x: 420, y: 1200, size: 80, t: 56.35, dur: 0.5, color: RED });
      A.text('?', { x: 860, y: 1360, size: 100, t: 56.95, dur: 0.3, color: '#8a7a62' });
    });

    // ---------------------------------------------------------------- S07
    scene('S07', { move: 'right', panDur: 0.7 }, (A) => {
      Art.bubble(A, { x: 300, y: 260, w: 480, h: 190, tx: 520, ty: 560, t: 58.6, dur: 0.45 });
      A.ar('حاجز', { x: 540, y: 395, size: 96, t: 59.1, dur: 0.5, color: GREEN });
      Art.phone(A, { x: 540, y: 760, s: 2.2, t: 59.65, dur: 0.65 });
      A.ar('فيديو مجاني', { x: 540, y: 1060, size: 70, t: 60.4, dur: 0.9 });
      screen(A, { x: 540, y: 1330, s: 1.0, t: 61.6, dur: 0.8 });
      A.path('M330 1400 L520 1400', { t: 62.45, dur: 0.3, w: 7, color: C.ink });
      wall(A, { x: 600, y: 1360, s: 0.45, t: 62.8, dur: 0.45 });
      A.arrow(520, 1400, 760, 1230, { t: 63.3, dur: 0.45, bend: -0.2, color: GREEN, w: 8 });
      Art.character(A, { kind: 'girl', x: 880, y: 1790, scale: 0.6, t: 63.9, dur: 1.2,
        keys: [{ t: 65.4, mouth: 'smile' }, { t: 70.9, ...Art.P.cheer }, { t: 71.6, ...Art.P.cheer, dy: 0 }, { t: 72.2, ...Art.P.cheer }] });
      A.loop(540, 360, 140, 70, { t: 67.4, dur: 0.45, color: GREEN, w: 7 });
      envelope(A, { x: 200, y: 760, s: 1.0, t: 69.4, dur: 0.6 });
      A.arrow(410, 760, 300, 760, { t: 70.1, dur: 0.3, bend: 0.05, color: GREEN, w: 7 });
      A.ar('على الخاص', { x: 200, y: 900, size: 54, t: 70.7, dur: 0.7, color: GREEN });
      Art.star(A, { x: 160, y: 1480, s: 1.0, t: 71.5, dur: 0.25 });
      Art.star(A, { x: 940, y: 300, s: 0.8, t: 71.8, dur: 0.25 });
      camTo(70.4, 72.6, { ...home(), z: 0.97 });
    });

    E.finalize();
  };
})(window);
