// reel-editorial engine v0.2 — every frame is a pure function of audio time t.
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
  };
  const prog = (t, t0, dur, ease = 'outCubic') => E[ease](clamp((t - t0) / Math.max(dur, 1e-6), 0, 1));

  const q = new URLSearchParams(location.search);
  const project = q.get('project') || 'ref-fitness';
  const render = q.get('render') === '1';
  const base = `../projects/${project}/`;

  let cfg, sb, fps = 30, nFrames = 0;
  const svgs = {}, photos = {};            // name → svg text | name → {url} or null (missing)
  const $ = (id) => document.getElementById(id);

  async function loadJSON(u) { const r = await fetch(u); if (!r.ok) throw new Error('fetch ' + u + ' ' + r.status); return r.json(); }
  async function loadSVG(name) {
    if (name in svgs) return;
    const r = await fetch(`../assets/svg/${name}.svg`);
    svgs[name] = r.ok ? await r.text() : null;
  }
  async function loadPhoto(name) {
    if (name in photos) return;
    for (const ext of ['jpg', 'png', 'webp']) {
      const url = `${base}assets/photos/${name}.${ext}`;
      const r = await fetch(url, { method: 'HEAD' });
      if (r.ok) { const img = new Image(); img.src = url; await img.decode(); photos[name] = { url, w: img.naturalWidth, h: img.naturalHeight }; return; }
    }
    photos[name] = null;
  }

  // ---------- source frames ----------
  const cache = new Map();
  const frameURL = (i) => `${base}frames/src/${String(i).padStart(5, '0')}.jpg`;
  async function frameAt(t) {
    const i = clamp(Math.round(t * fps) + 1, 1, nFrames);
    if (cache.has(i)) return cache.get(i);
    const img = new Image(); img.src = frameURL(i); await img.decode();
    if (cache.size > 24) cache.delete(cache.keys().next().value);
    cache.set(i, img); return img;
  }

  // ---------- presenter ----------
  const RECTS = { full: 'presenterFull', pip: 'presenterPip', fullbleed: 'presenterFullbleed' };
  function placement(name) {
    if (name === 'hidden') return null;
    const r = cfg.layout[RECTS[name] || 'presenterFull'];
    const W = cfg.canvas.width, H = cfg.canvas.height;
    const scale = (r.w / W) * (r.cropScale || 1);
    const iw = W * scale, ih = H * scale;
    return { x: r.x, y: r.y, w: r.w, h: r.h, radius: r.radius, scale, ox: (r.w - iw) / 2, oy: -(r.cropTop || 0) * ih, glow: name === 'fullbleed' ? 0 : 1, vis: 1 };
  }
  function presenterState(t, scene, prev) {
    const cur = placement(scene.presenter.rect);
    const was = prev ? placement(prev.presenter.rect) : null;
    const p = prog(t, scene.start, cfg.motion.pipMorph, 'inOutCubic');
    if (!cur && !was) return null;
    if (cur && was && prev.presenter.rect !== scene.presenter.rect) {
      if (scene.presenter.rect === 'fullbleed' || prev.presenter.rect === 'fullbleed') return cur; // hard cut, as in the reference
      const o = {}; for (const k of Object.keys(cur)) o[k] = lerp(was[k], cur[k], p); return o;
    }
    if (cur && !was) return { ...cur, vis: p };                   // presenter returns: fade in
    if (!cur && was) return p >= 1 ? null : { ...was, vis: 1 - p }; // presenter leaves: fade out under the card
    return cur;
  }

  function sceneAt(t) {
    const S = sb.scenes;
    let i = S.findIndex((s) => t >= s.start && t < s.end);
    if (i < 0) i = t >= S[S.length - 1].end ? S.length - 1 : 0;
    return { scene: S[i], prev: S[i - 1] || null, next: S[i + 1] || null };
  }

  // ---------- text ----------
  const parseFont = (f) => { const m = /(\d+)\/(\d+)/.exec(f || ''); return { size: m ? +m[1] : cfg.fonts.kinetic.size, weight: m ? +m[2] : 800 }; };
  const parseColor = (c) => { const m = /(#[0-9A-Fa-f]{6})(?:\s+on\s+(#[0-9A-Fa-f]{6}))?/.exec(c || '#FFFFFF'); return { fg: m ? m[1] : '#FFFFFF', bg: m && m[2] ? m[2] : null }; };
  function animState(t, item, holdOut = true) {
    const a = item.anim || '';
    const inDur = /stamp/.test(a) ? 0.2 : /pop/.test(a) ? 0.25 : cfg.motion.punchIn;
    const pin = prog(t, item.t0, inDur, /punch|pop|stamp/.test(a) ? 'outBack' : 'outCubic');
    const pout = holdOut ? prog(t, item.t1 - cfg.motion.fade, cfg.motion.fade, 'linear') : 0;
    let scale = 1, tx = 0, ty = 0, rot = 0;
    let opacity = Math.min(prog(t, item.t0, inDur * 0.8, 'linear'), 1 - pout);
    if (/punch/.test(a)) scale = lerp(1.5, 1, pin);
    if (/stamp/.test(a)) { scale = lerp(1.6, 1, pin); rot = -8; }
    if (/pop/.test(a)) scale = lerp(0.2, 1, pin);
    if (/fade-up/.test(a)) ty = lerp(40, 0, pin);
    if (/slide-right/.test(a)) tx = lerp(-90, 0, pin);
    if (/slide-in from right/.test(a)) tx = lerp(120, 0, pin);
    if (/float/.test(a)) ty += Math.sin((t - item.t0) * 2.2) * 6;
    return { scale, tx, ty, rot, opacity, pin, a };
  }
  const glowShadow = (c) => `0 0 28px ${c}99, 0 0 6px ${c}, 0 6px 18px rgba(0,0,0,0.7)`;

  // Two-tier kinetic block: small lead line (white) above the big keyword.
  function kineticBlock(t, item, topY, width, leftX = 54) {
    const st = animState(t, item);
    const f = parseFont(item.font), c = parseColor(item.color);
    const el = document.createElement('div'); el.className = 'kin';
    el.style.left = leftX + 'px'; el.style.width = width + 'px'; el.style.top = topY + 'px';
    el.style.opacity = st.opacity;
    el.style.transform = `translate(${st.tx}px, ${st.ty}px) scale(${st.scale}) rotate(${st.rot}deg)`;
    if (item.lead) {
      const lead = document.createElement('div'); lead.className = 'lead'; lead.textContent = item.lead;
      lead.style.fontSize = cfg.fonts.lead.size + 'px'; lead.style.fontWeight = cfg.fonts.lead.weight;
      lead.style.opacity = prog(t, item.t0 - 0.05, 0.2, 'linear');
      el.appendChild(lead);
    }
    const word = document.createElement('div'); word.className = 'word';
    const line = document.createElement('span'); line.className = 'line'; line.textContent = item.text; word.appendChild(line);
    word.style.fontSize = f.size + 'px'; word.style.fontWeight = f.weight; word.style.color = c.fg;
    word.style.textShadow = /glow/.test(st.a) ? glowShadow(c.fg) : '0 4px 14px rgba(0,0,0,0.65)';
    if (/tracking-in/.test(st.a)) word.style.wordSpacing = lerp(28, 0, st.pin) + 'px';
    if (/echo/.test(st.a) && st.pin < 1) for (const k of [1, 2]) {
      const e = document.createElement('span'); e.className = 'echo'; e.textContent = item.text;
      e.style.transform = `scale(${1 + (1 - st.pin) * 0.18 * k})`; e.style.color = c.fg; e.style.opacity = 0.22 * (1 - st.pin); word.appendChild(e);
    }
    if (/strike-through/.test(st.a)) {
      const m = /\((\d+(?:\.\d+)?)→(\d+(?:\.\d+)?)\)/.exec(st.a);
      const d0 = m ? +m[1] : item.t0 + 0.3, d1 = m ? +m[2] : d0 + 0.35;
      const r = document.createElement('span'); r.className = 'rule';
      r.style.top = '52%'; r.style.right = '0'; r.style.width = (prog(t, d0, d1 - d0) * 100) + '%'; r.style.background = cfg.colors.burgundy; r.style.height = '12px'; line.appendChild(r);
    }
    if (/underline/.test(st.a)) {
      const r = document.createElement('span'); r.className = 'rule';
      r.style.bottom = '-6px'; r.style.right = '0'; r.style.width = (prog(t, item.t0 + 0.25, 0.35) * 100) + '%'; r.style.background = cfg.colors.cyan; line.appendChild(r);
    }
    el.appendChild(word);
    return el;
  }

  function kineticLayer(t, scene) {
    const L = $('kinetic'); L.innerHTML = '';
    const zone = cfg.layout.kineticZone, cta = cfg.layout.ctaZone;
    const iconNow = (scene.icons || []).some((i) => i.slot === 'kinetic-icon' && t >= i.t0 && t < i.t1);
    for (const item of scene.texts) {
      if (t < item.t0 || t >= item.t1) continue;
      const f = parseFont(item.font);
      const blockH = f.size * 1.15 + (item.lead ? cfg.fonts.lead.size * 1.3 : 0);
      if (item.slot === 'kinetic') L.appendChild(kineticBlock(t, item, zone.y + (zone.h - blockH) / 2, iconNow ? 972 - 230 : 972, iconNow ? 54 + 230 : 54));
      else if (item.slot === 'kinetic-low') L.appendChild(kineticBlock(t, item, 1690, 972));
      else if (item.slot === 'kinetic-top') L.appendChild(kineticBlock(t, item, zone.y, 972));
      else if (item.slot === 'cta-top') L.appendChild(kineticBlock(t, item, cta.y, 972));
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
      const ph = ic.photo && photos[ic.photo];
      d.innerHTML = ph ? `<img src="${ph.url}" style="width:100%;height:100%;object-fit:cover;border-radius:28px;box-shadow:0 18px 40px rgba(0,0,0,.6)">` : (svgs[ic.svg] || '');
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
      const fr = cfg.layout.presenterFull;
      if (item.slot === 'cta-badge') { el.style.left = '290px'; el.style.top = '1552px'; el.style.padding = '10px 44px'; el.style.fontSize = '64px'; }
      else if (!pr || scene.presenter.rect === 'hidden') { el.style.left = (fr.x + 44) + 'px'; el.style.top = (fr.y + 44) + 'px'; }
      else { el.style.left = (pr.x + pr.w - 92 - 56) + 'px'; el.style.top = (pr.y + 54) + 'px'; }
      B.appendChild(el);
    }
  }

  // ---------- cards (replace the presenter frame) ----------
  function cardLayer(t, scene, prev) {
    const C = $('cards'); C.innerHTML = '';
    const draw = (sc, mode) => {
      const cd = sc.card; if (!cd) return;
      const r = cfg.layout.presenterFull;
      const el = document.createElement('div'); el.className = 'card';
      el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px'; el.style.borderRadius = r.radius + 'px';
      let p, tx = 0, ty = 0, op = 1;
      if (mode === 'in') {
        p = prog(t, sc.start, cfg.motion.cardSlide, 'outCubic');
        if (prev && prev.card && prev.card.exit === 'left') tx = lerp(1100, 0, p); else { ty = lerp(80, 0, p); op = p; }
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
    if (!item || t < item.t0 || t >= item.t1) return '';
    const st = animState(t, item, false); const f = parseFont(item.font); const c = parseColor(item.color);
    const lead = item.lead ? `<div class="clead">${item.lead}</div>` : '';
    return `<div class="t" style="opacity:${st.opacity};transform:translate(${st.tx}px,${st.ty}px) scale(${st.scale}) rotate(${st.rot}deg);${extra}">${lead}<div style="font-size:${f.size}px;font-weight:${f.weight};color:${c.fg};line-height:1.2">${item.text}</div></div>`;
  };
  // Dominant photo with a long soft shadow; labelled placeholder when the file is missing.
  function photoHTML(name, w, h, t, t0, extra = '') {
    const p = prog(t, t0, 0.45, 'outBack');
    const style = `width:${w}px;height:${h}px;opacity:${prog(t, t0, 0.3, 'linear')};transform:scale(${lerp(0.85, 1, p)});${extra}`;
    const ph = photos[name];
    if (ph) return `<div class="photo" style="${style}"><img src="${ph.url}"></div>`;
    return `<div class="photo missing" style="${style}"><div>صورة مطلوبة<br><span>${name}</span></div></div>`;
  }
  function cardHTML(t, sc) {
    const T = (slot) => sc.texts.find((x) => x.slot === slot);
    const Ts = (slot) => sc.texts.filter((x) => x.slot === slot);
    const cd = sc.card, P = cd.photos || {};
    if (cd.template === 'photo-compare') {
      const a = T('tileA-title'), b = T('tileB-title'), bs = T('tileB-sub'), stamp = T('stamp');
      const showB = b && t >= b.t0;
      return `<div class="pc">
        <div class="half ${showB ? '' : 'solo'}">${photoHTML(P.a, showB ? 400 : 560, showB ? 400 : 560, t, sc.start + 0.1)}${txt(a, t, 'text-align:center')}</div>
        ${showB ? `<div class="half">${photoHTML(P.b, 400, 400, t, b.t0)}${txt(b, t, 'text-align:center')}${txt(bs, t, 'text-align:center')}</div>` : ''}
      </div>
      ${stamp ? `<div class="stampwrap">${txt(stamp, t, 'display:inline-block;border:10px solid ' + cfg.colors.burgundy + ';border-radius:28px;padding:0 48px;')}</div>` : ''}`;
    }
    if (cd.template === 'photo-list') {
      const title = T('card-title'); const items = Ts('item');
      const cur = items.filter((it) => t >= it.t0).length - 1;
      const photo = cur >= 0 ? photoHTML(P.item[cur], 640, 520, t, items[cur].t0) : '';
      return `<div class="ptitle">${txt(title, t, 'text-align:right')}</div><div class="pphoto">${photo}</div>
        <div class="plist">${items.map((it, i) => (t >= it.t0 ? `<div class="item ${i === cur ? 'on' : ''}" style="opacity:${animState(t, it, false).opacity};transform:translateX(${animState(t, it, false).tx}px)"><div class="num">${i + 1}</div>${txt(it, t, 'flex:1;text-align:right;')}</div>` : '')).join('')}</div>`;
    }
    if (cd.template === 'photo-compare2') {
      const A = ['colA-title', 'colA-value', 'colA-note'].map(T), B = ['colB-title', 'colB-value'].map(T);
      const showB = B[0] && t >= B[0].t0;
      return `<div class="pc cols">
        <div class="half" style="opacity:${A[0] && t >= A[0].t0 ? 1 : 0}">${photoHTML(P.a, 380, 380, t, A[0] ? A[0].t0 : sc.start)}${A.map((x) => txt(x, t, 'text-align:center')).join('')}</div>
        <div class="half" style="opacity:${showB ? 1 : 0}">${showB ? photoHTML(P.b, 380, 380, t, B[0].t0) : ''}${B.map((x) => txt(x, t, 'text-align:center')).join('')}</div>
      </div>`;
    }
    return '';
  }

  function fadeLayer(t, scene) {
    let o = 0;
    const first = sb.scenes[0], last = sb.scenes[sb.scenes.length - 1];
    if (scene.id === first.id && /fade from/.test(first.transition_in)) o = Math.max(o, 1 - prog(t, first.start, 0.35));
    if (scene.id === last.id && /fade to/.test(last.transition_out)) o = Math.max(o, prog(t, sb.duration - 0.3, 0.3, 'linear'));
    $('fade').style.opacity = o;
  }

  // ---------- main ----------
  async function renderAt(t) {
    t = clamp(t, 0, sb.duration);
    const { scene, prev } = sceneAt(t);
    const img = await frameAt(t);
    const bg = $('bg'); if (bg.src !== img.src) bg.src = img.src;
    const pr = presenterState(t, scene, prev);
    const P = $('presenter'), S = $('src');
    if (pr) {
      P.style.display = 'block';
      P.style.left = pr.x + 'px'; P.style.top = pr.y + 'px'; P.style.width = pr.w + 'px'; P.style.height = pr.h + 'px'; P.style.borderRadius = pr.radius + 'px';
      P.style.opacity = pr.vis;
      P.style.boxShadow = pr.glow > 0.01 ? `0 0 0 ${cfg.frame.borderWidth * pr.glow}px ${cfg.colors.cyan}, 0 0 ${cfg.frame.glowBlur}px 6px rgba(45,212,191,${cfg.frame.glowAlpha * pr.glow}), ${cfg.frame.shadow}` : 'none';
      if (S.src !== img.src) S.src = img.src;
      S.style.transform = `translate(${pr.ox}px, ${pr.oy}px) scale(${pr.scale})`;
      S.style.width = cfg.canvas.width + 'px'; S.style.height = cfg.canvas.height + 'px';
    } else P.style.display = 'none';
    cardLayer(t, scene, prev);
    badgeLayer(t, scene, pr);
    kineticLayer(t, scene);
    fadeLayer(t, scene);
    await Promise.all([bg.decode().catch(() => {}), pr ? S.decode().catch(() => {}) : null]);
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
    const svgNames = new Set(), photoNames = new Set();
    for (const s of sb.scenes) {
      for (const i of s.icons || []) { if (i.svg) svgNames.add(i.svg); if (i.photo) photoNames.add(i.photo); }
      if (s.card) { for (const v of Object.values(s.card.icons || {})) (Array.isArray(v) ? v : [v]).forEach((n) => svgNames.add(n));
        for (const v of Object.values(s.card.photos || {})) (Array.isArray(v) ? v : [v]).forEach((n) => photoNames.add(n)); }
    }
    await Promise.all([...svgNames].map(loadSVG));
    await Promise.all([...photoNames].map(loadPhoto));
    $('bg').style.filter = `blur(${cfg.frame.backdropBlur}px) brightness(${cfg.frame.backdropBrightness})`;
    $('bg').style.transform = `scale(${cfg.frame.backdropScale})`;
    $('tint').style.background = cfg.frame.backdropTint || 'transparent';
    await document.fonts.load('800 100px Cairo'); await document.fonts.load('700 50px Cairo');
    if (render) document.body.classList.add('render');
    window.reel = { cfg, sb, sceneAt, fps, photos: { ...photos } };
    window.renderAt = renderAt;
    await renderAt(0);
    return true;
  }
  window.videoReady = init();
})();
