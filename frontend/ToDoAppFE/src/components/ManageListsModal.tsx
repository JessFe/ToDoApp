import { useState, useEffect } from "react";
import { useFiltersContext, List } from "../context/FiltersContext";   // context dei filtri, che contiene le liste dell'utente
import { createList, updateList, deleteList } from "../services/api";
import { useUserContext } from "../context/UserContext";      // per accedere al token e all'id utente
import ToastMessage from "./ToastMessage";

// Tipo props ricevute (solo funzione chiusura modale)
type ManageListsModalProps = {
  onClose: () => void;
};

// colori disponibili per le liste
const availableColors = ["blue", "green", "yellow", "orange", "gray"];

const ManageListsModal = ({ onClose }: ManageListsModalProps) => {
  const { user, token } = useUserContext();                                  // dati utente e token autenticazione
  const { userLists, loadUserLists, reloadTasks } = useFiltersContext();   // Dati liste, funzione per ricaricarle, trigger per aggiornare le task
  const [editedLists, setEditedLists] = useState<List[]>([...userLists]);  // Stato locale delle liste modificate (copiate dalle userLists)
  const [newList, setNewList] = useState<{ name: string; color: string }>({ name: "", color: "blue" });    // Stato della nuova lista da creare
  const [toast, setToast] = useState<{ message: string | React.ReactNode; type: "success" | "error" } | null>(null);
  const [deletingListId, setDeletingListId] = useState<number | null>(null);  // ID della lista in fase di eliminazione (per evitare doppi click)

  // Aggiorna lo stato locale quando userLists cambia
  useEffect(() => {
    setEditedLists([...userLists]);
  }, [userLists]);

  // Modifica campo nome o colore di una lista specifica
  const handleChange = (id: number, field: keyof List, value: string) => {
    setEditedLists((prev) =>
      prev.map((list) =>
      (list.id === id
        ? { ...list, [field]: value }  // Se è la lista giusta, aggiorna il campo richiesto
        : list)));           // Altrimenti lascia la lista com'è
  };

  // Salva modifiche di una lista esistente
  const handleUpdate = async (list: List) => {
    if (!user || !token) return;

    // Chiudi eventuali toast di conferma ancora aperti
    setToast(null);
    setDeletingListId(null);

    const result = await updateList(list, token);

    if (result.success) {
      await loadUserLists();    // aggiorna l'elenco
      await reloadTasks?.();    // aggiorna le task

      setToast(null);
      setTimeout(() => {
        setToast({ message: "List updated successfully", type: "success" });
      }, 50);
    } else {
      setToast(null);
      setTimeout(() => {
        setToast({ message: "Update failed", type: "error" });
      }, 50);
    }
  };

  // Esegue l'eliminazione vera e propria dopo conferma
  const confirmDelete = async (id: number) => {
    if (!token) return;

    setToast(null);
    setDeletingListId(null);

    setTimeout(async () => {
      const result = await deleteList(id, token);

      if (result.success) {
        await loadUserLists();
        if (reloadTasks) reloadTasks();
        setToast(null);
        setTimeout(() => {
          setToast({ message: "List deleted", type: "success" });
        }, 50);

        setTimeout(() => setToast(null), 2000);
      } else {
        setToast(null);
        setTimeout(() => {
          setToast({
            message: "Delete failed - Check if the list is used in any task.",
            type: "error",
          });
        }, 50);
      }
    }, 100);
  };

  // Mostra conferma di eliminazione
  const handleDelete = async (id: number) => {
    if (deletingListId !== null) return; // blocca se già in corso

    setDeletingListId(id); // salva l'id per prevenire doppio click

    // toast conferma o annulla
    setToast({
      message: (
        <>
          <div>Are you sure you want to delete this list?</div>
          <div className="mt-2 pt-2 border-top d-flex gap-2">
            <button className="btn btn-sm btn-danger" onClick={() => confirmDelete(id)}>
              Confirm
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                setToast(null);
                setDeletingListId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ),
      type: "error",
    });
  };

  // Aggiunge una nuova lista
  const handleAdd = async () => {
    if (!user || !token || newList.name.trim() === "") return;

    const result = await createList({ ...newList, userId: user.id }, token);

    if (result.success) {
      setNewList({ name: "", color: "blue" });   // reset
      await loadUserLists();
      if (reloadTasks) reloadTasks();
      setToast(null);
      setTimeout(() => {
        setToast({ message: "List created!", type: "success" });
      }, 50);
    } else {
      setToast(null);
      setTimeout(() => {
        setToast({ message: "Failed to create list", type: "error" });
      }, 50);
    }
  };

  return (
    <div className="modal d-block bg-black bg-opacity-50" tabIndex={-1} role="dialog">
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
