import { useEffect, useState } from "react";

const initialState = { name: "", description: "" };

export function ProjectForm({ onSubmit, initialValues, onCancel, submitLabel = "Save Project" }) {
  const [form, setForm] = useState(initialValues || initialState);

  useEffect(() => {
    setForm(initialValues || initialState);
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    if (!initialValues) {
      setForm(initialState);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>{initialValues ? "Edit Project" : "New Project"}</h2>
        <p>Define scope before adding tasks.</p>
      </div>
      <label>
        Project Name
        <input
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="e.g. Website Redesign"
          required
        />
      </label>
      <label>
        Description
        <textarea
          rows="4"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Briefly describe the project goals"
          required
        />
      </label>
      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}