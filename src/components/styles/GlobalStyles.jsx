/* ═══════════════════════════════════════════════════════════
   MANSIK — WARM WATERCOLOR EDITORIAL ZINE — GLOBAL UI SYSTEM
   All component styles live here. No inline style duplication.
   ═══════════════════════════════════════════════════════════ */

const G = () => (
  <style>{`
    /* ── Google Fonts ── */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Source+Serif+4:ital,wght@0,300;0,400;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Caveat:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ═══════════════════════════════════════
       COLOR TOKENS — WARM WATERCOLOR PALETTE
       ═══════════════════════════════════════ */
    :root {
      /* Paper / Background */
      --paper-cream:   #FBF3E7;
      --paper-warm:    #F5EDE0;
      --paper-torn:    #EEE2CE;
      --line-pencil:   rgba(122, 74, 60, 0.25);

      /* Warm Accents */
      --peach:         #F7B48A;
      --coral:         #F26D5B;
      --rose:          #E85A7C;
      --terracotta:    #C74A3F;
      --amber:         #F2A03D;
      --dusty-rose:    #D89A94;
      --plum:          #7A4A6B;

      /* Text / Ink */
      --ink-warm:      #4A3428;
      --ink-soft:      #7A5C4E;
      --ink-meta:      #B0857A;

      /* Legacy aliases — maps to warm equivalents so inner components work */
      --cream:         var(--paper-cream);
      --parchment:     var(--paper-warm);
      --blush:         #F7C8BE;
      --dusty:         #F2A03D;
      --rose-nav:      #C74A3F;
      --sky:           #F7B48A;
      --sky-d:         #F26D5B;
      --sage:          #F5EDE0;
      --sage-d:        #F2A03D;
      --lav:           #FAEAF0;
      --lav-d:         #E85A7C;
      --honey:         #FBF3E7;
      --honey-d:       #F2A03D;

      /* Text aliases */
      --brown:         var(--ink-warm);
      --brown-l:       var(--ink-soft);
      --text:          var(--ink-warm);
      --soft:          var(--ink-soft);
      --mute:          var(--ink-meta);
      --ink:           #3A2418;
    }

    /* ═══════════════════════════════════════
       GRAIN + TEXTURE LAYER
       SVG feTurbulence grain — the soul of the system
       ═══════════════════════════════════════ */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.038'/%3E%3C/svg%3E");
      background-size: 220px 220px;
      opacity: 0.6;
      mix-blend-mode: multiply;
    }

    /* ═══════════════════════════════════════
       BASE
       ═══════════════════════════════════════ */
    html { cursor: none; scroll-behavior: smooth; }

    body {
      background: var(--paper-cream);
      font-family: 'Lora', Georgia, serif;
      color: var(--ink-warm);
      overflow-x: hidden;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(242, 109, 91, 0.35); border-radius: 10px; }

    /* ═══════════════════════════════════════
       CURSOR — warm watercolor dot
       ═══════════════════════════════════════ */
    #cd {
      position: fixed; z-index: 99998; pointer-events: none;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--coral);
      transform: translate(-50%, -50%);
      transition: width .2s, height .2s, background .3s;
    }
    #cr {
      position: fixed; z-index: 99997; pointer-events: none;
      width: 36px; height: 36px; border-radius: 50%;
      border: 1.5px solid rgba(199, 74, 63, 0.38);
      transform: translate(-50%, -50%);
      transition: width .35s cubic-bezier(.25,.46,.45,.94), height .35s cubic-bezier(.25,.46,.45,.94), border-color .3s;
    }
    body.ch #cd { width: 14px; height: 14px; background: var(--amber); }
    body.ch #cr { width: 52px; height: 52px; border-color: rgba(242, 160, 61, 0.5); }

    /* ═══════════════════════════════════════
       KEYFRAME ANIMATIONS
       ═══════════════════════════════════════ */
    @keyframes fadeUp    { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
    @keyframes float     { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes breathe   { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    @keyframes drift     { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(8px) rotate(2deg); } }
    @keyframes waveBar   { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes pulse2    { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
    @keyframes ripple2   { 0% { transform: scale(.9); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }
    @keyframes slideMsg  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes bloom     { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes blobDrift {
      0%   { transform: translate(0, 0) scale(1); }
      33%  { transform: translate(12px, -8px) scale(1.03); }
      66%  { transform: translate(-6px, 10px) scale(0.97); }
      100% { transform: translate(0, 0) scale(1); }
    }

    /* Utility animation classes */
    .fu  { animation: fadeUp  .7s cubic-bezier(.25,.46,.45,.94) both; }
    .flt { animation: float   7s  ease-in-out infinite; }
    .bth { animation: breathe 5s  ease-in-out infinite; }
    .dft { animation: drift   9s  ease-in-out infinite; }

    /* ═══════════════════════════════════════
       WATERCOLOR BACKGROUND BLOBS
       ═══════════════════════════════════════ */
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(72px);
      opacity: .45;
      pointer-events: none;
      animation: blobDrift 60s ease-in-out infinite;
    }
    .blob-coral  { background: var(--coral);  }
    .blob-peach  { background: var(--peach);  }
    .blob-amber  { background: var(--amber);  }
    .blob-rose   { background: var(--rose);   }
    .blob-plum   { background: var(--plum);   }

    /* ═══════════════════════════════════════
       PAPER CARD SYSTEM
       ═══════════════════════════════════════ */
    .paper {
      background: linear-gradient(145deg, rgba(251,243,231,.95), rgba(245,237,224,.90));
      border: 1px solid var(--line-pencil);
      border-radius: 22px;
      box-shadow: 0 8px 28px rgba(122, 74, 60, 0.08), inset 0 1px 0 rgba(255,255,255,.75);
    }
    .paper:hover {
      background: linear-gradient(145deg, rgba(251,243,231,1), rgba(247,180,138,.10));
      box-shadow: 0 12px 36px rgba(122, 74, 60, 0.12), inset 0 1px 0 rgba(255,255,255,.8);
    }

    /* Warm blush card — used for alerts/notifications */
    .paper-b {
      background: linear-gradient(145deg, rgba(247,196,190,.85), rgba(238,226,206,.75));
      border: 1px solid rgba(242,109,91,.22);
      border-radius: 22px;
      box-shadow: 0 6px 24px rgba(199, 74, 63, 0.10);
    }
    /* Amber card */
    .paper-s {
      background: linear-gradient(145deg, rgba(247,218,180,.82), rgba(245,237,224,.76));
      border: 1px solid rgba(242,160,61,.22);
      border-radius: 22px;
    }
    /* Rose/plum card */
    .paper-g {
      background: linear-gradient(145deg, rgba(232,210,220,.85), rgba(245,237,224,.76));
      border: 1px solid rgba(232,90,124,.18);
      border-radius: 22px;
    }

    /* ═══════════════════════════════════════
       NAVIGATION PILLS
       ═══════════════════════════════════════ */
    .nav-pill {
      display: flex; align-items: center; gap: 9px;
      padding: 9px 15px; border-radius: 999px;
      cursor: pointer;
      transition: all .28s cubic-bezier(.25,.46,.45,.94);
      font-family: 'Lora', serif; font-size: 13.5px;
      color: var(--ink-soft); border: 1px solid transparent;
      position: relative; overflow: hidden;
    }
    .nav-pill::before {
      content: '';
      position: absolute; inset: 0; border-radius: 999px;
      background: radial-gradient(ellipse at var(--mx, 50%) var(--my, 50%),
        rgba(242,109,91,.20) 0%, transparent 70%);
      opacity: 0; transition: opacity .24s;
    }
    .nav-pill:hover::before { opacity: 1; }
    .nav-pill:hover { background: rgba(247,180,138,.22); color: var(--ink-warm); }
    .nav-pill.act {
      background: linear-gradient(135deg, rgba(242,109,91,.20), rgba(247,180,138,.18));
      border-color: rgba(199,74,63,.22);
      color: var(--terracotta);
      box-shadow: 0 2px 14px rgba(199,74,63,.12);
    }
    .nav-pill.act span { font-weight: 500; }

    /* ═══════════════════════════════════════
       BUTTONS
       ═══════════════════════════════════════ */
    /* Primary — coral pill */
    .btn-s {
      background: linear-gradient(135deg, var(--coral), var(--terracotta));
      color: var(--paper-cream);
      border: none; border-radius: 999px;
      padding: 12px 32px;
      font-family: 'Lora', serif; font-size: 14px;
      cursor: pointer; letter-spacing: 0.01em;
      transition: all .3s cubic-bezier(.25,.46,.45,.94);
      box-shadow: 0 6px 20px rgba(199,74,63,.25), inset 0 1px 0 rgba(255,255,255,.20);
      position: relative; overflow: hidden;
    }
    .btn-s::after {
      content: '';
      position: absolute; inset: 0; border-radius: 999px;
      background: radial-gradient(ellipse at 50% 50%,
        rgba(255,255,255,.15) 0%, transparent 70%);
      opacity: 0; transition: opacity .24s;
    }
    .btn-s:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 30px rgba(199,74,63,.35); }
    .btn-s:hover::after { opacity: 1; }
    .btn-s:active { transform: scale(0.98); }

    /* Ghost / outline button — terracotta jitter outline */
    .btn-g {
      background: transparent;
      border: 1.5px solid rgba(199,74,63,.38);
      border-radius: 999px; padding: 10px 24px;
      font-family: 'Lora', serif; font-size: 13px;
      color: var(--ink-soft); cursor: pointer;
      transition: all .28s;
    }
    .btn-g:hover {
      background: rgba(242,109,91,.10);
      border-color: var(--coral); color: var(--terracotta);
    }

    /* ═══════════════════════════════════════
       INPUTS — pencil-line underline style
       ═══════════════════════════════════════ */
    .si {
      width: 100%; padding: 12px 16px;
      border: none;
      border-bottom: 1.5px solid rgba(199,74,63,.28);
      border-radius: 0;
      font-family: 'Lora', serif; font-size: 14px;
      background: transparent; color: var(--ink-warm);
      outline: none;
      transition: border-color .3s, box-shadow .3s;
    }
    .si:focus {
      border-bottom: 2px solid var(--coral);
      box-shadow: 0 2px 0 rgba(242,109,91,.18);
    }
    .si::placeholder { color: var(--ink-meta); font-style: italic; }

    /* ── Input with box (used in sidebar name edit) ── */
    .si-box {
      width: 100%; padding: 8px 12px;
      border: 1px solid rgba(199,74,63,.25);
      border-radius: 12px;
      font-family: 'Lora', serif; font-size: 13px;
      background: rgba(251,243,231,.8); color: var(--ink-warm);
      outline: none;
      transition: all .28s;
    }
    .si-box:focus { border-color: var(--coral); box-shadow: 0 0 0 3px rgba(242,109,91,.12); }

    /* ═══════════════════════════════════════
       SEVERITY TAGS
       ═══════════════════════════════════════ */
    .tag {
      display: inline-flex; align-items: center;
      padding: 4px 14px; border-radius: 999px;
      font-size: 11.5px; font-family: 'DM Mono', monospace;
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    /* Low — sage green tone */
    .tl { background: rgba(180,200,160,.30); color: #526842; border: 1px solid rgba(130,160,100,.25); }
    /* Moderate — amber */
    .tm { background: rgba(242,160,61,.22); color: #8B5E1A; border: 1px solid rgba(200,140,50,.22); }
    /* High — coral/terracotta */
    .th { background: rgba(242,109,91,.22); color: #8B2A1A; border: 1px solid rgba(199,74,63,.30); }

    /* ═══════════════════════════════════════
       WAVE BARS (audio visualizer in Music)
       ═══════════════════════════════════════ */
    .wave-bar {
      width: 3px; border-radius: 3px;
      background: linear-gradient(180deg, var(--coral), var(--peach));
      transform-origin: bottom;
      animation: waveBar 1.2s ease-in-out infinite;
    }

    /* ═══════════════════════════════════════
       PROGRESS BARS
       ═══════════════════════════════════════ */
    .pt {
      height: 5px;
      background: rgba(199,74,63,.12);
      border-radius: 999px; overflow: hidden;
    }
    .pf {
      height: 100%; border-radius: 999px;
      transition: width 1.2s cubic-bezier(.25,.46,.45,.94);
    }

    /* ═══════════════════════════════════════
       SCORE SELECTOR BUTTONS (Assessment)
       ═══════════════════════════════════════ */
    .sb {
      flex: 1; min-width: 52px;
      padding: 10px 6px; border-radius: 14px;
      cursor: pointer; border: 1.5px solid rgba(199,74,63,.18);
      text-align: center;
      transition: all .28s cubic-bezier(.25,.46,.45,.94);
      background: rgba(251,243,231,.55);
    }
    .sb:hover { border-color: rgba(242,109,91,.38); background: rgba(247,180,138,.18); }
    .sb.sel {
      background: linear-gradient(135deg, rgba(242,109,91,.22), rgba(247,180,138,.28));
      border-color: rgba(199,74,63,.42); color: var(--terracotta);
    }
    .sn { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; color: var(--ink-warm); }
    .sl { font-size: 10px; color: var(--ink-meta); margin-top: 2px; font-family: 'Lora', serif; }

    /* ═══════════════════════════════════════
       CHAT BUBBLES
       ═══════════════════════════════════════ */
    .bbl {
      max-width: 78%; padding: 13px 18px;
      border-radius: 20px; line-height: 1.75; font-size: 14px;
      animation: slideMsg .4s cubic-bezier(.25,.46,.45,.94) both;
    }
    /* Manas / AI — warm paper */
    .bbl-b {
      background: linear-gradient(135deg, rgba(245,237,224,.96), rgba(238,226,206,.90));
      border: 1px solid var(--line-pencil);
      border-bottom-left-radius: 4px;
      color: var(--ink-warm);
      font-family: 'Source Serif 4', Georgia, serif;
      font-style: italic;
    }
    /* User — dusty rose */
    .bbl-u {
      background: linear-gradient(135deg, rgba(216,154,148,.55), rgba(235,165,140,.40));
      border: 1px solid rgba(199,74,63,.18);
      border-bottom-right-radius: 4px;
      color: var(--ink-warm);
      margin-left: auto;
    }

    /* ═══════════════════════════════════════
       PILL TOGGLES (Persona tags)
       ═══════════════════════════════════════ */
    .pp {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 7px 16px; border-radius: 999px;
      font-size: 13px; cursor: pointer; font-family: 'Lora', serif;
      transition: all .28s cubic-bezier(.25,.46,.45,.94);
      border: 1.5px solid transparent;
    }
    .pp.on { color: var(--paper-cream); box-shadow: 0 3px 14px rgba(199,74,63,.18); }
    .pp.off { background: rgba(251,243,231,.55); border-color: rgba(199,74,63,.20); color: var(--ink-soft); }
    .pp.off:hover { background: rgba(247,180,138,.22); border-color: rgba(242,109,91,.35); }

    /* ═══════════════════════════════════════
       TOOLTIP
       ═══════════════════════════════════════ */
    .ttip {
      background: rgba(74,52,40,.92);
      color: var(--paper-cream);
      padding: 8px 14px; border-radius: 12px;
      font-size: 12px; font-family: 'Lora', serif;
      backdrop-filter: blur(8px);
    }

    /* ═══════════════════════════════════════
       TYPOGRAPHY UTILITIES
       ═══════════════════════════════════════ */
    /* Editorial serif headline italic */
    .st {
      font-family: 'Playfair Display', serif;
      font-weight: 500; color: var(--terracotta);
      letter-spacing: -.015em;
    }

    /* Handwritten accent */
    .cv { font-family: 'Caveat', cursive; }

    /* Small caps meta label */
    .meta {
      font-family: 'DM Mono', monospace;
      font-size: 10px; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--dusty-rose);
    }

    /* Source Serif italic for body reflections */
    .serif-italic {
      font-family: 'Source Serif 4', Georgia, serif;
      font-style: italic;
    }

    /* Icon chip */
    .ico-chip {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    }

    /* ═══════════════════════════════════════
       LAYOUT — APP SHELL
       ═══════════════════════════════════════ */
    .app-container { display: flex; min-height: 100vh; }

    .sidebar-container { width: 228px; flex-shrink: 0; }

    .sidebar-backdrop { display: none; }

    .mobile-header { display: none; }

    .view-container { padding: 34px 38px; margin: 0 auto; }

    /* ═══════════════════════════════════════
       LAYOUT — GRID SYSTEMS
       ═══════════════════════════════════════ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px; margin-bottom: 26px;
    }
    .dash-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }
    .insights-stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 13px; margin-bottom: 22px;
    }
    .insights-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px; margin-bottom: 20px;
    }
    .severity-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .form-row-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px; margin-bottom: 14px;
    }
    .consistency-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .intro-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px; margin-bottom: 28px;
    }

    .chat-container {
      padding: 24px 28px;
      max-width: 1060px;
      margin: 0 auto;
      height: calc(100vh - 40px);
      display: flex; flex-direction: column;
    }

    /* ═══════════════════════════════════════
       RECHARTS OVERRIDES — warm watercolor charts
       ═══════════════════════════════════════ */
    .recharts-cartesian-grid-horizontal line,
    .recharts-cartesian-grid-vertical line {
      stroke: rgba(199,74,63,.08) !important;
      stroke-dasharray: 3 5 !important;
    }
    .recharts-cartesian-axis-line { stroke: transparent !important; }
    .recharts-cartesian-axis-tick-line { stroke: transparent !important; }
    .recharts-text.recharts-cartesian-axis-tick-value {
      fill: var(--ink-meta) !important;
      font-family: 'DM Mono', monospace !important;
      font-size: 10px !important;
    }
    .recharts-polar-grid-concentric-polygon,
    .recharts-polar-grid-concentric-circle {
      stroke: rgba(199,74,63,.12) !important;
    }
    .recharts-polar-angle-axis-tick-value {
      fill: var(--ink-meta) !important;
      font-size: 11px !important;
      font-family: 'DM Mono', monospace !important;
    }

    /* ═══════════════════════════════════════
       RESPONSIVE BREAKPOINTS
       ═══════════════════════════════════════ */
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .insights-stats-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 768px) {
      .app-container { flex-direction: column; }
      .mobile-header { display: flex !important; }
      .sidebar-container {
        position: fixed !important;
        top: 0; left: 0;
        height: 100vh; z-index: 1000;
        width: 228px;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
      }
      .sidebar-container.open { transform: translateX(0); }
      .sidebar-backdrop {
        display: block;
        position: fixed; inset: 0;
        background: rgba(74,52,40,.35);
        backdrop-filter: blur(4px);
        z-index: 999;
      }
      .view-container { padding: 20px 16px; }
      .dash-main-grid { grid-template-columns: 1fr; }
      .insights-main-grid { grid-template-columns: 1fr; }
      .consistency-grid { grid-template-columns: 1fr; }
      .chat-container { padding: 16px 14px; height: calc(100vh - 56px); }
      .mobile-close-btn { display: flex !important; }
    }

    @media (max-width: 600px) {
      .insights-stats-grid { grid-template-columns: repeat(2, 1fr); }
      .severity-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
      .insights-stats-grid { grid-template-columns: 1fr; }
      .form-row-grid { grid-template-columns: 1fr; }
      .intro-grid { grid-template-columns: 1fr; }
    }

    /* ═══════════════════════════════════════
       FOCUS RINGS — WCAG AA
       ═══════════════════════════════════════ */
    :focus-visible {
      outline: 2px solid var(--coral);
      outline-offset: 2px;
      border-radius: 4px;
    }

    /* ═══════════════════════════════════════
       REDUCED MOTION
       ═══════════════════════════════════════ */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }
  `}</style>
);

export default G;
