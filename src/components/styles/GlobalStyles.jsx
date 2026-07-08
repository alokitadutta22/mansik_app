const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Caveat:wght@400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --cream:#ffffff;--parchment:#fafaf8;--blush:#e0f5d5;--dusty:#cce5ce;
      --rose:#558b5a;--sky:#e0f0ff;--sky-d:#b3d9ff;--sage:#eaffe6;--sage-d:#c9f0a1;
      --lav:#faedfd;--lav-d:#e8b0f5;--honey:#fffee0;--honey-d:#fff9b3;
      --brown:#0f2b16;--brown-l:#315c38;--text:#17221a;--soft:#4a5449;--mute:#7e8b7d;--ink:#0b1a0e;
    }
    body::before{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      background-size:200px 200px;opacity:0.55}
    html{cursor:none;scroll-behavior:smooth}
    body{background:var(--cream);font-family:'Lora',Georgia,serif;color:var(--text);overflow-x:hidden}
    #cd{position:fixed;z-index:99998;pointer-events:none;width:8px;height:8px;border-radius:50%;
      background:var(--rose);transform:translate(-50%,-50%);transition:width .2s,height .2s,background .3s}
    #cr{position:fixed;z-index:99997;pointer-events:none;width:36px;height:36px;border-radius:50%;
      border:1.5px solid rgba(180,120,110,.42);transform:translate(-50%,-50%);
      transition:width .35s cubic-bezier(.25,.46,.45,.94),height .35s cubic-bezier(.25,.46,.45,.94),border-color .3s}
    body.ch #cd{width:14px;height:14px;background:var(--honey-d)}
    body.ch #cr{width:52px;height:52px;border-color:rgba(196,164,90,.5)}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--blush);border-radius:10px}

    @keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
    @keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes breathe {0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes drift   {0%,100%{transform:translateX(0) rotate(0)}50%{transform:translateX(6px) rotate(1.5deg)}}
    @keyframes waveBar {0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
    @keyframes spin    {to{transform:rotate(360deg)}}
    @keyframes pulse2  {0%,100%{opacity:.55}50%{opacity:1}}
    @keyframes ripple2 {0%{transform:scale(.9);opacity:1}100%{transform:scale(2.2);opacity:0}}
    @keyframes slideMsg{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

    .fu{animation:fadeUp .7s cubic-bezier(.25,.46,.45,.94) both}
    .flt{animation:float 7s ease-in-out infinite}
    .bth{animation:breathe 4s ease-in-out infinite}
    .dft{animation:drift 8s ease-in-out infinite}

    .paper{background:linear-gradient(145deg,rgba(255,250,244,.92),rgba(239,230,216,.88));
      border:1px solid rgba(200,170,150,.22);border-radius:22px;
      box-shadow:0 4px 28px rgba(120,80,55,.07),inset 0 1px 0 rgba(255,255,255,.7);backdrop-filter:blur(4px)}
    .paper-b{background:linear-gradient(145deg,rgba(245,232,228,.9),rgba(232,200,194,.75));
      border:1px solid rgba(212,169,163,.28);border-radius:22px;box-shadow:0 4px 22px rgba(180,110,100,.1)}
    .paper-s{background:linear-gradient(145deg,rgba(228,238,246,.9),rgba(194,208,220,.75));
      border:1px solid rgba(151,174,192,.28);border-radius:22px}
    .paper-g{background:linear-gradient(145deg,rgba(232,238,226,.9),rgba(196,205,184,.75));
      border:1px solid rgba(143,160,138,.28);border-radius:22px}

    .nav-pill{display:flex;align-items:center;gap:9px;padding:9px 15px;border-radius:40px;cursor:pointer;
      transition:all .35s cubic-bezier(.25,.46,.45,.94);font-family:'Lora',serif;font-size:13.5px;
      color:var(--soft);border:1px solid transparent}
    .nav-pill:hover{background:rgba(232,200,194,.38);color:var(--brown)}
    .nav-pill.act{background:linear-gradient(135deg,rgba(232,200,194,.78),rgba(194,208,220,.58));
      border-color:rgba(200,170,150,.28);color:var(--brown);box-shadow:0 2px 12px rgba(180,110,100,.11)}

    .btn-s{background:linear-gradient(135deg,var(--blush),var(--dusty));color:white;border:none;
      border-radius:40px;padding:12px 32px;font-family:'Lora',serif;font-size:14px;cursor:pointer;
      transition:all .4s cubic-bezier(.25,.46,.45,.94);box-shadow:0 4px 18px rgba(180,110,100,.2),inset 0 1px 0 rgba(255,255,255,.28)}
    .btn-s:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(180,110,100,.3)}
    .btn-g{background:transparent;border:1.5px solid rgba(200,170,150,.38);border-radius:40px;
      padding:10px 24px;font-family:'Lora',serif;font-size:13px;color:var(--soft);cursor:pointer;transition:all .3s}
    .btn-g:hover{background:rgba(232,200,194,.22);border-color:var(--blush);color:var(--brown)}

    .si{width:100%;padding:13px 18px;border:1.5px solid rgba(200,170,150,.28);border-radius:16px;
      font-family:'Lora',serif;font-size:14px;background:rgba(255,250,244,.8);color:var(--text);outline:none;
      transition:all .35s cubic-bezier(.25,.46,.45,.94)}
    .si:focus{border-color:rgba(184,131,124,.5);background:rgba(255,252,248,.95);box-shadow:0 0 0 4px rgba(232,200,194,.18)}
    .si::placeholder{color:var(--mute);font-style:italic}

    .tag{display:inline-flex;align-items:center;padding:4px 14px;border-radius:30px;font-size:12px;font-family:'Lora',serif}
    .tl{background:rgba(196,205,184,.38);color:#506048;border:1px solid rgba(143,160,138,.28)}
    .tm{background:rgba(226,200,138,.38);color:#7A5A1A;border:1px solid rgba(196,164,90,.28)}
    .th{background:rgba(232,200,194,.48);color:#8B4A40;border:1px solid rgba(212,169,163,.38)}

    .wave-bar{width:3px;border-radius:3px;background:linear-gradient(180deg,var(--dusty),var(--blush));
      transform-origin:bottom;animation:waveBar 1.2s ease-in-out infinite}

    .pt{height:5px;background:rgba(200,170,150,.18);border-radius:3px;overflow:hidden}
    .pf{height:100%;border-radius:3px;transition:width 1.2s cubic-bezier(.25,.46,.45,.94)}

    .sb{flex:1;min-width:52px;padding:10px 6px;border-radius:14px;cursor:pointer;
      border:1.5px solid rgba(200,170,150,.22);text-align:center;
      transition:all .3s cubic-bezier(.25,.46,.45,.94);background:rgba(255,250,244,.55)}
    .sb:hover{border-color:rgba(184,131,124,.38);background:rgba(232,200,194,.18)}
    .sb.sel{background:linear-gradient(135deg,rgba(232,200,194,.78),rgba(226,200,138,.48));
      border-color:rgba(184,131,124,.48);color:var(--brown)}
    .sn{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:var(--brown)}
    .sl{font-size:10px;color:var(--mute);margin-top:2px;font-family:'Lora',serif}

    .bbl{max-width:78%;padding:13px 18px;border-radius:20px;line-height:1.72;font-size:14px;
      animation:slideMsg .4s cubic-bezier(.25,.46,.45,.94) both}
    .bbl-b{background:linear-gradient(135deg,rgba(245,232,228,.94),rgba(239,230,216,.88));
      border:1px solid rgba(200,170,150,.22);border-bottom-left-radius:4px;color:var(--text)}
    .bbl-u{background:linear-gradient(135deg,rgba(194,208,220,.83),rgba(204,196,216,.68));
      border:1px solid rgba(151,174,192,.28);border-bottom-right-radius:4px;color:var(--ink);margin-left:auto}

    .pp{display:inline-flex;align-items:center;gap:7px;padding:7px 16px;border-radius:30px;
      font-size:13px;cursor:pointer;font-family:'Lora',serif;
      transition:all .35s cubic-bezier(.25,.46,.45,.94);border:1.5px solid transparent}
    .pp.on{color:white;box-shadow:0 3px 12px rgba(0,0,0,.09)}
    .pp.off{background:rgba(240,230,220,.48);border-color:rgba(200,170,150,.22);color:var(--soft)}
    .pp.off:hover{background:rgba(232,200,194,.38)}

    .ttip{background:rgba(74,55,40,.9);color:var(--cream);padding:8px 14px;border-radius:12px;
      font-size:12px;font-family:'Lora',serif;backdrop-filter:blur(8px)}
    .st{font-family:'Playfair Display',serif;font-weight:600;color:var(--brown);letter-spacing:-.2px}
    .cv{font-family:'Caveat',cursive}
    .blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.32;pointer-events:none}

    /* Icon chip used in feature lists */
    .ico-chip{display:flex;align-items:center;justify-content:center;
      width:34px;height:34px;border-radius:10px;flex-shrink:0}

    /* Responsive Layout Styles */
    .app-container {
      display: flex;
      min-height: 100vh;
    }
    .sidebar-container {
      width: 228px;
      flex-shrink: 0;
    }
    .sidebar-backdrop {
      display: none;
    }
    .mobile-header {
      display: none;
    }
    .view-container {
      padding: 34px 38px;
      margin: 0 auto;
    }

    /* Grids & Layouts */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 26px;
    }
    .dash-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }
    .insights-stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 13px;
      margin-bottom: 22px;
    }
    .insights-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .severity-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .form-row-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
    }
    .consistency-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .intro-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .chat-container {
      padding: 34px 38px;
      max-width: 780px;
      margin: 0 auto;
      height: calc(100vh - 40px);
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .insights-stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .app-container {
        flex-direction: column;
      }
      .mobile-header {
        display: flex !important;
      }
      .sidebar-container {
        position: fixed !important;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 1000;
        width: 228px;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
      }
      .sidebar-container.open {
        transform: translateX(0);
      }
      .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        z-index: 999;
      }
      .view-container {
        padding: 20px 16px;
      }
      .dash-main-grid {
        grid-template-columns: 1fr;
      }
      .insights-main-grid {
        grid-template-columns: 1fr;
      }
      .consistency-grid {
        grid-template-columns: 1fr;
      }
      .chat-container {
        padding: 16px 14px;
        height: calc(100vh - 56px);
      }
      .mobile-close-btn {
        display: flex !important;
      }
    }

    @media (max-width: 600px) {
      .insights-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .severity-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .insights-stats-grid {
        grid-template-columns: 1fr;
      }
      .form-row-grid {
        grid-template-columns: 1fr;
      }
      .intro-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
);


export default G;
