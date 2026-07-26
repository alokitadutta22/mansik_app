// @coderabbitai review: check for security, bugs, and input validation
import { useState } from "react";
import Ico from "./icons/Ico";

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
              {busy ? "One moment…" : mode === "login" ? "Enter →" : "Begin →"}
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

export default Auth;
