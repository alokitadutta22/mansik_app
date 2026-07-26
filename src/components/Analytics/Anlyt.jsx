// @coderabbitai review: check for rendering performance, bounds checking, and security
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
import Ico from "../icons/Ico";
import { fd } from "../Assessment/pssData";

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
            Complete a PSS-14 assessment or chat with Manas to see your
            insights.
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
  const chatLineD = chatMood.map((m) => ({
    date: fd(m.date),
    chatScore: m.sentimentScore,
    m20: 20,
    m38: 38,
  }));
  // Combined timeline: assessment + chat
  const combinedLine = [
    ...lineD.map((d) => ({ ...d, chatScore: null })),
    ...chatLineD.map((d) => ({ ...d, score: null, avg: null })),
  ].sort((a, b) => a.date.localeCompare(b.date));
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
    { l: "Average", v: avg, ico: "brain", c: "var(--coral)", icoC: "#F26D5B" },
    { l: "Highest", v: hi, ico: "trend", c: "#C74A3F", icoC: "#C74A3F" },
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
      icoC: "#F2A03D",
    },
  ];

  return (
    <div className="view-container" style={{ maxWidth: 1080 }}>
      <div className="fu" style={{ marginBottom: 30 }}>
        <div
          className="cv"
          style={{ fontSize: 13, color: "var(--ink-meta)", marginBottom: 3, fontFamily: "'DM Mono',monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          longitudinal insights
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 34,
            fontStyle: "italic",
            fontWeight: 500,
            color: "var(--terracotta)",
            textTransform: "lowercase",
          }}
        >
          your month, softly.
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
      <div className="insights-stats-grid">
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
      {/* ── Mind Anatomy & Feeling Breakdown (Reference Image 4 style) ── */}
      <div
        className="paper fu"
        style={{
          padding: "24px 28px",
          marginBottom: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* Left: Watercolor Brain anatomical profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "linear-gradient(135deg,rgba(251,243,231,.8),rgba(247,180,138,.15))",
            padding: 18,
            borderRadius: 20,
            border: "1px solid var(--line-pencil)",
          }}
        >
          <img
            src="/brain-main.png"
            alt="mind anatomy"
            style={{
              width: 150,
              height: 150,
              objectFit: "contain",
              flexShrink: 0,
              filter: "drop-shadow(0 4px 12px rgba(199,74,63,.15))",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              className="st"
              style={{ fontSize: 17, marginBottom: 8 }}
            >
              Mind Anatomy Breakdown
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Joy & Calm", pct: "30%", color: "#7A9A78" },
                { label: "Anxiety & Stress", pct: "25%", color: "#C74A3F" },
                { label: "Sadness & Overwhelm", pct: "15%", color: "#7A4A6B" },
                { label: "Growth & Focus", pct: "30%", color: "#F2A03D" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--ink-soft)", fontFamily: "'Lora',serif" }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: item.color, marginRight: 6 }} />
                    {item.label}
                  </span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 500, color: item.color }}>{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Feeling Words Cloud */}
        <div
          style={{
            textAlign: "center",
            padding: 18,
            background: "radial-gradient(circle at 50% 50%, rgba(247,180,138,.20) 0%, transparent 75%)",
            borderRadius: 20,
            border: "1px dashed rgba(199,74,63,.20)",
          }}
        >
          <div
            className="meta"
            style={{ marginBottom: 10 }}
          >
            FEELING WORDS THIS MONTH
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[
              { text: "TENDER", size: 18, c: "var(--terracotta)", f: "'Playfair Display',serif" },
              { text: "BRIGHT", size: 14, c: "var(--amber)", f: "'Lora',serif" },
              { text: "TIRED", size: 13, c: "var(--ink-soft)", f: "'DM Mono',monospace" },
              { text: "HOPEFUL", size: 17, c: "var(--coral)", f: "'Playfair Display',serif" },
              { text: "GENTLE", size: 16, c: "#7A9A78", f: "'Caveat',cursive" },
              { text: "ANXIOUS", size: 12, c: "var(--dusty-rose)", f: "'DM Mono',monospace" },
              { text: "QUIET", size: 15, c: "var(--plum)", f: "'Source Serif 4',serif" },
              { text: "LOVED", size: 16, c: "var(--terracotta)", f: "'Playfair Display',serif" },
              { text: "CONFIDENT", size: 13, c: "var(--amber)", f: "'Lora',serif" },
              { text: "VULNERABLE", size: 14, c: "var(--coral)", f: "'Caveat',cursive" },
            ].map((w, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: w.size,
                  color: w.c,
                  fontFamily: w.f,
                  fontStyle: "italic",
                  padding: "2px 6px",
                }}
              >
                {w.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="insights-main-grid">
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
            <LineChart
              data={combinedLine.length > lineD.length ? combinedLine : lineD}
            >
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
                stroke="#F26D5B"
                strokeWidth={2.5}
                dot={{ fill: "#F26D5B", r: 4, strokeWidth: 0 }}
                name="PSS Score"
                connectNulls={false}
              />
              {chatMood.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="chatScore"
                  stroke="#D89A94"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ fill: "#D89A94", r: 3, strokeWidth: 0 }}
                  name="Chat Mood"
                  connectNulls={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="m20"
                stroke="rgba(242,160,61,.38)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="m38"
                stroke="rgba(199,74,63,.38)"
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
                stroke="#F26D5B"
                fill="#F7B48A"
                fillOpacity={0.22}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="paper fu" style={{ padding: "24px 22px" }}>
        <div className="st" style={{ fontSize: 19, marginBottom: 16 }}>
          Severity Distribution
        </div>
        <div className="severity-grid">
          {[
            ["Low", "#7A9A78", "rgba(180,200,160,.18)"],
            ["Moderate", "#F2A03D", "rgba(242,160,61,.14)"],
            ["High", "#C74A3F", "rgba(242,109,91,.16)"],
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
        <div
          className="paper fu"
          style={{ padding: "24px 22px", marginTop: 20 }}
        >
          <div className="st" style={{ fontSize: 19, marginBottom: 4 }}>
            Chat Sentiment Signals
          </div>
          <p
            style={{
              fontSize: 11,
              color: "var(--mute)",
              fontStyle: "italic",
              marginBottom: 14,
            }}
          >
            Emotional moments detected from your conversations with Manas
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {chatMood
              .slice()
              .reverse()
              .slice(0, 10)
              .map((m, i) => {
                const sColor =
                  m.severity === "High"
                    ? "#A8504A"
                    : m.severity === "Moderate"
                      ? "#A88040"
                      : "#7A9A78";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: `${sColor}08`,
                      border: `1px solid ${sColor}20`,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: sColor,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        "{m.snippet || "Emotional message"}..."
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--mute)",
                          fontStyle: "italic",
                        }}
                      >
                        {new Date(m.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontFamily: "'Playfair Display',serif",
                          fontSize: 18,
                          fontWeight: 600,
                          color: sColor,
                        }}
                      >
                        {m.sentimentScore}
                      </span>
                      <span className={`tag t${m.severity[0].toLowerCase()}`}>
                        {m.severity}
                      </span>
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

export default Anlyt;
