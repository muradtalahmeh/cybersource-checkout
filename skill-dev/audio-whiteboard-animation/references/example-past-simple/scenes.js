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

    // ================================================================ S01
    scene('S01', {}, (A) => {
      // slow push-in over the hook
      camTo(0.2, 12.4, { ...home(), z: 1.04 });
      const girl = Art.character(A, {
        kind: 'girl', x: pk(290, 400), y: pk(1330, 960), scale: pk(0.95, 0.92), t: 0.1, dur: 1.45,
        keys: [{ t: 2.5, ...Art.P.ask }, { t: 4.4, mouth: 'smile' }, { t: 9.6, mouth: 'smile', aR: [14, 8], head: 4 }],
      });
      const bub = Art.bubble(A, { x: pk(70, 110), y: pk(260, 70), w: pk(940, 860), h: pk(300, 250), tx: pk(300, 420), ty: pk(890, 560), t: 1.62, dur: 0.75 });
      const q = say(A, 'WHAT DID YOU DO YESTERDAY?', { x: pk(540, 540), y: pk(320, 120), size: pk(72, 66), maxW: pk(820, 780), t: 2.45, dur: 1.75, marks: { DID: C.green } });
      const boy = Art.character(A, {
        kind: 'boy', x: pk(790, 1520), y: pk(1330, 960), scale: pk(0.95, 0.92), t: 4.3, dur: 1.55,
        keys: [{ t: 6.6, ...Art.P.think }, { t: 9.3, mouth: 'talk', aR: [40, -10], head: 0 }, { t: 10.6, mouth: 'smile' }],
      });
      const th = Art.thought(A, { x: pk(520, 1030), y: pk(600, 80), w: pk(470, 560), h: pk(330, 330), tx: pk(760, 1480), ty: pk(940, 590), t: 5.95, dur: 0.75 });
      const tvx = pk(720, 1270), tvy = pk(770, 250);
      Art.tv(A, { x: tvx, y: tvy, s: pk(0.62, 0.62), on: true, t: 6.75, dur: 1.1 });
      Art.popcorn(A, { x: pk(890, 1470), y: pk(780, 270), s: 0.7, t: 7.9, dur: 0.6 });
      const ans = say(A, 'I WATCHED A MOVIE.', { x: pk(540, 960), y: pk(1440, 520), size: pk(76, 66), maxW: pk(960, 1000), t: 9.3, dur: 1.25, marks: { '@7': C.green, '@8': C.green } });
      A.ar('حضرت فيلم', { x: pk(540, 960), y: pk(1590, 680), size: 58, t: 11.0, dur: 0.9, color: C.green });
      shared.answer = ans;
      // S02 continues here: close-up on WATCHED
      const wb = find(ans, 'WATCHED');
      camTo(12.9, 13.6, local(pk(540, 960), wb.cy + pk(110, 120), pk(1.22, 1.5)));
      ring(A, { cx: wb.x + wb.w - PF.measure('ED', ans.lines[0].size) / 2 + 2, cy: wb.cy, w: PF.measure('ED', ans.lines[0].size), h: wb.h }, 13.7, { pad: 18, padY: 22, dur: 0.6, color: C.red });
      const watchQ = A.text('WATCH ?', { x: wb.cx, y: wb.y + wb.h + pk(150, 190), size: 64, t: 15.75, dur: 1.1 });
      shared.watchQ = watchQ;
    });

    // ================================================================ S02
    // the camera stays on the S01 close-up until 17.25, then pans
    scene('S02', { move: 'right', panDur: 1.0, panAt: 17.25 }, (A, d) => {
      E.scenes[0].keepUntil = 18.6;
      Art.bulb(A, { x: pk(540, 360), y: pk(560, 330), s: pk(1.5, 1.4), t: 18.3, dur: 1.1 });
      const boy = Art.character(A, { kind: 'boy', x: pk(540, 380), y: pk(1720, 1010), scale: pk(0.8, 0.62), t: 19.5, dur: 1.6, keys: [{ t: 23.3, ...Art.P.cheer }, { t: 24.3, ...Art.P.cheer, dy: 0 }, { t: 24.9, ...Art.P.cheer, dy: -14 }] });
      const title = A.text('PAST SIMPLE', { x: pk(540, 1150), y: pk(800, 290), size: pk(128, 150), t: 21.25, dur: 1.9 });
      A.ar('الماضي البسيط', { x: pk(540, 1150), y: pk(1150, 640), size: pk(92, 100), t: 23.4, dur: 1.2, color: C.green });
      const uy = pk(800, 290) + pk(128, 150) + 34;
      const ux0 = pk(540, 1150) - title.w / 2, ux1 = pk(540, 1150) + title.w / 2;
      A.path(`M${ux0} ${uy} Q${(ux0 + ux1) / 2} ${uy + 12} ${ux1} ${uy - 4}`, { t: 24.65, dur: 0.3, color: C.green, w: 9 });
      A.path(`M${ux0 + 30} ${uy + 22} Q${(ux0 + ux1) / 2} ${uy + 32} ${ux1 - 30} ${uy + 18}`, { t: 24.98, dur: 0.3, color: C.green, w: 7 });
    });

    // ================================================================ S03
    const s03 = scene('S03', { move: 'down', panDur: 1.0 }, (A) => {
      const g = A.group({});
      shared.s03 = g;
      const ty = pk(470, 230), x0 = pk(70, 120), x1 = pk(1010, 1800), nowX = pk(880, 1600);
      A.path(`M${x0} ${ty} L${x1} ${ty}`, { t: 26.4, dur: 0.7, w: 8, parent: g });
      A.path(`M${x1 - 34} ${ty - 22} L${x1} ${ty} L${x1 - 34} ${ty + 22}`, { t: 27.12, dur: 0.18, w: 8, parent: g });
      A.path(`M${nowX} ${ty - 34} L${nowX} ${ty + 34}`, { t: 27.35, dur: 0.15, w: 8, color: C.green, parent: g });
      A.text('NOW', { x: nowX, y: ty - 110, size: 54, t: 27.55, dur: 0.55, color: C.green, parent: g });
      A.text('PAST', { x: pk(330, 640), y: ty - 110, size: 54, t: 28.65, dur: 0.6, parent: g });
      // finished event in the past
      const ex = pk(560, 1100);
      const dot = A.loop(ex, ty, 16, 16, { t: 29.6, dur: 0.3, w: 8, color: C.green, parent: g });
      const dotFill = Whiteboard.el('circle', { cx: ex, cy: ty, r: 15, fill: C.green }, g); A.fade(dotFill, 29.9, 0.2);
      A.check(ex, ty - 70, 50, { t: 32.1, dur: 0.35, parent: g });
      // time labels named in the narration
      const lab = [['YESTERDAY', pk(720, 1350), 34.0], ['LAST WEEK', pk(440, 900), 35.3], ['A YEAR AGO', pk(180, 450), 36.6]];
      lab.forEach(([s, x, t], i) => {
        A.path(`M${x} ${ty - 16} L${x} ${ty + 16}`, { t, dur: 0.1, w: 6, parent: g });
        A.text(s, { x, y: ty + 40 + (v && i === 1 ? 56 : 0), size: pk(36, 40), t: t + 0.12, dur: 0.75, parent: g });
      });
      // "any time in the past": arrow sweeping back
      A.arrow(pk(820, 1500), ty + pk(190, 140), pk(110, 180), ty + pk(190, 140), { t: 38.0, dur: 0.75, bend: -0.04, color: C.green, w: 7, parent: g });
      // calendar with yesterday circled
      const cal = Art.calendar(A, { x: pk(250, 380), y: pk(940, 680), s: pk(0.95, 0.95), t: 38.95, dur: 0.95, parent: g });
      const cell = cal.cell(6);
      A.loop(cell.x, cell.y, 30, 26, { t: 39.95, dur: 0.35, color: C.red, w: 6, parent: g });
      // the boy plays football
      const boy = Art.character(A, { kind: 'boy', x: pk(690, 960), y: pk(1330, 1010), scale: pk(0.82, 0.62), t: 40.3, dur: 1.15, parent: g, keys: [{ t: 42.3, ...Art.P.kick, dur: 0.35 }, { t: 43.4, mouth: 'grin', eyes: 'happy', aL: [40, 10], aR: [40, 10] }] });
      const ball = Art.ball(A, { x: pk(830, 1080), y: pk(1300, 990), s: 0.9, t: 41.48, dur: 0.3, parent: g });
      A.anim((t) => {
        const k = Math.max(0, Math.min(1, (t - 42.35) / 0.8));
        const e = 1 - Math.pow(1 - k, 2);
        ball.g.setAttribute('transform', `translate(${(pk(830, 1080) + e * pk(150, 260)).toFixed(1)} ${(pk(1300, 990) - Math.sin(k * Math.PI) * 140 - e * 40).toFixed(1)}) rotate(${(k * 540).toFixed(0)}) scale(0.9)`);
      });
      const sent = say(A, 'I PLAYED FOOTBALL YESTERDAY.', { x: pk(540, 1460), y: pk(1420, 520), size: pk(64, 52), maxW: pk(940, 780), t: 41.8, dur: 1.95, marks: { PLAYED: C.green }, parent: g });
      A.ar('لعبت كرة القدم مبارح', { x: pk(540, 1460), y: pk(1680, 770), size: 50, t: 44.3, dur: 1.4, parent: g });
      // connect the example to YESTERDAY on the timeline
      const yb = find(sent, 'YESTERDAY');
      A.arrow(yb.cx, yb.y - 20, pk(735, 1350), ty + 100, { t: 45.85, dur: 0.6, bend: pk(-0.25, 0.2), color: C.green, w: 6, parent: g });
    });

    // ================================================================ S04 (erase S03 in place)
    scene('S04', { scene: { showFrom: 47.1 } }, (A) => {
      s03.keepUntil = 48.6;
      A.erase(shared.s03, pk(0, 0), pk(80, 60), W, H - pk(200, 100), 47.15, 1.15);
      // stacked on 9:16 so the words stay large
      const p = pair(A, 'PLAY', 'PLAYED', { x: pk(540, 760), y: pk(250, 260), size: pk(140, 130), t: 48.6, da: 0.75, tb: 50.4, db: 1.0, ending: 2, stack: v });
      const ed = p.rb, es = ed.size;
      ring(A, { cx: ed.x + ed.w - PF.measure('ED', es) / 2, cy: ed.y + es / 2, w: PF.measure('ED', es), h: es }, 51.5, { pad: 20, padY: 26, dur: 0.45 });
      Art.clock(A, { x: pk(540, 1400), y: pk(1060, 640), s: pk(1.25, 1.1), t: 52.05, dur: 0.85, spin: [52.95, 54.05] });
      A.arrow(pk(420, 1300), pk(1220, 800), pk(240, 1120), pk(1220, 800), { t: 53.0, dur: 0.45, color: C.green, w: 7, bend: -0.2 });
      A.text('PAST', { x: pk(250, 1130), y: pk(1260, 840), size: 54, t: 53.5, dur: 0.5, color: C.green });
      Art.character(A, { kind: 'boy', x: pk(780, 1640), y: pk(1720, 1010), scale: pk(0.72, 0.6), t: 54.15, dur: 1.15, keys: [{ t: 55.6, ...Art.P.pointUp, mouth: 'open', brows: 1 }] });
      A.text('!', { x: pk(930, 1820), y: pk(1240, 600), size: 120, t: 55.45, dur: 0.3, color: C.red });
    });

    // ================================================================ S05
    scene('S05', { move: 'right', panDur: 1.0 }, (A) => {
      const L = pk(280, 560), R = pk(800, 1360);
      A.text('VERBS', { x: pk(540, 960), y: pk(260, 90), size: 92, t: 57.6, dur: 0.95 });
      A.arrow(pk(470, 860), pk(390, 210), L, pk(530, 340), { t: 58.75, dur: 0.5, bend: 0.12, w: 7 });
      A.arrow(pk(610, 1060), pk(390, 210), R, pk(530, 340), { t: 59.35, dur: 0.5, bend: -0.12, w: 7 });
      const reg = A.text('REGULAR', { x: L, y: pk(570, 370), size: pk(66, 80), t: 60.9, dur: 0.95, color: C.green });
      A.ar('منتظمة', { x: L, y: pk(745, 545), size: 52, t: 61.95, dur: 0.55, color: C.green });
      const irr = A.text('IRREGULAR', { x: R, y: pk(570, 370), size: pk(66, 80), t: 62.65, dur: 1.15 });
      A.ar('غير منتظمة', { x: R, y: pk(745, 545), size: 52, t: 63.85, dur: 0.6 });
      ring(A, { cx: L, cy: pk(570, 370) + pk(33, 40), w: reg.w, h: pk(66, 80) }, 64.95, { dur: 0.6, pad: 30 });
      A.text('?', { x: R, y: pk(880, 660), size: 150, t: 65.7, dur: 0.4, color: '#8a7a62' });
      if (v) camTo(66.0, 67.2, local(540, 1040, 1.03));
      Art.character(A, { kind: 'boy', x: pk(800, 1720), y: pk(1720, 1010), scale: pk(0.7, 0.55), flip: true, t: 66.2, dur: 1.2, keys: [{ t: 68.0, ...Art.P.point, mouth: 'grin' }] });
      A.text('+ ED', { x: L, y: pk(880, 660), size: 120, t: 69.85, dur: 1.4, colorAt: (k) => (k >= 2 ? C.green : C.ink) });
      A.text('+ D', { x: L, y: pk(1100, 840), size: 120, t: 73.85, dur: 0.95, colorAt: (k) => (k >= 2 ? C.green : C.ink) });
      A.ar('حسب نهاية الفعل', { x: L, y: pk(1330, 1035), size: 46, t: 74.95, dur: 1.0 });
    });

    // ================================================================ S06
    scene('S06', { move: 'down', panDur: 1.0 }, (A) => {
      const cx = pk(540, 520), y0 = pk(240, 160), dy = pk(170, 170), sz = pk(82, 78);
      pair(A, 'PLAY', 'PLAYED', { x: cx, y: y0, size: sz, t: 76.55, da: 0.5, tb: 77.45, db: 0.75, ending: 2 });
      pair(A, 'WATCH', 'WATCHED', { x: cx, y: y0 + dy, size: sz, t: 79.05, da: 0.6, tb: 80.05, db: 0.85, ending: 2 });
      const l = pair(A, 'LIVE', 'LIVED', { x: cx, y: y0 + dy * 2, size: sz, t: 81.65, da: 0.5, tb: 82.55, db: 0.75, ending: 1 });
      const dW = PF.measure('D', sz);
      ring(A, { cx: l.rb.x + l.rb.w - dW / 2, cy: y0 + dy * 2 + sz / 2, w: dW, h: sz }, 83.4, { pad: 16, padY: 16, dur: 0.4 });
      if (v) camTo(84.0, 85.2, local(540, 1100, 1.0));
      const tvx = pk(320, 1260), tvy = pk(1030, 700);
      Art.tv(A, { x: tvx, y: tvy, s: pk(0.92, 0.8), on: true, t: 84.25, dur: 1.15 });
      Art.character(A, { kind: 'boy', x: pk(780, 1660), y: pk(1330, 1000), scale: pk(0.8, 0.62), t: 85.45, dur: 1.3, pose: Art.P.hold, keys: [{ t: 88.0, ...Art.P.hold, mouth: 'grin', dy: -6 }, { t: 88.6, ...Art.P.hold, mouth: 'grin', dy: 0 }, { t: 89.2, ...Art.P.hold, mouth: 'grin', dy: -6 }, { t: 89.8, ...Art.P.hold, mouth: 'smile', dy: 0 }] });
      Art.popcorn(A, { x: pk(840, 1705), y: pk(1215, 910), s: pk(0.62, 0.48), t: 86.8, dur: 0.5 });
      say(A, 'I WATCHED A MOVIE YESTERDAY.', { x: pk(540, 540), y: pk(1440, 720), size: pk(64, 56), maxW: pk(940, 900), t: 87.6, dur: 2.15, marks: { WATCHED: C.green } });
    });

    // ================================================================ S07
    scene('S07', { move: 'diag', panDur: 1.1 }, (A) => {
      const bx = pk(780, 1700), by = pk(1720, 1010);
      const boy = Art.character(A, {
        kind: 'boy', x: bx, y: by, scale: pk(0.7, 0.55), t: 90.4, dur: 1.4,
        keys: [{ t: 92.2, ...Art.P.shrug }, { t: 96.0, mouth: 'smile' }, { t: 111.2, mouth: 'frown' }, { t: 114.0, mouth: 'grin' },
          // walk to school (115.9 → 117.9)
          ...[0, 1, 2, 3, 4].map((i) => ({ t: 116.0 + i * 0.42, dur: 0.42, x: -pk(70, 90) * (i + 1), lL: [i % 2 ? 18 : -12, 0], lR: [i % 2 ? -12 : 18, 0], aL: [i % 2 ? 24 : 6, 10], aR: [i % 2 ? 6 : 24, 10], mouth: 'grin' })),
          { t: 118.3, x: -pk(70, 90) * 5, mouth: 'smile' }],
      });
      const bub = A.group({});
      Art.thought(A, { x: pk(110, 1190), y: pk(1300, 640), w: pk(420, 340), h: pk(210, 180), tx: pk(700, 1640), ty: pk(1450, 830), t: 91.85, dur: 0.6, parent: bub });
      A.text('+ED ?', { x: pk(320, 1360), y: pk(1370, 700), size: 66, t: 92.55, dur: 0.8, parent: bub, colorAt: (k) => (k < 3 ? C.green : C.ink) });
      A.text('IRREGULAR', { x: pk(540, 960), y: pk(220, 60), size: pk(96, 90), t: 94.5, dur: 1.15, color: C.ink });
      A.ar('غير منتظمة', { x: pk(540, 960), y: pk(420, 220), size: 54, t: 95.75, dur: 0.7, color: C.green });
      const ex = pk(540, 480), ey = pk(500, 290), sz = pk(78, 70), dy = pk(140, 125);
      pair(A, 'GO', 'WENT', { x: ex, y: ey, size: sz, t: 98.45, da: 0.4, tb: 99.95, db: 0.65, colorB: C.green });
      pair(A, 'EAT', 'ATE', { x: ex, y: ey + dy, size: sz, t: 101.55, da: 0.45, tb: 102.35, db: 0.55, colorB: C.green });
      pair(A, 'SEE', 'SAW', { x: ex, y: ey + dy * 2, size: sz, t: 103.8, da: 0.5, tb: 105.2, db: 0.55, colorB: C.green });
      // wrong vs right
      const sy = pk(990, 380), sx = pk(540, 1350);
      if (v) camTo(107.2, 108.2, local(540, 1100, 1.05));
      const wrong = say(A, 'I GOED TO SCHOOL.', { x: sx, y: sy, size: pk(64, 54), maxW: pk(960, 700), t: 108.8, dur: 1.75, marks: { GOED: C.red } });
      strike(A, wrong, 110.85, { dur: 0.3 });
      const wx = sx + wrong.lines[0].w / 2 + 50;
      A.cross(wx, sy + 6, 50, 50, { t: 111.25, dur: 0.12 });
      const right = say(A, 'I WENT TO SCHOOL.', { x: sx, y: sy + pk(140, 120), size: pk(64, 54), maxW: pk(960, 700), t: 113.6, dur: 1.55, marks: { WENT: C.green } });
      A.check(sx + right.lines[0].w / 2 + 70, sy + pk(140, 120) + 30, 60, { t: 115.2, dur: 0.35 });
      // wipe the thought bubble and draw the school where the boy walks
      A.erase(bub, pk(80, 1170), pk(1280, 610), pk(480, 400), pk(270, 260), 115.6, 0.45);
      Art.school(A, { x: pk(260, 1080), y: by, s: pk(0.55, 0.42), t: 116.1, dur: 1.5 });
      if (v) camTo(116.2, 118.2, local(540, 1150, 1.0));
    });

    // ================================================================ S08
    scene('S08', { move: 'right', panDur: 1.0 }, (A) => {
      const lower = A.group({});
      shared.s08lower = lower;
      Art.character(A, { kind: 'girl', x: pk(300, 560), y: pk(1680, 1010), scale: pk(0.82, 0.58), t: 119.6, dur: 1.5, parent: lower, keys: [{ t: 140.6, ...Art.P.wave }] });
      const F = boxes(A, [
        { ar: 'الفاعل', color: C.green, t: 128.95 },
        { ar: 'الفعل الماضي', color: C.red, t: 130.25 },
        { ar: 'تكملة الجملة', color: C.beigeDark, t: 132.2 },
      ], { x: pk(40, 300), y: pk(260, 70), w: pk(1000, 1320), h: pk(150, 130), t: 121.4, ar: pk(38, 44), gap: 40 });
      shared.formula = F;
      const s = say(A, 'SHE VISITED HER GRANDMOTHER YESTERDAY.', { x: pk(540, 960), y: pk(560, 300), size: pk(60, 62), maxW: pk(980, 1500), t: 135.35, dur: 2.75, parent: lower });
      under(A, find(s, 'SHE'), 138.2, C.green, 0.2, lower);
      under(A, find(s, 'VISITED'), 138.45, C.red, 0.25, lower);
      ['HER', 'GRANDMOTHER', 'YESTERDAY.'].forEach((w, i) => under(A, find(s, w), 138.75 + i * 0.17, C.beigeDark, 0.14, lower));
      A.ar('زارت جدتها مبارح', { x: pk(540, 960), y: pk(860, 520), size: 50, t: 140.75, dur: 0.85, color: C.green, parent: lower });
      Art.character(A, { kind: 'grandma', x: pk(780, 1360), y: pk(1680, 1010), scale: pk(0.82, 0.58), t: 139.35, dur: 1.3, parent: lower, pose: { mouth: 'grin', eyes: 'happy' } });
    });

    // ================================================================ S09 (wipe lower half, keep formula)
    const s08 = E.scenes[E.scenes.length - 1];
    scene('S09', { scene: { showFrom: 142.0 } }, (A) => {
      s08.keepUntil = SB.S10.start + 4;
      A.erase(shared.s08lower, 0, pk(470, 260), W, H - pk(470, 260), 142.45, 0.85);
      Art.character(A, { kind: 'boy', x: pk(300, 560), y: pk(1680, 1010), scale: pk(0.82, 0.58), t: 143.35, dur: 1.45, pose: Art.P.hold, keys: [{ t: 151.6, ...Art.P.hold, mouth: 'grin', eyes: 'happy' }, { t: 154.6, ...Art.P.hold, mouth: 'smile' }] });
      const ph = Art.phone(A, { x: pk(300 + 58 * 0.82, 560 + 58 * 0.58), y: pk(1680 - 150 * 0.82, 1010 - 150 * 0.58), s: pk(0.62, 0.45), rot: -10, t: 144.9, dur: 0.6 });
      ring(A, { cx: shared.formula.boxes[1].cx, cy: shared.formula.boxes[1].cy, w: shared.formula.boxes[1].w - 40, h: shared.formula.boxes[1].h - 30 }, 145.7, { dur: 0.5, color: C.red });
      const s = say(A, 'HE BOUGHT A NEW PHONE LAST WEEK.', { x: pk(540, 960), y: pk(560, 300), size: pk(62, 64), maxW: pk(980, 1500), t: 147.35, dur: 2.75, marks: { BOUGHT: C.red } });
      A.ar('اشترى تلفون جديد', { x: pk(540, 960), y: pk(860, 520), size: 50, t: 151.4, dur: 1.0, color: C.green });
      pair(A, 'BUY', 'BOUGHT', { x: pk(690, 1360), y: pk(1100, 700), size: pk(80, 80), t: 157.75, da: 0.5, tb: 158.85, db: 0.75, colorB: C.red });
    });

    // ================================================================ S10
    scene('S10', { move: 'down', panDur: 1.0 }, (A) => {
      A.ar('النفي', { x: pk(540, 260), y: pk(320, 160), size: 84, t: 161.25, dur: 0.75, color: C.green });
      const dn = A.text("DIDN'T", { x: pk(540, 960), y: pk(400, 80), size: pk(140, 140), t: 165.45, dur: 1.4, color: C.red });
      A.text('= DID NOT', { x: pk(540, 1600), y: pk(590, 120), size: pk(68, 64), t: 168.2, dur: 1.05 });
      const F = boxes(A, [
        { ar: 'الفاعل', color: C.green, t: 171.45, dur: 0.6 },
        { en: "DIDN'T", color: C.red, t: 172.4, dur: 0.8 },
        { ar: 'الفعل الأصلي', color: C.ink, t: 173.6, dur: 0.9 },
      ], { x: pk(40, 300), y: pk(760, 290), w: pk(1000, 1320), h: pk(140, 120), t: 169.75, ar: pk(38, 42), en: 44, gap: 40 });
      const s = say(A, "I DIDN'T WATCH TV YESTERDAY.", { x: pk(540, 960), y: pk(1000, 470), size: pk(62, 64), maxW: pk(980, 1500), t: 176.9, dur: 2.75, marks: { "DIDN'T": C.red, WATCH: C.green } });
      const tvx = pk(300, 480), tvy = pk(1460, 800);
      const tv = Art.tv(A, { x: tvx, y: tvy, s: pk(0.75, 0.62), on: false, t: 180.5, dur: 1.0 });
      A.cross(tvx - 80, tvy - 60, 160, 110, { t: 181.6, dur: 0.15 });
      Art.character(A, { kind: 'boy', x: pk(780, 1560), y: pk(1720, 1010), scale: pk(0.72, 0.58), t: 182.1, dur: 1.5, keys: [{ t: 183.95, ...Art.P.no, dur: 0.35 }, { t: 184.35, ...Art.P.no, head: 8 }, { t: 184.75, ...Art.P.no, head: -8 }, { t: 185.15, ...Art.P.no, head: 6 }, { t: 185.6, mouth: 'smile', head: 0 }] });
      const wb = find(s, 'WATCH');
      if (v) camTo(185.0, 185.8, local(540, 1000, 1.08));
      ring(A, wb, 185.9, { dur: 0.45 });
      const b3 = F.boxes[2];
      A.arrow(b3.cx, b3.y + b3.h + 10, wb.cx + 20, wb.y - 30, { t: 186.45, dur: 0.6, bend: 0.15, color: C.green, w: 6 });
    });

    // ================================================================ S11
    scene('S11', { move: 'right', panDur: 1.0 }, (A) => {
      const sx = pk(500, 620), sz = pk(50, 54), mw = pk(940, 1100);
      const w1 = say(A, "I DIDN'T WATCHED TV.", { x: sx, y: pk(250, 110), size: sz, maxW: mw, t: 189.6, dur: 2.2, marks: { WATCHED: C.red } });
      strike(A, w1, 192.55, { dur: 0.3 });
      A.cross(sx + w1.lines[0].w / 2 + 40, pk(250, 110) + 4, 46, 46, { t: 192.95, dur: 0.12 });
      const r1 = say(A, "I DIDN'T WATCH TV.", { x: sx, y: pk(390, 230), size: sz, maxW: mw, t: 194.75, dur: 1.95, marks: { WATCH: C.green } });
      A.check(sx + r1.lines[0].w / 2 + 60, pk(390, 230) + 26, 54, { t: 196.75, dur: 0.3 });
      // the girl stays home (no school)
      Art.character(A, { kind: 'girl', x: pk(280, 1330), y: pk(1720, 1010), scale: pk(0.75, 0.55), t: 197.6, dur: 1.4, keys: [{ t: 201.0, ...Art.P.no }, { t: 207.0, mouth: 'smile', head: 0 }, { t: 215.8, ...Art.P.cheer }] });
      Art.school(A, { x: pk(790, 1740), y: pk(1720, 1010), s: pk(0.5, 0.4), t: 199.05, dur: 1.0 });
      const r2 = say(A, "SHE DIDN'T GO TO SCHOOL.", { x: sx, y: pk(560, 400), size: sz, maxW: mw, t: 200.75, dur: 2.0, marks: { GO: C.green } });
      A.check(sx + r2.lines[0].w / 2 + 60, pk(560, 400) + 26, 54, { t: 202.8, dur: 0.3 });
      const w2 = say(A, "SHE DIDN'T WENT TO SCHOOL.", { x: sx, y: pk(700, 520), size: sz, maxW: mw, t: 203.85, dur: 1.65, marks: { WENT: C.red } });
      strike(A, w2, 205.6, { dur: 0.3 });
      A.cross(sx + w2.lines[0].w / 2 + 40, pk(700, 520) + 4, 46, 46, { t: 205.98, dur: 0.1 });
      // "did" carries the past
      const db = find(r2, "DIDN'T");
      ring(A, db, 207.7, { dur: 0.5, color: C.red });
      const cx = pk(540, 1350), cy = pk(1010, 340);
      Art.clock(A, { x: cx, y: cy, s: pk(0.95, 0.9), t: 208.55, dur: 0.75, spin: [209.4, 210.9] });
      A.arrow(db.cx, db.y + db.h + 30, cx - pk(20, 90), cy - pk(70, 0), { t: 209.35, dur: 0.4, bend: 0.2, color: C.red, w: 6 });
      A.text('PAST', { x: cx + pk(170, 0), y: cy - pk(20, 120), size: 50, t: 209.85, dur: 0.5, color: C.green });
      under(A, find(r2, 'GO'), 212.0, C.green, 0.3);
      ring(A, find(r2, 'GO'), 212.4, { dur: 0.45 });
      Art.star(A, { x: pk(140, 1050), y: pk(1270, 760), s: 1.1, t: 215.7, dur: 0.35 });
      Art.star(A, { x: pk(450, 1580), y: pk(1220, 700), s: 0.8, t: 216.1, dur: 0.3 });
    });

    // ================================================================ S12
    scene('S12', { move: 'right', panDur: 1.0 }, (A) => {
      const gx = pk(270, 330), bx = pk(810, 1590), cy = pk(1720, 1010), cs = pk(0.75, 0.58);
      Art.character(A, { kind: 'girl', x: gx, y: cy, scale: cs, t: 218.25, dur: 1.2, keys: [{ t: 227.3, ...Art.P.ask }, { t: 230.2, mouth: 'smile', aR: [14, 8], head: 0 }, { t: 239.0, mouth: 'smile', head: 6 }] });
      Art.character(A, { kind: 'boy', x: bx, y: cy, scale: cs, t: 219.5, dur: 1.2, keys: [{ t: 234.3, ...Art.P.wave, eyes: 'happy', dur: 0.3 }, { t: 236.0, ...Art.P.no, dur: 0.3 }, { t: 237.3, mouth: 'smile', aR: [14, 8], head: 0 }, { t: 238.85, ...Art.P.ask }, { t: 240.8, mouth: 'smile', aR: [14, 8] }] });
      const F = boxes(A, [
        { en: 'DID', color: C.green, t: 220.95, dur: 0.45 },
        { ar: 'الفاعل', color: C.ink, t: 222.3, dur: 0.6 },
        { ar: 'الفعل الأصلي', color: C.ink, t: 223.85, dur: 0.95 },
      ], { x: pk(40, 330), y: pk(240, 60), w: pk(900, 1150), h: pk(130, 120), t: 220.75 - 0.95, ar: pk(36, 40), en: 50, gap: 36, bdur: 0.24 });
      A.text('?', { x: pk(990, 1560), y: pk(260, 70), size: 100, t: 225.5, dur: 0.35, color: C.green });
      shared.qF = F;
      // first question
      const q1 = A.group({});
      Art.bubble(A, { x: pk(50, 300), y: pk(470, 270), w: pk(980, 1100), h: pk(250, 200), tx: pk(200, 330), ty: pk(840, 590), t: 226.4, dur: 0.6, parent: q1 });
      const q = say(A, 'DID YOU PLAY FOOTBALL YESTERDAY?', { x: pk(540, 850), y: pk(520, 310), size: pk(60, 58), maxW: pk(900, 1000), t: 227.3, dur: 2.7, marks: { DID: C.green, PLAY: C.green }, parent: q1 });
      Art.ball(A, { x: pk(930, 1720), y: pk(1690, 985), s: 0.7, t: 230.15, dur: 0.25 });
      A.ar('هل لعبت كرة القدم مبارح؟', { x: pk(540, 850), y: pk(820, 530), size: 44, t: 230.45, dur: 1.55, parent: q1 });
      const ya = A.text('YES, I DID.', { x: pk(540, 1320), y: pk(1000, 650), size: 60, t: 234.3, dur: 0.75, color: C.green });
      const na = A.text("NO, I DIDN'T.", { x: pk(540, 1320), y: pk(1110, 760), size: 60, t: 236.05, dur: 0.85, color: C.red });
      // second question replaces the first
      A.erase(q1, pk(40, 280), pk(460, 260), pk(1000, 1140), pk(400, 300), 237.35, 0.75);
      const q2g = A.group({});
      Art.bubble(A, { x: pk(50, 300), y: pk(470, 270), w: pk(980, 1100), h: pk(250, 200), tx: pk(880, 1500), ty: pk(840, 590), t: 238.15, dur: 0.6, parent: q2g });
      const q2 = say(A, 'DID SHE VISIT HER GRANDMOTHER?', { x: pk(540, 850), y: pk(520, 310), size: pk(60, 58), maxW: pk(900, 1000), t: 238.85, dur: 1.75, marks: { DID: C.green, VISIT: C.green }, parent: q2g });
      A.ar('هل زارت جدتها؟', { x: pk(540, 850), y: pk(820, 530), size: 44, t: 241.15, dur: 1.2, parent: q2g });
      ring(A, find(q2, 'DID'), 243.9, { dur: 0.45, pad: 16 });
      ring(A, find(q2, 'SHE'), 245.55, { dur: 0.45, pad: 16, color: C.ink });
      ring(A, find(q2, 'VISIT'), 246.75, { dur: 0.5, pad: 16 });
      const vx = pk(540, 850), vy = pk(1240, 860);
      const vd = A.text('VISITED', { x: vx, y: vy, size: 56, t: 248.4, dur: 0.75, color: C.red });
      strike(A, { lines: [{ x: vd.x, y: vd.y, w: vd.w, size: 56 }] }, 249.2, { dur: 0.25 });
      // after DID → base verb
      const b0 = F.boxes[0], b2 = F.boxes[2];
      A.arrow(b0.cx, b0.y - 10, b2.cx, b2.y - 10, { t: 251.45, dur: 0.7, bend: -0.25, color: C.green, w: 6 });
      A.underline(b2.x + 20, b2.x + b2.w - 20, b2.y + b2.h + 14, { t: 252.3, dur: 0.4, color: C.green });
    });

    // ================================================================ S13
    scene('S13', { move: 'down', panDur: 1.0 }, (A) => {
      Art.character(A, { kind: 'boy', x: pk(540, 1640), y: pk(1720, 1010), scale: pk(0.82, 0.6), t: 255.0, dur: 1.5, keys: [{ t: 256.9, ...Art.P.think }, { t: 263.0, mouth: 'smile', aR: [14, 8], head: 0, brows: 0 }] });
      [[pk(330, 1440), pk(1240, 560), 110], [pk(760, 1830), pk(1200, 520), 80], [pk(250, 1450), pk(1420, 740), 70]].forEach(([x, y, s], i) => A.text('?', { x, y, size: s, t: 256.65 + i * 0.32, dur: 0.28, color: i === 1 ? C.green : C.ink }));
      const ex = pk(330, 330), ax = pk(800, 760), y0 = pk(250, 90), dy = pk(170, 160);
      A.text('WHAT', { x: ex, y: y0, size: 84, t: 262.45, dur: 0.85, color: C.green });
      A.ar('شو؟', { x: ax, y: y0 + 74, size: 60, t: 264.15, dur: 0.6 });
      A.text('WHERE', { x: ex, y: y0 + dy, size: 84, t: 265.6, dur: 0.75, color: C.green });
      A.ar('وين؟', { x: ax, y: y0 + dy + 74, size: 60, t: 266.55, dur: 0.6 });
      A.text('WHEN', { x: ex, y: y0 + dy * 2, size: 84, t: 267.75, dur: 0.7, color: C.green });
      A.ar('إمتى؟', { x: ax, y: y0 + dy * 2 + 74, size: 60, t: 268.65, dur: 0.6 });
      [0, 1, 2].forEach((i) => A.path(`M${pk(540, 545)} ${y0 + i * dy + 42} L${pk(640, 620)} ${y0 + i * dy + 42}`, { t: 264.0 + [0, 2.5, 4.55][i] - 0.12, dur: 0.1, w: 5, color: '#8a7a62' }));
      boxes(A, [
        { ar: 'كلمة السؤال', color: C.green, t: 271.55, dur: 0.6 },
        { en: 'DID', color: C.green, t: 272.2, dur: 0.35 },
        { ar: 'الفاعل', t: 272.6, dur: 0.5 },
        { ar: 'الفعل الأصلي', t: 273.8, dur: 0.8 },
      ], { x: pk(30, 120), y: pk(820, 610), w: pk(1020, 1300), h: pk(130, 120), t: 270.55, ar: pk(30, 36), en: 46, gap: 30, bdur: 0.18 });
      A.text('?', { x: pk(540, 1480), y: pk(990, 610), size: 90, t: 274.75, dur: 0.3, color: C.green });
    });

    // ================================================================ S14
    scene('S14', { move: 'right', panDur: 1.0 }, (A) => {
      const cards = [
        { q: 'WHAT DID YOU EAT YESTERDAY?', verb: 'EAT', ar: 'شو أكلت مبارح؟', t: 277.1, dur: 1.7, icon: 'food', it: 278.85, at: 279.35, ad: 1.4 },
        { q: 'WHERE DID YOU GO LAST WEEKEND?', verb: 'GO', ar: 'وين رحت بعطلة نهاية الأسبوع؟', t: 281.65, dur: 1.85, icon: 'park', it: 283.55, at: 284.15, ad: 1.95 },
        { q: 'WHEN DID THEY ARRIVE?', verb: 'ARRIVE', ar: 'إمتى وصلوا؟', t: 287.0, dur: 1.5, icon: 'suitcase', it: 288.5, at: 289.15, ad: 1.0 },
      ];
      const res = cards.map((c, i) => {
        const x = pk(540, 330 + i * 630), y = pk(190 + i * 480, 110);
        const r = say(A, c.q, { x: pk(540, x), y, size: pk(56, 48), maxW: pk(960, 560), t: c.t, dur: c.dur, marks: { DID: C.green } });
        const ix = pk(230, x), iy = pk(y + 300, 600);
        if (c.icon === 'food') Art.food(A, { x: ix, y: iy, s: pk(0.85, 0.95), t: c.it, dur: 0.45 });
        if (c.icon === 'park') Art.park(A, { x: ix, y: iy + pk(60, 80), s: pk(0.55, 0.6), t: c.it, dur: 0.55 });
        if (c.icon === 'suitcase') Art.suitcase(A, { x: ix, y: iy, s: pk(0.75, 0.85), t: c.it, dur: 0.6 });
        A.ar(c.ar, { x: pk(690, x), y: pk(y + 320, 900), size: pk(42, 40), t: c.at, dur: c.ad, color: C.green });
        return { r, c };
      });
      camTo(290.9, 292.0, { ...home(), z: 0.97 });
      res.forEach(({ r, c }, i) => ring(A, find(r, c.verb), 291.3 + i * 0.85, { dur: 0.5, pad: 14, padY: 16 }));
    });

    // ================================================================ S15
    scene('S15', { move: 'down', panDur: 1.0 }, (A) => {
      Art.bulb(A, { x: pk(160, 150), y: pk(330, 150), s: pk(0.85, 0.7), t: 297.0, dur: 1.0 });
      const did = A.text('DID', { x: pk(420, 440), y: pk(270, 80), size: 100, t: 300.55, dur: 0.8 });
      A.cross(did.x - 20, pk(270, 80) - 10, did.w + 40, 120, { t: 301.9, dur: 0.15 });
      const tb = pair(A, 'TO BE', 'WAS / WERE', { x: pk(540, 1220), y: pk(480, 90), size: pk(70, 70), t: 304.2, da: 0.75, tb: 305.75, db: 1.6, colorB: C.green });
      const bx = pk(230, 330), gx = pk(640, 650), mx = pk(880, 870), cy = pk(1720, 1010), cs = pk(0.72, 0.55);
      Art.character(A, { kind: 'boy', x: bx, y: cy, scale: cs, t: 307.55, dur: 1.85, pose: Art.P.tired, keys: [{ t: 319.4, ...Art.P.cheer, dy: 0, eyes: 'open', mouth: 'grin' }, { t: 320.6, mouth: 'smile', aL: [14, 8], aR: [14, 8] }] });
      const sz = pk(60, 52), sx = pk(540, 1350);
      say(A, 'I WAS TIRED YESTERDAY.', { x: sx, y: pk(660, 290), size: sz, maxW: pk(980, 900), t: 309.6, dur: 1.5, marks: { WAS: C.green } });
      Art.zzz(A, { x: bx + pk(60, 50), y: cy - pk(380, 300), t: 311.25 });
      Art.character(A, { kind: 'girl', x: gx, y: cy, scale: cs, t: 311.75, dur: 1.2, keys: [{ t: 315.3, ...Art.P.cheer }, { t: 315.9, ...Art.P.cheer, dy: 0 }, { t: 316.4, ...Art.P.cheer }, { t: 317.4, mouth: 'smile', aL: [14, 8], aR: [14, 8], eyes: 'open', dy: 0 }, { t: 322.4, mouth: 'frown', brows: -0.6 }] });
      Art.character(A, { kind: 'grandma', x: mx, y: cy, scale: cs, t: 313.0, dur: 1.3, keys: [{ t: 315.4, ...Art.P.cheer }, { t: 316.0, ...Art.P.cheer, dy: 0 }, { t: 316.5, ...Art.P.cheer }, { t: 317.4, mouth: 'smile', aL: [14, 8], aR: [14, 8], eyes: 'open', dy: 0 }, { t: 322.4, mouth: 'frown', brows: -0.6 }] });
      say(A, 'THEY WERE HAPPY.', { x: sx, y: pk(780, 410), size: sz, maxW: pk(980, 900), t: 314.35, dur: 1.05, marks: { WERE: C.green } });
      Art.star(A, { x: pk(760, 880), y: pk(1240, 640), s: 0.8, t: 315.85, dur: 0.3 });
      Art.star(A, { x: pk(990, 520), y: pk(1300, 700), s: 0.6, t: 316.2, dur: 0.25 });
      say(A, "I WASN'T TIRED.", { x: sx, y: pk(920, 560), size: sz, maxW: pk(980, 900), t: 319.25, dur: 1.1, marks: { "WASN'T": C.red } });
      say(A, "THEY WEREN'T HAPPY.", { x: sx, y: pk(1040, 680), size: sz, maxW: pk(980, 900), t: 321.4, dur: 1.1, marks: { "WEREN'T": C.red } });
    });

    // ================================================================ S16
    scene('S16', { move: 'right', panDur: 1.0 }, (A) => {
      const x = pk(540, 480);
      const a = A.text('YOU WERE', { x, y: pk(250, 140), size: 86, t: 323.3, dur: 0.95 });
      const you = { x: a.x, w: PF.measure('YOU', 86) }, were = { x: a.x + PF.measure('YOU ', 86), w: PF.measure('WERE', 86) };
      A.arrow(were.x + were.w / 2, pk(250, 140) + 110, you.x + you.w / 2, pk(450, 340) - 20, { t: 324.45, dur: 0.45, bend: -0.2, color: C.green, w: 7 });
      A.arrow(you.x + you.w / 2, pk(250, 140) + 110, were.x + were.w / 2 + 40, pk(450, 340) - 20, { t: 325.0, dur: 0.45, bend: 0.2, color: '#8a7a62', w: 6 });
      A.text('WERE YOU ?', { x, y: pk(450, 340), size: 86, t: 325.55, dur: 1.0, colorAt: (k) => (k < 4 ? C.green : C.ink) });
      Art.character(A, { kind: 'girl', x: pk(270, 1350), y: pk(1720, 1010), scale: pk(0.72, 0.55), t: 326.6, dur: 1.25, keys: [{ t: 327.9, ...Art.P.ask }, { t: 331.0, mouth: 'smile', aR: [14, 8] }] });
      const q = say(A, 'WERE YOU TIRED YESTERDAY?', { x: pk(540, 1380), y: pk(640, 150), size: pk(62, 56), maxW: pk(980, 860), t: 327.9, dur: 2.3, marks: { WERE: C.green } });
      A.ar('كنت تعبان مبارح؟', { x: pk(540, 1380), y: pk(880, 420), size: 50, t: 330.45, dur: 1.1, color: C.green });
      const ww = A.text('WAS / WERE', { x: pk(380, 1200), y: pk(990, 560), size: 66, t: 332.55, dur: 1.05, color: C.green });
      const dd = A.text('DID', { x: pk(860, 1640), y: pk(990, 560), size: 66, t: 333.8, dur: 0.55 });
      A.cross(dd.x - 18, pk(990, 560) - 8, dd.w + 36, 84, { t: 334.45, dur: 0.12 });
      Art.character(A, { kind: 'boy', x: pk(790, 1680), y: pk(1720, 1010), scale: pk(0.72, 0.55), t: 335.15, dur: 1.4, keys: [{ t: 337.0, ...Art.P.wave }] });
    });

    // ================================================================ S17
    scene('S17', { move: 'right', panDur: 1.0 }, (A) => {
      const t1 = A.ar('أهم الأفكار', { x: pk(540, 960), y: pk(300, 130), size: 76, t: 339.5, dur: 1.1, color: C.ink });
      A.underline(pk(330, 760), pk(750, 1160), pk(330, 160), { t: 340.7, dur: 0.35, color: C.green });
      const ty = pk(470, 260), x0 = pk(90, 300), x1 = pk(990, 1620), nowX = pk(860, 1500);
      A.path(`M${x0} ${ty} L${x1} ${ty}`, { t: 342.4, dur: 0.6, w: 7 });
      A.path(`M${x1 - 28} ${ty - 18} L${x1} ${ty} L${x1 - 28} ${ty + 18}`, { t: 343.02, dur: 0.15, w: 7 });
      A.path(`M${nowX} ${ty - 26} L${nowX} ${ty + 26}`, { t: 343.25, dur: 0.12, w: 7, color: C.green });
      A.text('NOW', { x: nowX, y: ty - 90, size: 44, t: 343.4, dur: 0.4, color: C.green });
      const ex = pk(330, 700);
      A.loop(ex, ty, 14, 14, { t: 343.9, dur: 0.25, w: 7, color: C.green });
      A.check(ex, ty - 60, 40, { t: 344.35, dur: 0.3 });
      A.text('PAST SIMPLE', { x: pk(540, 960), y: pk(540, 320), size: pk(76, 72), t: 345.85, dur: 1.5, color: C.green });
      const badge = (sym, y, t, col) => {
        const bx = pk(90, 330);
        A.loop(bx, y + 28, 38, 38, { t, dur: 0.35, color: col, w: 7 });
        A.text(sym, { x: bx, y: y + 6, size: 46, t: t + 0.38, dur: 0.22, color: col });
      };
      const sx = pk(570, 1000), sz = pk(52, 54);
      badge('+', pk(720, 470), 348.2, C.green);
      Art.character(A, { kind: 'boy', x: pk(540, 1640), y: pk(1720, 1010), scale: pk(0.72, 0.55), t: 349.0, dur: 1.6, keys: [{ t: 351.8, ...Art.P.kick, dur: 0.35 }, { t: 353.4, mouth: 'smile', aL: [14, 8], aR: [14, 8], lR: [5, 0] }, { t: 358.5, ...Art.P.no }, { t: 360.2, mouth: 'smile', aR: [14, 8], head: 0, brows: 0 }, { t: 365.9, ...Art.P.think }] });
      Art.ball(A, { x: pk(700, 1770), y: pk(1690, 985), s: 0.65, t: 350.7, dur: 0.3 });
      say(A, 'I PLAYED FOOTBALL.', { x: sx, y: pk(720, 470), size: sz, maxW: pk(860, 1200), t: 351.65, dur: 1.75, marks: { PLAYED: C.green } });
      badge('-', pk(880, 630), 354.4, C.red);
      say(A, "I DIDN'T PLAY FOOTBALL.", { x: sx, y: pk(880, 630), size: sz, maxW: pk(860, 1200), t: 358.4, dur: 1.5, marks: { "DIDN'T": C.red, PLAY: C.green } });
      badge('?', pk(1040, 790), 360.7, C.ink);
      say(A, 'DID YOU PLAY FOOTBALL?', { x: sx, y: pk(1040, 790), size: sz, maxW: pk(860, 1200), t: 365.85, dur: 1.2, marks: { DID: C.green, PLAY: C.green } });
    });

    // ================================================================ S18
    scene('S18', { move: 'right', panDur: 1.0 }, (A) => {
      const lx = pk(540, 540), rx = pk(540, 1400);
      A.text('REGULAR', { x: lx, y: pk(230, 130), size: 76, t: 368.2, dur: 1.0, color: C.green });
      A.text('+ED / +D', { x: lx, y: pk(370, 260), size: 84, t: 371.4, dur: 1.6, colorAt: (k) => (k === 0 || k === 5 ? C.ink : C.green) });
      A.text('IRREGULAR', { x: lx, y: pk(560, 460), size: 76, t: 374.9, dur: 1.15 });
      pair(A, 'GO', 'WENT', { x: lx, y: pk(700, 600), size: 76, t: 376.3, da: 0.4, tb: 377.05, db: 0.6, colorB: C.green });
      Art.book(A, { x: pk(890, 900), y: pk(730, 640), s: pk(0.8, 0.8), t: 377.75, dur: 0.4 });
      pair(A, 'TO BE', 'WAS / WERE', { x: rx, y: pk(900, 260), size: pk(66, 66), t: 380.4, da: 0.7, tb: 381.4, db: 1.2, colorB: C.green });
      const dd = A.text('DID', { x: rx, y: pk(1060, 460), size: 80, t: 383.75, dur: 0.6 });
      A.cross(dd.x - 20, pk(1060, 460) - 10, dd.w + 40, 100, { t: 384.45, dur: 0.14 });
      A.ar('النفي', { x: rx - pk(250, 250), y: pk(1270, 650), size: 48, t: 384.9, dur: 0.5 });
      A.ar('السؤال', { x: rx + pk(250, 250), y: pk(1270, 650), size: 48, t: 385.6, dur: 0.6 });
      camTo(379.0, 386.9, { ...home(), z: 1.03 });
    });

    // ================================================================ S19
    scene('S19', { move: 'down', panDur: 1.0 }, (A) => {
      A.text('?', { x: pk(540, 300), y: pk(200, 120), size: 200, t: 387.65, dur: 0.6, color: C.green });
      Art.character(A, { kind: 'boy', x: pk(540, 300), y: pk(1720, 1010), scale: pk(0.8, 0.6), t: 388.4, dur: 1.65, keys: [{ t: 390.6, ...Art.P.think }, { t: 401.95, ...Art.P.cheer }, { t: 402.4, ...Art.P.cheer, dy: 0 }] });
      const ax = pk(540, 1120), ay = pk(560, 200);
      A.ar('أنا ما رحت على المدرسة مبارح', { x: ax, y: ay, size: pk(56, 60), t: 392.1, dur: 2.05 });
      Art.box(A, { x: ax - pk(480, 520), y: ay - pk(80, 85), w: pk(960, 1040), h: pk(120, 125), t: 394.2, dur: 0.6, color: C.green, fill: 'none' });
      Art.clock(A, { x: pk(540, 1120), y: pk(780, 400), s: 0.8, t: 394.95, dur: 0.6, spin: [395.6, 397.6] });
      A.text('2', { x: pk(330, 900), y: pk(730, 350), size: 110, t: 395.65, dur: 0.35, color: '#8a7a62' });
      A.text('1', { x: pk(750, 1340), y: pk(730, 350), size: 110, t: 396.6, dur: 0.3, color: '#8a7a62' });
      const ans = say(A, "I DIDN'T GO TO SCHOOL YESTERDAY.", { x: pk(540, 1120), y: pk(970, 560), size: pk(64, 62), maxW: pk(960, 1150), t: 399.05, dur: 2.1, marks: { "DIDN'T": C.red, GO: C.green } });
      A.check(pk(940, 1680), pk(1200, 760), 90, { t: 401.25, dur: 0.4 });
      Art.star(A, { x: pk(150, 560), y: pk(1250, 820), s: 1.0, t: 401.95, dur: 0.25 });
      Art.star(A, { x: pk(900, 120), y: pk(1420, 820), s: 0.8, t: 402.25, dur: 0.25 });
    });

    // ================================================================ S20
    scene('S20', { move: 'right', panDur: 1.0 }, (A) => {
      const xs = pk([200, 540, 880], [400, 960, 1520]), iy = pk(380, 230), ly = pk(560, 420);
      Art.bulb(A, { x: xs[0], y: iy + 20, s: 1.0, t: 405.8, dur: 0.75 });
      A.ar('افهم القاعدة', { x: xs[0], y: ly, size: 42, t: 406.6, dur: 0.7, color: C.green });
      Art.book(A, { x: xs[1], y: iy, s: 1.05, t: 407.55, dur: 0.6 });
      A.ar('شوف أمثلة', { x: xs[1], y: ly, size: 42, t: 408.2, dur: 0.6, color: C.green });
      Art.bubble(A, { x: xs[2] - 110, y: iy - 80, w: 220, h: 120, tx: xs[2] - 60, ty: iy + 80, t: 409.2, dur: 0.6 });
      A.path(`M${xs[2] - 70} ${iy - 40} q12 -12 24 0 t24 0 t24 0 t24 0 t24 0 M${xs[2] - 70} ${iy} q12 -12 24 0 t24 0 t24 0 t24 0`, { t: 409.85, dur: 0.4, w: 5, color: C.green });
      A.ar('استخدمها', { x: xs[2], y: ly, size: 42, t: 410.35, dur: 0.6, color: C.green });
      // the more you use it, the easier it gets: rising arrow
      const a0 = pk([150, 980], [1300, 980]), a1 = pk([930, 700], [1800, 690]);
      A.arrow(a0[0], a0[1], a1[0], a1[1], { t: 412.3, dur: 0.9, bend: -0.12, color: C.green, w: 9, head: 40 });
      Art.character(A, { kind: 'boy', x: pk(330, 400), y: pk(1720, 1010), scale: pk(0.75, 0.52), t: 413.3, dur: 1.3, keys: [{ t: 418.9, ...Art.P.wave }] });
      Art.character(A, { kind: 'girl', x: pk(760, 700), y: pk(1720, 1010), scale: pk(0.75, 0.52), t: 414.7, dur: 1.3, keys: [{ t: 419.0, ...Art.P.waveL }] });
      A.text('PAST SIMPLE', { x: pk(540, 1000), y: pk(1050, 540), size: pk(110, 100), t: 416.95, dur: 1.65 });
      Art.star(A, { x: pk(900, 1420), y: pk(1000, 520), s: 0.9, t: 418.75, dur: 0.3 });
      camTo(418.9, 420.28, { ...home(), z: 0.97 });
    });

    E.finalize();
  };
})(window);
