import { Task } from "../types";
import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useFiltersContext } from "../context/FiltersContext";
import { editTask, deleteTask } from "../services/api";
import ToastMessage from "./ToastMessage";

type Props = {
  task: Task;
  onClose: () => void;
  onEdit: () => void; // per aprire la TaskFormModal
  onDeleteSuccess: () => void;
};

const colorMap: Record<string, string> = {
  blue: "bg-cyan-100",
  green: "bg-teal-100",
  yellow: "bg-yellow-100",
  orange: "bg-orange-100",
  gray: "bg-light",
};

const statusColorMap: Record<Task["status"], string> = {
  "To Do": "bg-cyan-100",
  Doing: "bg-yellow-100",
  Done: "bg-teal-100",
};

const TaskDetailsModal = ({ task, onClose, onEdit, onDeleteSuccess }: Props) => {
  const { user, token } = useUserContext();
  const { reloadTasks, userLists } = useFiltersContext();

  const [toast, setToast] = useState<{ message: string | React.ReactNode; type: "success" | "error" } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [localStatus, setLocalStatus] = useState<Task["status"]>(task.status);

  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (!token || !user) return;

    const updatedTask = { ...task, status: newStatus, userId: user.id };
    const result = await editTask(updatedTask, token);

    if (result.success) {
      setLocalStatus(newStatus);
      reloadTasks?.();
      setToast({ message: "Status updated", type: "success" });
    } else {
      setToast({ message: "Update failed", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!token || !task.id) return;

    setToast({
      message: (
        <>
          <div>Are you sure you want to delete this task?</div>
          <div className="mt-2 pt-2 border-top d-flex gap-2">
            <button className="btn btn-sm btn-danger" onClick={confirmDelete}>
              Confirm
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => setToast(null)}>
              Cancel
            </button>
          </div>
        </>
      ),
      type: "error",
    });
  };

  const confirmDelete = async () => {
    if (!token || !task.id) return;

    const result = await deleteTask(task.id, token);

    if (result.success) {
      setToast({ message: "Task deleted successfully", type: "success" });

      setTimeout(() => {
        onDeleteSuccess();
      }, 1500);
    } else {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  const listName = task.listId ? userLists.find((l) => l.id === task.listId)?.name ?? "Unknown list" : "No list";

  return (
    <div className="modal d-block bg-black bg-opacity-50" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered p-lg-5" role="document">
        <div className="modal-content bg-white p-2 m-lg-5 ">
          <div className="d-flex justify-content-between px-3 pt-3">
            <h5 className="modal-title">{task.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body d-flex flex-column gap-3 pt-1">
            <div>
              <span className={`badge text-dark ${colorMap[task.listColor || ""] || "bg-secondary-subtle"} px-3`}>
                {task.listName}
              </span>
            </div>
            <div>
              <div className="text-muted fs-7">
                <i className="bi bi-justify-left me-2"></i>
                <span>{task.description || "No description"}</span>
              </div>
            </div>
            <hr className="text-secondary my-1" />
            <div className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <div className="dropdown">
                    <button
                      className={`btn btn-sm btn-outline-secondary text-secondary dropdown-toggle py-1 ${statusColorMap[localStatus]}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {localStatus}
                    </button>
                    <ul className="dropdown-menu bg-white fs-7">
                      <li>
                        <button className="dropdown-item bg-cyan-100" onClick={() => handleStatusChange("To Do")}>
                          To Do
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item bg-yellow-100" onClick={() => handleStatusChange("Doing")}>
                          Doing
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item bg-teal-100" onClick={() => handleStatusChange("Done")}>
                          Done
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="text-secondary fs-7">
                    <i className="bi bi-clock me-1"></i>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "No due date"}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm px-3 btn-primary" onClick={onEdit}>
                  <i className="bi bi-pencil me-1"></i>Edit
                </button>
                <button className="btn btn-sm px-3 btn-outline-primary" onClick={handleDelete}>
                  <i className="bi bi-trash me-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default TaskDetailsModal;
