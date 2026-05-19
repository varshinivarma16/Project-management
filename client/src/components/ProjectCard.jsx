import { Link } from "react-router-dom";

export function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="card project-card">
      <div className="project-card-header">
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
        <span className="status-badge neutral">{project.taskCount} tasks</span>
      </div>
      <div className="project-meta">
        {project.taskCount} total tasks • Created{" "}
        {new Date(project.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })}
      </div>
      <div className="card-actions">
        <Link className="secondary-button" to={`/projects/${project.id}`}>
          View Tasks
        </Link>
        <button type="button" className="secondary-button" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button type="button" className="danger-button" onClick={() => onDelete(project.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
