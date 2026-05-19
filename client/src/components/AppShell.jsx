import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function AppShell({ title, subtitle, children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">SprintPilot</p>
          <h1>{title}</h1>
          {subtitle ? <p className="subtitle">{subtitle}</p> : null}
        </div>
        <div className="topbar-actions">
          {!isDashboard ? (
            <Link className="link-button" to="/">
              ← Dashboard
            </Link>
          ) : null}
          <div className="user-chip">
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#5e6ad2",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
                fontWeight: 600,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initials}
            </span>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>{user?.name}</span>
            <button type="button" className="link-button" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
