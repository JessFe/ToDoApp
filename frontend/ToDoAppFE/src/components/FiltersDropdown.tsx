import { useFiltersContext } from "../context/FiltersContext";
import ManageListsModal from "./ManageListsModal";
import { useState } from "react";

// Opzioni per filtri Status, Time, Tema - per generare le checkbox e i select option
const allStatusOptions: ("To Do" | "Doing" | "Done")[] = ["To Do", "Doing", "Done"];
const allTimeOptions = ["All", "Today", "3 days", "7 days", "14 days", "30 days"];
const allBackgroundOptions = ["gray", "green", "purple", "blue", "orange", "yellow", "pink"];
// TODO: Estrarre queste opzioni in un file condiviso

const FiltersDropdown = () => {
  // Destruttura i filtri e i metodi dal context
  const {
    statusFilter,
    setStatusFilter,
    timeFilter,
    setTimeFilter,
    background,
    setBackground,
    userLists,
    listsFilter,
    setListsFilter,
  } = useFiltersContext();

  // Stato per mostrare/nascondere la modale Manage your Lists
  const [showManageModal, setShowManageModal] = useState(false);

  // Controlla se tutti gli status sono selezionati
  const isAllStatusSelected = allStatusOptions.every((s) => statusFilter.includes(s));

  // Gestisce il cambio selezione dei checkbox Status
  const handleStatusChange = (status: string) => {
    if (status === "All") {
      // Se "All" è selezionato, toglie tutto o seleziona tutto
      setStatusFilter(isAllStatusSelected ? [] : allStatusOptions);
      return;
    }

    // Altrimenti, aggiunge o rimuove lo status dalla selezione
    const newStatus = statusFilter.includes(status as any)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status as any];

    setStatusFilter(newStatus);
  };

  // Tutti gli ID delle liste esistenti (+ "-1" che rappresenta "nessuna lista")
  const allListIds = [...userLists.map((l) => l.id), -1];
  // Controlla se tutte le liste sono selezionate
  const isAllListsSelected = allListIds.every((id) => listsFilter.includes(id));

  // Aggiunge o rimuove una singola lista dalla selezione
  const handleListToggle = (id: number) => {
    const updated = listsFilter.includes(id) ? listsFilter.filter((i) => i !== id) : [...listsFilter, id];

    setListsFilter(updated);
  };

  // Seleziona o deseleziona tutte le liste contemporaneamente
  const handleToggleAllLists = () => {
    setListsFilter(isAllListsSelected ? [] : allListIds);
  };

  return (
    <div className="filters-dropdown bg-white border rounded shadow-sm p-3">
      {/* STATUS */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="flex-grow-1 border-top border-primary px-4" />
          <span className="fw-semibold">Status</span>
          <div className="flex-grow-1 border-top border-primary px-4" />
        </div>

        <div className="d-flex flex-column gap-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="status-all"
              checked={isAllStatusSelected}
              onChange={() => handleStatusChange("All")}
            />
            <label className="form-check-label small" htmlFor="status-all">
              All
            </label>
          </div>
          {allStatusOptions.map((status) => (
            <div className="form-check" key={status}>
              <input
                type="checkbox"
                className="form-check-input"
                id={`status-${status}`}
                checked={statusFilter.includes(status)}
                onChange={() => handleStatusChange(status)}
              />
              <label className="form-check-label small" htmlFor={`status-${status}`}>
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* TIME */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="flex-grow-1 border-top border-primary px-4" />
          <span className="fw-semibold">Time</span>
          <div className="flex-grow-1 border-top border-primary px-4" />
        </div>
        <select
          className="form-select form-select-sm"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
        >
          {allTimeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* LISTS */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="flex-grow-1 border-top border-primary px-4" />
          <span className="fw-semibold">Lists</span>
          <div className="flex-grow-1 border-top border-primary px-4" />
        </div>
        <div className="d-flex flex-column gap-1">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="lists-all"
              checked={isAllListsSelected}
              onChange={handleToggleAllLists}
            />
            <label className="form-check-label small" htmlFor="lists-all">
              All
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="list-no-list"
              checked={listsFilter.includes(-1)}
              onChange={() => handleListToggle(-1)}
            />
            <label className="form-check-label small" htmlFor="list-no-list">
              No list
            </label>
          </div>

          {userLists.map((list) => (
            <div className="form-check" key={list.id}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`list-${list.id}`}
                checked={listsFilter.includes(list.id)}
                onChange={() => handleListToggle(list.id)}
              />
              <label className="form-check-label small" htmlFor={`list-${list.id}`}>
                {list.name}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <a
            href="#"
            className="small text-decoration-underline fs-8"
            onClick={(e) => {
              e.preventDefault();
              setShowManageModal(true);
            }}
          >
            <i className="bi bi-gear text-black-50 fs-7 me-2"></i>
            Manage your Lists
          </a>
        </div>
      </div>

      {/* THEMES */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="flex-grow-1 border-top border-primary px-4" />
          <span className="fw-semibold">Themes</span>
          <div className="flex-grow-1 border-top border-primary px-4" />
        </div>
        <select
          className="form-select form-select-sm"
          value={background}
          onChange={(e) => setBackground(e.target.value as any)}
        >
          {allBackgroundOptions.map((color) => (
            <option key={color}>{color}</option>
          ))}
        </select>
      </div>

      {showManageModal && <ManageListsModal onClose={() => setShowManageModal(false)} />}
    </div>
  );
};

export default FiltersDropdown;
