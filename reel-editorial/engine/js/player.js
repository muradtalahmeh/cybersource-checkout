// Preview player (never part of the render): plays the ORIGINAL audio and
// draws the frame for audio.currentTime. Scrub, jump to scenes, step frames.
(async function () {
  const q = new URLSearchParams(location.search);
  if (q.get('render') === '1') return;
  await window.videoReady;
  const { sb, fps } = window.reel;
  const ui = document.getElementById('ui');
  const project = q.get('project') || 'ref-fitness';
  ui.innerHTML = `
    <audio id="aud" src="../projects/${project}/audio/original.m4a" preload="auto"></audio>
    <div><button id="play">▶ / ❚❚</button> <span id="tc">0.000</span> s · <span id="sc"></span>
      <button id="prevf">◀ frame</button><button id="nextf">frame ▶</button></div>
    <input id="rng" type="range" min="0" max="${sb.duration}" step="0.01" value="0">
    <div class="scenes">${sb.scenes.map((s) => `<button data-t="${s.start}">${s.id} ${s.start.toFixed(1)}</button>`).join('')}</div>`;
  const aud = document.getElementById('aud'), rng = document.getElementById('rng'), tc = document.getElementById('tc'), scl = document.getElementById('sc');
  const stage = document.getElementById('stage');
  const fit = () => { const s = Math.min(1, (window.innerHeight - 160) / 1920); stage.style.transform = `scale(${s})`; stage.style.marginBottom = (1920 * s - 1920) + 'px'; };
  fit(); window.addEventListener('resize', fit);
  let busy = false, last = -1;
  async function draw(t) {
    if (busy) return; busy = true;
    try { await window.renderAt(t); } finally { busy = false; }
    tc.textContent = t.toFixed(3); rng.value = t;
    const { scene } = window.reel.sceneAt(t); scl.textContent = scene.id + ' · ' + scene.mode;
    for (const b of ui.querySelectorAll('.scenes button')) b.classList.toggle('on', +b.dataset.t === scene.start);
  }
  function loop() { if (!aud.paused) { const t = aud.currentTime; if (t !== last) { last = t; draw(t); } } requestAnimationFrame(loop); }
  loop();
  document.getElementById('play').onclick = () => (aud.paused ? aud.play() : aud.pause());
  rng.oninput = () => { aud.currentTime = +rng.value; draw(+rng.value); };
  document.getElementById('prevf').onclick = () => { aud.pause(); aud.currentTime = Math.max(0, aud.currentTime - 1 / fps); draw(aud.currentTime); };
  document.getElementById('nextf').onclick = () => { aud.pause(); aud.currentTime = Math.min(sb.duration, aud.currentTime + 1 / fps); draw(aud.currentTime); };
  for (const b of ui.querySelectorAll('.scenes button')) b.onclick = () => { aud.currentTime = +b.dataset.t; draw(+b.dataset.t); };
  aud.addEventListener('ended', () => draw(sb.duration));
})();
