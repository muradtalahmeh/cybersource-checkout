// The drawing hand: a shaded right hand gripping a white marker.
// The marker tip is the group's origin (0,0), so placing the group at a
// stroke point puts the pen exactly on the line being drawn.
(function (global) {
  const SVGNS = 'http://www.w3.org/2000/svg';

  const markup = `
  <defs>
    <linearGradient id="hSkin" gradientUnits="userSpaceOnUse" x1="80" y1="-120" x2="420" y2="220">
      <stop offset="0" stop-color="#f6d2b8"/>
      <stop offset="0.55" stop-color="#eab896"/>
      <stop offset="1" stop-color="#c98f6c"/>
    </linearGradient>
    <linearGradient id="hSkinDark" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="140">
      <stop offset="0" stop-color="#e3a985"/>
      <stop offset="1" stop-color="#b97a58"/>
    </linearGradient>
    <linearGradient id="hPen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.45" stop-color="#f4f4f2"/>
      <stop offset="1" stop-color="#c9c9c5"/>
    </linearGradient>
    <linearGradient id="hSleeve" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4c5a52"/>
      <stop offset="1" stop-color="#2f3a34"/>
    </linearGradient>
    <filter id="hShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="9"/>
      <feOffset dx="14" dy="18" result="b"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.28"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#hShadow)">
   <g transform="rotate(36)">
    <!-- forearm + sleeve -->
    <path d="M330 -70 C460 -80 640 -60 960 -30 L960 230 C660 220 450 196 320 160 Z" fill="url(#hSkin)"/>
    <path d="M560 -66 C680 -60 800 -46 960 -30 L960 232 C800 224 680 212 560 196 C584 130 584 0 560 -66 Z" fill="url(#hSleeve)"/>
    <path d="M560 -66 C584 0 584 130 560 196" fill="none" stroke="#28302b" stroke-width="5"/>
    <!-- curled middle / ring / little fingers (under the pen) -->
    <path d="M232 10 C196 6 166 18 162 40 C158 62 178 76 206 74 L240 70 Z" fill="url(#hSkinDark)"/>
    <path d="M240 12 C196 6 166 18 162 40 C158 62 178 76 206 74 L240 70" fill="none" stroke="#a8694a" stroke-width="3"/>
    <path d="M250 64 C214 62 190 78 190 98 C190 118 212 128 240 122 L262 116 Z" fill="url(#hSkinDark)"/>
    <path d="M262 64 C214 62 190 78 190 98 C190 118 212 128 240 122 L262 116" fill="none" stroke="#a8694a" stroke-width="3"/>
    <!-- marker -->
    <path d="M0 0 L24 -7 L24 7 Z" fill="#2b2b2b"/>
    <path d="M22 -12 L46 -17 L46 17 L22 12 Z" fill="#dcdcd8" stroke="#8b8b86" stroke-width="2"/>
    <rect x="44" y="-18" width="320" height="36" rx="10" fill="url(#hPen)" stroke="#9a9a94" stroke-width="2.5"/>
    <rect x="290" y="-18" width="18" height="36" fill="#2f6b4f"/>
    <!-- thumb pressing on the near side -->
    <path d="M270 52 C210 44 160 26 124 22 C100 20 92 46 112 56 C150 70 210 100 270 128 Z" fill="url(#hSkin)"/>
    <path d="M270 52 C210 44 160 26 124 22 C100 20 92 46 112 56 C150 70 210 100 270 128" fill="none" stroke="#a8694a" stroke-width="3"/>
    <path d="M106 34 C112 26 126 28 128 37 C130 46 120 52 112 50 C106 48 104 40 106 34 Z" fill="#f7ddd0" stroke="#c48e72" stroke-width="2"/>
    <path d="M186 50 C190 58 189 66 184 74" fill="none" stroke="#b97a58" stroke-width="2.5" stroke-linecap="round"/>
    <!-- back of the hand -->
    <path d="M236 -96 C300 -116 378 -92 400 -36 C420 20 410 116 356 152 C310 182 244 168 222 128 C206 96 222 70 236 40 C250 6 214 -66 236 -96 Z" fill="url(#hSkin)"/>
    <path d="M400 -36 C420 20 410 116 356 152 C310 182 244 168 228 136" fill="none" stroke="#a8694a" stroke-width="3"/>
    <path d="M250 -60 C300 -78 350 -66 372 -40" fill="none" stroke="#fbe3d2" stroke-width="7" stroke-linecap="round" opacity="0.7"/>
    <path d="M300 10 C330 30 346 60 350 96" fill="none" stroke="#d29c7a" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
    <!-- index finger lying over the pen -->
    <path d="M262 -86 C200 -74 140 -50 104 -38 C80 -30 78 -4 98 -4 C140 -6 200 -20 262 -30 Z" fill="url(#hSkin)"/>
    <path d="M262 -86 C200 -74 140 -50 104 -38 C80 -30 78 -4 98 -4 C140 -6 200 -20 250 -28" fill="none" stroke="#a8694a" stroke-width="3"/>
    <path d="M88 -26 C94 -32 106 -32 110 -24 C112 -16 104 -10 96 -12 C90 -14 86 -20 88 -26 Z" fill="#f7ddd0" stroke="#c48e72" stroke-width="2"/>
    <path d="M160 -46 C163 -38 163 -26 160 -16 M200 -58 C204 -46 204 -34 200 -22" fill="none" stroke="#b97a58" stroke-width="2.5" stroke-linecap="round"/>
   </g>
  </g>`;

  function create() {
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('id', 'drawingHand');
    g.innerHTML = markup;
    return g;
  }

  global.DrawingHand = { create };
})(window);
