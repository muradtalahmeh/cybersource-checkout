// Preview player. The <audio> element is the master clock; the board is a
// pure function of audio.currentTime (E.render(t)), so play/pause/seek/speed
// changes can never drift or duplicate drawings.
(function () {
  const qs = new URLSearchParams(location.search);
  const renderMode = qs.has('render');
  const aspect = qs.get('aspect') === 'h' ? 'h' : 'v';
  const W = aspect === 'v' ? 1080 : 1920, H = aspect === 'v' ? 1920 : 1080;
  const DUR = window.AUDIO_DURATION;
  const $ = (id) => document.getElementById(id);
  const stage = $('stage'), svg = $('board'), audio = $('audio');
  if (renderMode) document.body.classList.add('render');
  stage.classList.toggle('h', aspect === 'h');

  function fit() {
    if (renderMode) { stage.style.width = W + 'px'; stage.style.height = H + 'px'; return; }
    const wrap = $('stageWrap').getBoundingClientRect();
    const availH = window.innerWidth <= 900 ? window.innerHeight * 0.8 : wrap.height;
    const k = Math.min(wrap.width / W, availH / H);
    stage.style.width = Math.floor(W * k) + 'px';
    stage.style.height = Math.floor(H * k) + 'px';
  }
  fit();
  addEventListener('resize', fit);

  let E;
  const ready = (async () => {
    // fonts must be in before Arabic text is measured
    await Promise.all([document.fonts.load('700 50px Cairo', 'الماضي'), document.fonts.ready]);
    E = new Whiteboard.Engine(svg, W, H);
    window.buildVideo(E, aspect);
    E.render(0);
    window.E = E;
    return true;
  })();

  const caption = $('caption');
  let showCaps = renderMode && qs.get('captions') === '1';
  function captionAt(t) {
    const seg = window.TRANSCRIPT.find((s) => t >= s.s - 0.05 && t <= s.e + 0.35);
    return seg ? (seg.ar || seg.en) : '';
  }
  function draw(t) {
    if (!E) return;
    E.render(t);
    caption.hidden = !showCaps;
    if (showCaps) { const c = captionAt(t); caption.textContent = c; caption.style.visibility = c ? '' : 'hidden'; }
  }

  // Frame-exact entry point for the exporter.
  // In render mode every frame is repainted in full: Chromium otherwise
  // re-rasterizes only damaged regions, which can shift anti-aliasing by a
  // few levels depending on the frame order (seen in the determinism test).
  window.renderAt = async (t) => {
    await ready;
    draw(t);
    if (renderMode) { svg.style.display = 'none'; svg.getBoundingClientRect(); svg.style.display = ''; }
    return true;
  };
  window.videoReady = ready;
  if (renderMode) return;

  // ------------------------------------------------------------ controls
  const fmt = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
  $('dur').textContent = fmt(DUR);
  $('aspect').value = aspect;
  $('aspect').onchange = (e) => { const u = new URL(location); u.searchParams.set('aspect', e.target.value); location = u; };
  $('caps').onchange = (e) => { showCaps = e.target.checked; draw(audio.currentTime); };
  $('safe').onchange = (e) => stage.classList.toggle('safe', e.target.checked && aspect === 'v');
  $('speed').onchange = (e) => { audio.playbackRate = +e.target.value; };
  const playBtn = $('play');
  playBtn.onclick = () => (audio.paused ? audio.play() : audio.pause());
  audio.onplay = () => (playBtn.textContent = '❚❚ Pause');
  audio.onpause = () => (playBtn.textContent = '▶ Play');
  audio.onended = () => (playBtn.textContent = '▶ Play');
  $('restart').onclick = () => { audio.currentTime = 0; draw(0); audio.play(); };
  const seek = $('seek');
  seek.max = DUR;
  let scrubbing = false;
  seek.oninput = () => { scrubbing = true; audio.currentTime = +seek.value; draw(+seek.value); };
  seek.onchange = () => { scrubbing = false; };

  // scene markers + list
  const list = $('scenes'), marks = $('markers');
  window.STORYBOARD.forEach((s) => {
    const m = document.createElement('span');
    m.style.left = (s.start / DUR) * 100 + '%';
    m.title = `${s.id} · ${s.title}`;
    m.onclick = () => go(s.start);
    marks.appendChild(m);
    const li = document.createElement('li');
    li.innerHTML = `<b>${s.id}</b> ${s.title} <small>${fmt(s.start)}–${fmt(s.end)}</small>`;
    li.onclick = () => go(s.start);
    li.dataset.id = s.id;
    list.appendChild(li);
  });
  function go(t) { audio.currentTime = t; draw(t); }

  let lastScene = null;
  function tick() {
    const t = audio.currentTime;
    draw(t);
    if (!scrubbing) seek.value = t;
    $('cur').textContent = fmt(t);
    const sc = window.STORYBOARD.find((s) => t >= s.start && t < s.end) || window.STORYBOARD[window.STORYBOARD.length - 1];
    if (sc.id !== lastScene) {
      list.querySelectorAll('li').forEach((li) => li.classList.toggle('on', li.dataset.id === sc.id));
      lastScene = sc.id;
    }
    requestAnimationFrame(tick);
  }
  ready.then(() => requestAnimationFrame(tick));
  addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
    if (e.code === 'Space') { e.preventDefault(); playBtn.click(); }
    if (e.code === 'ArrowRight') go(Math.min(DUR, audio.currentTime + 2));
    if (e.code === 'ArrowLeft') go(Math.max(0, audio.currentTime - 2));
  });
})();
