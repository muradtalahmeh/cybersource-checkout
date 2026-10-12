// Doodle art library: characters and objects, all built from pen strokes so
// they are drawn progressively by the hand. Every builder takes the scene API
// `A`, a start time, and returns at least { end } (the time drawing finishes).
(function (global) {
  const { el, track, INK } = global.Whiteboard;
  const C = {
    ink: INK, cream: '#f4ecdc', beige: '#e3cfa8', beigeDark: '#c9b083', green: '#2e6a4a', greenLight: '#7fb08f',
    red: '#b23a2b', skin: '#f2d6bf', hairDark: '#2b2522', hairBrown: '#5a3a26', hairGray: '#c9c3ba',
  };
  const rad = (d) => (d * Math.PI) / 180;
  const f1 = (n) => n.toFixed(1);

  // A fill shape that fades in under the ink once the outline is drawn.
  function fillShape(A, parent, d, color, t, dur = 0.45, extra) {
    const p = el('path', { d, fill: color, stroke: 'none', ...extra }, parent);
    A.fade(p, t, dur);
    return p;
  }

  // ------------------------------------------------------------ characters
  const DEFAULT_POSE = { aL: [14, 8], aR: [14, 8], lL: [5, 0], lR: [5, 0], head: 0, dy: 0, lean: 0, x: 0, mouth: 'smile', eyes: 'open', brows: 0 };
  const POSE_FIELDS = ['head', 'dy', 'lean', 'x', 'brows'];

  function limb(sx, sy, side, a1, a2, l1, l2, w) {
    const s = side; // -1 left, +1 right
    const d1 = [s * Math.sin(rad(a1)), Math.cos(rad(a1))];
    const d2 = [s * Math.sin(rad(a1 + a2)), Math.cos(rad(a1 + a2))];
    const E = [sx + d1[0] * l1, sy + d1[1] * l1];
    const W = [E[0] + d2[0] * l2, E[1] + d2[1] * l2];
    const n1 = [-d1[1], d1[0]], n2 = [-d2[1], d2[0]];
    let na = [n1[0] + n2[0], n1[1] + n2[1]];
    const nl = Math.hypot(na[0], na[1]) || 1;
    na = [na[0] / nl, na[1] / nl];
    const h = w / 2;
    const P = (p, n, k) => `${f1(p[0] + n[0] * k)} ${f1(p[1] + n[1] * k)}`;
    const outline = `M${P([sx, sy], n1, h)} L${P(E, na, h)} L${P(W, n2, h)} L${P(W, n2, -h)} L${P(E, na, -h)} L${P([sx, sy], n1, -h)}`;
    return { E, W, d1, d2, outline, closed: outline + ' Z' };
  }

  function character(A, o) {
    const kind = o.kind || 'boy';
    const sc = o.scale || 1;
    const flip = o.flip ? -1 : 1;
    const keys = (o.keys || []).map((k) => ({ ...DEFAULT_POSE, ...o.pose, ...k }));
    const base = { ...DEFAULT_POSE, ...o.pose };
    const root = A.group({ transform: `translate(${o.x} ${o.y}) scale(${sc * flip} ${sc})` }, o.parent);
    const body = el('g', {}, root);
    const gLegs = el('g', {}, body), gTorso = el('g', {}, body), gArmL = el('g', {}, body), gArmR = el('g', {}, body);
    const gHead = el('g', {}, body);
    const W = 6;
    const shirt = o.shirt || (kind === 'boy' ? C.green : kind === 'girl' ? C.beige : '#b9a6c9');
    const pants = o.pants || (kind === 'boy' ? C.beigeDark : C.skin);
    const specs = [];
    const fills = [];

    // ---- head
    const hy = -318;
    specs.push({ d: `M0 ${hy - 60} C-34 ${hy - 60} -56 ${hy - 34} -56 ${hy} C-56 ${hy + 38} -30 ${hy + 60} 0 ${hy + 60} C30 ${hy + 60} 56 ${hy + 38} 56 ${hy} C56 ${hy - 34} 34 ${hy - 60} 0 ${hy - 60}`, parent: gHead, part: 'head' });
    fills.push([gHead, `M0 ${hy - 60} C-34 ${hy - 60} -56 ${hy - 34} -56 ${hy} C-56 ${hy + 38} -30 ${hy + 60} 0 ${hy + 60} C30 ${hy + 60} 56 ${hy + 38} 56 ${hy} C56 ${hy - 34} 34 ${hy - 60} 0 ${hy - 60}Z`, C.skin, 'head']);
    // ears
    specs.push({ d: `M-54 ${hy - 6} Q-72 ${hy - 12} -70 ${hy + 8} Q-66 ${hy + 22} -52 ${hy + 16}`, parent: gHead });
    specs.push({ d: `M54 ${hy - 6} Q72 ${hy - 12} 70 ${hy + 8} Q66 ${hy + 22} 52 ${hy + 16}`, parent: gHead });
    // hair
    const gHair = el('g', {}, gHead);
    if (kind === 'boy') {
      const top = `M-56 ${hy - 4} Q-62 ${hy - 76} 0 ${hy - 70} Q62 ${hy - 76} 58 ${hy - 4}`;
      const fringe = `M-56 ${hy - 4} L-46 ${hy - 34} L-34 ${hy - 22} L-20 ${hy - 44} L-8 ${hy - 26} L8 ${hy - 46} L20 ${hy - 28} L36 ${hy - 44} L44 ${hy - 24} L58 ${hy - 4}`;
      specs.push({ d: top, parent: gHair }, { d: fringe, parent: gHair });
      fills.push([gHair, top + ` L44 ${hy - 24} L36 ${hy - 44} L20 ${hy - 28} L8 ${hy - 46} L-8 ${hy - 26} L-20 ${hy - 44} L-34 ${hy - 22} L-46 ${hy - 34} Z`, C.hairDark]);
    } else if (kind === 'girl') {
      const outer = `M-58 ${hy + 34} C-76 ${hy - 40} -40 ${hy - 82} 4 ${hy - 76} C52 ${hy - 72} 76 ${hy - 36} 60 ${hy + 34}`;
      const bangs = `M-58 ${hy + 34} C-60 ${hy + 6} -56 ${hy - 10} -50 ${hy - 20} C-30 ${hy - 52} -6 ${hy - 50} 2 ${hy - 36} C14 ${hy - 54} 44 ${hy - 50} 54 ${hy - 20} C58 ${hy - 10} 62 ${hy + 6} 60 ${hy + 34}`;
      const tail = `M50 ${hy - 50} C96 ${hy - 70} 112 ${hy - 10} 92 ${hy + 50} C86 ${hy + 20} 80 ${hy - 10} 62 ${hy - 26}`;
      specs.push({ d: outer, parent: gHair }, { d: bangs, parent: gHair }, { d: tail, parent: gHair });
      fills.push([gHair, outer + ` C62 ${hy + 6} 58 ${hy - 10} 54 ${hy - 20} C44 ${hy - 50} 14 ${hy - 54} 2 ${hy - 36} C-6 ${hy - 50} -30 ${hy - 52} -50 ${hy - 20} C-56 ${hy - 10} -60 ${hy + 6} -58 ${hy + 34} Z`, C.hairBrown]);
      fills.push([gHair, tail + ' Z', C.hairBrown]);
      specs.push({ d: `M54 ${hy - 50} l8 -10 l8 12 z`, parent: gHair, color: C.green });
    } else if (kind === 'grandma') {
      const cap = `M-58 ${hy + 4} C-66 ${hy - 60} -30 ${hy - 72} 0 ${hy - 70} C34 ${hy - 72} 66 ${hy - 60} 58 ${hy + 4} C40 ${hy - 30} -40 ${hy - 30} -58 ${hy + 4}`;
      const bun = `M-24 ${hy - 66} C-30 ${hy - 110} 30 ${hy - 110} 24 ${hy - 66}`;
      specs.push({ d: bun, parent: gHair }, { d: cap, parent: gHair });
      fills.push([gHair, cap + ' Z', C.hairGray]);
      fills.push([gHair, bun + ' Z', C.hairGray]);
    }

    // eyes (open / happy / closed / tired variants; swapped by pose)
    const gEyes = el('g', {}, gHead);
    const eyeOpen = el('g', {}, gEyes);
    [-20, 20].forEach((ex) => specs.push({ d: `M${ex} ${hy - 12} C${ex - 7} ${hy - 12} ${ex - 7} ${hy + 6} ${ex} ${hy + 6} C${ex + 7} ${hy + 6} ${ex + 7} ${hy - 12} ${ex} ${hy - 12}`, parent: eyeOpen, w: 5 }));
    const eyeDots = el('g', {}, eyeOpen);
    [-20, 20].forEach((ex) => el('ellipse', { cx: ex, cy: hy - 3, rx: 5.5, ry: 8.5, fill: INK }, eyeDots));
    [-18, 22].forEach((ex) => el('circle', { cx: ex, cy: hy - 7, r: 2, fill: '#fff' }, eyeDots));
    const eyeHappy = el('g', { style: 'display:none' }, gEyes);
    [-20, 20].forEach((ex) => el('path', { d: `M${ex - 9} ${hy} Q${ex} ${hy - 14} ${ex + 9} ${hy}`, fill: 'none', stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round' }, eyeHappy));
    const eyeTired = el('g', { style: 'display:none' }, gEyes);
    [-20, 20].forEach((ex) => {
      el('path', { d: `M${ex - 10} ${hy - 4} L${ex + 10} ${hy - 4}`, stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round' }, eyeTired);
      el('path', { d: `M${ex - 8} ${hy - 4} Q${ex} ${hy + 8} ${ex + 8} ${hy - 4}`, fill: INK }, eyeTired);
    });
    if (kind === 'grandma') {
      specs.push({ d: `M-36 ${hy - 3} a15 13 0 1 0 30 0 a15 13 0 1 0 -30 0 M-6 ${hy - 5} Q0 ${hy - 10} 6 ${hy - 5} M6 ${hy - 3} a15 13 0 1 0 30 0 a15 13 0 1 0 -30 0`, parent: gHead, w: 4 });
    }
    // brows
    const gBrows = el('g', {}, gHead);
    specs.push({ d: `M-32 ${hy - 26} Q-22 ${hy - 33} -10 ${hy - 27}`, parent: gBrows, w: 5 });
    specs.push({ d: `M10 ${hy - 27} Q22 ${hy - 33} 32 ${hy - 26}`, parent: gBrows, w: 5 });
    // nose
    specs.push({ d: `M3 ${hy + 4} Q10 ${hy + 16} -1 ${hy + 19}`, parent: gHead, w: 5 });
    // mouths
    const gMouth = el('g', {}, gHead);
    const my = hy + 34;
    const mouths = {
      smile: `M-18 ${my - 4} Q0 ${my + 14} 18 ${my - 4}`,
      grin: `M-22 ${my - 6} Q0 ${my + 24} 22 ${my - 6} Z`,
      open: `M-12 ${my} Q0 ${my + 22} 12 ${my} Q0 ${my - 6} -12 ${my} Z`,
      o: `M0 ${my - 6} C-9 ${my - 6} -9 ${my + 12} 0 ${my + 12} C9 ${my + 12} 9 ${my - 6} 0 ${my - 6}`,
      frown: `M-16 ${my + 8} Q0 ${my - 6} 16 ${my + 8}`,
      flat: `M-14 ${my + 3} L14 ${my + 3}`,
      yawn: `M0 ${my - 10} C-14 ${my - 10} -14 ${my + 22} 0 ${my + 22} C14 ${my + 22} 14 ${my - 10} 0 ${my - 10}`,
      talk: `M-14 ${my} Q0 ${my + 16} 14 ${my} Q0 ${my + 4} -14 ${my} Z`,
    };
    const mouthEls = {};
    for (const k in mouths) {
      const filled = k === 'grin' || k === 'open' || k === 'yawn' || k === 'talk';
      if (k === base.mouth) continue;
      mouthEls[k] = el('path', { d: mouths[k], fill: filled ? '#7a2e24' : 'none', stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', style: 'display:none' }, gMouth);
    }
    const firstMouth = { d: mouths[base.mouth], parent: gMouth, part: 'mouth' };
    specs.push(firstMouth);
    // cheeks
    const cheeks = el('g', {}, gHead);
    [-34, 34].forEach((cx) => el('ellipse', { cx, cy: hy + 22, rx: 9, ry: 5, fill: '#e8a58c', opacity: 0.55 }, cheeks));

    // ---- torso
    const torsoD = kind === 'girl' || kind === 'grandma'
      ? 'M-40 -244 Q0 -256 40 -244 L46 -160 L74 -58 Q0 -48 -74 -58 L-46 -160 Z'
      : 'M-46 -244 Q0 -256 46 -244 L52 -150 Q52 -112 44 -98 L-44 -98 Q-52 -112 -52 -150 Z';
    specs.push({ d: 'M-10 -262 L-10 -246 M10 -262 L10 -246', parent: gTorso });
    specs.push({ d: torsoD, parent: gTorso, part: 'torso' });
    specs.push({ d: 'M-16 -250 Q0 -232 16 -250', parent: gTorso, w: 5 });
    fills.push([gTorso, torsoD, shirt]);
    if (kind === 'grandma') specs.push({ d: 'M-30 -120 Q0 -110 30 -120', parent: gTorso, w: 4 });

    // ---- arms & legs (geometry from pose)
    const armL = { g: gArmL, side: -1, sx: -42, sy: -234 }, armR = { g: gArmR, side: 1, sx: 42, sy: -234 };
    const hipY = kind === 'boy' ? -100 : -70;
    const legL = { g: gLegs, side: -1, sx: -20, sy: hipY }, legR = { g: gLegs, side: 1, sx: 20, sy: hipY };
    const legLen = kind === 'boy' ? [52, 48] : [36, 36];
    function armGeo(a, p) { return limb(a.sx, a.sy, a.side, p[0], p[1], 66, 60, 22); }
    function legGeo(l, p) { return limb(l.sx, l.sy, l.side, p[0], p[1], legLen[0], legLen[1], kind === 'boy' ? 30 : 18); }
    function handD(geo) { const [x, y] = geo.W; const ex = x + geo.d2[0] * 8, ey = y + geo.d2[1] * 8; return `M${f1(ex)} ${f1(ey - 14)} C${f1(ex - 15)} ${f1(ey - 14)} ${f1(ex - 15)} ${f1(ey + 14)} ${f1(ex)} ${f1(ey + 14)} C${f1(ex + 15)} ${f1(ey + 14)} ${f1(ex + 15)} ${f1(ey - 14)} ${f1(ex)} ${f1(ey - 14)}`; }
    function sleeveD(a, geo) {
      const s = [a.sx, a.sy], d = geo.d1, n = [-d[1], d[0]], L = 30, h = 15;
      const e = [s[0] + d[0] * L, s[1] + d[1] * L];
      return `M${f1(s[0] + n[0] * h)} ${f1(s[1] + n[1] * h)} L${f1(e[0] + n[0] * h)} ${f1(e[1] + n[1] * h)} L${f1(e[0] - n[0] * h)} ${f1(e[1] - n[1] * h)} L${f1(s[0] - n[0] * h)} ${f1(s[1] - n[1] * h)} Z`;
    }
    function shoeD(geo, side) {
      const [x, y] = geo.W; const s = side;
      return `M${f1(x - s * 10)} ${f1(y - 4)} Q${f1(x + s * 8)} ${f1(y - 16)} ${f1(x + s * 30)} ${f1(y - 2)} Q${f1(x + s * 34)} ${f1(y + 8)} ${f1(x + s * 20)} ${f1(y + 8)} L${f1(x - s * 12)} ${f1(y + 8)} Z`;
    }
    const limbEls = [];
    function addLimb(L, geoFn, isArm, pose) {
      const geo = geoFn(L, pose);
      const fillEl = el('path', { d: geo.closed, fill: isArm ? C.skin : pants, stroke: 'none' }, L.g);
      fills.push([null, fillEl]);
      const ink = { d: geo.outline, parent: L.g };
      specs.push(ink);
      let sleeve = null, sleeveFill = null;
      if (isArm) {
        sleeveFill = el('path', { d: sleeveD(L, geo), fill: shirt, stroke: 'none' }, L.g);
        fills.push([null, sleeveFill]);
        sleeve = { d: sleeveD(L, geo), parent: L.g, w: 5 };
        specs.push(sleeve);
      }
      const endFill = el('path', { d: isArm ? handD(geo) : shoeD(geo, L.side), fill: isArm ? C.skin : C.ink, stroke: 'none' }, L.g);
      fills.push([null, endFill]);
      const end = { d: isArm ? handD(geo) : shoeD(geo, L.side), parent: L.g };
      specs.push(end);
      limbEls.push({ L, geoFn, isArm, fillEl, ink, sleeve, sleeveFill, endFill, end });
    }
    // legs are drawn after the torso; arms after legs
    const specsHeadTorso = specs.splice(0);
    addLimb(legL, legGeo, false, base.lL);
    addLimb(legR, legGeo, false, base.lR);
    addLimb(armL, armGeo, true, base.aL);
    addLimb(armR, armGeo, true, base.aR);
    const limbSpecs = specs.splice(0);
    const all = [...specsHeadTorso, ...limbSpecs];

    const r = A.draw(all, { t: o.t, dur: o.dur, speed: (o.speed || 1000) / sc, lenScale: sc, w: W, gap: 0.03 });
    // map specs back to the created paths
    all.forEach((sp, i) => { sp.el = r.paths[i]; });
    const drawnAt = r.end;
    // fills fade in once the outline is complete
    const fillT = drawnAt - 0.1;
    for (const f of fills.filter((f) => f[0] === null).reverse()) {
      f[1].parentNode.insertBefore(f[1], f[1].parentNode.firstChild); A.fade(f[1], fillT, 0.5);
    }
    for (const f of fills) {
      if (f[0] === null) continue;
      const p = el('path', { d: f[1], fill: f[2], stroke: 'none' }, f[0]);
      f[0].insertBefore(p, f[0].firstChild);
      A.fade(p, fillT, 0.5);
    }
    // eye dots and cheeks appear with the fills
    A.fade(eyeDots, fillT, 0.3);
    A.fade(cheeks, fillT, 0.5);

    // ---- animation (after the character is fully drawn)
    const seed = Math.abs(Math.round(o.x * 3 + o.y)) % 97;
    const firstMouthEl = firstMouth.el;
    mouthEls[base.mouth] = firstMouthEl;
    let lastMouth = base.mouth, lastEyes = 'open';
    A.anim((t) => {
      const live = t >= drawnAt;
      const p = live && keys.length ? poseAt(t) : base;
      // limbs
      for (const lm of limbEls) {
        const pose = lm.isArm ? (lm.L === armL ? p.aL : p.aR) : (lm.L === legL ? p.lL : p.lR);
        const geo = lm.geoFn(lm.L, pose);
        lm.fillEl.setAttribute('d', geo.closed);
        lm.ink.el.setAttribute('d', geo.outline);
        const ed = lm.isArm ? handD(geo) : shoeD(geo, lm.L.side);
        lm.end.el.setAttribute('d', ed); lm.endFill.setAttribute('d', ed);
        if (lm.isArm) { const sd = sleeveD(lm.L, geo); lm.sleeve.el.setAttribute('d', sd); lm.sleeveFill.setAttribute('d', sd); }
      }
      gHead.setAttribute('transform', `rotate(${(p.head || 0).toFixed(2)} 0 -258)`);
      body.setAttribute('transform', `translate(${(p.x || 0).toFixed(1)} ${(p.dy || 0).toFixed(1)}) rotate(${(p.lean || 0).toFixed(2)} 0 0)`);
      gBrows.setAttribute('transform', `translate(0 ${(-(p.brows || 0) * 6).toFixed(1)})`);
      // expressions
      const mouth = live ? p.mouth : base.mouth;
      if (mouth !== lastMouth) {
        for (const k in mouthEls) mouthEls[k].style.display = k === mouth ? '' : 'none';
        lastMouth = mouth;
      }
      let eyes = live ? p.eyes : 'open';
      // deterministic blinking
      if (live && eyes === 'open') {
        const period = 3.3 + (seed % 7) * 0.23;
        const ph = (t + seed * 0.37) % period;
        if (ph < 0.13) eyes = 'blink';
      }
      if (eyes !== lastEyes) {
        eyeOpen.style.display = eyes === 'open' || eyes === 'blink' ? '' : 'none';
        eyeOpen.setAttribute('transform', eyes === 'blink' ? `translate(0 ${hy - 3}) scale(1 0.12) translate(0 ${-(hy - 3)})` : '');
        eyeHappy.style.display = eyes === 'happy' ? '' : 'none';
        eyeTired.style.display = eyes === 'tired' ? '' : 'none';
        lastEyes = eyes;
      }
    });
    function poseAt(t) {
      // numeric fields eased; arrays eased element-wise; categorical step
      if (t <= keys[0].t) return { ...base, ...(t >= keys[0].t ? keys[0] : {}) };
      let i = 0;
      while (i < keys.length - 1 && keys[i + 1].t <= t) i++;
      const a = keys[i], b = keys[i + 1];
      if (!b) return a;
      const span = b.dur ?? Math.min(0.6, b.t - a.t);
      const k0 = (t - (b.t - span)) / span;
      if (k0 <= 0) return a;
      const k = global.Whiteboard.ease(Math.min(1, k0));
      const out = { ...a };
      for (const f of POSE_FIELDS) out[f] = a[f] + (b[f] - a[f]) * k;
      for (const f of ['aL', 'aR', 'lL', 'lR']) out[f] = [a[f][0] + (b[f][0] - a[f][0]) * k, a[f][1] + (b[f][1] - a[f][1]) * k];
      out.mouth = k > 0.5 ? b.mouth : a.mouth;
      out.eyes = k > 0.5 ? b.eyes : a.eyes;
      return out;
    }
    // Keys are "arrive at pose by t": we shift so pose b is reached at b.t
    // (the transition starts `dur` seconds earlier).
    if (keys.length) keys.unshift({ ...base, t: drawnAt });
    const headPos = { x: o.x, y: o.y + (hy) * sc };
    return { end: drawnAt, g: root, head: headPos, scale: sc, top: o.y - 400 * sc, mouthPos: { x: o.x + 0, y: o.y + (hy + 40) * sc } };
  }

  // Two-bone IK: shoulder/elbow angles that put an arm's hand at (tx, ty)
  // in character coordinates (side -1 = left arm, +1 = right arm).
  function reach(side, tx, ty) {
    const sx = 42 * side, sy = -234, l1 = 66, l2 = 60;
    let dx = tx - sx, dy = ty - sy, D = Math.hypot(dx, dy);
    D = Math.min(l1 + l2 - 0.5, Math.max(Math.abs(l1 - l2) + 0.5, D));
    const base = Math.atan2(dy, dx);
    const alpha = Math.acos((l1 * l1 + D * D - l2 * l2) / (2 * l1 * D));
    let best = null;
    for (const sg of [1, -1]) {
      const a = base + sg * alpha;
      const E = [sx + Math.cos(a) * l1, sy + Math.sin(a) * l1];
      if (!best || E[0] * side > best.E[0] * side) best = { E };
    }
    const E = best.E;
    const d1 = [(E[0] - sx) / l1, (E[1] - sy) / l1];
    const W = [sx + dx / Math.hypot(dx, dy) * 0 + (tx - sx), ty];
    const d2 = [(tx - E[0]), (ty - E[1])];
    const n2 = Math.hypot(d2[0], d2[1]) || 1;
    const A1 = Math.atan2(side * d1[0], d1[1]) * 180 / Math.PI;
    const A2 = Math.atan2(side * d2[0] / n2, d2[1] / n2) * 180 / Math.PI;
    let el2 = A2 - A1;
    while (el2 > 180) el2 -= 360;
    while (el2 < -180) el2 += 360;
    return [A1, el2];
  }

  // Common poses (shoulder/elbow angles in degrees, outward = positive)
  const P = {
    rest: {},
    wave: { aR: [150, 25], mouth: 'grin' },
    waveL: { aL: [150, 25], mouth: 'grin' },
    think: { aR: reach(1, 16, -262), head: -8, mouth: 'flat', brows: 1 },
    point: { aR: [95, -5] },
    pointUp: { aR: [160, 5] },
    shrug: { aL: [60, -100], aR: [60, -100], head: 6, mouth: 'flat', brows: 1 },
    cheer: { aL: [160, 10], aR: [160, 10], mouth: 'grin', eyes: 'happy', dy: -16 },
    no: { aR: reach(1, 70, -300), aL: [14, 8], head: -8, mouth: 'frown', brows: -0.5 },
    tired: { aL: [6, 4], aR: [6, 4], head: 12, mouth: 'yawn', eyes: 'tired', lean: 3, dy: 6 },
    ask: { aR: [70, -60], mouth: 'talk', head: -5 },
    hold: { aR: reach(1, 70, -150) },
    holdL: { aL: reach(-1, -70, -150) },
    chin: { aR: reach(1, 16, -262) },
    kick: { lR: [55, -10], aL: [60, 10], aR: [40, 20], mouth: 'grin' },
  };

  // ---------------------------------------------------------------- objects
  function bubble(A, o) {
    // speech bubble: rounded rect + tail pointing to (tx, ty)
    const { x, y, w, h } = o, r = Math.min(40, h / 3);
    const tx = o.tx ?? x + w * 0.3, ty = o.ty ?? y + h + 60;
    const bx = Math.max(x + r + 10, Math.min(x + w - r - 70, tx - 30));
    const d = `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} L${bx + 60} ${y + h} L${tx} ${ty} L${bx} ${y + h} L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`;
    const g = A.group({}, o.parent);
    fillShape(A, g, d, o.fill || '#fffaf0', o.t + 0.3, 0.4);
    return A.draw([{ d, parent: g }], { t: o.t, dur: o.dur, speed: o.speed || 1600, w: 6 });
  }

  function thought(A, o) {
    // cloud bubble made of arcs + two small trailing circles toward (tx, ty)
    const { x, y, w, h } = o;
    const n = Math.max(6, Math.round((w + h) / 110));
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      pts.push([x + w / 2 + Math.cos(a) * w / 2, y + h / 2 + Math.sin(a) * h / 2]);
    }
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      const cx = x + w / 2, cy = y + h / 2;
      const ox = (mx - cx) * 0.32, oy = (my - cy) * 0.32;
      d += ` Q${f1(mx + ox)} ${f1(my + oy)} ${f1(q[0])} ${f1(q[1])}`;
    }
    const g = A.group({}, o.parent);
    fillShape(A, g, d + 'Z', '#fffaf0', o.t + 0.2, 0.4);
    const sx = o.tx, sy = o.ty;
    const ex = x + w / 2 + (sx - (x + w / 2)) * 0.35, ey = y + h + 10;
    const c1 = [sx + (ex - sx) * 0.25, sy + (ey - sy) * 0.25], c2 = [sx + (ex - sx) * 0.62, sy + (ey - sy) * 0.62];
    const circ = (c, r) => `M${f1(c[0])} ${f1(c[1] - r)} a${r} ${r} 0 1 0 0.1 0`;
    return A.draw([{ d: circ(c1, 10), parent: g }, { d: circ(c2, 18), parent: g }, { d, parent: g }], { t: o.t, dur: o.dur, speed: 1800, w: 6 });
  }

  function tv(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const screenFill = el('rect', { x: -130, y: -90, width: 260, height: 170, rx: 14, fill: o.on ? '#dfe9df' : '#3b3a36' }, g);
    A.fade(screenFill, o.t + 0.4, 0.4);
    const specs = [
      { d: 'M-160 -120 L160 -120 Q172 -120 172 -108 L172 98 Q172 110 160 110 L-160 110 Q-172 110 -172 98 L-172 -108 Q-172 -120 -160 -120 Z' },
      { d: 'M-130 -90 L130 -90 L130 80 L-130 80 Z', w: 5 },
      { d: 'M-40 -120 L-90 -190 M40 -120 L90 -190' },
      { d: 'M-60 110 L-80 150 M60 110 L80 150' },
      { d: 'M146 -60 a8 8 0 1 0 0.1 0 M146 -20 a8 8 0 1 0 0.1 0', w: 4 },
    ];
    if (o.on) {
      specs.push({ d: 'M-120 70 L-60 -10 L-20 40 L30 -30 L120 70', w: 5, color: C.green }, { d: 'M70 -50 a18 18 0 1 0 0.1 0', w: 5 });
    }
    specs.forEach((sp) => (sp.parent = g));
    const r = A.draw(specs, { t: o.t, dur: o.dur, speed: (o.speed || 1300) / s, lenScale: s, w: 6 });
    return { ...r, g, screenFill };
  }

  function popcorn(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const cup = 'M-40 -30 L40 -30 L30 60 L-30 60 Z';
    fillShape(A, g, cup, '#f1e4c8', o.t + 0.5);
    return A.draw([
      { d: cup, parent: g }, { d: 'M-20 -30 L-15 60 M0 -30 L0 60 M20 -30 L15 60', parent: g, color: C.red, w: 5 },
      { d: 'M-40 -30 Q-46 -52 -26 -54 Q-20 -72 0 -64 Q16 -76 28 -56 Q48 -54 40 -30', parent: g },
    ], { t: o.t, dur: o.dur, speed: 900 / s, lenScale: s, w: 5 });
  }

  function ball(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const circle = 'M0 -40 C-22 -40 -40 -22 -40 0 C-40 22 -22 40 0 40 C22 40 40 22 40 0 C40 -22 22 -40 0 -40';
    fillShape(A, g, circle, '#fffaf0', o.t + 0.2);
    const pent = 'M0 -12 L11 -4 L7 10 L-7 10 L-11 -4 Z';
    const pf = el('path', { d: pent, fill: INK }, g); A.fade(pf, o.t + 0.6, 0.3);
    const r = A.draw([{ d: circle, parent: g }, { d: pent, parent: g, w: 4 }, { d: 'M0 -12 L0 -40 M11 -4 L36 -14 M7 10 L22 32 M-7 10 L-22 32 M-11 -4 L-36 -14', parent: g, w: 4 }], { t: o.t, dur: o.dur, speed: 900 / s, lenScale: s, w: 5 });
    return { ...r, g };
  }

  function calendar(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const page = 'M-120 -110 L120 -110 L120 130 L-120 130 Z';
    fillShape(A, g, page, '#fffaf0', o.t + 0.3);
    const head = el('rect', { x: -120, y: -110, width: 240, height: 54, fill: C.green }, g); A.fade(head, o.t + 0.5, 0.4);
    const specs = [{ d: page }, { d: 'M-120 -56 L120 -56', w: 5 }, { d: 'M-70 -128 L-70 -92 M70 -128 L70 -92', w: 8 }];
    const grid = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) grid.push([-90 + c * 60, -20 + r * 52]);
    grid.forEach(([x, y]) => specs.push({ d: `M${x - 14} ${y} L${x + 14} ${y}`, w: 4, color: '#8a7a62' }));
    specs.forEach((sp) => (sp.parent = g));
    const r = A.draw(specs, { t: o.t, dur: o.dur, speed: 1500 / s, lenScale: s, w: 6 });
    return { ...r, g, cell: (i) => ({ x: o.x + grid[i][0] * s, y: o.y + grid[i][1] * s }) };
  }

  function school(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const wall = 'M-170 0 L-170 -170 L170 -170 L170 0 Z', roof = 'M-195 -170 L0 -280 L195 -170 Z';
    fillShape(A, g, wall, '#efe0c2', o.t + 0.6); fillShape(A, g, roof, '#b5523b', o.t + 0.6);
    const door = 'M-30 0 L-30 -90 Q0 -110 30 -90 L30 0';
    fillShape(A, g, door + 'Z', C.green, o.t + 0.8);
    const specs = [{ d: wall }, { d: roof }, { d: door },
      { d: 'M-140 -140 L-80 -140 L-80 -90 L-140 -90 Z M80 -140 L140 -140 L140 -90 L80 -90 Z', w: 5 },
      { d: 'M0 -280 L0 -350 L50 -335 L0 -320', w: 5 },
      { d: 'M-24 -225 a24 24 0 1 0 0.1 0 M0 -225 L0 -238 M0 -225 L10 -222', w: 4 }];
    specs.forEach((sp) => (sp.parent = g));
    return A.draw(specs, { t: o.t, dur: o.dur, speed: 1500 / s, lenScale: s, w: 6 });
  }

  function phone(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) rotate(${o.rot || 0}) scale(${s})` }, o.parent);
    const body = 'M-34 -64 L34 -64 Q44 -64 44 -54 L44 54 Q44 64 34 64 L-34 64 Q-44 64 -44 54 L-44 -54 Q-44 -64 -34 -64 Z';
    fillShape(A, g, body, '#3b3a36', o.t + 0.3);
    const scr = el('rect', { x: -34, y: -50, width: 68, height: 92, fill: '#cfe3d6' }, g); A.fade(scr, o.t + 0.5, 0.3);
    const r = A.draw([{ d: body, parent: g }, { d: 'M-34 -50 L34 -50 L34 42 L-34 42 Z', parent: g, w: 4 }, { d: 'M-8 53 L8 53', parent: g, w: 4 },
      { d: 'M60 -70 L76 -86 M66 -40 L88 -44 M48 -84 L50 -106', parent: g, w: 4, color: C.green }], { t: o.t, dur: o.dur, speed: 900 / s, lenScale: s, w: 5 });
    return { ...r, g };
  }

  function clock(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const c = 'M0 -70 C-39 -70 -70 -39 -70 0 C-70 39 -39 70 0 70 C39 70 70 39 70 0 C70 -39 39 -70 0 -70';
    fillShape(A, g, c, '#fffaf0', o.t + 0.3);
    const hands = el('g', {}, g);
    const r = A.draw([{ d: c, parent: g }, { d: 'M0 -58 L0 -48 M58 0 L48 0 M0 58 L0 48 M-58 0 L-48 0', parent: g, w: 5 },
      { d: 'M0 0 L0 -44', parent: hands, w: 6 }, { d: 'M0 0 L30 0', parent: hands, w: 7, color: C.green }], { t: o.t, dur: o.dur, speed: 1000 / s, lenScale: s, w: 6 });
    if (o.spin) {
      // the hands run backwards: time going back to the past
      const [a, b] = o.spin;
      A.anim((t) => { const k = Math.max(0, Math.min(1, (t - a) / (b - a))); hands.setAttribute('transform', `rotate(${(-k * 720).toFixed(1)})`); });
    }
    return { ...r, g };
  }

  function box(A, o) {
    // rounded label box (used for sentence formulas)
    const { x, y, w, h } = o, r = 18;
    const d = `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`;
    const g = A.group({}, o.parent);
    fillShape(A, g, d, o.fill || '#fffaf0', o.t + 0.25, 0.35);
    return A.draw([{ d, parent: g, color: o.color }], { t: o.t, dur: o.dur || 0.6, w: 6 });
  }

  function bulb(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const glass = 'M-22 30 C-24 10 -50 -4 -50 -36 C-50 -66 -26 -84 0 -84 C26 -84 50 -66 50 -36 C50 -4 24 10 22 30 Z';
    fillShape(A, g, glass, '#f7e7a6', o.t + 0.5);
    return A.draw([{ d: glass, parent: g }, { d: 'M-20 42 L20 42 M-16 54 L16 54 M-10 64 L10 64', parent: g, w: 5 },
      { d: 'M-8 30 L-8 -14 L0 -6 L8 -14 L8 30', parent: g, w: 4 },
      { d: 'M-80 -40 L-64 -40 M64 -40 L80 -40 M0 -112 L0 -100 M-56 -96 L-46 -84 M56 -96 L46 -84', parent: g, w: 5, color: C.green }], { t: o.t, dur: o.dur, speed: 1000 / s, lenScale: s, w: 6 });
  }

  function star(A, o) {
    const s = o.s || 1;
    const pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 16 : 40; pts.push(`${f1(o.x + Math.cos(a) * r * s)} ${f1(o.y + Math.sin(a) * r * s)}`); }
    const d = `M${pts.join(' L')} Z`;
    const g = A.group({}, o.parent);
    fillShape(A, g, d, '#f2c94c', o.t + 0.3, 0.3);
    return A.draw([{ d, parent: g }], { t: o.t, dur: o.dur || 0.5, w: 5 });
  }

  function food(A, o) {
    // plate with a burger
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const plate = 'M-110 40 C-110 70 110 70 110 40 C110 14 -110 14 -110 40 Z';
    const bun = 'M-60 10 C-60 -50 60 -50 60 10 Z', bun2 = 'M-60 26 L60 26 Q60 44 50 44 L-50 44 Q-60 44 -60 26 Z';
    fillShape(A, g, plate, '#fffaf0', o.t + 0.4); fillShape(A, g, bun, '#d9a35f', o.t + 0.6); fillShape(A, g, bun2, '#d9a35f', o.t + 0.6);
    const patty = el('rect', { x: -62, y: 10, width: 124, height: 16, rx: 6, fill: '#5a3a26' }, g); A.fade(patty, o.t + 0.6, 0.3);
    return A.draw([{ d: plate, parent: g }, { d: bun, parent: g }, { d: 'M-64 18 Q-30 8 0 18 Q30 28 64 18', parent: g, color: C.green, w: 6 }, { d: bun2, parent: g },
      { d: 'M-30 -20 L-26 -22 M0 -28 L4 -30 M28 -18 L32 -20', parent: g, w: 4 }], { t: o.t, dur: o.dur, speed: 1100 / s, lenScale: s, w: 5 });
  }

  function suitcase(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const b = 'M-70 -50 L70 -50 Q80 -50 80 -40 L80 60 Q80 70 70 70 L-70 70 Q-80 70 -80 60 L-80 -40 Q-80 -50 -70 -50 Z';
    fillShape(A, g, b, C.green, o.t + 0.4);
    return A.draw([{ d: b, parent: g }, { d: 'M-24 -50 L-24 -74 L24 -74 L24 -50', parent: g }, { d: 'M-40 -50 L-40 70 M40 -50 L40 70', parent: g, w: 4 },
      { d: 'M-56 92 a10 10 0 1 0 0.1 0 M56 92 a10 10 0 1 0 0.1 0', parent: g, w: 4 }], { t: o.t, dur: o.dur, speed: 1000 / s, lenScale: s, w: 6 });
  }

  function park(A, o) {
    // a tree + sun: "last weekend" outing
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const crown = 'M-60 -90 C-100 -100 -100 -170 -50 -170 C-40 -220 40 -220 50 -170 C100 -170 100 -100 60 -90 Z';
    fillShape(A, g, crown, C.greenLight, o.t + 0.5);
    const sun = 'M150 -200 a30 30 0 1 0 0.1 0';
    fillShape(A, g, sun, '#f2c94c', o.t + 0.5);
    return A.draw([{ d: crown, parent: g }, { d: 'M-16 -90 L-20 0 M16 -90 L20 0', parent: g }, { d: 'M-160 0 L200 0', parent: g, w: 5 }, { d: sun, parent: g },
      { d: 'M150 -250 L150 -262 M195 -200 L207 -200 M182 -236 L190 -244', parent: g, w: 4 }], { t: o.t, dur: o.dur, speed: 1200 / s, lenScale: s, w: 6 });
  }

  function book(A, o) {
    const s = o.s || 1, g = A.group({ transform: `translate(${o.x} ${o.y}) scale(${s})` }, o.parent);
    const d = 'M0 -40 Q-40 -56 -80 -40 L-80 40 Q-40 24 0 40 Q40 24 80 40 L80 -40 Q40 -56 0 -40 Z';
    fillShape(A, g, d, '#fffaf0', o.t + 0.3);
    return A.draw([{ d, parent: g }, { d: 'M0 -40 L0 40', parent: g }, { d: 'M-64 -24 L-16 -28 M-64 -8 L-16 -12 M16 -28 L64 -24 M16 -12 L64 -8', parent: g, w: 3, color: '#8a7a62' }], { t: o.t, dur: o.dur, speed: 1000 / s, lenScale: s, w: 5 });
  }

  function zzz(A, o) {
    const g = A.group({}, o.parent);
    const r1 = A.text('Z', { x: o.x, y: o.y, size: 44, t: o.t, anchor: 'start', parent: g, color: '#6b6b66' });
    const r2 = A.text('Z', { x: o.x + 40, y: o.y - 50, size: 34, t: r1.end + 0.1, anchor: 'start', parent: g, color: '#6b6b66' });
    return { end: r2.end };
  }

  global.Art = { C, character, P, reach, bubble, thought, tv, popcorn, ball, calendar, school, phone, clock, box, bulb, star, food, suitcase, park, book, zzz, fillShape };
})(window);
