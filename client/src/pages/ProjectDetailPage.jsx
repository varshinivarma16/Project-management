import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { AppShell } from "../components/AppShell.jsx";
import { TaskForm } from "../components/TaskForm.jsx";
import { TaskList } from "../components/TaskList.jsx";
import { TASK_STATUS_OPTIONS } from "../constants/statuses.js";

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [activeDropStatus, setActiveDropStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const filteredTasks = !project?.tasks
    ? []
    : project.tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" ? true : task.status === statusFilter;
        return matchesSearch && matchesStatus;
      });

  const handleSaveTask = async (form) => {
    try {
      if (editingTask?.id) {
        await api.put(`/tasks/${editingTask.id}`, form);
      } else {
        await api.post(`/projects/${projectId}/tasks`, form);
      }
      setEditingTask(null);
      setShowForm(false);
      await loadProject();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save task");
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await api.put(`/tasks/${task.id}`, { ...task, status });
      await loadProject();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      await loadProject();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleAddTask = (status = "backlog") => {
    setEditingTask({
      title: "",
      description: "",
      status,
      assignedTo: ""
    });
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const handleDragStart = (event, task) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.id);
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setActiveDropStatus("");
  };

  const handleDragOverColumn = (event, status) => {
    event.preventDefault();
    if (draggedTask) {
      setActiveDropStatus(status);
    }
  };

  const handleDropOnColumn = async (status) => {
    if (!draggedTask || draggedTask.status === status) {
      handleDragEnd();
      return;
    }

    try {
      await api.put(`/tasks/${draggedTask.id}`, { status });
      await loadProject();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to move task");
    } finally {
      handleDragEnd();
    }
  };

  return (
    <AppShell
      title={project?.name || "Project"}
      subtitle={project?.description}
    >
      {error ? (
        <div style={{ padding: "0.75rem 1.25rem" }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="card empty-state" style={{ margin: "1.25rem" }}>
          <p>Loading project…</p>
        </div>
      ) : !project ? (
        <div className="card empty-state" style={{ margin: "1.25rem" }}>
          <p>Project not found.</p>
        </div>
      ) : (
        <>
          {/* Toolbar row above board */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 1.25rem",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg)",
              flexShrink: 0,
            }}
          >
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks…"
              style={{
                width: 220,
                fontSize: "0.8125rem",
                padding: "0.35rem 0.7rem",
                background: "var(--bg-3)",
                border: "1px solid var(--border-2)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-1)",
                outline: "none",
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                fontSize: "0.8125rem",
                padding: "0.35rem 1.75rem 0.35rem 0.7rem",
                background: "var(--bg-3)",
                border: "1px solid var(--border-2)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-2)",
                outline: "none",
                appearance: "none",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5a62' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                cursor: "pointer",
              }}
            >
              <option value="all">All statuses</option>
              {TASK_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleAddTask()}
                style={{ fontSize: "0.8125rem" }}
              >
                + Add task
              </button>
            </div>
          </div>

          {/* Slide-in task form */}
          {showForm ? (
            <div
              style={{
                position: "absolute",
                top: 52,
                right: 0,
                width: 320,
                height: "calc(100vh - 52px)",
                background: "var(--bg-2)",
                borderLeft: "1px solid var(--border)",
                zIndex: 50,
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              <TaskForm
                onSubmit={handleSaveTask}
                editingTask={editingTask?.id ? editingTask : null}
                initialTask={editingTask && !editingTask.id ? editingTask : null}
                onCancel={handleCancelForm}
              />
            </div>
          ) : null}

          {/* Kanban board */}
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTask}
            draggedTaskId={draggedTask?.id}
            activeDropStatus={activeDropStatus}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOverColumn={handleDragOverColumn}
            onDropOnColumn={handleDropOnColumn}
          />
        </>
      )}
    </AppShell>
  );
}
