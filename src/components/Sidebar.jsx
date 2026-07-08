import { useEffect, useRef, useState } from "react";
import Ico from "./icons/Ico";
import { NAV } from "../navigation/navItems";

const Sidebar = ({
  view,
  setView,
  user,
  latest,
  displayName,
  setDisplayName,
  onLogout,
  onClose,
}) => {
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
      {/* Mobile Close Button */}
      <div className="mobile-close-btn" style={{
        display: "none",
        justifyContent: "flex-end",
        padding: "8px 12px 0",
      }}>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--soft)",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

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
                style={{
                  padding: "4px 8px",
                  fontSize: 13,
                  borderRadius: 10,
                  width: "100%",
                }}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") {
                    setNameInput(displayName || user.name);
                    setEditingName(false);
                  }
                }}
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
                onClick={() => {
                  setNameInput(displayName || user.name);
                  setEditingName(true);
                }}
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
              style={{
                fontSize: 11,
                color: "var(--mute)",
                fontStyle: "italic",
              }}
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

export default Sidebar;
