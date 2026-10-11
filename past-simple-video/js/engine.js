// Deterministic whiteboard engine.
//
// Everything on screen is a pure function of the audio time `t`:
//   - each stroke has {t0, dur}; its progress p = clamp((t - t0) / dur)
//   - the stroke reveals p of its length (stroke-dashoffset) and the hand is
//     placed at getPointAtLength(p * len) of that same path
//   - fills, character poses, camera and erasers are keyframed on `t`
// Seeking, pausing, rewinding or rendering frame N therefore always yields
// the same picture; nothing accumulates between frames.
(function (global) {
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#1d1d1b';
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = (v) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);
  const lerp = (a, b, k) => a + (b - a) * k;

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // Interpolate numeric keyframes [{t, ...values}] (eased, held at ends).
  function track(keys, t, fields) {
    if (!keys.length) return {};
    if (t <= keys[0].t) return keys[0];
    const last = keys[keys.length - 1];
    if (t >= last.t) return last;
    let i = 0;
    while (keys[i + 1].t < t) i++;
    const a = keys[i], b = keys[i + 1];
    const k = ease((t - a.t) / (b.t - a.t));
    const out = { t };
    for (const f of fields) out[f] = lerp(a[f] ?? 0, b[f] ?? 0, k);
    return out;
  }

  class Engine {
    constructor(svg, W, H) {
      this.svg = svg; this.W = W; this.H = H;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      this.defs = el('defs', null, svg);
      this.buildPaper();
      this.cam = el('g', { id: 'camera' }, svg);
      this.paperRect = el('rect', { x: -20000, y: -20000, width: 60000, height: 60000, fill: 'url(#paperTex)' }, this.cam);
      this.world = el('g', { id: 'world' }, this.cam);
      this.overlay = el('g', { id: 'overlay' }, svg);
      this.hand = global.DrawingHand.create();
      this.hand.setAttribute('transform', `translate(${W + 400} ${H + 400})`);
      this.overlay.appendChild(this.hand);
      this.strokes = [];   // pen events the hand follows
      this.fades = [];     // fills / reveals without a pen
      this.anims = [];     // functions of t (character poses, blinking…)
      this.camKeys = [];
      this.scenes = [];
      this.handScale = W > H ? 0.62 : 0.78;
      this.uid = 0;
    }

    buildPaper() {
      // Cream paper with a subtle fibre texture, generated once into a tile.
      const c = document.createElement('canvas');
      c.width = c.height = 512;
      const g = c.getContext('2d');
      g.fillStyle = '#f4ecdc';
      g.fillRect(0, 0, 512, 512);
      const r = global.PenFont.rng(7);
      const img = g.getImageData(0, 0, 512, 512);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = (r() - 0.5) * 10;
        img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n * 0.8;
      }
      g.putImageData(img, 0, 0);
      g.globalAlpha = 0.05;
      g.strokeStyle = '#8a7356';
      for (let i = 0; i < 140; i++) {
        const x = r() * 512, y = r() * 512, a = r() * Math.PI, l = 6 + r() * 22;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
      }
      const pat = el('pattern', { id: 'paperTex', patternUnits: 'userSpaceOnUse', width: 512, height: 512 }, this.defs);
      el('image', { href: c.toDataURL('image/png'), width: 512, height: 512 }, pat);
    }

    // ---------------------------------------------------------------- scenes
    addScene(scene, build) {
      const g = el('g', { id: 'scene-' + scene.id, 'data-scene': scene.id }, this.world);
      const s = { ...scene, g, strokes: [] };
      this.scenes.push(s);
      this.current = s;
      build(this.api(s));
      for (const k of scene.cam || []) this.camKeys.push(k);
      return s;
    }

    finalize() {
      this.camKeys.sort((a, b) => a.t - b.t);
      this.strokes.sort((a, b) => a.t0 - b.t0);
      // Visibility windows: a scene is shown from its start until `until`
      // (default: a few seconds into the next scene, covering pans/erases).
      this.scenes.forEach((s, i) => {
        const next = this.scenes[i + 1];
        s.from = s.showFrom ?? s.start;
        s.until = s.keepUntil ?? (next ? next.start + 4 : Infinity);
      });
    }

    // ------------------------------------------------------------ primitives
    registerStroke(path, t0, dur, opts = {}) {
      const len = path.getTotalLength();
      const s = { el: path, len, t0, dur: Math.max(0.02, dur), scene: this.current, hidden: !!opts.hidden, onP: opts.onP, last: -1 };
      if (!s.hidden) {
        path.style.strokeDasharray = `${len + 1} ${len + 1}`;
        path.style.strokeDashoffset = len + 1;
      }
      this.strokes.push(s);
      this.current.strokes.push(s);
      return s;
    }

    api(scene) {
      const E = this;
      const ox = scene.origin?.[0] || 0, oy = scene.origin?.[1] || 0;
      scene.g.setAttribute('transform', `translate(${ox} ${oy})`);
      const A = {
        E, scene, NS, el, INK,
        group(attrs, parent) { return el('g', attrs, parent || scene.g); },
        // A pen stroke. `speed` in px/s (scene units) or explicit `dur`.
        path(d, o = {}) {
          const p = el('path', {
            d, fill: 'none', stroke: o.color || INK, 'stroke-width': o.w ?? 7,
            'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: o.transform,
            opacity: o.opacity,
          }, o.parent || scene.g);
          const len = p.getTotalLength() * (o.lenScale || 1);
          const dur = o.dur ?? Math.max(0.08, len / (o.speed || 900));
          const s = E.registerStroke(p, o.t, dur, o);
          s.end = o.t + s.dur;
          return s;
        },
        // Draw a list of path specs one after another; returns end time.
        seq(t, specs, o = {}) {
          let cur = t;
          for (const sp of specs) {
            const spec = typeof sp === 'string' ? { d: sp } : sp;
            const s = A.path(spec.d, { ...o, ...spec, t: cur });
            cur = s.end + (spec.gap ?? o.gap ?? 0.06);
          }
          return cur;
        },
        // Draw several strokes in order. With `dur`, the strokes share that
        // time in proportion to their length (constant pen speed); otherwise
        // each stroke takes len / speed.
        draw(specs, o) {
          const ls = o.lenScale || 1;
          const items = specs.filter(Boolean).map((sp) => {
            const p = el('path', {
              d: sp.d, fill: 'none', stroke: sp.color || o.color || INK, 'stroke-width': sp.w ?? o.w ?? 6,
              'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: sp.transform,
            }, sp.parent || o.parent || scene.g);
            return { p, len: p.getTotalLength() * (sp.lenScale || ls), sp };
          });
          const gap = o.gap ?? 0.05;
          const total = items.reduce((a, b) => a + b.len, 0) || 1;
          const durs = o.dur
            ? items.map((i) => Math.max(0.03, (o.dur - gap * (items.length - 1)) * i.len / total))
            : items.map((i) => Math.max(0.05, i.len / (o.speed || 900)));
          let cur = o.t;
          const strokes = items.map((it, k) => {
            const s = E.registerStroke(it.p, cur, durs[k]);
            cur += durs[k] + (k < items.length - 1 ? gap : 0);
            return s;
          });
          return { end: cur, strokes, paths: items.map((i) => i.p) };
        },
        fade(target, t, dur = 0.5, to = 1) {
          target.setAttribute('opacity', 0);
          E.fades.push({ el: target, t0: t, dur, to, scene });
          return t + dur;
        },
        anim(fn) { E.anims.push({ fn, scene }); },
        // Hand-written English text with the single-stroke pen font.
        text(str, o) {
          const size = o.size || 80;
          const w = global.PenFont.measure(str, size);
          const x = o.anchor === 'start' ? o.x : o.anchor === 'end' ? o.x - w : o.x - w / 2;
          const L = global.PenFont.layout(str, x, o.y, size, o.seed);
          const g = el('g', { class: 'pen-text' }, o.parent || scene.g);
          const sw = o.w ?? Math.max(5, size * 0.085);
          const colorAt = o.colorAt || (() => o.color || INK);
          const specs = L.strokes.map((st) => ({
            d: st.d, transform: st.transform, parent: g, color: colorAt(st.index, st.char),
            w: +(sw * 100 / size).toFixed(2), lenScale: size / 100,
          }));
          const r = A.draw(specs, { t: o.t, dur: o.dur, speed: o.speed || 700, gap: o.gap ?? 0.035 });
          return { g, end: r.end, x, y: o.y, w, h: size, strokes: r.strokes, size };
        },
        // Wrap a sentence into centred lines no wider than maxW and write it.
        para(str, o) {
          const size = o.size || 70;
          const words = str.split(' ');
          const lines = [];
          let cur = '';
          for (const w of words) {
            const tryL = cur ? cur + ' ' + w : w;
            if (cur && global.PenFont.measure(tryL, size) > o.maxW) { lines.push(cur); cur = w; } else cur = tryL;
          }
          if (cur) lines.push(cur);
          const lh = o.lineH || size * 1.45;
          const totalChars = str.replace(/ /g, '').length;
          let t = o.t;
          const out = [];
          let idx = 0;
          lines.forEach((ln, i) => {
            const share = o.dur ? (o.dur - 0.15 * (lines.length - 1)) * ln.replace(/ /g, '').length / totalChars : undefined;
            const off = idx;
            const r = A.text(ln, { ...o, y: o.y + i * lh, t, dur: share, colorAt: o.colorAt ? (k, ch) => o.colorAt(k + off, ch) : undefined });
            idx += ln.length + 1;
            r.str = ln;
            out.push(r);
            t = r.end + 0.15;
          });
          return { lines: out, lineStrs: lines, end: out[out.length - 1].end, h: lh * lines.length, n: lines.length };
        },
        // Arabic is shaped by the browser (correct joining + RTL), then
        // revealed right-to-left while the hand travels along the line.
        ar(str, o) {
          const size = o.size || 56;
          const g = el('g', { class: 'ar-text' }, o.parent || scene.g);
          const id = 'arclip' + (E.uid++);
          const cp = el('clipPath', { id }, E.defs);
          const t = el('text', {
            x: o.x, y: o.y, 'font-family': 'Cairo, "DejaVu Sans", sans-serif', 'font-weight': o.weight || 700,
            'font-size': size, fill: o.color || INK, 'text-anchor': o.anchor || 'middle', direction: 'rtl',
            'clip-path': `url(#${id})`,
          }, g);
          t.textContent = str;
          const bb = { x: o.x - (o.wGuess || size * str.length * 0.42) / 2, w: o.wGuess || size * str.length * 0.42 };
          if (o.anchor === 'start') bb.x = o.x - bb.w; // rtl start = right edge
          if (o.anchor === 'end') bb.x = o.x;
          const rect = el('rect', { x: bb.x + bb.w, y: o.y - size * 1.2, width: 0, height: size * 1.8 }, cp);
          const right = bb.x + bb.w, left = bb.x;
          const yb = o.y - size * 0.3;
          const trace = el('path', { d: `M${right} ${yb} L${left} ${yb}`, fill: 'none', stroke: 'none' }, g);
          const dur = o.dur ?? Math.max(0.5, bb.w / (o.speed || 650));
          const s = E.registerStroke(trace, o.t, dur, {
            hidden: true,
            onP: (p) => { rect.setAttribute('x', right - bb.w * p - 4); rect.setAttribute('width', bb.w * p + 8); },
          });
          // measure real width once fonts are in, so the reveal matches the text
          A.later(() => {
            try {
              const b = t.getBBox();
              if (b.width > 0) {
                const R = b.x + b.width, Lx = b.x;
                trace.setAttribute('d', `M${R + 6} ${yb} L${Lx - 6} ${yb}`);
                s.len = trace.getTotalLength();
                s.onP = (p) => { rect.setAttribute('x', R + 6 - (b.width + 12) * p); rect.setAttribute('width', (b.width + 12) * p + 2); };
              }
            } catch (e) { /* keep the estimate */ }
          });
          return { g, text: t, end: o.t + dur };
        },
        later(fn) { (E.lateFns ||= []).push(fn); },
        // ---- hand-drawn helpers
        arrow(x1, y1, x2, y2, o = {}) {
          const bend = o.bend ?? 0.12;
          const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
          const s1 = A.path(`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, { ...o, t: o.t });
          const ang = Math.atan2(y2 - my, x2 - mx), hl = o.head || 34;
          const a1 = ang + 2.6, a2 = ang - 2.6;
          const s2 = A.path(`M${x2 + Math.cos(a1) * hl} ${y2 + Math.sin(a1) * hl} L${x2} ${y2} L${x2 + Math.cos(a2) * hl} ${y2 + Math.sin(a2) * hl}`, { ...o, t: s1.end + 0.05, speed: 700 });
          return { end: s2.end };
        },
        loop(cx, cy, rx, ry, o = {}) {
          // an ellipse drawn by hand: starts top-left, overshoots slightly
          const r = global.PenFont.rng(Math.round(cx * 7 + cy * 13));
          const pts = [];
          const n = 28, a0 = -2.2, turns = 1.08;
          for (let i = 0; i <= n; i++) {
            const a = a0 + (i / n) * Math.PI * 2 * turns;
            const k = 1 + (r() - 0.5) * 0.05;
            pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
          }
          return A.path(A.smooth(pts), o);
        },
        underline(x1, x2, y, o = {}) {
          return A.path(`M${x1} ${y} Q${(x1 + x2) / 2} ${y + 10} ${x2} ${y - 4}`, { w: 8, ...o });
        },
        cross(x, y, w, h, o = {}) {
          const a = A.path(`M${x} ${y} L${x + w} ${y + h}`, { color: '#b23a2b', w: 10, speed: 1400, ...o });
          const b = A.path(`M${x + w} ${y} L${x} ${y + h}`, { color: '#b23a2b', w: 10, speed: 1400, ...o, t: a.end + 0.08 });
          return { end: b.end };
        },
        check(x, y, s, o = {}) {
          return A.path(`M${x - s * 0.5} ${y} L${x - s * 0.1} ${y + s * 0.4} L${x + s * 0.6} ${y - s * 0.5}`, { color: '#2e6a4a', w: 12, speed: 1000, ...o });
        },
        smooth(pts) {
          let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
          for (let i = 1; i < pts.length - 1; i++) {
            const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
            d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
          }
          const l = pts[pts.length - 1];
          return d + ` L${l[0].toFixed(1)} ${l[1].toFixed(1)}`;
        },
        // Wipe-erase a whole scene group with the side of the hand: the hand
        // follows a zig-zag and the same zig-zag path, stroked wide in a mask,
        // removes the ink it passes over.
        erase(target, x, y, w, h, t, dur) {
          const id = 'erase' + (E.uid++);
          const m = el('mask', { id, maskUnits: 'userSpaceOnUse', x: -20000, y: -20000, width: 60000, height: 60000 }, E.defs);
          el('rect', { x: -20000, y: -20000, width: 60000, height: 60000, fill: 'white' }, m);
          const rows = Math.max(2, Math.ceil(h / 200));
          let d = `M${x - 60} ${y + 40}`;
          for (let i = 0; i < rows; i++) {
            const yy = y + 40 + (i * (h - 80)) / Math.max(1, rows - 1);
            d += ` L${i % 2 ? x - 60 : x + w + 60} ${yy}`;
            if (i < rows - 1) d += ` L${i % 2 ? x - 60 : x + w + 60} ${y + 40 + ((i + 1) * (h - 80)) / Math.max(1, rows - 1)}`;
          }
          const p = el('path', { d, fill: 'none', stroke: 'black', 'stroke-width': Math.max(260, (h / rows) * 1.5), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, m);
          target.setAttribute('mask', `url(#${id})`);
          // the erase trace is placed in the target's coordinate space
          const trace = el('path', { d, fill: 'none', stroke: 'none' }, target.parentNode);
          const len = p.getTotalLength();
          p.style.strokeDasharray = `${len + 1} ${len + 1}`;
          const s = E.registerStroke(trace, t, dur, { hidden: true, onP: (k) => { p.style.strokeDashoffset = (len + 1) * (1 - k); } });
          s.erase = true;
          p.style.strokeDashoffset = len + 1;
          return t + dur;
        },
      };
      return A;
    }

    // ---------------------------------------------------------------- render
    render(t) {
      if (this.lateFns) { this.lateFns.forEach((f) => f()); this.lateFns = null; }
      // camera: (x, y) = paper point at stage centre, z = zoom
      const c = track(this.camKeys, t, ['x', 'y', 'z', 'r']);
      const z = c.z || 1;
      this.cam.setAttribute('transform', `translate(${this.W / 2} ${this.H / 2}) rotate(${c.r || 0}) scale(${z}) translate(${-c.x} ${-c.y})`);

      for (const s of this.scenes) {
        const vis = t >= s.from - 0.001 && t < s.until;
        if (vis !== s.vis) { s.g.style.display = vis ? '' : 'none'; s.vis = vis; }
      }

      for (const s of this.strokes) {
        // erasers / reveals (onP) must stay in sync even while their own
        // scene is hidden, otherwise seeking backwards could leave ink erased
        if (!s.scene.vis && !s.onP) continue;
        const p = clamp01((t - s.t0) / s.dur);
        if (p === s.last) continue;
        s.last = p;
        if (s.onP) s.onP(p);
        if (s.hidden) continue;
        if (p <= 0) { s.el.style.visibility = 'hidden'; s.el.style.strokeDasharray = `${s.len + 1} ${s.len + 1}`; }
        else if (p >= 1) { s.el.style.visibility = ''; s.el.style.strokeDasharray = 'none'; }
        else {
          s.el.style.visibility = '';
          s.el.style.strokeDasharray = `${s.len + 1} ${s.len + 1}`;
          s.el.style.strokeDashoffset = (s.len + 1) * (1 - p);
        }
      }
      for (const f of this.fades) {
        if (!f.scene.vis) continue;
        const k = clamp01((t - f.t0) / f.dur);
        f.el.setAttribute('opacity', (k * f.to).toFixed(3));
      }
      for (const a of this.anims) if (a.scene.vis) a.fn(t);
      this.placeHand(t);
    }

    // Screen position of the pen on stroke s at progress p.
    penPoint(s, p) {
      const L = s.len * p;
      const pt = s.el.getPointAtLength(Math.min(L, s.el.getTotalLength()));
      const m = s.el.getCTM();
      if (!m) return null;
      return [m.a * pt.x + m.c * pt.y + m.e, m.b * pt.x + m.d * pt.y + m.f];
    }

    placeHand(t) {
      const S = this.strokes;
      // binary search: last stroke with t0 <= t
      let lo = 0, hi = S.length - 1, idx = -1;
      while (lo <= hi) { const mid = (lo + hi) >> 1; if (S[mid].t0 <= t) { idx = mid; lo = mid + 1; } else hi = mid - 1; }
      // stroke currently being drawn (latest one that is still in progress)
      let active = null;
      for (let i = idx; i >= 0 && i > idx - 12; i--) if (t < S[i].t0 + S[i].dur) { active = S[i]; break; }
      const rest = [this.W + 260, this.H + 420];
      let pos = rest, lift = 0, rot = 0;
      if (active && active.scene.vis) {
        pos = this.penPoint(active, clamp01((t - active.t0) / active.dur)) || rest;
        if (active.erase) rot = -18;
      } else {
        // between strokes: travel from previous end to next start, or rest
        let prev = null;
        for (let i = idx; i >= 0; i--) { if (S[i].scene.vis) { prev = S[i]; break; } }
        const next = S[idx + 1];
        const prevEnd = prev ? prev.t0 + prev.dur : -Infinity;
        const nextStart = next ? next.t0 : Infinity;
        const gap = nextStart - prevEnd;
        const a = prev && prev.scene.vis ? this.penPoint(prev, 1) : null;
        const b = next && next.scene.vis ? this.penPoint(next, 0) : null;
        if (a && b && gap <= 1.4) {
          const k = ease(clamp01((t - prevEnd) / gap));
          pos = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
          lift = Math.sin(Math.PI * k) * Math.min(1, gap * 2);
        } else {
          const out = 0.55;
          if (a && t - prevEnd < out) {
            const k = ease((t - prevEnd) / out);
            pos = [lerp(a[0], rest[0], k), lerp(a[1], rest[1], k)];
          } else if (b && nextStart - t < out) {
            const k = ease(1 - (nextStart - t) / out);
            pos = [lerp(rest[0], b[0], k), lerp(rest[1], b[1], k)];
          }
        }
      }
      const sc = this.handScale * (1 + lift * 0.06);
      this.hand.setAttribute('transform', `translate(${pos[0].toFixed(1)} ${(pos[1] - lift * 14).toFixed(1)}) rotate(${rot}) scale(${sc.toFixed(3)})`);
    }

    duration() { return this.scenes.length ? this.scenes[this.scenes.length - 1].end : 0; }
  }

  global.Whiteboard = { Engine, track, ease, clamp01, lerp, el, INK };
})(window);
