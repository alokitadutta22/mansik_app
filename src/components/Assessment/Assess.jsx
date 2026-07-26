// @coderabbitai review: check for form input validation and score calculation security
import { useState } from "react";
import Ico from "../icons/Ico";
import { PSS, SCALE, calcSc, sev, sc, fd } from "./pssData";

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
      <div className="view-container" style={{ maxWidth: 680 }}>
        {/* ── Reflection Header ── */}
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
                background: "rgba(242,109,91,.15)",
                border: "1px solid rgba(199,74,63,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico n="clip" s={21} c="var(--coral)" sw={1.6} />
            </div>
            <div>
              <div
                className="cv"
                style={{ fontSize: 15, color: "var(--amber)", fontWeight: 600 }}
              >
                perceived stress scale · reflection
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 28,
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--terracotta)",
                }}
              >
                PSS‑14 Assessment
              </div>
            </div>
          </div>
          <p
            style={{
              fontFamily: "'Source Serif 4',Georgia,serif",
              fontStyle: "italic",
              fontSize: 14.5,
              color: "var(--ink-soft)",
              lineHeight: 1.8,
              marginBottom: 24,
              maxWidth: 480,
            }}
          >
            A gentle 14-question reflection on how you have felt over the{" "}
            <strong style={{ color: "var(--terracotta)" }}>past month</strong>. Take your time — there are no wrong answers.
          </p>
          <div className="intro-grid">
            {[
              ["14", "Questions"],
              ["5-point", "Scale"],
              ["~5 min", "Duration"],
            ].map(([v2, l]) => (
              <div
                key={l}
                style={{
                  background: "rgba(251,243,231,.75)",
                  borderRadius: 13,
                  padding: "11px",
                  textAlign: "center",
                  border: "1px solid rgba(199,74,63,.15)",
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
          <button className="btn-s" data-h onClick={() => setStep("questions")} style={{ marginTop: 6 }}>
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
    <div className="view-container" style={{ maxWidth: 680 }}>
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

export default Assess;
