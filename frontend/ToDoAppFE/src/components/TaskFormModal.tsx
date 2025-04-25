import { useState, useEffect } from "react";
import { useFiltersContext } from "../context/FiltersContext";
import { useUserContext } from "../context/UserContext";
import { createTask, editTask } from "../services/api";
import { Task } from "../types";
import ToastMessage from "./ToastMessage";

// Tipo delle props che riceve la modale
type TaskFormModalProps = {
  mode: "add" | "edit";
  taskToEdit?: Task;     // Se modalità edit, task da modificare
  onClose: () => void;
  onSuccess: () => void; // per ricarica la lista e chiusura la modale
};

const TaskFormModal = ({ mode, taskToEdit, onClose, onSuccess }: TaskFormModalProps) => {
  const { user, token } = useUserContext();
  const { userLists, reloadTasks } = useFiltersContext();

  // Stati locali dei campi del form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [listId, setListId] = useState<number | null>(null);
  const [status, setStatus] = useState<Task["status"]>("To Do");

  // Stato per i messaggi di feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Se in modalità edit, precompila i campi col task passato
  useEffect(() => {
    if (mode === "edit" && taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setDueDate(taskToEdit.dueDate?.split("T")[0] || "");  // Prende solo data, senza ora
      setListId(taskToEdit.listId);
      setStatus(taskToEdit.status);
    }
  }, [mode, taskToEdit]);

  // salva una nuova task o aggiorna una esistente
  const handleSave = async () => {
    if (!token || !user || !title || !dueDate) return;   // controllo dati obbligatori

    const taskData: Omit<Task, "id"> = {
      title,
      description,
      dueDate,
      listId,
      status,
      userId: user.id,
    };

    // Se modalità add, crea task nuova - se edit, aggiorna quella esistente
    const result =
      mode === "add" ? await createTask(taskData, token) : await editTask({ ...taskToEdit!, ...taskData }, token);

    if (result.success) {
      reloadTasks?.();
      setToast(null);

      setTimeout(() => {
        setToast({
          message: mode === "add" ? "Task created successfully!" : "Task updated successfully!",
          type: "success",
        });

        // Chiudi modale dopo che il toast ha avuto tempo di mostrarsi
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }, 50);
    } else {
      setToast(null);
      setTimeout(() => {
        setToast({ message: result.message || "Something went wrong", type: "error" });
      }, 50);
    }
  };

  return (
    <div className="modal d-block bg-black bg-opacity-50" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content bg-light">
          <div className="modal-header">
            <h5 className="modal-title text-muted">{mode === "add" ? "Add a new Task" : "Edit this Task"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label opacity-50 fs-7 fst-italic">Title* :</label>
              <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label opacity-50 fs-7 fst-italic">Description :</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label opacity-50 fs-7 fst-italic">Due date* :</label>
                <input
                  className="form-control"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label opacity-50 fs-7 fst-italic">List :</label>
                <select
                  className="form-select"
                  value={listId ?? -1}
                  onChange={(e) => setListId(+e.target.value === -1 ? null : +e.target.value)}
                >
                  <option value={-1}>No list</option>
                  {userLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3 w-50">
              <label className="form-label opacity-50 fs-7 fst-italic">Status :</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
              >
                <option value="To Do">To Do</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-sm btn-primary px-4" onClick={handleSave}>
                <i className="bi bi-check-lg me-2"></i>Save
              </button>
              <button className="btn btn-sm btn-outline-primary px-2" onClick={onClose}>
                <i className="bi bi-x-lg me-2"></i>Don't save
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default TaskFormModal;
