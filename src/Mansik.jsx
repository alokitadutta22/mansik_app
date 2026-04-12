import { useState, useEffect, useRef } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

/* ══ PALETTE-MATCHED SVG ICON SYSTEM ══ */
const PATHS = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  clip: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M12 12h4M12 16h4M8 12h.01M8 16h.01",
  chart: "M18 20V10M12 20V4M6 20v-6",
  dna: "M3 3c1.5 4 6 6 9 9s4.5 5.5 3 9M21 3c-1.5 4-6 6-9 9s-4.5 5.5-3 9M4.5 9h15M4.5 15h15",
  msg: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  leaf: "M17 8C8 10 5.9 16.17 3.82 19.36M17 8c-1 4-3 6-7 8M17 8c1-8-8-6-8-6",
  pen: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  brief:
    "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  film: "M19.82 2H4.18A2.18 2.18 0 0 0 2 4.18v15.64A2.18 2.18 0 0 0 4.18 22h15.64A2.18 2.18 0 0 0 22 19.82V4.18A2.18 2.18 0 0 0 19.82 2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  exit: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  music:
    "M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  rain: "M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9M16 14v6M8 14v6M12 16v6",
  wave: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
  wind: "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2",
  grain: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v4M12 16h.01",
  sun: "M12 17A5 5 0 1 0 12 7a5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  alert:
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  check: "M20 6L9 17l-5-5",
  trend: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  brain:
    "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.24zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.24z",
};

const Ico = ({ n, s = 18, c = "currentColor", sw = 1.7 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={PATHS[n] || ""} />
  </svg>
);

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
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
  `}</style>
);

/* ── Cursor ── */
const Cursor = () => {
  const dot = useRef(null),
    ring = useRef(null),
    pos = useRef({ x: 0, y: 0 }),
    lag = useRef({ x: 0, y: 0 }),
    raf = useRef(null);
  useEffect(() => {
    const mv = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
    };
    const lp = () => {
      if (ring.current) {
        lag.current.x += (pos.current.x - lag.current.x) * 0.45;
        lag.current.y += (pos.current.y - lag.current.y) * 0.45;
        ring.current.style.left = lag.current.x + "px";
        ring.current.style.top = lag.current.y + "px";
      }
      raf.current = requestAnimationFrame(lp);
    };
    const ov = (e) => {
      if (e.target.closest("button,[data-h],.nav-pill,.sb,.pp"))
        document.body.classList.add("ch");
    };
    const ou = () => document.body.classList.remove("ch");
    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", ov);
    document.addEventListener("mouseout", ou);
    raf.current = requestAnimationFrame(lp);
    return () => {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseover", ov);
      document.removeEventListener("mouseout", ou);
      cancelAnimationFrame(raf.current);
    };
  }, []);
  return (
    <>
      <div id="cd" ref={dot} />
      <div id="cr" ref={ring} />
    </>
  );
};

/* ── Music Player ── */
const TRACKS = [
  { t: "Morning Rain", m: "Calming", ico: "rain", c: "#97AEC0" },
  { t: "Forest Breath", m: "Grounding", ico: "leaf", c: "#8FA08A" },
  { t: "Dusk Tide", m: "Soothing", ico: "wave", c: "#9B8FB0" },
  { t: "Still Meadow", m: "Peaceful", ico: "wind", c: "#C4A45A" },
];
const Music = () => {
  const [play, setPlay] = useState(false),
    [tr, setTr] = useState(0),
    [exp, setExp] = useState(false),
    [vol, setVol] = useState(70);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      {exp && (
        <div
          className="paper fu"
          style={{
            padding: "18px 20px",
            marginBottom: 10,
            width: 256,
            animationDuration: ".35s",
          }}
        >
          <div
            className="cv"
            style={{
              fontSize: 12,
              color: "var(--mute)",
              marginBottom: 12,
              letterSpacing: 0.8,
            }}
          >
            ambient sounds
          </div>
          {TRACKS.map((t, i) => (
            <div
              key={i}
              data-h
              onClick={() => {
                setTr(i);
                setPlay(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 11,
                cursor: "pointer",
                background: tr === i ? "rgba(232,200,194,.3)" : "transparent",
                transition: "background .28s",
                marginBottom: 3,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: `${t.c}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico n={t.ico} s={15} c={t.c} sw={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "'Lora',serif",
                    color: "var(--text)",
                    fontWeight: tr === i ? 500 : 400,
                  }}
                >
                  {t.t}
                </div>
                <div style={{ fontSize: 10, color: "var(--mute)" }}>{t.m}</div>
              </div>
              {tr === i && play && (
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-end",
                    height: 14,
                  }}
                >
                  {[0, 0.2, 0.1, 0.3].map((d, j) => (
                    <div
                      key={j}
                      className="wave-bar"
                      style={{ height: 6 + j * 3, animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <Ico n="music" s={13} c="var(--mute)" sw={1.6} />
            <input
              type="range"
              min={0}
              max={100}
              value={vol}
              onChange={(e) => setVol(+e.target.value)}
              style={{ flex: 1, accentColor: "var(--dusty)", height: 3 }}
            />
          </div>
        </div>
      )}
      <div
        className="paper"
        style={{
          padding: "9px 14px",
          display: "flex",
          alignItems: "center",
          gap: 11,
          cursor: "pointer",
        }}
        data-h
        onClick={() => setExp((e) => !e)}
      >
        <div
          style={{
            display: "flex",
            gap: 2.5,
            alignItems: "flex-end",
            height: 18,
          }}
        >
          {[0.4, 0.65, 1, 0.7, 0.5].map((h, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                height: play ? `${h * 16}px` : "3px",
                animationDelay: `${i * 0.15}s`,
                animationPlayState: play ? "running" : "paused",
                background: play
                  ? "linear-gradient(180deg,var(--dusty),var(--blush))"
                  : "rgba(200,170,150,.28)",
              }}
            />
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontFamily: "'Lora',serif",
              color: "var(--text)",
            }}
          >
            {TRACKS[tr].t}
          </div>
          <div style={{ fontSize: 10, color: "var(--mute)" }}>
            {play ? "Now playing" : "Tap to play"}
          </div>
        </div>
        <button
          className="btn-s"
          style={{ padding: "5px 12px", fontSize: 12, borderRadius: 28 }}
          onClick={(e) => {
            e.stopPropagation();
            setPlay((p) => !p);
          }}
        >
          {play ? "⏸" : "▶"}
        </button>
      </div>
    </div>
  );
};

/* ── Constants ── */
const PSS = [
  {
    id: 1,
    t: "Been upset because of something that happened unexpectedly?",
    r: false,
  },
  {
    id: 2,
    t: "Felt unable to control the important things in your life?",
    r: false,
  },
  { id: 3, t: "Felt nervous and stressed?", r: false },
  { id: 4, t: "Successfully dealt with irritating life hassles?", r: true },
  {
    id: 5,
    t: "Felt effectively coping with important changes in your life?",
    r: true,
  },
  {
    id: 6,
    t: "Felt confident about your ability to handle personal problems?",
    r: true,
  },
  { id: 7, t: "Felt that things were going your way?", r: true },
  {
    id: 8,
    t: "Found that you could not cope with all the things you had to do?",
    r: false,
  },
  { id: 9, t: "Been able to control irritations in your life?", r: true },
  { id: 10, t: "Felt that you were on top of things?", r: true },
  {
    id: 11,
    t: "Been angered because of things outside your control?",
    r: false,
  },
  {
    id: 12,
    t: "Found yourself thinking about things you have to accomplish?",
    r: false,
  },
  { id: 13, t: "Been able to control how you spend your time?", r: true },
  {
    id: 14,
    t: "Felt difficulties piling up so high you could not overcome them?",
    r: false,
  },
];
const SCALE = [
  { v: 0, l: "Never" },
  { v: 1, l: "Almost Never" },
  { v: 2, l: "Sometimes" },
  { v: 3, l: "Often" },
  { v: 4, l: "Very Often" },
];

/* Pillars: each now has an icon key for SVG rendering */
const PIL = {
  Health: {
    ico: "leaf",
    c: "#C4CDB8",
    d: "#8FA08A",
    a: ["Sleep", "Fitness", "Medication", "Nutrition", "Hydration"],
  },
  Habit: {
    ico: "pen",
    c: "#C2D0DC",
    d: "#97AEC0",
    a: ["Exercise", "Journaling", "Reading", "Meditation", "Social Media"],
  },
  Relationship: {
    ico: "heart",
    c: "#CCC4D8",
    d: "#9B8FB0",
    a: ["Friends", "Family", "Partner", "Manager", "Peers"],
  },
  Occupation: {
    ico: "brief",
    c: "#E2C88A",
    d: "#C4A45A",
    a: ["Student", "IT Professional", "Doctor", "Engineer", "Entrepreneur"],
  },
  Entertainment: {
    ico: "film",
    c: "#E8C8C2",
    d: "#D4A9A3",
    a: ["Movies", "Traveling", "Gaming", "Music", "Sports"],
  },
  Liability: {
    ico: "moon",
    c: "#D8CCBC",
    d: "#A8846E",
    a: [
      "Financial Stress",
      "Family Duties",
      "Work Pressure",
      "Health Worries",
      "Debt",
    ],
  },
};

const HIST = [];
const calcSc = (rs) =>
  PSS.reduce((s, q, i) => {
    const v = rs[i] ?? 0;
    return s + (q.r ? 4 - v : v);
  }, 0);
const sev = (sc) => (sc <= 19 ? "Low" : sc <= 37 ? "Moderate" : "High");
const sc = (sv) =>
  sv === "Low" ? "#7A9A78" : sv === "Moderate" ? "#A88040" : "#A8504A";
const fd = (d) =>
  new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

/* Nav config — icon keys instead of emoji */
const NAV = [
  { id: "dash", ico: "home", icoC: "#D4A9A3", l: "My Sanctuary" },
  { id: "assess", ico: "clip", icoC: "#8FA08A", l: "Assessment" },
  { id: "analytics", ico: "chart", icoC: "#97AEC0", l: "Insights" },
  { id: "persona", ico: "dna", icoC: "#9B8FB0", l: "My Persona" },
  { id: "chat", ico: "msg", icoC: "#B8837C", l: "Manas — AI" },
  { id: "recs", ico: "star", icoC: "#C4A45A", l: "Guidance" },
];

/* ── Auth ── */
const Auth = ({ onAuth }) => {
  const [mode, setMode] = useState("login"),
    [form, setForm] = useState({ name: "", email: "", password: "" }),
    [busy, setBusy] = useState(false);
  const go = async () => {
    if (!form.email || !form.password) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1000));
    onAuth({
      id: "u1",
      name: form.name || form.email.split("@")[0],
      email: form.email,
    });
    setBusy(false);
  };

  const feats = [
    { ico: "clip", c: "#8FA08A", label: "Psychometric stress assessment" },
    { ico: "msg", c: "#B8837C", label: "Gentle AI companion" },
    { ico: "chart", c: "#97AEC0", label: "Calming longitudinal insights" },
    { ico: "star", c: "#C4A45A", label: "Personalised lifestyle guidance" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="blob"
        style={{
          width: 500,
          height: 500,
          background: "var(--blush)",
          top: -100,
          left: -100,
        }}
      />
      <div
        className="blob"
        style={{
          width: 380,
          height: 380,
          background: "var(--sky)",
          bottom: -80,
          right: -80,
        }}
      />
      <div
        className="blob"
        style={{
          width: 280,
          height: 280,
          background: "var(--honey)",
          top: "35%",
          right: "22%",
        }}
      />

      {/* Left */}
      <div
        className="flt"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: 44 }}>
          <div
            className="cv"
            style={{
              fontSize: 15,
              color: "var(--mute)",
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            welcome to
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg,rgba(232,200,194,.6),rgba(194,208,220,.5))",
                border: "1px solid rgba(200,170,150,.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico n="brain" s={26} c="var(--rose)" sw={1.5} />
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 52,
                fontWeight: 600,
                color: "var(--brown)",
                lineHeight: 1,
              }}
            >
              Mansik
            </div>
          </div>
          <div
            className="cv"
            style={{ fontSize: 20, color: "var(--mute)", marginBottom: 22 }}
          >
            मानसिक — Mindful wellness
          </div>
          <p
            style={{
              fontFamily: "'Lora',serif",
              fontSize: 15,
              color: "var(--soft)",
              lineHeight: 1.88,
              maxWidth: 360,
            }}
          >
            A gentle digital sanctuary for your mental wellness. Breathe easy.
            You are safe here.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {feats.map((f, i) => (
            <div
              key={i}
              className="fu"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                animationDelay: `${i * 0.08 + 0.18}s`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `${f.c}1A`,
                  border: `1px solid ${f.c}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico n={f.ico} s={15} c={f.c} sw={1.8} />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: "'Lora',serif",
                  color: "var(--soft)",
                  fontStyle: "italic",
                }}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          width: 450,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 36,
          zIndex: 1,
        }}
      >
        <div className="paper fu" style={{ width: "100%", padding: 42 }}>
          {/* App mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
              paddingBottom: 20,
              borderBottom: "1px solid rgba(200,170,150,.15)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg,rgba(232,200,194,.5),rgba(194,208,220,.4))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico n="brain" s={18} c="var(--rose)" sw={1.6} />
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 18,
                color: "var(--brown)",
              }}
            >
              Mansik
            </div>
          </div>

          <div
            style={{
              display: "flex",
              background: "rgba(200,170,150,.1)",
              borderRadius: 40,
              padding: 4,
              marginBottom: 28,
            }}
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                data-h
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "9px",
                  border: "none",
                  borderRadius: 36,
                  cursor: "pointer",
                  fontFamily: "'Lora',serif",
                  fontSize: 13,
                  background:
                    mode === m ? "rgba(255,250,244,.94)" : "transparent",
                  color: mode === m ? "var(--brown)" : "var(--mute)",
                  boxShadow:
                    mode === m ? "0 2px 9px rgba(120,80,55,.09)" : "none",
                  transition: "all .35s cubic-bezier(.25,.46,.45,.94)",
                }}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 22,
              color: "var(--brown)",
              marginBottom: 4,
            }}
          >
            {mode === "login" ? "Good to see you again" : "Begin your journey"}
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--mute)",
              marginBottom: 24,
              fontStyle: "italic",
            }}
          >
            {mode === "login"
              ? "Your calm space awaits."
              : "A gentler relationship with your mind starts here."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {mode === "register" && (
              <div>
                <div
                  className="cv"
                  style={{
                    fontSize: 13,
                    color: "var(--mute)",
                    marginBottom: 4,
                  }}
                >
                  your name
                </div>
                <input
                  className="si"
                  placeholder="What shall we call you?"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
            )}
            <div>
              <div
                className="cv"
                style={{ fontSize: 13, color: "var(--mute)", marginBottom: 4 }}
              >
                email address
              </div>
              <input
                className="si"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div>
              <div
                className="cv"
                style={{ fontSize: 13, color: "var(--mute)", marginBottom: 4 }}
              >
                password
              </div>
              <input
                className="si"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>
            <button
              className="btn-s"
              style={{
                width: "100%",
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
              }}
              data-h
              onClick={go}
              disabled={busy}
            >
              {busy && (
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin .8s linear infinite",
                    display: "inline-block",
                  }}
                />
              )}
              {busy
                ? "One moment…"
                : mode === "login"
                  ? "Enter →"
                  : "Begin →"}
            </button>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "var(--mute)",
              marginTop: 18,
              fontStyle: "italic",
            }}
          >
            Your privacy is sacred to us.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Sidebar ── */
const Sidebar = ({ view, setView, user, latest, displayName, setDisplayName, onLogout }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName || user.name);
  const nameRef = useRef(null);
  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);
  const saveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) setDisplayName(trimmed);
    else setNameInput(displayName || user.name);
    setEditingName(false);
  };
  return (
  <div
    style={{
      width: 228,
      background:
        "linear-gradient(180deg,rgba(247,240,232,.97),rgba(239,230,216,.97))",
      borderRight: "1px solid rgba(200,170,150,.18)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
      overflowY: "auto",
      backdropFilter: "blur(10px)",
    }}
  >
    {/* Logo */}
    <div
      style={{
        padding: "22px 20px 18px",
        borderBottom: "1px solid rgba(200,170,150,.13)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background:
              "linear-gradient(135deg,rgba(232,200,194,.55),rgba(194,208,220,.45))",
            border: "1px solid rgba(200,170,150,.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ico n="brain" s={17} c="var(--rose)" sw={1.6} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 18,
              color: "var(--brown)",
              lineHeight: 1.1,
            }}
          >
            Mansik
          </div>
          <div className="cv" style={{ fontSize: 11, color: "var(--mute)" }}>
            मानसिक
          </div>
        </div>
      </div>
    </div>

    {/* User with editable name */}
    <div
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid rgba(200,170,150,.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg,var(--blush),var(--honey))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display',serif",
            fontSize: 16,
            color: "var(--brown)",
            fontWeight: 600,
          }}
        >
          {(displayName || user.name)[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingName ? (
            <input
              ref={nameRef}
              className="si"
              style={{ padding: "4px 8px", fontSize: 13, borderRadius: 10, width: "100%" }}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") { setNameInput(displayName || user.name); setEditingName(false); } }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                cursor: "pointer",
              }}
              data-h
              onClick={() => { setNameInput(displayName || user.name); setEditingName(true); }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "'Lora',serif",
                  color: "var(--text)",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName || user.name}
              </div>
              <Ico n="pen" s={11} c="var(--mute)" sw={1.8} />
            </div>
          )}
          <div
            style={{ fontSize: 11, color: "var(--mute)", fontStyle: "italic" }}
          >
            {latest ? `${latest.severity} stress` : "No assessment yet"}
          </div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav
      style={{
        flex: 1,
        padding: "12px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {NAV.map((n) => (
        <div
          key={n.id}
          className={`nav-pill ${view === n.id ? "act" : ""}`}
          data-h
          onClick={() => setView(n.id)}
        >
          <Ico
            n={n.ico}
            s={16}
            c={view === n.id ? "var(--rose)" : n.icoC}
            sw={1.8}
          />
          <span>{n.l}</span>
        </div>
      ))}
    </nav>

    {/* Logout */}
    <div
      style={{
        padding: "12px 10px",
        borderTop: "1px solid rgba(200,170,150,.1)",
      }}
    >
      <div
        className="nav-pill"
        data-h
        onClick={onLogout}
        style={{ color: "var(--rose)" }}
      >
        <Ico n="exit" s={16} c="var(--rose)" sw={1.8} />
        Leave
      </div>
    </div>
  </div>
  );
};

/* ── Dashboard ── */
const Dash = ({ user, data, persona }) => {
  const lat = data[data.length - 1],
    prev = data[data.length - 2];
  const avg = data.length
    ? Math.round(data.reduce((s, a) => s + a.score, 0) / data.length)
    : 0;
  const trend =
    lat && prev
      ? lat.score < prev.score
        ? "Improving"
        : lat.score > prev.score
          ? "Increasing"
          : "Stable"
      : "Stable";
  const tc =
    trend === "Improving"
      ? "#7A9A78"
      : trend === "Increasing"
        ? "#A8504A"
        : "#A88040";
  const chartD = data
    .slice(-8)
    .map((a) => ({ date: fd(a.date), score: a.score, sev: a.severity }));
  const risk =
    data.slice(-3).length === 3 &&
    data.slice(-3).every((a) => a.severity === "High");
  const CT = ({ active, payload }) =>
    active && payload?.length ? (
      <div className="ttip">
        <div style={{ fontWeight: 500 }}>{payload[0].payload.date}</div>
        <div style={{ color: sc(payload[0].payload.sev) }}>
          Score: {payload[0].value}
        </div>
      </div>
    ) : null;

  const stats = [
    {
      l: "Latest Score",
      v: lat?.score ?? "—",
      sub: lat?.severity ?? "No data",
      c: lat ? sc(lat.severity) : "var(--mute)",
      ico: "brain",
      icoC: "#D4A9A3",
    },
    {
      l: "Average Score",
      v: avg || "—",
      sub: "All time",
      c: "var(--sage-d)",
      ico: "chart",
      icoC: "#8FA08A",
    },
    {
      l: "Trend",
      v: trend === "Improving" ? "↓" : trend === "Increasing" ? "↑" : "→",
      sub: trend,
      c: tc,
      ico: "trend",
      icoC: tc,
    },
    {
      l: "Sessions",
      v: data.length,
      sub: "Completed",
      c: "var(--honey-d)",
      ico: "clip",
      icoC: "#C4A45A",
    },
  ];

  return (
    <div style={{ padding: "34px 38px", maxWidth: 1080, margin: "0 auto" }}>
      <div className="fu" style={{ marginBottom: 34 }}>
        <div
          className="cv"
          style={{ fontSize: 15, color: "var(--mute)", marginBottom: 3 }}
        >
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 36,
            color: "var(--brown)",
            lineHeight: 1.1,
          }}
        >
          How are you, <em style={{ color: "var(--dusty)" }}>{user.name}</em>?
        </div>
        <p
          style={{
            color: "var(--mute)",
            marginTop: 6,
            fontStyle: "italic",
            fontSize: 14,
          }}
        >
          Your Mansik wellness sanctuary.
        </p>
      </div>

      {risk && (
        <div
          className="paper-b fu"
          style={{
            padding: "15px 20px",
            marginBottom: 22,
            display: "flex",
            gap: 13,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(184,131,124,.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Ico n="alert" s={19} c="var(--rose)" sw={1.8} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 15,
                color: "var(--rose)",
              }}
            >
              A gentle nudge
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--soft)",
                marginTop: 2,
                lineHeight: 1.65,
              }}
            >
              Your last three sessions show elevated stress. Consider speaking
              with a professional — seeking help is an act of courage.
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 15,
          marginBottom: 26,
        }}
      >
        {stats.map((s2, i) => (
          <div
            key={i}
            className="paper fu"
            style={{ padding: "20px 18px", animationDelay: `${i * 0.07}s` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                className="cv"
                style={{ fontSize: 13, color: "var(--mute)" }}
              >
                {s2.l}
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${s2.icoC}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico n={s2.ico} s={13} c={s2.icoC} sw={1.9} />
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 38,
                fontWeight: 600,
                color: s2.c,
                lineHeight: 1,
              }}
            >
              {s2.v}
            </div>
            <div
              style={{
                fontFamily: "'Lora',serif",
                fontSize: 11,
                color: "var(--mute)",
                marginTop: 4,
                fontStyle: "italic",
              }}
            >
              {s2.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div className="paper fu" style={{ padding: "24px 22px" }}>
          <div className="st" style={{ fontSize: 19, marginBottom: 3 }}>
            Stress Journey
          </div>
          <p
            style={{
              fontSize: 11,
              color: "var(--mute)",
              fontStyle: "italic",
              marginBottom: 18,
            }}
          >
            Your emotional landscape over time
          </p>
          {chartD.length > 1 ? (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartD}>
                <defs>
                  <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A9A3" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#D4A9A3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(200,170,150,.12)"
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: "var(--mute)",
                    fontFamily: "Lora",
                  }}
                />
                <YAxis
                  domain={[0, 56]}
                  tick={{ fontSize: 10, fill: "var(--mute)" }}
                />
                <Tooltip content={<CT />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--dusty)"
                  strokeWidth={2}
                  fill="url(#aG)"
                  dot={{ fill: "var(--dusty)", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "var(--rose)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: 210,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--mute)",
                fontStyle: "italic",
                fontSize: 13,
              }}
            >
              Complete your first assessment to see your journey ✦
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            {[
              ["Low (0–19)", "#7A9A78"],
              ["Moderate (20–37)", "#A88040"],
              ["High (38–56)", "#A8504A"],
            ].map(([l, c2]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 10,
                  color: "var(--mute)",
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: c2,
                  }}
                />
                <span style={{ fontStyle: "italic" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="paper fu" style={{ padding: "20px 18px" }}>
            <div className="st" style={{ fontSize: 17, marginBottom: 12 }}>
              Life Pillars
            </div>
            {Object.entries(PIL).map(([k, v]) => {
              const n = (persona[k] || []).length,
                t = v.a.length,
                p = Math.round((n / t) * 100);
              return (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      marginBottom: 3,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Ico n={v.ico} s={12} c={v.d} sw={1.9} />
                      <span
                        style={{
                          fontFamily: "'Lora',serif",
                          color: "var(--soft)",
                        }}
                      >
                        {k}
                      </span>
                    </div>
                    <span
                      className="cv"
                      style={{ fontSize: 12, color: "var(--mute)" }}
                    >
                      {n}/{t}
                    </span>
                  </div>
                  <div className="pt">
                    <div
                      className="pf"
                      style={{
                        width: `${p}%`,
                        background: `linear-gradient(90deg,${v.c},${v.d})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="paper fu" style={{ padding: "20px 18px", flex: 1 }}>
            <div className="st" style={{ fontSize: 17, marginBottom: 12 }}>
              Recent Sessions
            </div>
            {data
              .slice(-4)
              .reverse()
              .map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "7px 0",
                    borderBottom:
                      i < 3 ? "1px solid rgba(200,170,150,.1)" : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontFamily: "'Lora',serif",
                        color: "var(--text)",
                      }}
                    >
                      {fd(a.date)}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--mute)",
                        fontStyle: "italic",
                      }}
                    >
                      score {a.score}
                    </div>
                  </div>
                  <span className={`tag t${a.severity[0].toLowerCase()}`}>
                    {a.severity}
                  </span>
                </div>
              ))}
            {!data.length && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--mute)",
                  fontStyle: "italic",
                }}
              >
                No sessions yet — begin when ready.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Assessment ── */
const Assess = ({ onSubmit, data }) => {
  const [step, setStep] = useState("intro"),
    [resp, setResp] = useState(Array(14).fill(null)),
    [result, setRes] = useState(null);
  const done = resp.every((r) => r !== null),
    filled = resp.filter((r) => r !== null).length;
  const submit = () => {
    const s = calcSc(resp),
      sv = sev(s),
      a = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        score: s,
        severity: sv,
        responses: [...resp],
      };
    setRes(a);
    onSubmit(a);
    setStep("result");
  };
  const reset = () => {
    setResp(Array(14).fill(null));
    setRes(null);
    setStep("intro");
  };

  if (step === "result" && result) {
    const c2 = sc(result.severity);
    return (
      <div style={{ padding: "34px 38px", maxWidth: 640, margin: "0 auto" }}>
        <div className="paper fu" style={{ padding: 42, textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: 108,
              height: 108,
              margin: "0 auto 22px",
            }}
          >
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: "50%",
                background: `${c2}12`,
                border: `2.5px solid ${c2}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 38,
                  fontWeight: 600,
                  color: c2,
                }}
              >
                {result.score}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--mute)",
                  fontStyle: "italic",
                }}
              >
                out of 56
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                border: `2px solid ${c2}22`,
                animation: "ripple2 2.5s ease-in-out infinite",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 27,
              color: "var(--brown)",
              marginBottom: 7,
            }}
          >
            Assessment Complete
          </div>
          <span
            className={`tag t${result.severity[0].toLowerCase()}`}
            style={{ fontSize: 13, padding: "5px 17px" }}
          >
            {result.severity} Stress
          </span>
          <div
            style={{
              background: "rgba(200,170,150,.07)",
              borderRadius: 16,
              padding: 18,
              margin: "22px 0",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 14,
                color: "var(--brown)",
                marginBottom: 9,
              }}
            >
              What your score means
            </div>
            {[
              ["0–19", "Low Stress", "#7A9A78"],
              ["20–37", "Moderate Stress", "#A88040"],
              ["38–56", "High Stress", "#A8504A"],
            ].map(([r, l, c3]) => (
              <div
                key={r}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "5px 0",
                  borderBottom: "1px solid rgba(200,170,150,.1)",
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: c3,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    width: 58,
                    color: c3,
                    fontFamily: "'Lora',serif",
                  }}
                >
                  {r}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--soft)",
                    fontStyle: "italic",
                  }}
                >
                  {l}
                </span>
                {l.split(" ")[0] === result.severity && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: c3 }}>
                    ← you
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 11, justifyContent: "center" }}>
            <button className="btn-g" data-h onClick={reset}>
              Take another
            </button>
            <button className="btn-s" data-h onClick={reset}>
              View insights →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "intro")
    return (
      <div style={{ padding: "34px 38px", maxWidth: 680, margin: "0 auto" }}>
        <div
          className="paper-b fu"
          style={{
            padding: "36px 38px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="blob"
            style={{
              width: 180,
              height: 180,
              background: "var(--honey)",
              top: -55,
              right: -35,
              opacity: 0.22,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(184,131,124,.12)",
                border: "1px solid rgba(184,131,124,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico n="clip" s={21} c="var(--rose)" sw={1.6} />
            </div>
            <div>
              <div
                className="cv"
                style={{ fontSize: 14, color: "var(--rose)" }}
              >
                perceived stress scale
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 28,
                  color: "var(--brown)",
                }}
              >
                PSS‑14 Assessment
              </div>
            </div>
          </div>
          <p
            style={{
              fontFamily: "'Lora',serif",
              fontSize: 14,
              color: "var(--soft)",
              lineHeight: 1.82,
              marginBottom: 24,
              maxWidth: 460,
            }}
          >
            A gentle 14-question reflection on how you have felt over the{" "}
            <strong>past month</strong>. Take your time — there are no wrong
            answers.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {[
              ["14", "Questions"],
              ["5-point", "Scale"],
              ["~5 min", "Duration"],
            ].map(([v2, l]) => (
              <div
                key={l}
                style={{
                  background: "rgba(255,250,244,.58)",
                  borderRadius: 13,
                  padding: "11px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 22,
                    color: "var(--brown)",
                  }}
                >
                  {v2}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mute)",
                    fontStyle: "italic",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
          <button className="btn-s" data-h onClick={() => setStep("questions")}>
            Begin when ready →
          </button>
        </div>
        {data.length > 0 && (
          <div className="paper fu" style={{ padding: "22px 24px" }}>
            <div className="st" style={{ fontSize: 19, marginBottom: 14 }}>
              Previous Sessions
            </div>
            {data
              .slice()
              .reverse()
              .slice(0, 5)
              .map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 0",
                    borderBottom: "1px solid rgba(200,170,150,.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontFamily: "'Lora',serif",
                      color: "var(--text)",
                    }}
                  >
                    {fd(a.date)}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 11 }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 24,
                        fontWeight: 600,
                        color: sc(a.severity),
                      }}
                    >
                      {a.score}
                    </span>
                    <span className={`tag t${a.severity[0].toLowerCase()}`}>
                      {a.severity}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );

  return (
    <div style={{ padding: "34px 38px", maxWidth: 680, margin: "0 auto" }}>
      <div className="fu" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 7,
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 24,
              color: "var(--brown)",
            }}
          >
            How have you been feeling?
          </div>
          <span className="cv" style={{ fontSize: 14, color: "var(--mute)" }}>
            {filled} of 14
          </span>
        </div>
        <div className="pt" style={{ height: 5, marginBottom: 5 }}>
          <div
            className="pf"
            style={{
              width: `${(filled / 14) * 100}%`,
              background: "linear-gradient(90deg,var(--blush),var(--dusty))",
            }}
          />
        </div>
        <p style={{ fontSize: 12, color: "var(--mute)", fontStyle: "italic" }}>
          Over the past month…
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {PSS.map((q, i) => (
          <div
            key={q.id}
            className="paper fu"
            style={{
              padding: "19px 21px",
              animationDelay: `${i * 0.022}s`,
              borderLeft: `3px solid ${resp[i] !== null ? "var(--blush)" : "transparent"}`,
              transition: "border-color .38s",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 11,
                marginBottom: 13,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: "50%",
                  background:
                    resp[i] !== null ? "var(--blush)" : "rgba(200,170,150,.13)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontFamily: "'Playfair Display',serif",
                  fontWeight: 600,
                  flexShrink: 0,
                  marginTop: 2,
                  color: resp[i] !== null ? "var(--brown)" : "var(--mute)",
                  transition: "all .3s",
                }}
              >
                {i + 1}
              </div>
              <p
                style={{
                  fontFamily: "'Lora',serif",
                  fontSize: 14,
                  lineHeight: 1.66,
                  color: "var(--text)",
                  fontStyle: q.r ? "italic" : "normal",
                }}
              >
                {q.t}
                {q.r && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--sage-d)",
                      marginLeft: 5,
                    }}
                  >
                    ◐
                  </span>
                )}
              </p>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {SCALE.map((o) => (
                <div
                  key={o.v}
                  className={`sb ${resp[i] === o.v ? "sel" : ""}`}
                  data-h
                  onClick={() =>
                    setResp((p) => {
                      const n = [...p];
                      n[i] = o.v;
                      return n;
                    })
                  }
                >
                  <div className="sn">{o.v}</div>
                  <div className="sl">{o.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button className="btn-g" data-h onClick={() => setStep("intro")}>
          ← Return
        </button>
        <button
          className="btn-s"
          data-h
          onClick={submit}
          disabled={!done}
          style={{ opacity: done ? 1 : 0.42 }}
        >
          Submit with care →
        </button>
      </div>
    </div>
  );
};

/* ── Analytics ── */
const Anlyt = ({ data, chatMood = [] }) => {
  if (!data.length && !chatMood.length)
    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 420,
        }}
      >
        <div style={{ textAlign: "center", color: "var(--mute)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ico n="chart" s={46} c="rgba(200,170,150,.5)" sw={1.2} />
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 21,
              color: "var(--brown)",
            }}
          >
            Your story is yet to begin
          </div>
          <p style={{ fontSize: 13, fontStyle: "italic", marginTop: 7 }}>
            Complete a PSS-14 assessment or chat with Manas to see your insights.
          </p>
        </div>
      </div>
    );
  const scores = data.map((a) => a.score),
    avg = Math.round(scores.reduce((s, x) => s + x, 0) / scores.length);
  const hi = Math.max(...scores),
    lo = Math.min(...scores);
  const last = data[data.length - 1],
    prev = data[data.length - 2];
  const chg = prev
    ? (((last.score - prev.score) / prev.score) * 100).toFixed(1)
    : 0;
  const trend =
    data.length < 2
      ? "Stable"
      : scores[scores.length - 1] < scores[scores.length - 2]
        ? "Improving"
        : scores[scores.length - 1] > scores[scores.length - 2]
          ? "Escalating"
          : "Stable";
  const risk =
    data.slice(-3).length === 3 &&
    data.slice(-3).every((a) => a.severity === "High");
  const dist = { Low: 0, Moderate: 0, High: 0 };
  data.forEach((a) => dist[a.severity]++);
  const lineD = data.map((a) => ({
    date: fd(a.date),
    score: a.score,
    avg,
    m20: 20,
    m38: 38,
  }));
  // Merge chat mood signals into timeline
  const chatLineD = chatMood.map(m => ({
    date: fd(m.date),
    chatScore: m.sentimentScore,
    m20: 20,
    m38: 38,
  }));
  // Combined timeline: assessment + chat
  const combinedLine = [...lineD.map(d => ({ ...d, chatScore: null })), ...chatLineD.map(d => ({ ...d, score: null, avg: null }))]
    .sort((a, b) => a.date.localeCompare(b.date));
  const radar = [
    { s: "Consistency", v: Math.min(100, data.length * 12) },
    { s: "Stability", v: trend === "Stable" ? 85 : 45 },
    { s: "Improvement", v: chg < 0 ? 80 : 40 },
    { s: "Awareness", v: Math.min(100, 50 + chatMood.length * 5) },
    { s: "Resilience", v: avg < 25 ? 80 : avg < 38 ? 55 : 30 },
    { s: "Engagement", v: Math.min(100, (data.length + chatMood.length) * 8) },
  ];
  const CT = ({ active, payload }) =>
    active && payload?.length ? (
      <div className="ttip">
        <div style={{ fontWeight: 500 }}>{payload[0].payload.date}</div>
        {payload.map((p2, i) =>
          p2.dataKey === "score" ? (
            <div key={i} style={{ color: "var(--blush)" }}>
              Score: {p2.value}
            </div>
          ) : null,
        )}
      </div>
    ) : null;

  const statRows = [
    { l: "Average", v: avg, ico: "brain", c: "var(--rose)", icoC: "#D4A9A3" },
    { l: "Highest", v: hi, ico: "trend", c: "#A8504A", icoC: "#A8504A" },
    { l: "Lowest", v: lo, ico: "check", c: "#7A9A78", icoC: "#7A9A78" },
    {
      l: "Change",
      v: `${chg > 0 ? "+" : ""}${chg}%`,
      ico: chg < 0 ? "check" : "trend",
      c: chg < 0 ? "#7A9A78" : "#A8504A",
      icoC: chg < 0 ? "#7A9A78" : "#A8504A",
    },
    {
      l: "Trend",
      v: trend,
      ico: "chart",
      c:
        trend === "Improving"
          ? "#7A9A78"
          : trend === "Escalating"
            ? "#A8504A"
            : "#A88040",
      icoC: "#97AEC0",
    },
  ];

  return (
    <div style={{ padding: "34px 38px", maxWidth: 1080, margin: "0 auto" }}>
      <div className="fu" style={{ marginBottom: 30 }}>
        <div
          className="cv"
          style={{ fontSize: 15, color: "var(--mute)", marginBottom: 3 }}
        >
          longitudinal insights
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 34,
            color: "var(--brown)",
          }}
        >
          Your Mental Landscape
        </div>
        <p style={{ color: "var(--mute)", fontStyle: "italic", marginTop: 3 }}>
          Drawn from {data.length} sessions
        </p>
      </div>
      {risk && (
        <div
          className="paper-b fu"
          style={{
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            gap: 13,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(184,131,124,.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Ico n="alert" s={18} c="var(--rose)" sw={1.8} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 14,
                color: "var(--rose)",
              }}
            >
              We see you carrying a heavy weight
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--soft)",
                marginTop: 2,
                lineHeight: 1.62,
              }}
            >
              Three consecutive high-stress sessions. Reaching out to a
              therapist is an act of courage, not weakness.
            </p>
          </div>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 13,
          marginBottom: 22,
        }}
      >
        {statRows.map((s2, i) => (
          <div
            key={i}
            className="paper fu"
            style={{
              padding: "15px",
              textAlign: "center",
              animationDelay: `${i * 0.07}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: `${s2.icoC}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico n={s2.ico} s={14} c={s2.icoC} sw={1.9} />
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 22,
                fontWeight: 600,
                color: s2.c,
              }}
            >
              {s2.v}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--mute)",
                fontStyle: "italic",
                marginTop: 2,
              }}
            >
              {s2.l}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div className="paper fu" style={{ padding: "24px 22px" }}>
          <div className="st" style={{ fontSize: 19, marginBottom: 3 }}>
            Score Timeline & Thresholds
          </div>
          <p
            style={{
              fontSize: 11,
              color: "var(--mute)",
              fontStyle: "italic",
              marginBottom: 16,
            }}
          >
            Dashed lines mark Moderate (20) and High (38) thresholds
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={combinedLine.length > lineD.length ? combinedLine : lineD}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(200,170,150,.1)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--mute)" }}
              />
              <YAxis
                domain={[0, 56]}
                tick={{ fontSize: 10, fill: "var(--mute)" }}
              />
              <Tooltip content={<CT />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--dusty)"
                strokeWidth={2.5}
                dot={{ fill: "var(--dusty)", r: 4, strokeWidth: 0 }}
                name="PSS Score"
                connectNulls={false}
              />
              {chatMood.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="chatScore"
                  stroke="#97AEC0"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ fill: "#97AEC0", r: 3, strokeWidth: 0 }}
                  name="Chat Mood"
                  connectNulls={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="m20"
                stroke="rgba(168,128,64,.38)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="m38"
                stroke="rgba(168,80,74,.38)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="paper fu" style={{ padding: "24px 22px" }}>
          <div className="st" style={{ fontSize: 19, marginBottom: 16 }}>
            Wellness Profile
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radar} outerRadius="65%">
              <PolarGrid stroke="rgba(200,170,150,.18)" />
              <PolarAngleAxis
                dataKey="s"
                tick={{ fontSize: 10, fill: "var(--mute)" }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
              <Radar
                dataKey="v"
                stroke="var(--dusty)"
                fill="var(--blush)"
                fillOpacity={0.28}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="paper fu" style={{ padding: "24px 22px" }}>
        <div className="st" style={{ fontSize: 19, marginBottom: 16 }}>
          Severity Distribution
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
          }}
        >
          {[
            ["Low", "#7A9A78", "rgba(196,205,184,.18)"],
            ["Moderate", "#A88040", "rgba(226,200,138,.18)"],
            ["High", "#A8504A", "rgba(232,200,194,.28)"],
          ].map(([sv2, c2, bg]) => {
            const n = dist[sv2],
              p = Math.round((n / data.length) * 100);
            return (
              <div
                key={sv2}
                style={{
                  background: bg,
                  borderRadius: 16,
                  padding: "18px",
                  textAlign: "center",
                  border: `1px solid ${c2}22`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 44,
                    fontWeight: 600,
                    color: c2,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontFamily: "'Lora',serif",
                    fontWeight: 500,
                    color: c2,
                    marginBottom: 3,
                  }}
                >
                  {sv2} Stress
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mute)",
                    fontStyle: "italic",
                  }}
                >
                  {p}% of sessions
                </div>
                <div className="pt" style={{ marginTop: 10 }}>
                  <div
                    className="pf"
                    style={{ width: `${p}%`, background: c2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Sentiment Signals */}
      {chatMood.length > 0 && (
        <div className="paper fu" style={{ padding: "24px 22px", marginTop: 20 }}>
          <div className="st" style={{ fontSize: 19, marginBottom: 4 }}>
            Chat Sentiment Signals
          </div>
          <p style={{ fontSize: 11, color: "var(--mute)", fontStyle: "italic", marginBottom: 14 }}>
            Emotional moments detected from your conversations with Manas
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {chatMood.slice().reverse().slice(0, 10).map((m, i) => {
              const sColor = m.severity === "High" ? "#A8504A" : m.severity === "Moderate" ? "#A88040" : "#7A9A78";
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  borderRadius: 12, background: `${sColor}08`,
                  border: `1px solid ${sColor}20`,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: sColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      "{m.snippet || "Emotional message"}..."
                    </div>
                    <div style={{ fontSize: 10, color: "var(--mute)", fontStyle: "italic" }}>
                      {new Date(m.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: sColor
                    }}>
                      {m.sentimentScore}
                    </span>
                    <span className={`tag t${m.severity[0].toLowerCase()}`}>{m.severity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Persona ── */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayName = () => {
  const d = new Date();
  return DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
};
const todayStr = () => new Date().toISOString().split("T")[0];

/* Pillar Analytics helper */
const calcPillarStats = (activities, pillar) => {
  const acts = activities.filter(a => a.pillar === pillar);
  if (!acts.length) return null;
  let totalPlanned = 0, totalCompleted = 0, currentStreak = 0, longestStreak = 0;
  const today = new Date(); 
  const last14 = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    last14.push(d.toISOString().split("T")[0]);
  }
  const weeklyRates = [];
  for (let w = 0; w < 2; w++) {
    let wPlanned = 0, wDone = 0;
    for (let d = 0; d < 7; d++) {
      const dateStr = last14[w * 7 + d];
      const dayOfWeek = DAYS[new Date(dateStr).getDay() === 0 ? 6 : new Date(dateStr).getDay() - 1];
      acts.forEach(act => {
        if (act.days.includes(dayOfWeek)) {
          wPlanned++; totalPlanned++;
          if (act.completionLog?.[dateStr]) { wDone++; totalCompleted++; }
        }
      });
    }
    weeklyRates.push(wPlanned > 0 ? Math.round((wDone / wPlanned) * 100) : 0);
  }
  // streak calc (last 14 days, most recent first)
  for (let i = last14.length - 1; i >= 0; i--) {
    const dateStr = last14[i];
    const dayOfWeek = DAYS[new Date(dateStr).getDay() === 0 ? 6 : new Date(dateStr).getDay() - 1];
    const dayPlanned = acts.filter(a => a.days.includes(dayOfWeek));
    if (!dayPlanned.length) continue;
    const allDone = dayPlanned.every(a => a.completionLog?.[dateStr]);
    if (allDone) { currentStreak++; longestStreak = Math.max(longestStreak, currentStreak); }
    else break;
  }
  // activityStats
  const actStats = acts.map(act => {
    let p = 0, c = 0;
    last14.forEach(ds => {
      const dow = DAYS[new Date(ds).getDay() === 0 ? 6 : new Date(ds).getDay() - 1];
      if (act.days.includes(dow)) { p++; if (act.completionLog?.[ds]) c++; }
    });
    return { ...act, planned: p, completed: c, rate: p > 0 ? Math.round((c / p) * 100) : 0 };
  });
  return {
    consistency: totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
    currentStreak, longestStreak, weeklyRates, actStats,
    score: totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
  };
};

const Pers = ({ persona, setPersona, activities, setActivities, data }) => {
  const [active, setActive] = useState("Health");
  const [customTag, setCustomTag] = useState("");
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newAct, setNewAct] = useState({ name: "", pillar: "Health", days: [], startTime: "07:00", endTime: "08:00" });
  const [persTab, setPersTab] = useState("pillars"); // pillars | routines | analytics
  const tog = (cat, ag) =>
    setPersona((p) => {
      const cur = p[cat] || [],
        upd = cur.includes(ag) ? cur.filter((x) => x !== ag) : [...cur, ag];
      return { ...p, [cat]: upd };
    });
  const total = Object.values(persona).reduce((s, v) => s + v.length, 0);
  const addActivity = () => {
    if (!newAct.name.trim() || !newAct.days.length) return;
    const act = { ...newAct, id: Date.now().toString(), createdAt: todayStr(), completionLog: {} };
    setActivities(prev => [...prev, act]);
    setNewAct({ name: "", pillar: active, days: [], startTime: "07:00", endTime: "08:00" });
    setShowAddActivity(false);
  };
  const removeActivity = (id) => setActivities(prev => prev.filter(a => a.id !== id));
  const toggleCompletion = (id, dateStr) => {
    setActivities(prev => prev.map(a => {
      if (a.id !== id) return a;
      const log = { ...(a.completionLog || {}) };
      log[dateStr] = !log[dateStr];
      return { ...a, completionLog: log };
    }));
  };
  const todaysActivities = activities.filter(a => a.days.includes(todayName()));
  const td = todayStr();

  return (
    <div style={{ padding: "34px 38px", maxWidth: 960, margin: "0 auto" }}>
      <div className="fu" style={{ marginBottom: 30 }}>
        <div
          className="cv"
          style={{ fontSize: 15, color: "var(--mute)", marginBottom: 3 }}
        >
          who you are
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 34,
            color: "var(--brown)",
          }}
        >
          My Persona Profile
        </div>
        <p style={{ color: "var(--mute)", fontStyle: "italic", marginTop: 3 }}>
          Shape your lifestyle landscape for more meaningful guidance
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {[
          { id: "pillars", l: "Life Pillars", ico: "dna" },
          { id: "routines", l: "Daily Routines", ico: "clip" },
          { id: "analytics", l: "Consistency", ico: "chart" },
        ].map(tab => (
          <button
            key={tab.id} data-h
            onClick={() => setPersTab(tab.id)}
            style={{
              padding: "10px 20px", borderRadius: 30, border: "1.5px solid",
              cursor: "pointer", fontSize: 13, fontFamily: "'Lora',serif",
              transition: "all .3s", display: "flex", alignItems: "center", gap: 7,
              background: persTab === tab.id ? "linear-gradient(135deg,rgba(232,200,194,.78),rgba(194,208,220,.58))" : "transparent",
              borderColor: persTab === tab.id ? "rgba(200,170,150,.38)" : "rgba(200,170,150,.22)",
              color: persTab === tab.id ? "var(--brown)" : "var(--soft)",
              boxShadow: persTab === tab.id ? "0 2px 12px rgba(180,110,100,.11)" : "none",
            }}
          >
            <Ico n={tab.ico} s={14} c={persTab === tab.id ? "var(--rose)" : "var(--mute)"} sw={1.8} />
            {tab.l}
          </button>
        ))}
      </div>

      {/* ════ PILLARS TAB ════ */}
      {persTab === "pillars" && (<>
      <div
        className="paper-b fu"
        style={{
          padding: "16px 22px",
          marginBottom: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 22,
              color: "var(--brown)",
            }}
          >
            {total} agents configured
          </div>
          <p
            style={{
              fontSize: 12,
              color: "var(--soft)",
              fontStyle: "italic",
              marginTop: 1,
            }}
          >
            Across {Object.values(persona).filter((v) => v.length > 0).length}{" "}
            life pillars
          </p>
        </div>
        <div
          style={{ display: "flex", gap: 7, flexWrap: "wrap", maxWidth: 360 }}
        >
          {Object.entries(PIL).map(([k, v]) => {
            const n = (persona[k] || []).length;
            return (
              n > 0 && (
                <span
                  key={k}
                  style={{
                    fontSize: 12,
                    padding: "4px 11px",
                    borderRadius: 20,
                    background: `${v.c}45`,
                    color: v.d,
                    fontFamily: "'Lora',serif",
                    fontStyle: "italic",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Ico n={v.ico} s={11} c={v.d} sw={2} />
                  {k} ({n})
                </span>
              )
            );
          })}
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}
      >
        {Object.entries(PIL).map(([k, v]) => {
          const n = (persona[k] || []).length;
          return (
            <button
              key={k}
              data-h
              onClick={() => { setActive(k); setCustomTag(""); }}
              style={{
                padding: "8px 16px",
                borderRadius: 30,
                border: "1.5px solid",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'Lora',serif",
                transition: "all .3s",
                background: active === k ? v.d : "transparent",
                borderColor: active === k ? v.d : "rgba(200,170,150,.28)",
                color: active === k ? "white" : "var(--soft)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ico
                n={v.ico}
                s={13}
                c={active === k ? "rgba(255,255,255,.85)" : v.d}
                sw={1.9}
              />
              {k}
              {n > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    background:
                      active === k
                        ? "rgba(255,255,255,.22)"
                        : "rgba(200,170,150,.18)",
                    padding: "1px 7px",
                    borderRadius: 10,
                    color: active === k ? "white" : "var(--brown)",
                  }}
                >
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div
        className="paper fu"
        style={{ padding: "24px 22px", marginBottom: 18 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `${PIL[active].c}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ico n={PIL[active].ico} s={17} c={PIL[active].d} sw={1.8} />
          </div>
          <div className="st" style={{ fontSize: 21 }}>
            {active}
          </div>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "var(--mute)",
            fontStyle: "italic",
            marginBottom: 14,
          }}
        >
          Select all that reflect your current life
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {PIL[active].a.map((ag) => {
            const on = (persona[active] || []).includes(ag);
            return (
              <div
                key={ag}
                className={`pp ${on ? "on" : "off"}`}
                data-h
                onClick={() => tog(active, ag)}
                style={on ? { background: PIL[active].d } : {}}
              >
                {on ? "✓" : "+"} {ag}
              </div>
            );
          })}
          {(persona[active] || []).filter(ag => !PIL[active].a.includes(ag)).map((ag) => (
            <div
              key={ag}
              className="pp on"
              data-h
              onClick={() => tog(active, ag)}
              style={{ background: PIL[active].d }}
            >
              ✓ {ag}
            </div>
          ))}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if (customTag.trim()) { tog(active, customTag.trim()); setCustomTag(""); } 
            }}
            style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
          >
            <input 
              className="si" 
              style={{ width: 140, padding: "6px 12px", borderRadius: 30 }} 
              placeholder="+ Custom..." 
              value={customTag} 
              onChange={e => setCustomTag(e.target.value)} 
            />
          </form>
        </div>
      </div>
      {Object.values(persona).some((v) => v.length > 0) && (
        <div className="paper fu" style={{ padding: "22px" }}>
          <div className="st" style={{ fontSize: 19, marginBottom: 14 }}>
            Your Configuration
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {Object.entries(persona)
              .filter(([, v]) => v.length > 0)
              .map(([cat, ags]) => (
                <div
                  key={cat}
                  style={{ display: "flex", gap: 11, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: `${PIL[cat].c}45`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Ico n={PIL[cat].ico} s={14} c={PIL[cat].d} sw={1.9} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontFamily: "'Lora',serif",
                        fontWeight: 500,
                        color: "var(--brown)",
                        marginBottom: 4,
                      }}
                    >
                      {cat}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {ags.map((a) => (
                        <span
                          key={a}
                          style={{
                            fontSize: 12,
                            padding: "2px 10px",
                            borderRadius: 20,
                            background: `${PIL[cat].c}38`,
                            color: PIL[cat].d,
                            fontStyle: "italic",
                          }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      </>)}

      {/* ════ ROUTINES TAB ════ */}
      {persTab === "routines" && (<>
        {/* Today's check-in */}
        {todaysActivities.length > 0 && (
          <div className="paper-b fu" style={{ padding: "20px 22px", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(122,154,120,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico n="check" s={16} c="#7A9A78" sw={2} />
              </div>
              <div>
                <div className="st" style={{ fontSize: 18 }}>Today's Check-in</div>
                <div style={{ fontSize: 12, color: "var(--mute)", fontStyle: "italic" }}>{todayName()}, {new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric" })}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {todaysActivities.map(act => {
                const done = act.completionLog?.[td];
                const pilObj = PIL[act.pillar] || PIL.Health;
                return (
                  <div key={act.id} data-h onClick={() => toggleCompletion(act.id, td)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                      borderRadius: 14, cursor: "pointer", transition: "all .3s",
                      background: done ? "rgba(122,154,120,.12)" : "rgba(200,170,150,.08)",
                      border: `1.5px solid ${done ? "rgba(122,154,120,.3)" : "rgba(200,170,150,.18)"}`,
                    }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: 8,
                      background: done ? "#7A9A78" : "transparent",
                      border: done ? "none" : "2px solid rgba(200,170,150,.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .3s", flexShrink: 0,
                    }}>
                      {done && <Ico n="check" s={14} c="white" sw={2.5} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontFamily: "'Lora',serif", fontWeight: 500, color: done ? "#7A9A78" : "var(--text)", textDecoration: done ? "line-through" : "none" }}>{act.name}</div>
                      <div style={{ fontSize: 11, color: "var(--mute)" }}>{act.startTime} – {act.endTime}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: `${pilObj.c}38`, color: pilObj.d, fontStyle: "italic" }}>{act.pillar}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Activity Form */}
        <div className="paper fu" style={{ padding: "22px", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="st" style={{ fontSize: 19 }}>Daily Routines</div>
            <button data-h onClick={() => setShowAddActivity(!showAddActivity)}
              className="btn-s" style={{ padding: "8px 20px", fontSize: 12 }}>
              {showAddActivity ? "Cancel" : "+ Add Routine"}
            </button>
          </div>

          {showAddActivity && (
            <div className="fu" style={{
              padding: 18, borderRadius: 16, marginBottom: 16,
              background: "rgba(232,200,194,.12)", border: "1px solid rgba(200,170,150,.18)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <div className="cv" style={{ fontSize: 12, color: "var(--mute)", marginBottom: 4 }}>activity name</div>
                  <input className="si" placeholder="e.g. Gym, Reading, Meditation..." value={newAct.name} onChange={e => setNewAct(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <div className="cv" style={{ fontSize: 12, color: "var(--mute)", marginBottom: 4 }}>life pillar</div>
                  <select className="si" value={newAct.pillar} onChange={e => setNewAct(p => ({ ...p, pillar: e.target.value }))}
                    style={{ cursor: "pointer" }}>
                    {Object.keys(PIL).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <div className="cv" style={{ fontSize: 12, color: "var(--mute)", marginBottom: 4 }}>start time</div>
                  <input className="si" type="time" value={newAct.startTime} onChange={e => setNewAct(p => ({ ...p, startTime: e.target.value }))} />
                </div>
                <div>
                  <div className="cv" style={{ fontSize: 12, color: "var(--mute)", marginBottom: 4 }}>end time</div>
                  <input className="si" type="time" value={newAct.endTime} onChange={e => setNewAct(p => ({ ...p, endTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <div className="cv" style={{ fontSize: 12, color: "var(--mute)", marginBottom: 6 }}>days of the week</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {DAYS.map((d, i) => {
                    const sel = newAct.days.includes(d);
                    return (
                      <button key={d} data-h
                        onClick={() => setNewAct(p => ({ ...p, days: sel ? p.days.filter(x => x !== d) : [...p.days, d] }))}
                        style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 12, fontFamily: "'Lora',serif",
                          border: "1.5px solid", cursor: "pointer", transition: "all .25s",
                          background: sel ? "var(--rose)" : "transparent",
                          borderColor: sel ? "var(--rose)" : "rgba(200,170,150,.28)",
                          color: sel ? "white" : "var(--soft)",
                        }}
                      >{DAY_SHORT[i]}</button>
                    );
                  })}
                </div>
              </div>
              <button data-h onClick={addActivity} className="btn-s" style={{ width: "100%", marginTop: 16, padding: "10px", fontSize: 13 }}>
                Save Routine
              </button>
            </div>
          )}

          {/* Activity list */}
          {activities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "var(--mute)", fontStyle: "italic", fontSize: 13 }}>
              No routines logged yet. Add your first daily routine to start tracking consistency ✦
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activities.map(act => {
                const pilObj = PIL[act.pillar] || PIL.Health;
                const logCount = Object.values(act.completionLog || {}).filter(Boolean).length;
                return (
                  <div key={act.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                    borderRadius: 14, background: "rgba(255,250,244,.6)",
                    border: "1px solid rgba(200,170,150,.15)", transition: "all .3s",
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: `${pilObj.c}45`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Ico n={pilObj.ico} s={15} c={pilObj.d} sw={1.8} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontFamily: "'Lora',serif", fontWeight: 500, color: "var(--text)" }}>{act.name}</div>
                      <div style={{ fontSize: 11, color: "var(--mute)" }}>
                        {act.startTime} – {act.endTime} · {act.days.map(d => d.slice(0, 3)).join(", ")}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: `${pilObj.c}38`, color: pilObj.d, fontStyle: "italic" }}>{act.pillar}</span>
                      <div style={{ fontSize: 10, color: "var(--mute)", marginTop: 3 }}>{logCount} completions</div>
                    </div>
                    <button data-h onClick={() => removeActivity(act.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.5, transition: "opacity .2s" }}
                      onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.5}>
                      <Ico n="exit" s={14} c="var(--rose)" sw={1.8} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Schedule Grid */}
        {activities.length > 0 && (
          <div className="paper fu" style={{ padding: "22px" }}>
            <div className="st" style={{ fontSize: 19, marginBottom: 14 }}>Weekly Schedule</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'Lora',serif" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 10px", textAlign: "left", color: "var(--mute)", fontWeight: 400, fontStyle: "italic", borderBottom: "1px solid rgba(200,170,150,.15)" }}>Routine</th>
                    {DAY_SHORT.map(d => (
                      <th key={d} style={{
                        padding: "8px 6px", textAlign: "center", color: d === todayName().slice(0, 3) ? "var(--rose)" : "var(--mute)",
                        fontWeight: d === todayName().slice(0, 3) ? 600 : 400, fontStyle: "italic",
                        borderBottom: "1px solid rgba(200,170,150,.15)",
                      }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activities.map(act => {
                    const pilObj = PIL[act.pillar] || PIL.Health;
                    return (
                      <tr key={act.id}>
                        <td style={{ padding: "10px 10px", color: "var(--text)", borderBottom: "1px solid rgba(200,170,150,.08)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: pilObj.d, flexShrink: 0 }} />
                            {act.name}
                            <span style={{ fontSize: 10, color: "var(--mute)" }}>{act.startTime}</span>
                          </div>
                        </td>
                        {DAYS.map(day => {
                          const isScheduled = act.days.includes(day);
                          return (
                            <td key={day} style={{ padding: "10px 6px", textAlign: "center", borderBottom: "1px solid rgba(200,170,150,.08)" }}>
                              {isScheduled ? (
                                <div style={{
                                  width: 20, height: 20, borderRadius: 6, margin: "0 auto",
                                  background: `linear-gradient(135deg,${pilObj.c},${pilObj.d})`,
                                  opacity: 0.7, display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <Ico n="check" s={10} c="white" sw={2.5} />
                                </div>
                              ) : (
                                <div style={{ width: 20, height: 20, borderRadius: 6, margin: "0 auto", background: "rgba(200,170,150,.08)" }} />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>)}

      {/* ════ ANALYTICS TAB ════ */}
      {persTab === "analytics" && (<>
        <div className="paper fu" style={{ padding: "22px", marginBottom: 18 }}>
          <div className="st" style={{ fontSize: 19, marginBottom: 6 }}>Pillar Consistency Analysis</div>
          <p style={{ fontSize: 12, color: "var(--mute)", fontStyle: "italic", marginBottom: 18 }}>
            Based on your last 14 days of activity completions
          </p>

          {activities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "var(--mute)", fontStyle: "italic", fontSize: 13 }}>
              Add daily routines to see your consistency analytics ✦
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {Object.entries(PIL).map(([pillar, pilObj]) => {
                const stats = calcPillarStats(activities, pillar);
                if (!stats) return null;
                const cColor = stats.consistency >= 80 ? "#7A9A78" : stats.consistency >= 50 ? "#A88040" : "#A8504A";
                return (
                  <div key={pillar} style={{
                    padding: 18, borderRadius: 16,
                    background: `${pilObj.c}12`, border: `1px solid ${pilObj.c}30`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${pilObj.c}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Ico n={pilObj.ico} s={14} c={pilObj.d} sw={1.9} />
                      </div>
                      <div className="st" style={{ fontSize: 16 }}>{pillar}</div>
                    </div>

                    {/* Consistency ring */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                      <div style={{ position: "relative", width: 56, height: 56 }}>
                        <svg width={56} height={56} viewBox="0 0 56 56">
                          <circle cx={28} cy={28} r={23} fill="none" stroke="rgba(200,170,150,.15)" strokeWidth={4} />
                          <circle cx={28} cy={28} r={23} fill="none" stroke={cColor} strokeWidth={4}
                            strokeDasharray={`${(stats.consistency / 100) * 144.5} 144.5`}
                            strokeLinecap="round" transform="rotate(-90 28 28)" style={{ transition: "stroke-dasharray 1s" }} />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: cColor }}>
                          {stats.consistency}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--soft)", marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, color: "var(--brown)" }}>🔥 {stats.currentStreak}</span> day streak
                        </div>
                        <div style={{ fontSize: 11, color: "var(--mute)", fontStyle: "italic" }}>
                          Best: {stats.longestStreak} days
                        </div>
                      </div>
                    </div>

                    {/* Weekly trend mini bars */}
                    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 30, marginBottom: 10 }}>
                      {stats.weeklyRates.map((rate, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <div style={{
                            width: "100%", height: `${Math.max(4, rate * 0.28)}px`, borderRadius: 3,
                            background: `linear-gradient(180deg,${pilObj.d},${pilObj.c})`,
                            transition: "height 1s",
                          }} />
                          <span style={{ fontSize: 9, color: "var(--mute)" }}>W{i + 1}</span>
                        </div>
                      ))}
                    </div>

                    {/* Per-activity breakdown */}
                    {stats.actStats.map(as => (
                      <div key={as.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderTop: "1px solid rgba(200,170,150,.1)" }}>
                        <div style={{ fontSize: 12, color: "var(--soft)" }}>{as.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div className="pt" style={{ width: 50 }}>
                            <div className="pf" style={{ width: `${as.rate}%`, background: as.rate >= 80 ? "#7A9A78" : as.rate >= 50 ? "#A88040" : "#A8504A" }} />
                          </div>
                          <span style={{ fontSize: 11, color: as.rate < 60 ? "#A8504A" : "var(--mute)", fontWeight: as.rate < 60 ? 600 : 400 }}>
                            {as.rate}%{as.rate < 60 ? " ⚠" : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stress-Activity Correlation */}
        {data.length > 0 && activities.length > 0 && (
          <div className="paper fu" style={{ padding: "22px" }}>
            <div className="st" style={{ fontSize: 19, marginBottom: 6 }}>Lifestyle-Stress Correlation</div>
            <p style={{ fontSize: 12, color: "var(--mute)", fontStyle: "italic", marginBottom: 14 }}>
              How your routine consistency may relate to your stress levels
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              {Object.entries(PIL).map(([pillar, pilObj]) => {
                const stats = calcPillarStats(activities, pillar);
                if (!stats) return null;
                const latScore = data[data.length - 1]?.score || 0;
                const impact = stats.consistency >= 70 ? "positive" : stats.consistency >= 40 ? "neutral" : "needs attention";
                const impColor = impact === "positive" ? "#7A9A78" : impact === "neutral" ? "#A88040" : "#A8504A";
                return (
                  <div key={pillar} style={{
                    flex: 1, padding: 14, borderRadius: 12, textAlign: "center",
                    background: `${pilObj.c}10`, border: `1px solid ${pilObj.c}25`,
                  }}>
                    <Ico n={pilObj.ico} s={18} c={pilObj.d} sw={1.8} />
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--brown)", marginTop: 6 }}>{pillar}</div>
                    <div style={{ fontSize: 20, fontFamily: "'Playfair Display',serif", fontWeight: 600, color: impColor, marginTop: 4 }}>{stats.consistency}%</div>
                    <div style={{ fontSize: 10, color: impColor, fontStyle: "italic", marginTop: 2, textTransform: "capitalize" }}>{impact}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>)}
    </div>
  );
};

/* ── Recommendations ── */
const RecsV = ({ data, persona }) => {
  const lat = data[data.length - 1],
    sv = lat?.severity || "Low",
    sc2 = lat?.score || 0;
  const esc2 =
    data.length >= 2 && data[data.length - 1]?.score > data[0]?.score;
  const RECS = {
    Low: [
      {
        ico: "leaf",
        icoC: "#8FA08A",
        t: "Tend your garden",
        d: "Your inner landscape is calm. Continue nurturing the routines that sustain you.",
        c: "Lifestyle",
      },
      {
        ico: "pen",
        icoC: "#97AEC0",
        t: "Gratitude pages",
        d: "Three small morning gratitudes rewire your brain toward the gentle and the good.",
        c: "Habit",
      },
      {
        ico: "sun",
        icoC: "#C4A45A",
        t: "Unhurried movement",
        d: "A slow walk in natural light — no destination, no timer — is one of the finest gifts.",
        c: "Health",
      },
      {
        ico: "heart",
        icoC: "#9B8FB0",
        t: "Deep connection",
        d: "Reach out to someone you love this week. Presence is the rarest gift we can offer.",
        c: "Relationship",
      },
    ],
    Moderate: [
      {
        ico: "wind",
        icoC: "#97AEC0",
        t: "4-7-8 Breath",
        d: "Inhale 4 counts. Hold 7. Exhale 8. Repeat three times. Let your nervous system soften.",
        c: "Mindfulness",
      },
      {
        ico: "moon",
        icoC: "#9B8FB0",
        t: "Evening screen-rest",
        d: "One screen-free hour before sleep. Your mind needs time to undress before rest.",
        c: "Habit",
      },
      {
        ico: "leaf",
        icoC: "#8FA08A",
        t: "Twenty minutes outside",
        d: "Twenty minutes in natural surroundings measurably lowers cortisol. No phones.",
        c: "Health",
      },
      {
        ico: "clip",
        icoC: "#C4A45A",
        t: "Gentle prioritising",
        d: "Not everything needs doing. Write your three most important things, and let the rest breathe.",
        c: "Occupation",
      },
      {
        ico: "msg",
        icoC: "#D4A9A3",
        t: "Speak it aloud",
        d: "Tell someone you trust what is weighing on you. Words lighten what silence makes heavy.",
        c: "Relationship",
      },
    ],
    High: [
      {
        ico: "heart",
        icoC: "#B8837C",
        t: "Seek a professional voice",
        d: "Your load is real. A licensed therapist can offer tools and presence that no app can replace.",
        c: "Urgent",
        u: true,
      },
      {
        ico: "wind",
        icoC: "#97AEC0",
        t: "Box breathing",
        d: "In 4 · Hold 4 · Out 4 · Hold 4. Repeat until your heartbeat slows. You are safe.",
        c: "Crisis",
      },
      {
        ico: "moon",
        icoC: "#9B8FB0",
        t: "Sacred sleep",
        d: "High stress and sleep deprivation feed each other. Protect your rest as something precious.",
        c: "Health",
      },
      {
        ico: "brief",
        icoC: "#A8846E",
        t: "Subtract, don't add",
        d: "Remove one commitment this week. Recovery is not laziness.",
        c: "Lifestyle",
      },
      {
        ico: "msg",
        icoC: "#B8837C",
        t: "Crisis lines — India",
        d: "iCall: 9152987821 · Vandrevala Foundation: 1860-2662-345 · NIMHANS: 080-46110007",
        c: "Support",
        u: true,
      },
    ],
  };
  const PR = [];
  if (persona.Health?.includes("Sleep"))
    PR.push({
      ico: "moon",
      icoC: "#9B8FB0",
      t: "Sleep as medicine",
      d: "Consistent sleep and wake times are the single highest-leverage habit for mental resilience.",
      c: "✦ Personal",
    });
  if (
    persona.Habit?.includes("Journaling") ||
    persona.Habit?.includes("Meditation")
  )
    PR.push({
      ico: "pen",
      icoC: "#97AEC0",
      t: "Deepen your practice",
      d: "Add five minutes to your existing practice. Depth matters more than duration.",
      c: "✦ Personal",
    });
  if (
    persona.Occupation?.includes("IT Professional") ||
    persona.Occupation?.includes("Engineer")
  )
    PR.push({
      ico: "brief",
      icoC: "#C4A45A",
      t: "Tech-worker rhythms",
      d: "45 minutes deep · 5 minutes far. Hard stop on notifications after 7PM.",
      c: "✦ Personal",
    });

  return (
    <div style={{ padding: "34px 38px", maxWidth: 800, margin: "0 auto" }}>
      <div className="fu" style={{ marginBottom: 30 }}>
        <div
          className="cv"
          style={{ fontSize: 15, color: "var(--mute)", marginBottom: 3 }}
        >
          for you, today
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 34,
            color: "var(--brown)",
          }}
        >
          Gentle Guidance
        </div>
        <p style={{ color: "var(--mute)", fontStyle: "italic", marginTop: 3 }}>
          Personalised to your stress profile and life pillars
        </p>
      </div>
      <div
        className={`paper-${sv === "High" ? "b" : sv === "Moderate" ? "g" : "s"} fu`}
        style={{
          padding: "16px 22px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 17,
              color: "var(--brown)",
            }}
          >
            {sv === "High" ? "Carrying a heavy weight" : "Riding the current"}
          </div>
          <p
            style={{
              fontSize: 12,
              color: "var(--soft)",
              fontStyle: "italic",
              marginTop: 2,
            }}
          >
            {lat
              ? `Based on your most recent Mansik score of ${sc2}`
              : "Based on your overall profile"}
            {esc2 ? " · Trend is rising" : " · Trend is gentle"}
          </p>
        </div>
        <span
          className={`tag t${sv[0].toLowerCase()}`}
          style={{ fontSize: 13 }}
        >
          {sv}
        </span>
      </div>
      <div style={{ marginBottom: 22 }}>
        <div className="st" style={{ fontSize: 19, marginBottom: 12 }}>
          What might help
        </div>
        {(RECS[sv] || RECS.Low).map((r, i) => (
          <div
            key={i}
            className="fu"
            style={{
              animationDelay: `${i * 0.07}s`,
              marginBottom: 11,
              background: r.u ? "rgba(232,200,194,.18)" : "var(--cream)",
              border: `1px solid ${r.u ? "rgba(212,169,163,.32)" : "rgba(200,170,150,.16)"}`,
              borderLeft: `3.5px solid ${r.u ? "var(--dusty)" : "var(--honey)"}`,
              borderRadius: "0 16px 16px 0",
              padding: "15px 19px",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: `${r.icoC}18`,
                  border: `1px solid ${r.icoC}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <Ico n={r.ico} s={16} c={r.icoC} sw={1.8} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 14,
                      color: r.u ? "var(--rose)" : "var(--brown)",
                    }}
                  >
                    {r.t}
                  </span>
                  <span
                    className="cv"
                    style={{
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 20,
                      background: "rgba(200,170,150,.13)",
                      color: "var(--mute)",
                    }}
                  >
                    {r.c}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--soft)",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  {r.d}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {PR.length > 0 && (
        <div>
          <div className="st" style={{ fontSize: 19, marginBottom: 12 }}>
            Written just for you
          </div>
          {PR.map((r, i) => (
            <div
              key={i}
              className="fu"
              style={{
                marginBottom: 11,
                background: "rgba(194,208,220,.13)",
                border: "1px solid rgba(151,174,192,.22)",
                borderLeft: "3.5px solid var(--sky-d)",
                borderRadius: "0 16px 16px 0",
                padding: "15px 19px",
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: `${r.icoC}18`,
                    border: `1px solid ${r.icoC}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Ico n={r.ico} s={16} c={r.icoC} sw={1.8} />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      alignItems: "center",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 14,
                        color: "var(--brown)",
                      }}
                    >
                      {r.t}
                    </span>
                    <span
                      className="cv"
                      style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 20,
                        background: "rgba(194,208,220,.28)",
                        color: "var(--sky-d)",
                      }}
                    >
                      {r.c}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--soft)",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    {r.d}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Chatbot (Manas) ── */
/* Sentiment keyword lists for chat mood signals */
const CRISIS_WORDS = ["suicide", "end my life", "kill myself", "can't go on", "want to die", "self harm", "hurt myself", "no reason to live"];
const NEG_WORDS = ["anxious", "panic", "depressed", "hopeless", "worthless", "alone", "scared", "terrified", "exhausted", "overwhelmed", "can't cope", "breaking down", "falling apart", "numb", "empty", "suffering", "miserable", "hate myself", "useless", "trapped", "helpless", "crying", "breakdown"];
const classifySentiment = (text) => {
  const t = text.toLowerCase();
  if (CRISIS_WORDS.some(w => t.includes(w))) return { score: 48, level: "High", trigger: "crisis" };
  if (NEG_WORDS.some(w => t.includes(w))) return { score: 30, level: "Moderate", trigger: "emotional" };
  return null;// No signal for neutral messages
};

const ChatV = ({ data, user, chatMsgs, setChatMsgs, activities, persona, addChatMood }) => {
  const lat = data[data.length - 1];
  const defaultGreeting = {
    role: "assistant",
    content: `Namaste, ${user.name}\n\nI am Manas — a gentle companion for your inner world, here within Mansik. I am here to listen without judgment, to help you reflect, and to walk beside you through whatever you are carrying today.\n\n${lat ? `I noticed your most recent reflection showed ${lat.severity.toLowerCase()} stress. ` : ""}How are you feeling right now?`,
  };
  const [msgs, setMsgs] = useState(chatMsgs && chatMsgs.length > 0 ? chatMsgs : [defaultGreeting]);
  const [inp, setInp] = useState(""),
    [busy, setBusy] = useState(false),
    [esc, setEsc] = useState(false);
  // Nearby mental health centers
  const [nearbyCenters, setNearbyCenters] = useState([]);
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | granted | denied | error
  const [showNearby, setShowNearby] = useState(false);
  // Dynamically load Google Maps API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") return;
    if (window.google?.maps) return; // already loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) return;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);
  const chatEl = useRef(null);
  useEffect(() => {
    if (chatEl.current) chatEl.current.scrollTop = chatEl.current.scrollHeight;
  }, [msgs]);

  // Sync msgs to parent for persistence
  useEffect(() => {
    if (setChatMsgs && msgs.length > 0) setChatMsgs(msgs);
  }, [msgs]);

  // Search nearby mental health centers via Google Maps Places API
  const searchNearbyCenters = async () => {
    if (locStatus === "loading" || nearbyCenters.length > 0) return;
    setLocStatus("loading");
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 10000, maximumAge: 60000
        })
      );
      setLocStatus("granted");
      const { latitude: lat2, longitude: lng2 } = pos.coords;
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
      if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
        setLocStatus("error");
        return;
      }
      // Use Google Places Nearby Search REST API via proxy or direct
      const queries = ["mental health clinic", "psychologist", "therapist", "counseling center"];
      const allResults = [];
      for (const q of queries.slice(0, 2)) {
        try {
          const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&location=${lat2},${lng2}&radius=10000&key=${apiKey}`;
          // Since Places API has CORS restrictions, use the New Places API from JS SDK
          // or fallback to the Nearby Search via the Maps JS library
          if (window.google?.maps?.places) {
            const { Place } = await window.google.maps.importLibrary("places");
            const request = {
              textQuery: q + " near me",
              fields: ["displayName", "formattedAddress", "nationalPhoneNumber", "rating", "userRatingCount", "location", "googleMapsURI"],
              locationBias: {
                circle: { center: { lat: lat2, lng: lng2 }, radius: 10000 },
              },
              maxResultCount: 5,
            };
            const { places } = await Place.searchByText(request);
            if (places) {
              places.forEach(p => {
                const dist = haversine(lat2, lng2, p.location?.lat(), p.location?.lng());
                allResults.push({
                  name: p.displayName,
                  address: p.formattedAddress || "",
                  phone: p.nationalPhoneNumber || "",
                  rating: p.rating || 0,
                  reviews: p.userRatingCount || 0,
                  distance: dist,
                  mapsUrl: p.googleMapsURI || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName)}`,
                });
              });
            }
          }
        } catch(e2) { console.warn("Places search error:", e2); }
      }
      // Dedupe by name
      const seen = new Set();
      const unique = allResults.filter(r => {
        const k = r.name?.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      unique.sort((a, b) => a.distance - b.distance);
      setNearbyCenters(unique.slice(0, 8));
    } catch (err) {
      if (err.code === 1) setLocStatus("denied");
      else setLocStatus("error");
    }
  };

  // Haversine distance (km)
  const haversine = (lat1, lon1, lat2, lon2) => {
    if (!lat2 || !lon2) return 999;
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // National helplines fallback
  const HELPLINES = [
    { name: "iCall (TISS Mumbai)", phone: "9152987821", desc: "Mon-Sat, 8am-10pm", panIndia: true },
    { name: "Vandrevala Foundation", phone: "1860-2662-345", desc: "24/7, All languages", panIndia: true },
    { name: "NIMHANS Helpline", phone: "080-46110007", desc: "24/7 Mental Health", panIndia: true },
    { name: "Snehi", phone: "044-24640050", desc: "24/7 Emotional Support", panIndia: true },
    { name: "AASRA", phone: "9820466726", desc: "24/7 Crisis Intervention", panIndia: true },
  ];

  // Build activity context for the AI
  const activityContext = (() => {
    if (!activities || activities.length === 0) return "No daily routines logged yet.";
    const lines = activities.map(a => {
      const completions = Object.values(a.completionLog || {}).filter(Boolean).length;
      const total = Object.keys(a.completionLog || {}).length;
      const rate = total > 0 ? Math.round((completions / total) * 100) : 0;
      return `- ${a.name} (${a.pillar}): ${a.startTime}–${a.endTime} on ${a.days.map(d=>d.slice(0,3)).join(",")} | Completion: ${completions}/${total} (${rate}%)`;
    });
    return lines.join("\n");
  })();

  // Build pillar consistency summary
  const pillarSummary = (() => {
    if (!activities || activities.length === 0) return "";
    const pillars = [...new Set(activities.map(a => a.pillar))];
    return pillars.map(p => {
      const stats = calcPillarStats(activities, p);
      if (!stats) return "";
      const flag = stats.consistency < 60 ? " ⚠ IRREGULAR — needs attention" : stats.consistency >= 80 ? " ✓ Consistent" : " ~ Moderate";
      return `${p}: ${stats.consistency}% consistency, streak: ${stats.currentStreak} days${flag}`;
    }).filter(Boolean).join("\n");
  })();

  // Stress-activity correlation
  const stressCorrelation = (() => {
    if (data.length < 2 || !activities || activities.length === 0) return "";
    const recent = data.slice(-3);
    const trend = recent.length >= 2 && recent[recent.length-1].score > recent[0].score ? "increasing" : recent[recent.length-1].score < recent[0].score ? "decreasing" : "stable";
    const lowConsistency = [...new Set(activities.map(a => a.pillar))].filter(p => {
      const stats = calcPillarStats(activities, p);
      return stats && stats.consistency < 50;
    });
    let correlation = `Stress trend: ${trend} (${recent.map(r => r.score).join(" → ")}).`;
    if (lowConsistency.length > 0 && trend === "increasing") {
      correlation += ` Low consistency in [${lowConsistency.join(", ")}] may be contributing to rising stress.`;
    }
    return correlation;
  })();

  const sys = `You are Manas, an empathetic AI mental wellness companion on the Mansik platform.

Persona: You speak gently, slowly, like a wise and warm therapist. Short paragraphs. Breathing room between ideas.

Your role:
- Listen deeply and acknowledge feelings before offering anything else
- Help users reflect on what they are carrying
- Suggest gentle coping strategies: 4-7-8 breathing, 5-4-3-2-1 grounding, body scan, journaling
- Provide emotional warmth and presence
- Ask one open, curious question per response
- PROACTIVELY reference the user's daily routines and lifestyle data below
- If you notice irregularities (low completion rates), gently ask about barriers and suggest small adjustments
- Celebrate consistency and streaks — positive reinforcement matters
- Track whether lifestyle changes correlate with stress changes and share observations
- Guide the patient toward improving their lifestyle based on the data

User context:
- Name: ${user.name}
- Latest PSS-14 score: ${lat?.score ?? "not yet taken"} (${lat?.severity ?? "unknown"})
- Total Mansik sessions: ${data.length}

Daily Routine Log:
${activityContext}

Pillar Consistency (last 14 days):
${pillarSummary || "No data yet"}

${stressCorrelation ? `Stress-Lifestyle Correlation:\n${stressCorrelation}` : ""}

${persona ? `Life Pillars configured: ${Object.entries(persona).filter(([,v]) => v.length > 0).map(([k,v]) => `${k}(${v.join(", ")})`).join(" · ")}` : ""}

Important:
- Never diagnose. Never prescribe.
- If someone expresses crisis or suicidal thoughts, gently redirect to professional help and crisis lines (iCall India: 9152987821)
- Keep responses 2-4 short paragraphs
- Use line breaks generously
- Tone: warm, present, unhurried.`;
  const send = async () => {
    if (!inp.trim() || busy) return;
    const u = inp.trim();
    setInp("");
    const next = [...msgs, { role: "user", content: u }];
    setMsgs(next);
    setBusy(true);

    // Sentiment-based mood signal
    const sentiment = classifySentiment(u);
    if (sentiment && addChatMood) {
      addChatMood({
        date: new Date().toISOString(),
        sentimentScore: sentiment.score,
        severity: sentiment.level,
        source: "chat",
        trigger: sentiment.trigger,
        snippet: u.slice(0, 60),
      });
    }

    const crisis = CRISIS_WORDS.some((k) => u.toLowerCase().includes(k));
    if (
      crisis ||
      (lat?.severity === "High" &&
        data.slice(-3).every((a) => a.severity === "High"))
    ) {
      setEsc(true);
      setShowNearby(true);
      searchNearbyCenters();
    }
    try {
      const r = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-3.1-flash-lite-preview",
          messages: [
            {
              role: "system",
              content: sys,
            },
            ...next.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      });

      const d = await r.json();

      setMsgs((p) => [
        ...p,
        {
          role: "assistant",
          content: d.choices?.[0]?.message?.content || "Try again",
        },
      ]);
    } catch {
      setMsgs((p) => [
        ...p,
        {
          role: "assistant",
          content:
            "Something felt disconnected just then. Please try again in a moment — I am still here.",
        },
      ]);
    }
    setBusy(false);
  };
  const prompts = [
    "I'm feeling overwhelmed",
    "Help me breathe",
    "I can't sleep",
    "Work is crushing me",
    "I feel lonely",
  ];

  /* Manas avatar */
  const ManasAvatar = ({ size = 22, sw = 1.6 }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,rgba(232,200,194,.7),rgba(204,196,216,.6))",
        border: "1px solid rgba(200,170,150,.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ico n="brain" s={Math.round(size * 0.55)} c="var(--rose)" sw={sw} />
    </div>
  );

  return (
    <div
      style={{
        padding: "34px 38px",
        maxWidth: 780,
        margin: "0 auto",
        height: "calc(100vh - 40px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="fu" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ position: "relative" }}>
            <div
              className="bth"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,rgba(232,200,194,.6),rgba(204,196,216,.5))",
                border: "1.5px solid rgba(200,170,150,.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico n="brain" s={24} c="var(--rose)" sw={1.5} />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#7A9A78",
                border: "2px solid var(--cream)",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 22,
                color: "var(--brown)",
              }}
            >
              Manas
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--mute)",
                fontStyle: "italic",
              }}
            >
              Your gentle AI companion within Mansik · Available always
            </div>
          </div>
        </div>
      </div>

      {esc && (
        <div className="fu" style={{ marginBottom: 12 }}>
          {/* Crisis banner */}
          <div
            className="paper-b"
            style={{
              padding: "11px 17px",
              marginBottom: 8,
              display: "flex",
              gap: 9,
              alignItems: "center",
            }}
          >
            <Ico n="alert" s={18} c="var(--rose)" sw={1.8} />
            <p
              style={{ fontSize: 13, color: "var(--rose)", fontStyle: "italic", flex: 1 }}
            >
              You are not alone. If you are in crisis, please reach out:{" "}
              <a href="tel:9152987821" style={{ color: "var(--rose)", fontWeight: 700, textDecoration: "none" }}>iCall 9152987821</a> ·{" "}
              <a href="tel:18602662345" style={{ color: "var(--rose)", fontWeight: 700, textDecoration: "none" }}>Vandrevala 1860-2662-345</a>
            </p>
            <button data-h onClick={() => { setShowNearby(!showNearby); if (!showNearby) searchNearbyCenters(); }}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 11, fontFamily: "'Lora',serif",
                border: "1.5px solid rgba(168,80,74,.35)", cursor: "pointer", flexShrink: 0,
                background: showNearby ? "rgba(168,80,74,.12)" : "transparent",
                color: "var(--rose)", transition: "all .3s",
              }}
            >
              {showNearby ? "Hide" : "Find Nearby Help"}
            </button>
          </div>

          {/* Nearby centers panel */}
          {showNearby && (
            <div className="paper" style={{ padding: "18px 20px", marginBottom: 4, maxHeight: 280, overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div className="st" style={{ fontSize: 15 }}>
                  {locStatus === "loading" ? "Locating you..." :
                   locStatus === "denied" ? "Location access denied" :
                   nearbyCenters.length > 0 ? `${nearbyCenters.length} centers near you` :
                   "Professional Help"}
                </div>
                {locStatus === "denied" && (
                  <span style={{ fontSize: 11, color: "var(--mute)", fontStyle: "italic" }}>
                    Enable location for nearby results
                  </span>
                )}
              </div>

              {/* Loading spinner */}
              {locStatus === "loading" && (
                <div style={{ textAlign: "center", padding: "16px 0", color: "var(--mute)", fontSize: 13 }}>
                  <div style={{ width: 24, height: 24, border: "2.5px solid rgba(200,170,150,.25)", borderTopColor: "var(--rose)", borderRadius: "50%", margin: "0 auto 8px", animation: "spin 1s linear infinite" }} />
                  Searching for mental health professionals near you...
                </div>
              )}

              {/* Nearby results */}
              {nearbyCenters.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {nearbyCenters.map((c, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      borderRadius: 12, background: "rgba(255,250,244,.7)",
                      border: "1px solid rgba(200,170,150,.15)", transition: "all .3s",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "linear-gradient(135deg,rgba(168,80,74,.12),rgba(168,80,74,.06))",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Ico n="brain" s={16} c="var(--rose)" sw={1.6} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontFamily: "'Lora',serif", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--mute)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.address}
                        </div>
                        {c.phone && (
                          <a href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`} style={{ fontSize: 11, color: "var(--rose)", textDecoration: "none", fontWeight: 500 }}>
                            📞 {c.phone}
                          </a>
                        )}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {c.rating > 0 && (
                          <div style={{ fontSize: 12, color: "#A88040", fontWeight: 500 }}>
                            ★ {c.rating.toFixed(1)} <span style={{ fontSize: 10, color: "var(--mute)" }}>({c.reviews})</span>
                          </div>
                        )}
                        <div style={{ fontSize: 10, color: "var(--mute)" }}>{c.distance < 999 ? `${c.distance.toFixed(1)} km` : ""}</div>
                        <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 10, color: "var(--rose)", textDecoration: "none" }}>
                          Directions →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback helplines — always shown */}
              <div style={{ marginTop: nearbyCenters.length > 0 ? 14 : 0 }}>
                {(nearbyCenters.length === 0 || locStatus === "denied" || locStatus === "error") && (
                  <div style={{ fontSize: 12, color: "var(--mute)", fontStyle: "italic", marginBottom: 8 }}>
                    {locStatus === "denied" ? "Please enable location access in your browser to see nearby centers. Meanwhile, here are national helplines:" : "National helplines available 24/7:"}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {HELPLINES.map((h, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 12px", borderRadius: 10,
                      background: i === 0 ? "rgba(168,80,74,.08)" : "rgba(200,170,150,.06)",
                      border: "1px solid rgba(200,170,150,.1)",
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{h.name}</div>
                        <div style={{ fontSize: 10, color: "var(--mute)", fontStyle: "italic" }}>{h.desc}</div>
                      </div>
                      <a href={`tel:${h.phone.replace(/[^0-9+]/g, "")}`}
                        style={{ fontSize: 13, color: "var(--rose)", fontWeight: 600, textDecoration: "none", padding: "4px 12px", borderRadius: 16, background: "rgba(168,80,74,.1)" }}>
                        📞 {h.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        ref={chatEl}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minHeight: 0,
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {m.role === "assistant" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <ManasAvatar size={22} sw={1.7} />
                <span
                  className="cv"
                  style={{ fontSize: 12, color: "var(--mute)" }}
                >
                  Manas
                </span>
              </div>
            )}
            <div
              className={`bbl bbl-${m.role === "user" ? "u" : "b"}`}
              style={{
                whiteSpace: "pre-wrap",
                animationDelay: `${i < 2 ? i * 0.1 : 0}s`,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
            <ManasAvatar size={22} sw={1.7} />
            <div
              className="bbl bbl-b"
              style={{
                display: "flex",
                gap: 5,
                alignItems: "center",
                padding: "13px 17px",
              }}
            >
              {[0, 0.22, 0.44].map((d, j) => (
                <div
                  key={j}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--blush)",
                    animation: `pulse2 1.4s ease-in-out infinite`,
                    animationDelay: `${d}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}
      >
        {prompts.map((p2) => (
          <button
            key={p2}
            data-h
            onClick={() => setInp(p2)}
            style={{
              padding: "5px 12px",
              background: "rgba(232,200,194,.18)",
              border: "1px solid rgba(200,170,150,.22)",
              borderRadius: 30,
              fontSize: 12,
              color: "var(--soft)",
              cursor: "pointer",
              fontFamily: "'Lora',serif",
              fontStyle: "italic",
              transition: "all .3s",
            }}
          >
            {p2}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 9,
          background: "rgba(255,250,244,.88)",
          border: "1.5px solid rgba(200,170,150,.22)",
          borderRadius: 16,
          padding: "9px 9px 9px 17px",
          alignItems: "flex-end",
          backdropFilter: "blur(8px)",
        }}
      >
        <textarea
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Share what is on your heart…"
          rows={2}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "'Lora',serif",
            fontSize: 14,
            background: "transparent",
            color: "var(--text)",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        />
        <button
          data-h
          onClick={send}
          disabled={!inp.trim() || busy}
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            border: "none",
            cursor: inp.trim() && !busy ? "pointer" : "not-allowed",
            background:
              inp.trim() && !busy
                ? "linear-gradient(135deg,var(--blush),var(--dusty))"
                : "rgba(200,170,150,.18)",
            color: "white",
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all .3s",
            flexShrink: 0,
          }}
        >
          <Ico
            n="msg"
            s={15}
            c={inp.trim() && !busy ? "white" : "rgba(200,170,150,.5)"}
            sw={1.8}
          />
        </button>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "var(--mute)",
          marginTop: 7,
          fontStyle: "italic",
        }}
      >
        Manas offers companionship, not clinical care. In a true emergency,
        please call a professional.
      </p>
    </div>
  );
};

/* ══ Root ══ */
export default function Mansik({ firebaseUser }) {
  const [user, setUser] = useState(
    firebaseUser ? { name: firebaseUser.displayName || firebaseUser.email.split("@")[0], email: firebaseUser.email } : null
  ),
    [view, setView] = useState("dash");

  // ── Persisted assessment data ──
  const [data, setData] = useState(() => {
    if (firebaseUser?.email) {
      try {
        const saved = localStorage.getItem(`mansik_assessments_${firebaseUser.email}`);
        return saved ? JSON.parse(saved) : HIST;
      } catch { return HIST; }
    }
    return HIST;
  });

  // ── Persisted custom display name ──
  const [displayName, setDisplayName] = useState(() => {
    if (firebaseUser?.email) {
      return localStorage.getItem(`mansik_displayName_${firebaseUser.email}`) 
        || firebaseUser.displayName 
        || firebaseUser.email.split("@")[0];
    }
    return "";
  });

  // ── Persisted chat messages ──
  const [chatMsgs, setChatMsgs] = useState(() => {
    if (firebaseUser?.email) {
      try {
        const saved = localStorage.getItem(`mansik_chat_${firebaseUser.email}`);
        return saved ? JSON.parse(saved) : null;
      } catch { return null; }
    }
    return null;
  });

  // ── Persisted daily activities ──
  const [activities, setActivities] = useState(() => {
    if (firebaseUser?.email) {
      try {
        const saved = localStorage.getItem(`mansik_activities_${firebaseUser.email}`);
        return saved ? JSON.parse(saved) : [];
      } catch { return []; }
    }
    return [];
  });

  // ── Persisted chat mood signals ──
  const [chatMood, setChatMood] = useState(() => {
    if (firebaseUser?.email) {
      try {
        const saved = localStorage.getItem(`mansik_chatMood_${firebaseUser.email}`);
        return saved ? JSON.parse(saved) : [];
      } catch { return []; }
    }
    return [];
  });
  const addChatMood = (signal) => setChatMood(prev => [...prev, signal]);

  const [persona, setPersona] = useState({
    Health: [],
    Habit: [],
    Relationship: [],
    Occupation: [],
    Entertainment: [],
    Liability: [],
  });
  const [isPersonaLoaded, setIsPersonaLoaded] = useState(false);

  // Keep user.name in sync with displayName
  useEffect(() => {
    if (user && displayName) {
      setUser(prev => prev ? { ...prev, name: displayName } : prev);
    }
  }, [displayName]);

  // Persist display name
  useEffect(() => {
    if (user?.email && displayName) {
      localStorage.setItem(`mansik_displayName_${user.email}`, displayName);
    }
  }, [displayName, user?.email]);

  // Persist assessment data
  useEffect(() => {
    if (user?.email && data.length > 0) {
      localStorage.setItem(`mansik_assessments_${user.email}`, JSON.stringify(data));
    }
  }, [data, user?.email]);

  // Persist chat messages
  useEffect(() => {
    if (user?.email && chatMsgs && chatMsgs.length > 0) {
      localStorage.setItem(`mansik_chat_${user.email}`, JSON.stringify(chatMsgs));
    }
  }, [chatMsgs, user?.email]);

  // Persist activities
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`mansik_activities_${user.email}`, JSON.stringify(activities));
    }
  }, [activities, user?.email]);

  // Persist chat mood
  useEffect(() => {
    if (user?.email && chatMood.length > 0) {
      localStorage.setItem(`mansik_chatMood_${user.email}`, JSON.stringify(chatMood));
    }
  }, [chatMood, user?.email]);

  // Load persona from localStorage
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`mansik_persona_${user.email}`);
      if (saved) {
        try {
          setPersona(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse persona", e);
        }
      }
      setIsPersonaLoaded(true);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email && isPersonaLoaded) {
      localStorage.setItem(`mansik_persona_${user.email}`, JSON.stringify(persona));
    }
  }, [persona, user?.email, isPersonaLoaded]);

  const addA = (a) => {
    setData((p) => [...p, a]);
    setView("analytics");
  };
  const lat = data[data.length - 1];
  if (!user)
    return (
      <>
        <G />
        <Cursor />
        <Auth onAuth={setUser} />
      </>
    );
  const views = {
    dash: <Dash user={user} data={data} persona={persona} />,
    assess: <Assess onSubmit={addA} data={data} />,
    analytics: <Anlyt data={data} chatMood={chatMood} />,
    persona: <Pers persona={persona} setPersona={setPersona} activities={activities} setActivities={setActivities} data={data} />,
    chat: <ChatV data={data} user={user} chatMsgs={chatMsgs} setChatMsgs={setChatMsgs} activities={activities} persona={persona} addChatMood={addChatMood} />,
    recs: <RecsV data={data} persona={persona} />,
  };
  return (
    <>
      <G />
      <Cursor />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          view={view}
          setView={setView}
          user={user}
          latest={lat}
          displayName={displayName}
          setDisplayName={setDisplayName}
          onLogout={() => {
            signOut(auth).then(() => setUser(null));
          }}
        />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: "100vh",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              overflow: "hidden",
            }}
          >
            <div
              className="blob dft"
              style={{
                width: 420,
                height: 420,
                background: "var(--blush)",
                top: -110,
                right: 90,
                opacity: 0.15,
              }}
            />
            <div
              className="blob flt"
              style={{
                width: 340,
                height: 340,
                background: "var(--sky)",
                bottom: 40,
                right: -70,
                opacity: 0.12,
              }}
            />
            <div
              className="blob"
              style={{
                width: 280,
                height: 280,
                background: "var(--honey)",
                top: "42%",
                left: "32%",
                opacity: 0.07,
              }}
            />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            {views[view] || views.dash}
          </div>
        </main>
      </div>
      <Music />
    </>
  );
}
