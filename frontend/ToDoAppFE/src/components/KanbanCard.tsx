import { Task } from "../types";

const colorMap: Record<string, string> = {
  blue: "bg-cyan-100",
  green: "bg-teal-100",
  yellow: "bg-yellow-100",
  orange: "bg-orange-100",
  gray: "bg-light",
};

//prettier-ignore
const statusColorMap: Record<Task["status"], string> = {
  "To Do": "bg-cyan-100",
  "Doing": "bg-yellow-100",
  "Done": "bg-teal-100",
};

type KanbanCardProps = {
  task: Task;
  onStatusChange: (taskId: number, newStatus: Task["status"]) => void;
};

const KanbanCard = ({ task, onStatusChange }: KanbanCardProps) => {
  const truncate = (text?: string) => {
    if (!text) return "";
    return text.length > 40 ? text.substring(0, 40) + ".." : text;
  };

  return (
    <div className="card p-3 shadow-sm task-card bg-white" role="button">
      <h6 className="mb-2">{task.title}</h6>

      {task.listName && (
        <div className="mb-2">
          <span className={`badge text-dark ${colorMap[task.listColor || ""] || "bg-secondary-subtle"} px-3`}>
            {task.listName}
          </span>
        </div>
      )}

      <p className="mb-2 text-muted small">{truncate(task.description)}</p>

      <hr className="text-secondary my-2" />

      <div className="d-flex justify-content-between align-items-center">
        <span className="text-secondary fs-8">
          <i className="bi bi-clock me-1"></i>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "No due date"}
        </span>

        <div className="dropdown">
          <button
            className={`btn btn-sm btn-outline-secondary text-secondary dropdown-toggle py-0 ${
              statusColorMap[task.status]
            }`}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {task.status}
          </button>
          <ul className="dropdown-menu bg-white fs-7">
            <li>
              <button className="dropdown-item bg-cyan-100" onClick={() => onStatusChange(task.id, "To Do")}>
                To Do
              </button>
            </li>
            <li>
              <button className="dropdown-item bg-yellow-100" onClick={() => onStatusChange(task.id, "Doing")}>
                Doing
              </button>
            </li>
            <li>
              <button className="dropdown-item bg-teal-100" onClick={() => onStatusChange(task.id, "Done")}>
                Done
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
