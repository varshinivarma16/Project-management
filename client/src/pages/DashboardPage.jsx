import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { AppShell } from "../components/AppShell.jsx";
import { ProjectCard } from "../components/ProjectCard.jsx";
import { ProjectForm } from "../components/ProjectForm.jsx";

export function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSaveProject = async (form) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, form);
      } else {
        await api.post("/projects", form);
      }
      setEditingProject(null);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete project");
    }
  };

  return (
    <AppShell title="Dashboard" subtitle="Manage active projects and jump into task execution.">
      <div className="dashboard-grid">
        <ProjectForm
          onSubmit={handleSaveProject}
          initialValues={editingProject}
          onCancel={editingProject ? () => setEditingProject(null) : undefined}
          submitLabel={editingProject ? "Update Project" : "Create Project"}
        />

        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Projects</h2>
            <p>Each project shows description, task volume, and created date.</p>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          {loading ? (
            <div className="card empty-state">
              <p>Loading projects…</p>
            </div>
          ) : projects.length ? (
            <div className="project-list">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={setEditingProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <div className="card empty-state">
              <h3>No projects yet</h3>
              <p>Create your first project to start tracking tasks.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}