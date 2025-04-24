import { useState, useEffect } from "react";
import { useFiltersContext, List } from "../context/FiltersContext";
import { createList, updateList, deleteList } from "../services/api";
import { useUserContext } from "../context/UserContext";
import ToastMessage from "./ToastMessage";

type ManageListsModalProps = {
  onClose: () => void;
};

const availableColors = ["blue", "green", "yellow", "orange", "gray"];

const ManageListsModal = ({ onClose }: ManageListsModalProps) => {
  const { user, token } = useUserContext();
  const { userLists, loadUserLists, reloadTasks } = useFiltersContext();
  const [editedLists, setEditedLists] = useState<List[]>([...userLists]);
  const [newList, setNewList] = useState<{ name: string; color: string }>({ name: "", color: "blue" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    setEditedLists([...userLists]);
  }, [userLists]);

  const handleChange = (id: number, field: keyof List, value: string) => {
    setEditedLists((prev) => prev.map((list) => (list.id === id ? { ...list, [field]: value } : list)));
  };

  const handleUpdate = async (list: List) => {
    if (!user || !token) return;
    const result = await updateList(list, token);
    if (result.success) {
      await loadUserLists();
      if (reloadTasks) reloadTasks();
      setToast({ message: "List updated successfully", type: "success" });
    } else {
      setToast({ message: "Update failed", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    const result = await deleteList(id, token);
    if (result.success) {
      await loadUserLists();
      if (reloadTasks) reloadTasks();
      setToast({ message: "List deleted", type: "success" });
    } else {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  const handleAdd = async () => {
    if (!user || !token || newList.name.trim() === "") return;
    const result = await createList({ ...newList, userId: user.id }, token);
    if (result.success) {
      setNewList({ name: "", color: "green" });
      await loadUserLists();
      if (reloadTasks) reloadTasks();
      setToast({ message: "List created!", type: "success" });
    } else {
      setToast({ message: "Failed to create list", type: "error" });
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "#00000080" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Manage your Lists</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body mb-3">
            <div className="d-flex align-items-center gap-4 mb-2">
              <div className="flex-grow-1 border-top border-primary" />
              <span className="fw-semibold">Edit / Delete</span>
              <div className="flex-grow-1 border-top border-primary" />
            </div>

            <ul className="list-group mb-3">
              {editedLists.map((list) => (
                <li className="list-group-item d-flex gap-2 align-items-center" key={list.id}>
                  <input
                    type="text"
                    className="form-control"
                    value={list.name}
                    onChange={(e) => handleChange(list.id, "name", e.target.value)}
                  />
                  <select
                    className="form-select w-auto"
                    value={list.color}
                    onChange={(e) => handleChange(list.id, "color", e.target.value)}
                  >
                    {availableColors.map((color) => (
                      <option key={color}>{color}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => handleUpdate(list)}
                  >
                    <i className="bi bi-floppy me-2"></i>
                    <span className="fs-8">Save</span>
                  </button>

                  <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center"
                    onClick={() => handleDelete(list.id)}
                  >
                    <i className="bi bi-trash me-2"></i>
                    <span className="fs-8">Delete</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-4 mt-4 mb-2">
              <div className="flex-grow-1 border-top border-primary" />
              <span className="fw-semibold">Add new list</span>
              <div className="flex-grow-1 border-top border-primary" />
            </div>

            <ul className="list-group">
              <li className="list-group-item d-flex align-items-center gap-2">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="New list name"
                  value={newList.name}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                />
                <select
                  className="form-select w-auto"
                  value={newList.color}
                  onChange={(e) => setNewList({ ...newList, color: e.target.value })}
                >
                  {availableColors.map((color) => (
                    <option key={color}>{color}</option>
                  ))}
                </select>
                <button
                  className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                  onClick={handleAdd}
                >
                  <i className="bi bi-folder-plus me-2"></i>
                  <span className="fs-8 text-nowrap">Add new list</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ManageListsModal;
