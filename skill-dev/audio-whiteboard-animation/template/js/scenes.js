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
    // SCENES — one scene() call per STORYBOARD entry, in order.
    // Every time below must come from the measured transcript.
    // The demo scene shows the typical pattern; replace it.
    // ================================================================

    scene('S01', {}, (A, d) => {
      const t = d.start;
      Art.character(A, { kind: 'girl', x: pk(300, 420), y: pk(1330, 960), scale: pk(0.95, 0.9), t: t + 0.1, dur: 1.4,
        keys: [{ t: t + 2.0, ...Art.P.wave }, { t: t + 4.0, mouth: 'smile', aR: [14, 8] }] });
      Art.bubble(A, { x: pk(70, 120), y: pk(280, 90), w: pk(940, 860), h: pk(260, 230), tx: pk(250, 360), ty: pk(700, 450), t: t + 1.6, dur: 0.7 });
      say(A, 'HELLO! THIS IS A DEMO.', { x: pk(540, 550), y: pk(340, 150), size: pk(70, 66), maxW: pk(820, 780), t: t + 2.4, dur: 1.6, marks: { DEMO: C.green } });
      Art.character(A, { kind: 'boy', x: pk(780, 1500), y: pk(1330, 960), scale: pk(0.95, 0.9), t: t + 4.2, dur: 1.4, keys: [{ t: t + 6.0, ...Art.P.cheer }] });
      A.ar('مثال تجريبي', { x: pk(540, 960), y: pk(1560, 760), size: 60, t: t + 5.8, dur: 0.9, color: C.green });
    });

    E.finalize();
  };
})(window);
