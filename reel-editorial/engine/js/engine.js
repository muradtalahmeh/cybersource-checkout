// reel-editorial engine — every frame is a pure function of audio time t.
// window.renderAt(t) draws the stage for time t and resolves when the frame is
// fully decoded. No state carries over between calls; no CSS animations are used.
(function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = {
    linear: (p) => p,
    outCubic: (p) => 1 - Math.pow(1 - p, 3),
    inOutCubic: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    outBack: (p) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
    outQuint: (p) => 1 - Math.pow(1 - p, 5),
  };
  const prog = (t, t0, dur, ease = 'outCubic') => E[ease](clamp((t - t0) / Math.max(dur, 1e-6), 0, 1));

  const q = new URLSearchParams(location.search);
  const project = q.get('project') || 'ref-fitness';
  const render = q.get('render') === '1';
  const base = `../projects/${project}/`;

  let cfg, sb, svgs = {}, fps = 30, nFrames = 0;
  const $ = (id) => document.getElementById(id);
  const stage = $('stage');

  async function loadJSON(u) { const r = await fetch(u); if (!r.ok) throw new Error('fetch ' + u + ' ' + r.status); return r.json(); }
  async function loadSVG(name) {
    if (svgs[name]) return svgs[name];
    const r = await fetch(`../assets/svg/${name}.svg`);
    svgs[name] = r.ok ? await r.text() : `<svg viewBox="0 0 100 100"><text x="10" y="55">${name}</text></svg>`;
    return svgs[name];
  }

  // ---------- frame images ----------
  const cache = new Map();
  function frameURL(i) { return `${base}frames/src/${String(i).padStart(5, '0')}.jpg`; }
  async function frameAt(t) {
    const i = clamp(Math.round(t * fps) + 1, 1, nFrames);
    if (cache.has(i)) return cache.get(i);
    const img = new Image();
    img.src = frameURL(i);
    await img.decode();
    if (cache.size > 24) cache.delete(cache.keys().next().value);
    cache.set(i, img);
    return img;
  }

  // ---------- presenter rect ----------
  function rectFor(name) { return name === 'pip' ? cfg.layout.presenterPip : cfg.layout.presenterFull; }
  function placement(r) {
    const W = cfg.canvas.width, H = cfg.canvas.height;
    const scale = (r.w / W) * (r.cropScale || 1);
    const iw = W * scale, ih = H * scale;
    return { x: r.x, y: r.y, w: r.w, h: r.h, radius: r.radius, scale, ox: (r.w - iw) / 2, oy: -(r.cropTop || 0) * ih };
  }
  function presenterState(t, scene, prev) {
    const cur = placement(rectFor(scene.presenter.rect));
    if (!prev || prev.presenter.rect === scene.presenter.rect) return cur;
    const p = prog(t, scene.start, cfg.motion.pipMorph, 'inOutCubic');
    const a = placement(rectFor(prev.presenter.rect));
    const o = {};
    for (const k of Object.keys(cur)) o[k] = lerp(a[k], cur[k], p);
    return o;
  }

  // ---------- scene lookup ----------
  function sceneAt(t) {
    const S = sb.scenes;
    let i = S.findIndex((s) => t >= s.start && t < s.end);
    if (i < 0) i = t >= S[S.length - 1].end ? S.length - 1 : 0;
    return { scene: S[i], prev: S[i - 1] || null, next: S[i + 1] || null, index: i };
  }

  // ---------- text animation ----------
  function parseFont(f) { // "kinetic 132/800" | "cardTitle 84/800" | "badge 40/800"
    const m = /(\d+)\/(\d+)/.exec(f || '');
    return { size: m ? +m[1] : cfg.fonts.kinetic.size, weight: m ? +m[2] : 800 };
  }
  function parseColor(c) { // "#1A1A1A on #F59E0B"
    const m = /(#[0-9A-Fa-f]{6})(?:\s+on\s+(#[0-9A-Fa-f]{6}))?/.exec(c || '#FFFFFF');
    return { fg: m ? m[1] : '#FFFFFF', bg: m && m[2] ? m[2] : null };
  }
  function animState(t, item, holdOut = true) {
    const a = item.anim || '';
    const inDur = /stamp/.test(a) ? 0.2 : /pop/.test(a) ? 0.25 : cfg.motion.punchIn;
    const outDur = cfg.motion.fade;
    const pin = prog(t, item.t0, inDur, /punch|pop|stamp/.test(a) ? 'outBack' : 'outCubic');
    const pout = holdOut ? prog(t, item.t1 - outDur, outDur, 'linear') : 0;
    let scale = 1, tx = 0, ty = 0, rot = 0, opacity = Math.min(prog(t, item.t0, inDur * 0.8, 'linear'), 1 - pout);
    if (/punch/.test(a)) scale = lerp(1.5, 1, pin);
    if (/stamp/.test(a)) { scale = lerp(1.6, 1, pin); rot = -8; }
    if (/pop/.test(a)) scale = lerp(0.2, 1, pin);
    if (/fade-up/.test(a)) ty = lerp(40, 0, pin);
    if (/slide-right/.test(a)) tx = lerp(-90, 0, pin);
    if (/slide-in from right/.test(a)) tx = lerp(120, 0, pin);
    if (/float/.test(a)) ty += Math.sin((t - item.t0) * 2.2) * 6;
    if (pout >= 1) opacity = 0;
    return { scale, tx, ty, rot, opacity, pin, a };
  }
  function textStyle(el, item, st) {
    const f = parseFont(item.font), c = parseColor(item.color);
    el.style.fontSize = f.size + 'px';
    el.style.fontWeight = f.weight;
    el.style.color = c.fg;
    el.style.opacity = st.opacity;
    el.style.transform = `translate(${st.tx}px, ${st.ty}px) scale(${st.scale}) rotate(${st.rot}deg)`;
    const glow = /glow/.test(st.a);
    el.style.textShadow = glow
      ? `0 0 28px ${c.fg}99, 0 0 6px ${c.fg}, 0 6px 18px rgba(0,0,0,0.7)`
      : '0 4px 14px rgba(0,0,0,0.65)';
    if (/tracking-in/.test(st.a)) el.style.wordSpacing = lerp(28, 0, st.pin) + 'px';
    return c;
  }

  // ---------- layers ----------
  function kineticLayer(t, scene) {
    const L = $('kinetic'); L.innerHTML = '';
    const zone = cfg.layout.kineticZone;
    const iconItems = (scene.icons || []).filter((i) => i.slot === 'kinetic-icon' && t >= i.t0 && t < i.t1);
    for (const item of scene.texts) {
      if (!/^kinetic/.test(item.slot)) continue;
      if (t < item.t0 || t >= item.t1) continue;
      const st = animState(t, item);
      const f = parseFont(item.font);
      const el = document.createElement('div');
      el.className = 'kin';
      const y = item.slot === 'kinetic-low' ? 1690 : item.slot === 'kinetic-top' ? zone.y : zone.y + (zone.h - f.size * 1.15) / 2;
      el.style.top = y + 'px';
      const line = document.createElement('span'); line.className = 'line'; line.textContent = item.text;
      el.appendChild(line);
      const c = textStyle(el, item, st);
      if (/echo/.test(st.a) && st.pin < 1) {
        for (const k of [1, 2]) {
          const e = document.createElement('span'); e.className = 'echo'; e.textContent = item.text;
          e.style.transform = `scale(${1 + (1 - st.pin) * 0.18 * k})`; e.style.color = c.fg; e.style.opacity = 0.22 * (1 - st.pin);
          el.appendChild(e);
        }
      }
      if (/strike-through/.test(st.a)) {
        const m = /\((\d+(?:\.\d+)?)→(\d+(?:\.\d+)?)\)/.exec(st.a); // "(6.6→6.95)"
        const d0 = m ? +m[1] : item.t0 + 0.3, d1 = m ? +m[2] : d0 + 0.35;
        const p = prog(t, d0, d1 - d0, 'outCubic');
        const r = document.createElement('span'); r.className = 'rule';
        r.style.top = '52%'; r.style.right = '0'; r.style.left = 'auto'; r.style.width = (p * 100) + '%'; r.style.background = cfg.colors.burgundy; r.style.height = '12px';
        line.appendChild(r);
      }
      if (/underline/.test(st.a)) {
        const p = prog(t, item.t0 + 0.25, 0.35, 'outCubic');
        const r = document.createElement('span'); r.className = 'rule';
        r.style.bottom = '-6px'; r.style.right = '0'; r.style.left = 'auto'; r.style.width = (p * 100) + '%'; r.style.background = cfg.colors.cyan;
        line.appendChild(r);
      }
      if (iconItems.length && item.slot === 'kinetic') { el.style.left = (54 + 190) + 'px'; el.style.width = (972 - 190) + 'px'; }
      L.appendChild(el);
    }
    const I = $('icons'); I.innerHTML = '';
    for (const ic of (scene.icons || [])) {
      if (t < ic.t0 || t >= ic.t1) continue;
      const st = animState(t, { ...ic, anim: 'pop' });
      const d = document.createElement('div'); d.className = 'icon-abs';
      d.style.width = d.style.height = ic.size + 'px'; d.style.color = ic.color;
      if (ic.slot === 'kinetic-icon') { d.style.left = '70px'; d.style.top = (zone.y + (zone.h - ic.size) / 2) + 'px'; }
      if (ic.slot === 'cta-icon') { d.style.left = '150px'; d.style.top = '1545px'; }
      d.style.opacity = st.opacity; d.style.transform = `scale(${st.scale})`;
      d.innerHTML = svgs[ic.svg] || '';
      I.appendChild(d);
    }
  }

  function badgeLayer(t, scene, pr) {
    const B = $('badges'); B.innerHTML = '';
    for (const item of scene.texts) {
      if (item.slot !== 'badge' && item.slot !== 'cta-badge') continue;
      if (t < item.t0 || t >= item.t1) continue;
      const st = animState(t, item, false);
      const c = parseColor(item.color), f = parseFont(item.font);
      const el = document.createElement('div');
      el.className = 'badge' + (/^\d+$/.test(item.text) ? ' num' : '');
      el.textContent = item.text;
      el.style.background = c.bg || cfg.colors.gold; el.style.color = c.fg; el.style.fontSize = f.size + 'px';
      el.style.opacity = st.opacity; el.style.transform = `scale(${st.scale}) translate(${st.tx}px, ${st.ty}px)`;
      if (item.slot === 'cta-badge') { el.style.left = '290px'; el.style.top = '1552px'; el.style.padding = '10px 44px'; el.style.fontSize = '64px'; }
      else if (scene.presenter.rect === 'pip') { el.style.left = (cfg.layout.card.x + 44) + 'px'; el.style.top = (cfg.layout.card.y + 44) + 'px'; }
      else { el.style.left = (pr.x + pr.w - 92 - 56) + 'px'; el.style.top = (pr.y + 54) + 'px'; }
      B.appendChild(el);
    }
  }

  function cardLayer(t, scene, prev, next) {
    const C = $('cards'); C.innerHTML = '';
    const draw = (sc, mode) => { // mode: 'in' | 'out'
      const cd = sc.card; if (!cd) return;
      const el = document.createElement('div'); el.className = 'card';
      const lay = cfg.layout.card;
      el.style.left = lay.x + 'px'; el.style.top = lay.y + 'px'; el.style.width = lay.w + 'px';
      el.style.height = cd.template === 'list' ? 'auto' : '1080px'; if (cd.template === 'list') el.style.minHeight = '620px';
      let p, tx = 0, ty = 0, op = 1;
      if (mode === 'in') {
        p = prog(t, sc.start, cfg.motion.cardSlide, 'outCubic');
        const fromLeft = prev && prev.card && prev.card.exit === 'left';
        if (fromLeft) tx = lerp(1100, 0, p); else { ty = lerp(80, 0, p); op = p; }
      } else {
        p = prog(t, sc.end, 0.4, 'inOutCubic');
        if (cd.exit === 'left') tx = lerp(0, -1100, p); else { ty = lerp(0, 120, p); op = 1 - p; }
        if (p >= 1) return;
      }
      el.style.transform = `translate(${tx}px, ${ty}px)`; el.style.opacity = op;
      el.innerHTML = cardHTML(t, sc);
      C.appendChild(el);
    };
    if (prev && prev.card && t < prev.end + 0.4) draw(prev, 'out');
    if (scene.card) draw(scene, 'in');
  }
  const txt = (item, t, extra = '') => {
    if (t < item.t0 || t >= item.t1) return '';
    const st = animState(t, item, false); const f = parseFont(item.font); const c = parseColor(item.color);
    return `<div class="t" style="font-size:${f.size}px;font-weight:${f.weight};color:${c.fg};opacity:${st.opacity};transform:translate(${st.tx}px,${st.ty}px) scale(${st.scale}) rotate(${st.rot}deg);${extra}">${item.text}</div>`;
  };
  function cardHTML(t, sc) {
    const T = (slot) => sc.texts.find((x) => x.slot === slot);
    const Ts = (slot) => sc.texts.filter((x) => x.slot === slot);
    const ic = (name, color) => `<div class="icon" style="color:${color}">${svgs[name] || ''}</div>`;
    const cd = sc.card;
    if (cd.template === 'compare') {
      const a = T('tileA-title'), b = T('tileB-title'), bs = T('tileB-sub'), stamp = T('stamp');
      const vis = (it) => it && t >= it.t0;
      return `<div class="row" style="margin-top:100px;height:calc(100% - 100px)">
        <div class="tile a" style="opacity:${vis(a) ? 1 : 0}">${ic(cd.icons.tileA, cfg.colors.teal)}${txt(a, t)}</div>
        <div class="tile b" style="opacity:${vis(b) ? 1 : 0}">${ic(cd.icons.tileB, cfg.colors.burgundy)}${txt(b, t)}${bs ? txt(bs, t) : ''}</div>
      </div>
      ${stamp ? `<div style="position:absolute;left:0;right:0;top:6px;text-align:center;">${txt(stamp, t, 'display:inline-block;border:10px solid ' + cfg.colors.burgundy + ';border-radius:28px;padding:0 48px;line-height:1.2;')}</div>` : ''}`;
    }
    if (cd.template === 'list') {
      const title = T('card-title'); const items = Ts('item');
      return `<div class="title" style="font-size:84px;color:${cfg.colors.burgundy};text-align:right;margin-bottom:10px">${title && t >= title.t0 ? txt(title, t) : ''}</div>
        ${items.map((it, i) => (t >= it.t0 ? `<div class="item" style="opacity:${animState(t, it, false).opacity};transform:translateX(${animState(t, it, false).tx}px)"><div class="num">${i + 1}</div><div class="icon">${svgs[cd.icons.item[i]] || ''}</div>${txt(it, t, 'flex:1;text-align:right;line-height:1.3;')}</div>` : '')).join('')}`;
    }
    if (cd.template === 'compare2') {
      const A = ['colA-title', 'colA-value', 'colA-note'].map(T), B = ['colB-title', 'colB-value'].map(T);
      const vis = (it) => it && t >= it.t0;
      return `<div class="row" style="margin-top:20px;height:calc(100% - 20px)">
        <div class="col a" style="opacity:${vis(A[0]) ? 1 : 0}">${ic(cd.icons.colA, cfg.colors.teal)}${A.map((x) => (x ? txt(x, t, 'line-height:1.25;') : '')).join('')}</div>
        <div class="divider"></div>
        <div class="col b" style="opacity:${vis(B[0]) ? 1 : 0}">${ic(cd.icons.colB, cfg.colors.burgundy)}${B.map((x) => (x ? txt(x, t, 'line-height:1.25;') : '')).join('')}</div>
      </div>`;
    }
    return '';
  }

  function fadeLayer(t, scene) {
    let o = 0;
    if (scene.id === sb.scenes[0].id && /fade from/.test(scene.transition_in)) o = Math.max(o, 1 - prog(t, scene.start, 0.35, 'outCubic'));
    if (scene.id === sb.scenes[sb.scenes.length - 1].id && /fade to/.test(scene.transition_out)) o = Math.max(o, prog(t, sb.duration - 0.3, 0.3, 'linear'));
    $('fade').style.opacity = o;
  }

  // ---------- main ----------
  async function renderAt(t) {
    t = clamp(t, 0, sb.duration);
    const { scene, prev, next } = sceneAt(t);
    const img = await frameAt(t);
    const bg = $('bg'); if (bg.src !== img.src) bg.src = img.src;
    const pr = presenterState(t, scene, prev);
    const P = $('presenter');
    P.style.left = pr.x + 'px'; P.style.top = pr.y + 'px'; P.style.width = pr.w + 'px'; P.style.height = pr.h + 'px'; P.style.borderRadius = pr.radius + 'px';
    P.style.boxShadow = `0 0 0 ${cfg.frame.borderWidth}px ${cfg.colors.cyan}, 0 0 ${cfg.frame.glowBlur}px 6px rgba(45,212,191,${cfg.frame.glowAlpha}), ${cfg.frame.shadow}`;
    const S = $('src'); if (S.src !== img.src) S.src = img.src;
    S.style.transform = `translate(${pr.ox}px, ${pr.oy}px) scale(${pr.scale})`;
    S.style.width = cfg.canvas.width + 'px'; S.style.height = cfg.canvas.height + 'px';
    cardLayer(t, scene, prev, next);
    badgeLayer(t, scene, pr);
    kineticLayer(t, scene);
    fadeLayer(t, scene);
    await Promise.all([bg.decode().catch(() => {}), S.decode().catch(() => {})]);
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    return t;
  }

  async function init() {
    cfg = await loadJSON('../config/identity.json');
    sb = await loadJSON(base + 'storyboard.json');
    fps = sb.fps || cfg.canvas.fps;
    const meta = await loadJSON(base + 'frames/meta.json').catch(() => null);
    nFrames = meta ? meta.count : Math.ceil(sb.duration * fps);
    for (const [k, v] of Object.entries(cfg.colors)) document.documentElement.style.setProperty('--' + k, v);
    const names = new Set();
    for (const s of sb.scenes) { for (const i of s.icons || []) names.add(i.svg); if (s.card) for (const v of Object.values(s.card.icons)) (Array.isArray(v) ? v : [v]).forEach((n) => names.add(n)); }
    await Promise.all([...names].map(loadSVG));
    $('bg').style.filter = `blur(${cfg.frame.backdropBlur}px) brightness(${cfg.frame.backdropBrightness})`;
    $('bg').style.transform = `scale(${cfg.frame.backdropScale})`;
    await document.fonts.load('800 100px Cairo'); await document.fonts.load('700 50px Cairo');
    if (render) document.body.classList.add('render');
    window.reel = { cfg, sb, sceneAt, fps };
    window.renderAt = renderAt;
    await renderAt(0);
    return true;
  }
  window.videoReady = init();
})();
