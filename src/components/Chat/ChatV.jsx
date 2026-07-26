// @coderabbitai review: check for chat XSS, input sanitization, and state leaks
import { useEffect, useRef, useState } from "react";
import Ico from "../icons/Ico";
import { calcPillarStats } from "../Persona/pillarHelpers";
import { CRISIS_WORDS, NEG_WORDS, classifySentiment } from "./sentiment";

const ChatV = ({
  data,
  user,
  chatMsgs,
  setChatMsgs,
  activities,
  persona = {},
  setPersona,
  addChatMood,
  addChatMsg,
}) => {
  // Mandatory Guardian Setup Check
  const hasGuardian = Boolean(
    persona?.guardian?.name &&
      (persona?.guardian?.email || persona?.guardian?.phone),
  );
  const [showMandatoryGuardianModal, setShowMandatoryGuardianModal] =
    useState(!hasGuardian);

  useEffect(() => {
    const valid = Boolean(
      persona?.guardian?.name &&
        (persona?.guardian?.email || persona?.guardian?.phone),
    );
    setShowMandatoryGuardianModal(!valid);
  }, [persona?.guardian]);

  const [mGuardian, setMGuardian] = useState({
    name: persona?.guardian?.name || "",
    phone: persona?.guardian?.phone || "",
    email: persona?.guardian?.email || "",
    relationship: persona?.guardian?.relationship || "Parent",
  });
  const [mErr, setMErr] = useState("");

  const handleSaveMandatoryGuardian = (e) => {
    e.preventDefault();
    setMErr("");

    const uEmail = user?.email?.toLowerCase()?.trim();
    const gEmail = mGuardian.email.toLowerCase().trim();

    if (uEmail && gEmail && uEmail === gEmail) {
      setMErr("Guardian email cannot be the same as your account email.");
      return;
    }

    if (!mGuardian.name.trim()) {
      setMErr("Please enter your guardian's name.");
      return;
    }

    if (!mGuardian.email.trim() && !mGuardian.phone.trim()) {
      setMErr("Please provide at least a guardian email address or mobile phone number.");
      return;
    }

    if (setPersona) {
      setPersona((p) => ({
        ...p,
        guardian: {
          name: mGuardian.name.trim(),
          phone: mGuardian.phone.trim(),
          email: mGuardian.email.trim(),
          relationship: mGuardian.relationship,
          updatedAt: new Date().toISOString(),
        },
      }));
    }
    setShowMandatoryGuardianModal(false);
  };

  const lat = data[data.length - 1];
  const defaultGreeting = {
    role: "assistant",
    content: `Namaste, ${user.name}\n\nI am Manas — a gentle companion for your inner world, here within Mansik. I am here to listen without judgment, to help you reflect, and to walk beside you through whatever you are carrying today.\n\n${lat ? `I noticed your most recent reflection showed ${lat.severity.toLowerCase()} stress. ` : ""}How are you feeling right now?`,
  };
  const [msgs, setMsgs] = useState(
    chatMsgs && chatMsgs.length > 0 ? chatMsgs : [defaultGreeting],
  );
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
  const crisisCountRef = useRef(0);
  const guardianNotifiedRef = useRef(false);
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
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }),
      );
      setLocStatus("granted");
      const { latitude: lat2, longitude: lng2 } = pos.coords;
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
      if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
        setLocStatus("error");
        return;
      }
      // Use Google Places Nearby Search REST API via proxy or direct
      const queries = [
        "mental health clinic",
        "psychologist",
        "therapist",
        "counseling center",
      ];
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
              fields: [
                "displayName",
                "formattedAddress",
                "nationalPhoneNumber",
                "rating",
                "userRatingCount",
                "location",
                "googleMapsURI",
              ],
              locationBias: {
                circle: { center: { lat: lat2, lng: lng2 }, radius: 10000 },
              },
              maxResultCount: 5,
            };
            const { places } = await Place.searchByText(request);
            if (places) {
              places.forEach((p) => {
                const dist = haversine(
                  lat2,
                  lng2,
                  p.location?.lat(),
                  p.location?.lng(),
                );
                allResults.push({
                  name: p.displayName,
                  address: p.formattedAddress || "",
                  phone: p.nationalPhoneNumber || "",
                  rating: p.rating || 0,
                  reviews: p.userRatingCount || 0,
                  distance: dist,
                  mapsUrl:
                    p.googleMapsURI ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName)}`,
                });
              });
            }
          }
        } catch (e2) {
          console.warn("Places search error:", e2);
        }
      }
      // Dedupe by name
      const seen = new Set();
      const unique = allResults.filter((r) => {
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
    const R = 6371,
      dLat = ((lat2 - lat1) * Math.PI) / 180,
      dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // National helplines fallback
  const HELPLINES = [
    {
      name: "iCall (TISS Mumbai)",
      phone: "9152987821",
      desc: "Mon-Sat, 8am-10pm",
      panIndia: true,
    },
    {
      name: "Vandrevala Foundation",
      phone: "1860-2662-345",
      desc: "24/7, All languages",
      panIndia: true,
    },
    {
      name: "NIMHANS Helpline",
      phone: "080-46110007",
      desc: "24/7 Mental Health",
      panIndia: true,
    },
    {
      name: "Snehi",
      phone: "044-24640050",
      desc: "24/7 Emotional Support",
      panIndia: true,
    },
    {
      name: "AASRA",
      phone: "9820466726",
      desc: "24/7 Crisis Intervention",
      panIndia: true,
    },
  ];

  // Build activity context for the AI
  const activityContext = (() => {
    if (!activities || activities.length === 0)
      return "No daily routines logged yet.";
    const lines = activities.map((a) => {
      const completions = Object.values(a.completionLog || {}).filter(
        Boolean,
      ).length;
      const total = Object.keys(a.completionLog || {}).length;
      const rate = total > 0 ? Math.round((completions / total) * 100) : 0;
      return `- ${a.name} (${a.pillar}): ${a.startTime}–${a.endTime} on ${a.days.map((d) => d.slice(0, 3)).join(",")} | Completion: ${completions}/${total} (${rate}%)`;
    });
    return lines.join("\n");
  })();

  // Build pillar consistency summary
  const pillarSummary = (() => {
    if (!activities || activities.length === 0) return "";
    const pillars = [...new Set(activities.map((a) => a.pillar))];
    return pillars
      .map((p) => {
        const stats = calcPillarStats(activities, p);
        if (!stats) return "";
        const flag =
          stats.consistency < 60
            ? " ⚠ IRREGULAR — needs attention"
            : stats.consistency >= 80
              ? " ✓ Consistent"
              : " ~ Moderate";
        return `${p}: ${stats.consistency}% consistency, streak: ${stats.currentStreak} days${flag}`;
      })
      .filter(Boolean)
      .join("\n");
  })();

  // Stress-activity correlation
  const stressCorrelation = (() => {
    if (data.length < 2 || !activities || activities.length === 0) return "";
    const recent = data.slice(-3);
    const trend =
      recent.length >= 2 && recent[recent.length - 1].score > recent[0].score
        ? "increasing"
        : recent[recent.length - 1].score < recent[0].score
          ? "decreasing"
          : "stable";
    const lowConsistency = [...new Set(activities.map((a) => a.pillar))].filter(
      (p) => {
        const stats = calcPillarStats(activities, p);
        return stats && stats.consistency < 50;
      },
    );
    let correlation = `Stress trend: ${trend} (${recent.map((r) => r.score).join(" → ")}).`;
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

${
  persona
    ? `Life Pillars configured: ${Object.entries(persona)
        .filter(([, v]) => Array.isArray(v) && v.length > 0)
        .map(([k, v]) => `${k}(${v.join(", ")})`)
        .join(" · ")}`
    : ""
}

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
    const showsDistress = NEG_WORDS.some((k) => u.toLowerCase().includes(k));
    const historyIsHigh =
      lat?.severity === "High" &&
      data.slice(-3).length === 3 &&
      data.slice(-3).every((a) => a.severity === "High");

    // Count all matching crisis keywords in the message
    const matchingCrisis = CRISIS_WORDS.filter((k) => u.toLowerCase().includes(k));
    if (matchingCrisis.length > 0) {
      crisisCountRef.current += matchingCrisis.length;
      // Notify guardian when cumulative crisis trigger threshold is reached (>= 3 matches)
      if (crisisCountRef.current >= 3 && !guardianNotifiedRef.current) {
        guardianNotifiedRef.current = true;
        const notifyUrl =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
            ? "http://localhost:5000/notify-guardian"
            : "https://7gh18z2ovk.execute-api.ap-south-1.amazonaws.com/prod/notify-guardian";
        fetch(notifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userDisplayName: user?.name,
            userEmail: user?.email,
            guardianName: persona?.guardian?.name,
            guardianPhone: persona?.guardian?.phone,
            guardianEmail: persona?.guardian?.email,
            triggerCount: crisisCountRef.current,
          }),
        }).catch((err) => console.warn("Silent guardian dispatch notice:", err));
      }
    }

    try {
      let r = await fetch(
        "https://7gh18z2ovk.execute-api.ap-south-1.amazonaws.com/prod/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gemini-3.1-flash-lite-preview",
            messages: [
              { role: "system", content: sys },
              ...next.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        },
      ).catch(() => null);

      let d = r && r.ok ? await r.json().catch(() => null) : null;

      // Fallback to local server if AWS Lambda failed or returned an error
      if (!d || d.error || !d.choices?.[0]?.message?.content) {
        try {
          const localRes = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "gemini-3.1-flash-lite-preview",
              messages: [
                { role: "system", content: sys },
                ...next.map((m) => ({ role: m.role, content: m.content })),
              ],
            }),
          });
          if (localRes.ok) {
            const localData = await localRes.json();
            if (localData?.choices?.[0]?.message?.content) {
              d = localData;
            }
          }
        } catch {
          // Ignore local fallback failure
        }
      }

      const assistantContent =
        d?.choices?.[0]?.message?.content ||
        "Connection error. Please check your internet connection and try sending your message again — Manas is still here.";

      setMsgs((p) => [...p, { role: "assistant", content: assistantContent }]);
      if (addChatMsg) {
        addChatMsg("user", u).catch(console.error);
        addChatMsg("assistant", assistantContent).catch(console.error);
      }
    } catch {
      setMsgs((p) => [
        ...p,
        {
          role: "assistant",
          content:
            "Connection error. Please check your internet connection and try sending your message again — Manas is still here.",
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
    <div className="chat-container">
      {/* Header bar */}
      <div className="fu" style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ position: "relative" }}>
            <div
              className="bth"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,rgba(247,180,138,.4),rgba(242,109,91,.25))",
                border: "1.5px solid rgba(199,74,63,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico n="brain" s={24} c="var(--coral)" sw={1.5} />
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
                border: "2px solid var(--paper-cream)",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 22,
                fontStyle: "italic",
                color: "var(--terracotta)",
              }}
            >
              a conversation with Manas 🌙
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-meta)",
                fontFamily: "'DM Mono',monospace",
                letterSpacing: "0.08em",
              }}
            >
              SESSION_{String((chatMsgs?.length || 1)).padStart(3, "0")} · {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-column container */}
      <div style={{ display: "flex", gap: 24, flex: 1, minHeight: 0 }}>
        {/* Left column — Messages + Input */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Old 2-layer safety protocol (helplines & nearby clinics) commented out per user request */}
      {/*
      {esc && (
        <div className="fu" style={{ marginBottom: 12 }}>
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
              style={{
                fontSize: 13,
                color: "var(--rose)",
                fontStyle: "italic",
                flex: 1,
              }}
            >
              You are not alone. If you are in crisis, please reach out:{" "}
              <a
                href="tel:9152987821"
                style={{
                  color: "var(--rose)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                iCall 9152987821
              </a>{" "}
              ·{" "}
              <a
                href="tel:18602662345"
                style={{
                  color: "var(--rose)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Vandrevala 1860-2662-345
              </a>
            </p>
            <button
              data-h
              onClick={() => {
                setShowNearby(!showNearby);
                if (!showNearby) searchNearbyCenters();
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 11,
                fontFamily: "'Lora',serif",
                border: "1.5px solid rgba(168,80,74,.35)",
                cursor: "pointer",
                flexShrink: 0,
                background: showNearby ? "rgba(168,80,74,.12)" : "transparent",
                color: "var(--rose)",
                transition: "all .3s",
              }}
            >
              {showNearby ? "Hide" : "Find Nearby Help"}
            </button>
          </div>

          {showNearby && (
            <div
              className="paper"
              style={{
                padding: "18px 20px",
                marginBottom: 4,
                maxHeight: 280,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div className="st" style={{ fontSize: 15 }}>
                  {locStatus === "loading"
                    ? "Locating you..."
                    : locStatus === "denied"
                      ? "Location access denied"
                      : nearbyCenters.length > 0
                        ? `${nearbyCenters.length} centers near you`
                        : "Professional Help"}
                </div>
                {locStatus === "denied" && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--mute)",
                      fontStyle: "italic",
                    }}
                  >
                    Enable location for nearby results
                  </span>
                )}
              </div>

              {locStatus === "loading" && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 0",
                    color: "var(--mute)",
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      border: "2.5px solid rgba(200,170,150,.25)",
                      borderTopColor: "var(--rose)",
                      borderRadius: "50%",
                      margin: "0 auto 8px",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Searching for mental health professionals near you...
                </div>
              )}

              {nearbyCenters.length > 0 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {nearbyCenters.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        borderRadius: 12,
                        background: "rgba(255,250,244,.7)",
                        border: "1px solid rgba(200,170,150,.15)",
                        transition: "all .3s",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background:
                            "linear-gradient(135deg,rgba(168,80,74,.12),rgba(168,80,74,.06))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Ico n="brain" s={16} c="var(--rose)" sw={1.6} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontFamily: "'Lora',serif",
                            fontWeight: 500,
                            color: "var(--text)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--mute)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.address}
                        </div>
                        {c.phone && (
                          <a
                            href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`}
                            style={{
                              fontSize: 11,
                              color: "var(--rose)",
                              textDecoration: "none",
                              fontWeight: 500,
                            }}
                          >
                            📞 {c.phone}
                          </a>
                        )}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {c.rating > 0 && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#A88040",
                              fontWeight: 500,
                            }}
                          >
                            ★ {c.rating.toFixed(1)}{" "}
                            <span
                              style={{ fontSize: 10, color: "var(--mute)" }}
                            >
                              ({c.reviews})
                            </span>
                          </div>
                        )}
                        <div style={{ fontSize: 10, color: "var(--mute)" }}>
                          {c.distance < 999
                            ? `${c.distance.toFixed(1)} km`
                            : ""}
                        </div>
                        <a
                          href={c.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 10,
                            color: "var(--rose)",
                            textDecoration: "none",
                          }}
                        >
                          Directions →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: nearbyCenters.length > 0 ? 14 : 0 }}>
                {(nearbyCenters.length === 0 ||
                  locStatus === "denied" ||
                  locStatus === "error") && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--mute)",
                      fontStyle: "italic",
                      marginBottom: 8,
                    }}
                  >
                    {locStatus === "denied"
                      ? "Please enable location access in your browser to see nearby centers. Meanwhile, here are national helplines:"
                      : "National helplines available 24/7:"}
                  </div>
                )}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {HELPLINES.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: 10,
                        background:
                          i === 0
                            ? "rgba(168,80,74,.08)"
                            : "rgba(200,170,150,.06)",
                        border: "1px solid rgba(200,170,150,.1)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: "var(--text)",
                          }}
                        >
                          {h.name}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--mute)",
                            fontStyle: "italic",
                          }}
                        >
                          {h.desc}
                        </div>
                      </div>
                      <a
                        href={`tel:${h.phone.replace(/[^0-9+]/g, "")}`}
                        style={{
                          fontSize: 13,
                          color: "var(--rose)",
                          fontWeight: 600,
                          textDecoration: "none",
                          padding: "4px 12px",
                          borderRadius: 16,
                          background: "rgba(168,80,74,.1)",
                        }}
                      >
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
      */}

      {/* Mandatory Guardian Setup Modal */}
      {showMandatoryGuardianModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(30, 20, 25, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            className="paper-b fu"
            style={{
              maxWidth: 480,
              width: "100%",
              borderRadius: 20,
              padding: "28px 24px",
              background: "linear-gradient(135deg, rgba(255,250,245,.98), rgba(248,240,230,.98))",
              border: "1px solid rgba(200,170,150,.4)",
              boxShadow: "0 10px 40px rgba(0,0,0,.25)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(242,109,91,.2), rgba(232,90,124,.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <Ico n="shield" s={26} c="var(--rose)" sw={1.8} />
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--brown)",
                  margin: "0 0 6px",
                }}
              >
                Mandatory Guardian Setup
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--mute)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Personal safety comes first. Before starting chat sessions, you must upload the contact info of a trusted close person or guardian. Your messages remain 100% encrypted & private.
              </p>
            </div>

            <form onSubmit={handleSaveMandatoryGuardian} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mErr && (
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "rgba(199,74,63,.1)",
                    border: "1px solid rgba(199,74,63,.3)",
                    color: "#C74A3F",
                    fontSize: 12,
                  }}
                >
                  ⚠ {mErr}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--brown)", marginBottom: 4 }}>
                  Guardian Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parent / Sibling / Friend Name"
                  value={mGuardian.name}
                  onChange={(e) => setMGuardian({ ...mGuardian, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(200,170,150,.4)",
                    background: "#FFF",
                    fontSize: 13,
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--brown)", marginBottom: 4 }}>
                  Guardian Email Address *
                </label>
                <input
                  type="email"
                  placeholder="guardian@example.com"
                  value={mGuardian.email}
                  onChange={(e) => setMGuardian({ ...mGuardian, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(200,170,150,.4)",
                    background: "#FFF",
                    fontSize: 13,
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--brown)", marginBottom: 4 }}>
                  Guardian Mobile Phone Number (Optional SMS)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={mGuardian.phone}
                  onChange={(e) => setMGuardian({ ...mGuardian, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(200,170,150,.4)",
                    background: "#FFF",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 6,
                  padding: "12px",
                  borderRadius: 30,
                  background: "linear-gradient(135deg, rgba(242,109,91,.95), rgba(232,90,124,.95))",
                  color: "#FFF",
                  border: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(242,109,91,.3)",
                }}
              >
                Save & Continue to Chat
              </button>
            </form>
          </div>
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
          Manas offers companionship, not clinical care. In a true emergency, please call a professional.
        </p>
        </div> {/* End left column */}

        {/* Right column — Watercolor Brain & Feeling Panel (Reference Image 2) */}
        <div
          className="paper fu"
          style={{
            width: 280,
            flexShrink: 0,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(160deg, rgba(251,243,231,.95) 0%, rgba(247,180,138,.18) 100%)",
            border: "1px solid var(--line-pencil)",
            borderRadius: 22,
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 17,
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--terracotta)",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            how you're feeling right now
          </div>

          {/* Hand-painted watercolor head profile silhouette */}
          <div
            style={{
              position: "relative",
              width: 140,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(242,109,91,.22) 0%, rgba(247,180,138,.15) 60%, transparent 80%)",
                filter: "blur(10px)",
              }}
            />
            <img
              src="/brain-small.png"
              alt="brain silhouette"
              style={{
                width: 120,
                height: 120,
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 4px 10px rgba(199,74,63,.15))",
              }}
            />
          </div>

          {/* Soft sentiment wave line */}
          <svg viewBox="0 0 200 30" style={{ width: "100%", height: 24, marginBottom: 14 }}>
            <path
              d="M 0 15 Q 30 5, 60 15 T 120 15 T 180 15 T 200 15"
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F26D5B" />
                <stop offset="50%" stopColor="#F2A03D" />
                <stop offset="100%" stopColor="#D89A94" />
              </linearGradient>
            </defs>
          </svg>

          {/* Sentiment mood progress bars (matching reference 2) */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "tender", pct: 62, bg: "linear-gradient(90deg, #F26D5B, #F7B48A)", c: "var(--terracotta)" },
              { label: "hopeful", pct: 24, bg: "linear-gradient(90deg, #F2A03D, #FBF3E7)", c: "#8B5E1A" },
              { label: "tired", pct: 14, bg: "linear-gradient(90deg, #D89A94, #7A4A6B)", c: "var(--plum)" },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: m.c }}>{m.label}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--ink-meta)" }}>{m.pct}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "rgba(199,74,63,.12)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.pct}%`, borderRadius: 999, background: m.bg }} />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 11,
              fontFamily: "'Source Serif 4',serif",
              fontStyle: "italic",
              color: "var(--ink-meta)",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            "Remember, we can take this one breath at a time."
          </div>
        </div>
      </div> {/* End main 2-column container */}
    </div>
  );
};

export default ChatV;