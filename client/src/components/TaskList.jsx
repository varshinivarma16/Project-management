import { TASK_STATUSES, TASK_STATUS_OPTIONS } from "../constants/statuses.js";
import { useState } from "react";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusLabel(statusValue) {
  return TASK_STATUS_OPTIONS.find((status) => status.value === statusValue)?.label || statusValue;
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
  onDragEnd,
  isDragging,
  isExpanded,
  onToggleExpand,
  isStatusMenuOpen,
  onToggleStatusMenu
}) {
  const taskId = `TASK-${String(task.id).slice(-3).padStart(3, "0")}`;

  return (
    <article
      className={`task-card${isDragging ? " dragging" : ""}${isExpanded ? " expanded" : ""}`}
      draggable
      onDragStart={(event) => onDragStart(event, task)}
      onDragEnd={onDragEnd}
      onClick={() => onToggleExpand(task.id)}
    >
      <div className="task-card-headline">
        <div className="task-card-id">{taskId}</div>
        <button
          type="button"
          className="task-expand-toggle"
          onClick={(event) => {
            event.stopPropagation();
            onToggleExpand(task.id);
          }}
        >
          {isExpanded ? "Hide" : "Open"}
        </button>
      </div>
      <div className="task-card-top">
        <h3>{task.title}</h3>
        {task.description ? <p className={isExpanded ? "task-description expanded" : "task-description"}>{task.description}</p> : null}
      </div>
      {isExpanded ? (
        <div className="task-card-expanded">
          <div className="task-expanded-row">
            <span>Assigned to</span>
            <strong>{task.assignedTo || "Unassigned"}</strong>
          </div>
          <div className="task-expanded-row">
            <span>Created</span>
            <strong>{new Date(task.createdAt).toLocaleString()}</strong>
          </div>
          <div className="task-expanded-row">
            <span>Updated</span>
            <strong>{new Date(task.updatedAt).toLocaleString()}</strong>
          </div>
        </div>
      ) : null}
      <div className="task-card-footer">
        <div className="task-card-meta-row">
          <div className="task-status-wrap">
            <button
              type="button"
              className="task-status-trigger"
              onClick={(event) => {
                event.stopPropagation();
                onToggleStatusMenu(task.id);
              }}
            >
              {getStatusLabel(task.status)}
            </button>
            {isStatusMenuOpen ? (
              <div className="task-status-menu" onClick={(event) => event.stopPropagation()}>
                {TASK_STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    className={`task-status-option${status.value === task.status ? " active" : ""}`}
                    onClick={() => onStatusChange(task, status.value)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          {task.assignedTo ? (
            <div
              className="assignee-avatar"
              title={task.assignedTo}
            >
              {getInitials(task.assignedTo)}
            </div>
          ) : null}
        </div>
        <div className="task-card-actions">
          <button
            type="button"
            className="task-action-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            Edit
          </button>
          <button
            type="button"
            className="task-action-btn danger"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            Del
          </button>
        </div>
      </div>
    </article>
  );
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onAddTask,
  draggedTaskId,
  activeDropStatus,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDropOnColumn
}) {
  const [expandedTaskId, setExpandedTaskId] = useState("");
  const [statusMenuTaskId, setStatusMenuTaskId] = useState("");

  const handleToggleExpand = (taskId) => {
    setExpandedTaskId((current) => (current === taskId ? "" : taskId));
  };

  const handleToggleStatusMenu = (taskId) => {
    setStatusMenuTaskId((current) => (current === taskId ? "" : taskId));
  };

  return (
    <div className="kanban-board">
      {TASK_STATUSES.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            className={`kanban-col${activeDropStatus === col.status ? " drop-target" : ""}`}
            onDragOver={(event) => onDragOverColumn(event, col.status)}
            onDrop={() => onDropOnColumn(col.status)}
          >
            <div className="kanban-col-header">
              <div className="kanban-col-title">
                <span className="col-dot" style={{ background: col.dot }} />
                {col.label}
                <span className="kanban-col-count">{colTasks.length}</span>
              </div>
              <div className="kanban-col-actions">
                <button className="col-icon-btn" title="Add task" type="button" onClick={() => onAddTask(col.status)}>
                  +
                </button>
              </div>
            </div>
            <div className="kanban-col-body">
              {colTasks.length === 0 ? (
                <div style={{ padding: "1rem 0.5rem", fontSize: "0.75rem", color: "var(--text-3)", textAlign: "center" }}>
                  No tasks
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isDragging={draggedTaskId === task.id}
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={handleToggleExpand}
                    isStatusMenuOpen={statusMenuTaskId === task.id}
                    onToggleStatusMenu={handleToggleStatusMenu}
                  />
                ))
              )}
              <button type="button" className="kanban-add-btn" onClick={() => onAddTask(col.status)}>
                + New work item
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
