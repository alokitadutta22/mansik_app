import { useState } from "react";
import Ico from "../icons/Ico";
import { PIL } from "../Assessment/pssData";
import { DAYS, DAY_SHORT, todayName, todayStr, calcPillarStats } from "./pillarHelpers";

const Pers = ({
  persona,
  setPersona,
  activities,
  addActivityFS,
  updateActivity,
  deleteActivity,
  data,
}) => {
  const [active, setActive] = useState("Health");
  const [customTag, setCustomTag] = useState("");
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newAct, setNewAct] = useState({
    name: "",
    pillar: "Health",
    days: [],
    startTime: "07:00",
    endTime: "08:00",
  });
  const [persTab, setPersTab] = useState("pillars"); // pillars | routines | analytics
  const tog = (cat, ag) =>
    setPersona((p) => {
      const cur = p[cat] || [],
        upd = cur.includes(ag) ? cur.filter((x) => x !== ag) : [...cur, ag];
      return { ...p, [cat]: upd };
    });
  const total = Object.values(persona)
    .filter((v) => Array.isArray(v))
    .reduce((s, v) => s + v.length, 0);
  const addActivity = async () => {
    if (!newAct.name.trim() || !newAct.days.length) return;
    const act = {
      ...newAct,
      createdAt: todayStr(),
      completionLog: {},
    };
    await addActivityFS(act).catch(console.error);
    setNewAct({
      name: "",
      pillar: active,
      days: [],
      startTime: "07:00",
      endTime: "08:00",
    });
    setShowAddActivity(false);
  };
  const removeActivity = (id) => deleteActivity(id).catch(console.error);
  const toggleCompletion = async (id, dateStr) => {
    const act = activities.find((a) => a.id === id);
    if (!act) return;
    const log = { ...(act.completionLog || {}) };
    log[dateStr] = !log[dateStr];
    await updateActivity(id, { completionLog: log }).catch(console.error);
  };
  const todaysActivities = activities.filter((a) =>
    a.days.includes(todayName()),
  );
  const td = todayStr();

  return (
    <div className="view-container" style={{ maxWidth: 960 }}>
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
        ].map((tab) => (
          <button
            key={tab.id}
            data-h
            onClick={() => setPersTab(tab.id)}
            style={{
              padding: "10px 20px",
              borderRadius: 30,
              border: "1.5px solid",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Lora',serif",
              transition: "all .3s",
              display: "flex",
              alignItems: "center",
              gap: 7,
              background:
                persTab === tab.id
                  ? "linear-gradient(135deg,rgba(232,200,194,.78),rgba(194,208,220,.58))"
                  : "transparent",
              borderColor:
                persTab === tab.id
                  ? "rgba(200,170,150,.38)"
                  : "rgba(200,170,150,.22)",
              color: persTab === tab.id ? "var(--brown)" : "var(--soft)",
              boxShadow:
                persTab === tab.id
                  ? "0 2px 12px rgba(180,110,100,.11)"
                  : "none",
            }}
          >
            <Ico
              n={tab.ico}
              s={14}
              c={persTab === tab.id ? "var(--rose)" : "var(--mute)"}
              sw={1.8}
            />
            {tab.l}
          </button>
        ))}
      </div>

      {/* ════ PILLARS TAB ════ */}
      {persTab === "pillars" && (
        <>
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
                Across{" "}
                {Object.values(persona).filter((v) => Array.isArray(v) && v.length > 0).length} life
                pillars
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 7,
                flexWrap: "wrap",
                maxWidth: 360,
              }}
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
            style={{
              display: "flex",
              gap: 7,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {Object.entries(PIL).map(([k, v]) => {
              const n = (persona[k] || []).length;
              return (
                <button
                  key={k}
                  data-h
                  onClick={() => {
                    setActive(k);
                    setCustomTag("");
                  }}
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
              {(persona[active] || [])
                .filter((ag) => !PIL[active].a.includes(ag))
                .map((ag) => (
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
                  if (customTag.trim()) {
                    tog(active, customTag.trim());
                    setCustomTag("");
                  }
                }}
                style={{
                  display: "inline-flex",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <input
                  className="si"
                  style={{ width: 140, padding: "6px 12px", borderRadius: 30 }}
                  placeholder="+ Custom..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                />
              </form>
            </div>
          </div>
          {Object.values(persona).some((v) => Array.isArray(v) && v.length > 0) && (
            <div className="paper fu" style={{ padding: "22px" }}>
              <div className="st" style={{ fontSize: 19, marginBottom: 14 }}>
                Your Configuration
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 11 }}
              >
                {Object.entries(persona)
                  .filter(([, v]) => Array.isArray(v) && v.length > 0)
                  .map(([cat, ags]) => (
                    <div
                      key={cat}
                      style={{
                        display: "flex",
                        gap: 11,
                        alignItems: "flex-start",
                      }}
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
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
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
        </>
      )}

      {/* ════ ROUTINES TAB ════ */}
      {persTab === "routines" && (
        <>
          {/* Today's check-in */}
          {todaysActivities.length > 0 && (
            <div
              className="paper-b fu"
              style={{ padding: "20px 22px", marginBottom: 22 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: "rgba(122,154,120,.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ico n="check" s={16} c="#7A9A78" sw={2} />
                </div>
                <div>
                  <div className="st" style={{ fontSize: 18 }}>
                    Today's Check-in
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--mute)",
                      fontStyle: "italic",
                    }}
                  >
                    {todayName()},{" "}
                    {new Date().toLocaleDateString("en-IN", {
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {todaysActivities.map((act) => {
                  const done = act.completionLog?.[td];
                  const pilObj = PIL[act.pillar] || PIL.Health;
                  return (
                    <div
                      key={act.id}
                      data-h
                      onClick={() => toggleCompletion(act.id, td)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        borderRadius: 14,
                        cursor: "pointer",
                        transition: "all .3s",
                        background: done
                          ? "rgba(122,154,120,.12)"
                          : "rgba(200,170,150,.08)",
                        border: `1.5px solid ${done ? "rgba(122,154,120,.3)" : "rgba(200,170,150,.18)"}`,
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          background: done ? "#7A9A78" : "transparent",
                          border: done
                            ? "none"
                            : "2px solid rgba(200,170,150,.35)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all .3s",
                          flexShrink: 0,
                        }}
                      >
                        {done && <Ico n="check" s={14} c="white" sw={2.5} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontFamily: "'Lora',serif",
                            fontWeight: 500,
                            color: done ? "#7A9A78" : "var(--text)",
                            textDecoration: done ? "line-through" : "none",
                          }}
                        >
                          {act.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--mute)" }}>
                          {act.startTime} – {act.endTime}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: `${pilObj.c}38`,
                          color: pilObj.d,
                          fontStyle: "italic",
                        }}
                      >
                        {act.pillar}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Activity Form */}
          <div
            className="paper fu"
            style={{ padding: "22px", marginBottom: 18 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div className="st" style={{ fontSize: 19 }}>
                Daily Routines
              </div>
              <button
                data-h
                onClick={() => setShowAddActivity(!showAddActivity)}
                className="btn-s"
                style={{ padding: "8px 20px", fontSize: 12 }}
              >
                {showAddActivity ? "Cancel" : "+ Add Routine"}
              </button>
            </div>

            {showAddActivity && (
              <div
                className="fu"
                style={{
                  padding: 18,
                  borderRadius: 16,
                  marginBottom: 16,
                  background: "rgba(232,200,194,.12)",
                  border: "1px solid rgba(200,170,150,.18)",
                }}
              >
                <div className="form-row-grid">
                  <div>
                    <div
                      className="cv"
                      style={{
                        fontSize: 12,
                        color: "var(--mute)",
                        marginBottom: 4,
                      }}
                    >
                      activity name
                    </div>
                    <input
                      className="si"
                      placeholder="e.g. Gym, Reading, Meditation..."
                      value={newAct.name}
                      onChange={(e) =>
                        setNewAct((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <div
                      className="cv"
                      style={{
                        fontSize: 12,
                        color: "var(--mute)",
                        marginBottom: 4,
                      }}
                    >
                      life pillar
                    </div>
                    <select
                      className="si"
                      value={newAct.pillar}
                      onChange={(e) =>
                        setNewAct((p) => ({ ...p, pillar: e.target.value }))
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {Object.keys(PIL).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row-grid">
                  <div>
                    <div
                      className="cv"
                      style={{
                        fontSize: 12,
                        color: "var(--mute)",
                        marginBottom: 4,
                      }}
                    >
                      start time
                    </div>
                    <input
                      className="si"
                      type="time"
                      value={newAct.startTime}
                      onChange={(e) =>
                        setNewAct((p) => ({ ...p, startTime: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <div
                      className="cv"
                      style={{
                        fontSize: 12,
                        color: "var(--mute)",
                        marginBottom: 4,
                      }}
                    >
                      end time
                    </div>
                    <input
                      className="si"
                      type="time"
                      value={newAct.endTime}
                      onChange={(e) =>
                        setNewAct((p) => ({ ...p, endTime: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <div
                    className="cv"
                    style={{
                      fontSize: 12,
                      color: "var(--mute)",
                      marginBottom: 6,
                    }}
                  >
                    days of the week
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {DAYS.map((d, i) => {
                      const sel = newAct.days.includes(d);
                      return (
                        <button
                          key={d}
                          data-h
                          onClick={() =>
                            setNewAct((p) => ({
                              ...p,
                              days: sel
                                ? p.days.filter((x) => x !== d)
                                : [...p.days, d],
                            }))
                          }
                          style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontFamily: "'Lora',serif",
                            border: "1.5px solid",
                            cursor: "pointer",
                            transition: "all .25s",
                            background: sel ? "var(--rose)" : "transparent",
                            borderColor: sel
                              ? "var(--rose)"
                              : "rgba(200,170,150,.28)",
                            color: sel ? "white" : "var(--soft)",
                          }}
                        >
                          {DAY_SHORT[i]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  data-h
                  onClick={addActivity}
                  className="btn-s"
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "10px",
                    fontSize: 13,
                  }}
                >
                  Save Routine
                </button>
              </div>
            )}

            {/* Activity list */}
            {activities.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "var(--mute)",
                  fontStyle: "italic",
                  fontSize: 13,
                }}
              >
                No routines logged yet. Add your first daily routine to start
                tracking consistency ✦
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activities.map((act) => {
                  const pilObj = PIL[act.pillar] || PIL.Health;
                  const logCount = Object.values(
                    act.completionLog || {},
                  ).filter(Boolean).length;
                  return (
                    <div
                      key={act.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        borderRadius: 14,
                        background: "rgba(255,250,244,.6)",
                        border: "1px solid rgba(200,170,150,.15)",
                        transition: "all .3s",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 9,
                          background: `${pilObj.c}45`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Ico n={pilObj.ico} s={15} c={pilObj.d} sw={1.8} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontFamily: "'Lora',serif",
                            fontWeight: 500,
                            color: "var(--text)",
                          }}
                        >
                          {act.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--mute)" }}>
                          {act.startTime} – {act.endTime} ·{" "}
                          {act.days.map((d) => d.slice(0, 3)).join(", ")}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: `${pilObj.c}38`,
                            color: pilObj.d,
                            fontStyle: "italic",
                          }}
                        >
                          {act.pillar}
                        </span>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--mute)",
                            marginTop: 3,
                          }}
                        >
                          {logCount} completions
                        </div>
                      </div>
                      <button
                        data-h
                        onClick={() => removeActivity(act.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          opacity: 0.5,
                          transition: "opacity .2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.opacity = 1)}
                        onMouseLeave={(e) => (e.target.style.opacity = 0.5)}
                      >
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
              <div className="st" style={{ fontSize: 19, marginBottom: 14 }}>
                Weekly Schedule
              </div>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                    fontFamily: "'Lora',serif",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: "8px 10px",
                          textAlign: "left",
                          color: "var(--mute)",
                          fontWeight: 400,
                          fontStyle: "italic",
                          borderBottom: "1px solid rgba(200,170,150,.15)",
                        }}
                      >
                        Routine
                      </th>
                      {DAY_SHORT.map((d) => (
                        <th
                          key={d}
                          style={{
                            padding: "8px 6px",
                            textAlign: "center",
                            color:
                              d === todayName().slice(0, 3)
                                ? "var(--rose)"
                                : "var(--mute)",
                            fontWeight:
                              d === todayName().slice(0, 3) ? 600 : 400,
                            fontStyle: "italic",
                            borderBottom: "1px solid rgba(200,170,150,.15)",
                          }}
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((act) => {
                      const pilObj = PIL[act.pillar] || PIL.Health;
                      return (
                        <tr key={act.id}>
                          <td
                            style={{
                              padding: "10px 10px",
                              color: "var(--text)",
                              borderBottom: "1px solid rgba(200,170,150,.08)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <div
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: pilObj.d,
                                  flexShrink: 0,
                                }}
                              />
                              {act.name}
                              <span
                                style={{ fontSize: 10, color: "var(--mute)" }}
                              >
                                {act.startTime}
                              </span>
                            </div>
                          </td>
                          {DAYS.map((day) => {
                            const isScheduled = act.days.includes(day);
                            return (
                              <td
                                key={day}
                                style={{
                                  padding: "10px 6px",
                                  textAlign: "center",
                                  borderBottom:
                                    "1px solid rgba(200,170,150,.08)",
                                }}
                              >
                                {isScheduled ? (
                                  <div
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: 6,
                                      margin: "0 auto",
                                      background: `linear-gradient(135deg,${pilObj.c},${pilObj.d})`,
                                      opacity: 0.7,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Ico n="check" s={10} c="white" sw={2.5} />
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: 6,
                                      margin: "0 auto",
                                      background: "rgba(200,170,150,.08)",
                                    }}
                                  />
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
        </>
      )}

      {/* ════ ANALYTICS TAB ════ */}
      {persTab === "analytics" && (
        <>
          <div
            className="paper fu"
            style={{ padding: "22px", marginBottom: 18 }}
          >
            <div className="st" style={{ fontSize: 19, marginBottom: 6 }}>
              Pillar Consistency Analysis
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--mute)",
                fontStyle: "italic",
                marginBottom: 18,
              }}
            >
              Based on your last 14 days of activity completions
            </p>

            {activities.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "var(--mute)",
                  fontStyle: "italic",
                  fontSize: 13,
                }}
              >
                Add daily routines to see your consistency analytics ✦
              </div>
            ) : (
              <div className="consistency-grid">
                {Object.entries(PIL).map(([pillar, pilObj]) => {
                  const stats = calcPillarStats(activities, pillar);
                  if (!stats) return null;
                  const cColor =
                    stats.consistency >= 80
                      ? "#7A9A78"
                      : stats.consistency >= 50
                        ? "#A88040"
                        : "#A8504A";
                  return (
                    <div
                      key={pillar}
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        background: `${pilObj.c}12`,
                        border: `1px solid ${pilObj.c}30`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: `${pilObj.c}55`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ico n={pilObj.ico} s={14} c={pilObj.d} sw={1.9} />
                        </div>
                        <div className="st" style={{ fontSize: 16 }}>
                          {pillar}
                        </div>
                      </div>

                      {/* Consistency ring */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: 56,
                            height: 56,
                          }}
                        >
                          <svg width={56} height={56} viewBox="0 0 56 56">
                            <circle
                              cx={28}
                              cy={28}
                              r={23}
                              fill="none"
                              stroke="rgba(200,170,150,.15)"
                              strokeWidth={4}
                            />
                            <circle
                              cx={28}
                              cy={28}
                              r={23}
                              fill="none"
                              stroke={cColor}
                              strokeWidth={4}
                              strokeDasharray={`${(stats.consistency / 100) * 144.5} 144.5`}
                              strokeLinecap="round"
                              transform="rotate(-90 28 28)"
                              style={{ transition: "stroke-dasharray 1s" }}
                            />
                          </svg>
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "'Playfair Display',serif",
                              fontSize: 15,
                              fontWeight: 600,
                              color: cColor,
                            }}
                          >
                            {stats.consistency}%
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--soft)",
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{ fontWeight: 600, color: "var(--brown)" }}
                            >
                              🔥 {stats.currentStreak}
                            </span>{" "}
                            day streak
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--mute)",
                              fontStyle: "italic",
                            }}
                          >
                            Best: {stats.longestStreak} days
                          </div>
                        </div>
                      </div>

                      {/* Weekly trend mini bars */}
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "flex-end",
                          height: 30,
                          marginBottom: 10,
                        }}
                      >
                        {stats.weeklyRates.map((rate, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: `${Math.max(4, rate * 0.28)}px`,
                                borderRadius: 3,
                                background: `linear-gradient(180deg,${pilObj.d},${pilObj.c})`,
                                transition: "height 1s",
                              }}
                            />
                            <span style={{ fontSize: 9, color: "var(--mute)" }}>
                              W{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Per-activity breakdown */}
                      {stats.actStats.map((as) => (
                        <div
                          key={as.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "5px 0",
                            borderTop: "1px solid rgba(200,170,150,.1)",
                          }}
                        >
                          <div style={{ fontSize: 12, color: "var(--soft)" }}>
                            {as.name}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div className="pt" style={{ width: 50 }}>
                              <div
                                className="pf"
                                style={{
                                  width: `${as.rate}%`,
                                  background:
                                    as.rate >= 80
                                      ? "#7A9A78"
                                      : as.rate >= 50
                                        ? "#A88040"
                                        : "#A8504A",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                color: as.rate < 60 ? "#A8504A" : "var(--mute)",
                                fontWeight: as.rate < 60 ? 600 : 400,
                              }}
                            >
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
              <div className="st" style={{ fontSize: 19, marginBottom: 6 }}>
                Lifestyle-Stress Correlation
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--mute)",
                  fontStyle: "italic",
                  marginBottom: 14,
                }}
              >
                How your routine consistency may relate to your stress levels
              </p>
              <div style={{ display: "flex", gap: 14 }}>
                {Object.entries(PIL).map(([pillar, pilObj]) => {
                  const stats = calcPillarStats(activities, pillar);
                  if (!stats) return null;
                  const latScore = data[data.length - 1]?.score || 0;
                  const impact =
                    stats.consistency >= 70
                      ? "positive"
                      : stats.consistency >= 40
                        ? "neutral"
                        : "needs attention";
                  const impColor =
                    impact === "positive"
                      ? "#7A9A78"
                      : impact === "neutral"
                        ? "#A88040"
                        : "#A8504A";
                  return (
                    <div
                      key={pillar}
                      style={{
                        flex: 1,
                        padding: 14,
                        borderRadius: 12,
                        textAlign: "center",
                        background: `${pilObj.c}10`,
                        border: `1px solid ${pilObj.c}25`,
                      }}
                    >
                      <Ico n={pilObj.ico} s={18} c={pilObj.d} sw={1.8} />
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--brown)",
                          marginTop: 6,
                        }}
                      >
                        {pillar}
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontFamily: "'Playfair Display',serif",
                          fontWeight: 600,
                          color: impColor,
                          marginTop: 4,
                        }}
                      >
                        {stats.consistency}%
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: impColor,
                          fontStyle: "italic",
                          marginTop: 2,
                          textTransform: "capitalize",
                        }}
                      >
                        {impact}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pers;
