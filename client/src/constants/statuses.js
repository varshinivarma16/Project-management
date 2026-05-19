export const TASK_STATUSES = [
  { status: "backlog", label: "Backlog", dot: "#64748b" },
  { status: "todo", label: "To Do", dot: "#94a3b8" },
  { status: "in-progress", label: "In Progress", dot: "#f59e0b" },
  { status: "on-hold", label: "On Hold", dot: "#ef4444" },
  { status: "done", label: "Done", dot: "#22c55e" }
];

export const TASK_STATUS_OPTIONS = TASK_STATUSES.map(({ status, label }) => ({
  value: status,
  label
}));
