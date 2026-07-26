// @coderabbitai review: check for media handling, audio security, and state cleanup
import { useState } from "react";
import Ico from "../icons/Ico";
import { TRACKS } from "./tracks";
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

export default Music;
