import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import {
  useAssessments,
  usePersona,
  useActivities,
  useChatHistory,
} from "./useDatabase";
import {
  hasLocalStorageData,
  getLocalStorageData,
  clearLocalStorageData,
} from "./migrationUtils";
import ErrorBoundary from "./components/ErrorBoundary";

import G from "./components/styles/GlobalStyles";
import Cursor from "./components/Cursor";
import Music from "./components/Music/Music";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import Dash from "./components/Dashboard/Dash";
import Assess from "./components/Assessment/Assess";
import Anlyt from "./components/Analytics/Anlyt";
import Pers from "./components/Persona/Pers";
import RecsV from "./components/Recommendations/RecsV";
import ChatV from "./components/Chat/ChatV";
import Ico from "./components/icons/Ico";

/* ══ Root ══ */
export default function Mansik({ firebaseUser }) {
  const [user, setUser] = useState(
      firebaseUser
        ? {
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: firebaseUser.email,
          }
        : null,
    ),
    [view, setView] = useState("dash");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Firestore hooks ──
  const { assessments, addAssessment } = useAssessments();
  const { persona: firestorePersona, updatePersona } = usePersona();
  const {
    activities: firestoreActivities,
    addActivity: addActivityFS,
    updateActivity,
    deleteActivity,
  } = useActivities();
  const { messages: chatMsgsFS, addMessage: addChatMsg } = useChatHistory();
  const data = assessments;

  // ── Persisted custom display name ──
  const [displayName, setDisplayName] = useState(() => {
    if (firebaseUser?.email) {
      return (
        localStorage.getItem(`mansik_displayName_${firebaseUser.email}`) ||
        firebaseUser.displayName ||
        firebaseUser.email.split("@")[0]
      );
    }
    return "";
  });

  // chatMood stays local
  const [chatMood, setChatMood] = useState([]);
  const addChatMood = (signal) => setChatMood((prev) => [...prev, signal]);

  // Firestore aliases
  // Use optimistic local persona state for instant mobile feedback
  const [localPersona, setLocalPersona] = useState(null);
  const persona = localPersona !== null ? localPersona : firestorePersona;
  const activities = firestoreActivities;
  const chatMsgs = chatMsgsFS;
  const setChatMsgs = () => {};

  // Sync local persona when Firestore persona changes (e.g. from another device)
  useEffect(() => {
    setLocalPersona(null); // reset so firestorePersona is used
  }, [JSON.stringify(firestorePersona)]);

  const setPersona = (updaterOrValue) => {
    const newVal =
      typeof updaterOrValue === "function"
        ? updaterOrValue(persona)
        : updaterOrValue;
    // Optimistically update local state instantly
    setLocalPersona(newVal);
    updatePersona(newVal).catch((e) => {
      console.error("Persona update failed:", e);
      // Roll back optimistic update on failure
      setLocalPersona(null);
    });
  };

  // Keep user.name in sync with displayName
  useEffect(() => {
    if (user && displayName) {
      setUser((prev) => (prev ? { ...prev, name: displayName } : prev));
    }
  }, [displayName]);

  // Persist display name
  useEffect(() => {
    if (user?.email && displayName) {
      localStorage.setItem(`mansik_displayName_${user.email}`, displayName);
    }
  }, [displayName, user?.email]);

  // ── One-time migration localStorage → Firestore ──
  useEffect(() => {
    if (!firebaseUser?.email) return;
    const { hasAny } = hasLocalStorageData(firebaseUser.email);
    if (!hasAny) return;
    const {
      assessments: localA,
      persona: localP,
      activities: localAct,
    } = getLocalStorageData(firebaseUser.email);
    (async () => {
      try {
        for (const a of localA) await addAssessment(a);
        if (Object.keys(localP).length) await updatePersona(localP);
        for (const act of localAct) await addActivityFS(act);
        clearLocalStorageData(firebaseUser.email);
        console.log("✅ Migration complete");
      } catch (e) {
        console.error("Migration failed:", e);
      }
    })();
  }, [firebaseUser?.email]);

  const addA = async (a) => {
    try {
      await addAssessment(a);
      setView("analytics");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Could not save assessment. Please try again.");
    }
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
    dash: <ErrorBoundary><Dash user={user} data={data} persona={persona} /></ErrorBoundary>,
    assess: <ErrorBoundary><Assess onSubmit={addA} data={data} /></ErrorBoundary>,
    analytics: <ErrorBoundary><Anlyt data={data} chatMood={chatMood} /></ErrorBoundary>,
    persona: (
      <ErrorBoundary>
        <Pers
          persona={persona}
          setPersona={setPersona}
          activities={activities}
          addActivityFS={addActivityFS}
          updateActivity={updateActivity}
          deleteActivity={deleteActivity}
          data={data}
        />
      </ErrorBoundary>
    ),
    chat: (
      <ErrorBoundary>
        <ChatV
          data={data}
          user={user}
          chatMsgs={chatMsgs}
          setChatMsgs={setChatMsgs}
          activities={activities}
          persona={persona}
          addChatMood={addChatMood}
          addChatMsg={addChatMsg}
        />
      </ErrorBoundary>
    ),
    recs: <ErrorBoundary><RecsV data={data} persona={persona} /></ErrorBoundary>,
    soundlull: (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 45px)", width: "100%" }}>
        <iframe
          src="https://therapyapp-seven.vercel.app/"
          style={{ flex: 1, width: "100%", border: "none" }}
          title="Soundlull Music Therapy"
          allow="autoplay; fullscreen"
        />
      </div>
    ),
  };

  return (
    <>
      <G />
      <Cursor />
      <div className="app-container">
        {/* Mobile sticky header */}
        <div className="mobile-header" style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "linear-gradient(135deg,rgba(247,240,232,.97),rgba(239,230,216,.97))",
          borderBottom: "1px solid rgba(200,170,150,.18)",
          position: "sticky",
          top: 0,
          zIndex: 900,
          backdropFilter: "blur(10px)",
          width: "100%",
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              color: "var(--brown)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg,rgba(232,200,194,.55),rgba(194,208,220,.45))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Ico n="brain" s={14} c="var(--rose)" sw={1.6} />
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: "var(--brown)" }}>
              Mansik
            </span>
          </div>
          <div style={{ width: 36 }} /> {/* spacer */}
        </div>

        <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
          <Sidebar
            view={view}
            setView={(v) => {
              setView(v);
              setSidebarOpen(false);
            }}
            user={user}
            latest={lat}
            displayName={displayName}
            setDisplayName={setDisplayName}
            onLogout={() => {
              signOut(auth).then(() => setUser(null));
            }}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: "100dvh",
            position: "relative",
            width: "100%",
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
      {view !== "soundlull" && <Music />}
    </>
  );
}
