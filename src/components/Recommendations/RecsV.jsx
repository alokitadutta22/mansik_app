import Ico from "../icons/Ico";

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
    <div className="view-container" style={{ maxWidth: 800 }}>
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

export default RecsV;
