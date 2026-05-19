import { useEffect, useState } from "react";
import { TASK_STATUS_OPTIONS } from "../constants/statuses.js";

const emptyTask = {
  title: "",
  description: "",
  status: "backlog",
  assignedTo: ""
};

export function TaskForm({ onSubmit, editingTask, initialTask, onCancel }) {
  const [form, setForm] = useState(emptyTask);
  const isEditing = Boolean(editingTask?.id);

  useEffect(() => {
    setForm(
      editingTask
        ? {
            title: editingTask.title,
            description: editingTask.description,
            status: editingTask.status,
            assignedTo: editingTask.assignedTo || ""
          }
        : initialTask || emptyTask
    );
  }, [editingTask, initialTask]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    if (!isEditing) {
      setForm(emptyTask);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>{isEditing ? "Edit Task" : "New Task"}</h2>
        <p>Track the work inside this project.</p>
      </div>
      <label>
        Title
        <input
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="e.g. Create landing page"
          required
        />
      </label>
      <label>
        Description
        <textarea
          rows="3"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Break down the task details"
        />
      </label>
      <div className="grid-two">
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
          >
            {TASK_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assigned To
          <input
            value={form.assignedTo}
            onChange={(event) => setForm((prev) => ({ ...prev, assignedTo: event.target.value }))}
            placeholder="Teammate name"
          />
        </label>
      </div>
      <div className="form-actions">
        {editingTask ? (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button type="submit">{isEditing ? "Update Task" : "Add Task"}</button>
      </div>
    </form>
  );
}
