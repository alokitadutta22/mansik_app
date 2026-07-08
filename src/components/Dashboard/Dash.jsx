import Ico from "../icons/Ico";
import { PIL, sc, fd } from "../Assessment/pssData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    <div className="view-container" style={{ maxWidth: 1080 }}>
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

      <div className="stats-grid">
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

      <div className="dash-main-grid">
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

export default Dash;