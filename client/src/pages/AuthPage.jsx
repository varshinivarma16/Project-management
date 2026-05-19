import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const CARDS = [
  { id: 1, title: "Design system tokens", tag: "Design", col: 0, avatar: "AR" },
  { id: 2, title: "Auth flow implementation", tag: "Dev", col: 0, avatar: "VS" },
  { id: 3, title: "API rate limiting", tag: "Backend", col: 1, avatar: "KM" },
  { id: 4, title: "Mobile responsive layout", tag: "Dev", col: 1, avatar: "AR" },
  { id: 5, title: "Unit test coverage", tag: "QA", col: 2, avatar: "VS" },
  { id: 6, title: "Deploy to production", tag: "DevOps", col: 2, avatar: "KM" }
];

const COL_COLORS = ["#9a9a9f", "#f0a429", "#4cb782"];
const COL_LABELS = ["Todo", "In Progress", "Done"];
const TAG_COLORS = {
  Design: "#7c6fcd",
  Dev: "#4a9eff",
  Backend: "#e86c4f",
  QA: "#4cb782",
  DevOps: "#f0a429"
};
const AVATAR_COLORS = { AR: "#5e6ad2", VS: "#e86c4f", KM: "#4cb782" };

const SEQUENCE = [
  { cardId: 2, fromCol: 0, toCol: 1, delay: 1200 },
  { cardId: 3, fromCol: 1, toCol: 2, delay: 3200 },
  { cardId: 1, fromCol: 0, toCol: 1, delay: 5400 },
  { cardId: 5, fromCol: 2, toCol: 1, delay: 7600 },
  { cardId: 4, fromCol: 1, toCol: 2, delay: 9800 },
  { cardId: 2, fromCol: 1, toCol: 2, delay: 12000 }
];

function KanbanDemo() {
  const [cards, setCards] = useState(CARDS);
  const [dragging, setDragging] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [highlight, setHighlight] = useState(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const seqRef = useRef(0);
  const cardsRef = useRef(CARDS);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    setCards(CARDS);
    cardsRef.current = CARDS;

    function runNext() {
      const step = SEQUENCE[seqRef.current % SEQUENCE.length];
      const containerEl = containerRef.current;

      if (!containerEl) {
        return;
      }

      const colEls = containerEl.querySelectorAll(".demo-col");
      const fromColEl = colEls[step.fromCol];
      const toColEl = colEls[step.toCol];

      if (!fromColEl || !toColEl) {
        return;
      }

      const currentCards = cardsRef.current;
      const movingCard = currentCards.find((card) => card.id === step.cardId);

      if (!movingCard || movingCard.col !== step.fromCol) {
        seqRef.current += 1;
        timerRef.current = setTimeout(runNext, 1800);
        return;
      }

      const cardEls = Array.from(fromColEl.querySelectorAll(".demo-card"));
      const cardEl = cardEls[0];

      if (!cardEl) {
        seqRef.current += 1;
        timerRef.current = setTimeout(runNext, 1800);
        return;
      }

      const fromRect = cardEl.getBoundingClientRect();
      const toRect = toColEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      const startX = fromRect.left - containerRect.left;
      const startY = fromRect.top - containerRect.top;
      const endX = toRect.left - containerRect.left + 10;
      const endY = toRect.top - containerRect.top + 58;

      setDragging(step.cardId);
      setDragPos({ x: startX, y: startY });
      setHighlight(step.toCol);

      const duration = 900;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        setDragPos({
          x: startX + (endX - startX) * eased,
          y: startY + (endY - startY) * eased
        });

        if (t < 1) {
          animRef.current = requestAnimationFrame(animate);
          return;
        }

        setDragging(null);
        setHighlight(null);
        setCards((prev) =>
          prev.map((card) => (card.id === step.cardId ? { ...card, col: step.toCol } : card))
        );
        seqRef.current += 1;
        timerRef.current = setTimeout(runNext, 2000);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    timerRef.current = setTimeout(runNext, 1400);

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const draggingCard = cards.find((card) => card.id === dragging);

  return (
    <div ref={containerRef} className="auth-demo-board">
      {[0, 1, 2].map((col) => (
        <div
          key={col}
          className={`demo-col${highlight === col ? " highlight" : ""}`}
        >
          <div className="auth-demo-col-head">
            <span className="auth-demo-col-dot" style={{ background: COL_COLORS[col] }} />
            <span>{COL_LABELS[col]}</span>
            <span className="auth-demo-col-count">
              {cards.filter((card) => card.col === col && card.id !== dragging).length}
            </span>
          </div>

          {cards
            .filter((card) => card.col === col && card.id !== dragging)
            .map((card) => (
              <div key={card.id} className="demo-card auth-demo-card">
                <div className="auth-demo-card-title">{card.title}</div>
                <div className="auth-demo-card-foot">
                  <span
                    className="auth-demo-tag"
                    style={{
                      color: TAG_COLORS[card.tag],
                      background: `${TAG_COLORS[card.tag]}18`,
                      borderColor: `${TAG_COLORS[card.tag]}33`
                    }}
                  >
                    {card.tag}
                  </span>
                  <div className="auth-demo-avatar" style={{ background: AVATAR_COLORS[card.avatar] }}>
                    {card.avatar}
                  </div>
                </div>
              </div>
            ))}

          {highlight === col ? <div className="auth-demo-drop" /> : null}
        </div>
      ))}

      {dragging && draggingCard ? (
        <div
          className="auth-demo-ghost"
          style={{
            left: dragPos.x,
            top: dragPos.y
          }}
        >
          <div className="auth-demo-card-title">{draggingCard.title}</div>
          <div className="auth-demo-card-foot">
            <span
              className="auth-demo-tag"
              style={{
                color: TAG_COLORS[draggingCard.tag],
                background: `${TAG_COLORS[draggingCard.tag]}18`,
                borderColor: `${TAG_COLORS[draggingCard.tag]}33`
              }}
            >
              {draggingCard.tag}
            </span>
            <div className="auth-demo-avatar" style={{ background: AVATAR_COLORS[draggingCard.avatar] }}>
              {draggingCard.avatar}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const { authenticate } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authenticate(mode, form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-experience">
      <section className="auth-showcase">
        <div className="auth-showcase-grid" />
        <div className="auth-showcase-glow auth-showcase-glow-a" />
        <div className="auth-showcase-glow auth-showcase-glow-b" />

        <div className="auth-showcase-inner">
          <div className="auth-brand-row">
            <div className="auth-brand-mark">P</div>
            <div>
              <p className="auth-brand-name">SprintPilot</p>
              <p className="auth-brand-subtitle">Project planning that stays fast.</p>
            </div>
          </div>

          <div className="auth-hero-copy">
            <span className="auth-kicker">Team workspace</span>
            <h1>Plan work, move faster, keep every project visible.</h1>
            <p>
              SprintPilot gives you a focused workspace for projects, tasks, owners, and progress. Drag
              work across the board, filter it instantly, and keep delivery moving.
            </p>
          </div>

          <div className="auth-showcase-panels">
            <div className="auth-browser-frame">
              <div className="auth-browser-bar">
                <span className="auth-browser-dot red" />
                <span className="auth-browser-dot amber" />
                <span className="auth-browser-dot green" />
                <div className="auth-browser-address">sprintpilot.app / sprint-board</div>
              </div>

              <div className="auth-browser-topline">
                <div className="auth-browser-project">
                  <span>SprintPilot</span>
                  <span>/</span>
                  <span>Sprint 04</span>
                </div>
                <div className="auth-browser-team">
                  {["AR", "VS", "KM"].map((av) => (
                    <div key={av} className="auth-browser-avatar" style={{ background: AVATAR_COLORS[av] }}>
                      {av}
                    </div>
                  ))}
                  <span className="auth-browser-cta">+ Add task</span>
                </div>
              </div>

              <div className="auth-browser-board">
                <KanbanDemo />
              </div>
            </div>
          </div>

          <div className="auth-feature-row">
            <div className="auth-feature-pill">Kanban workflow</div>
            <div className="auth-feature-pill">Project timelines</div>
            <div className="auth-feature-pill">Search and filters</div>
            <div className="auth-feature-pill">Fast task updates</div>
          </div>
        </div>
      </section>

      <aside className="auth-panel">
        <div className="auth-panel-frame">
          <div className="auth-panel-header">
            <span className="auth-panel-badge">{mode === "login" ? "Welcome back" : "Start with SprintPilot"}</span>
            <h2>{mode === "login" ? "Sign in to your workspace" : "Create your workspace account"}</h2>
            <p>
              {mode === "login"
                ? "Access your projects, task boards, and active delivery work."
                : "Set up your account and start organizing projects in minutes."}
            </p>
          </div>

          <div className="auth-mode-tabs">
            {["login", "signup"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={mode === value ? "active" : ""}
              >
                {value === "login" ? "Login" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form-stack">
            {mode === "signup" ? (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Your name"
                  required
                  style={inputStyle}
                />
              </div>
            ) : null}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="At least 6 characters"
                required
                style={inputStyle}
              />
            </div>

            {error ? <p className="auth-inline-error">{error}</p> : null}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Please wait..." : mode === "login" ? "Login to SprintPilot" : "Create SprintPilot Account"}
            </button>
          </form>

          <div className="auth-panel-footer">
            <div className="auth-footer-item">
              <strong>Projects</strong>
              <span>Structured by workspace, not scattered notes.</span>
            </div>
            <div className="auth-footer-item">
              <strong>Tasks</strong>
              <span>Statuses, owners, filters, and quick updates built in.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9a9a9f",
  marginBottom: "0.35rem",
  display: "block"
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 0.85rem",
  fontSize: "0.9rem",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#e8e8ea",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  outline: "none",
  boxSizing: "border-box"
};
