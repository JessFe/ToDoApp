import { useEffect, useRef, useState } from "react";
import { useFiltersContext } from "../context/FiltersContext";
import FiltersDropdown from "./FiltersDropdown";
import TaskFormModal from "./TaskFormModal";

const FiltersBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);   // Stato che controlla se mostrare il menu a tendina dei filtri
  const dropdownRef = useRef<HTMLDivElement | null>(null);   // Ref per rilevare click fuori dal dropdown
  const [showAddModal, setShowAddModal] = useState(false);   // Stato che controlla se mostrare la modale Add task
  const { reloadTasks } = useFiltersContext();               // Accede alla funzione per ricaricare le tasks

  // Data odierna
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "long" });

  // Chiude dropdown al click fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    // Se il dropdown è aperto, aggiunge il listener
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="filters-bar bg-white py-3 border-bottom rounded shadow-sm px-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Data attuale */}
        <div className="d-flex align-items-center gap-3">
          <i className="bi bi-calendar4 fs-5 text-primary"></i>
          <div className="d-flex align-items-baseline gap-1">
            <div className="fs-5 fw-bold">{day}</div>
            <div className="text-muted text-uppercase fs-7">{month}</div>
          </div>
        </div>

        {/* Pulsanti a destra */}
        <div className="d-flex gap-2 gap-md-3 align-items-center">
          <button className="btn btn-sm btn-primary fw-semibold px-3 px-md-4" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-square me-2"></i>Add Task
          </button>

          <div className="position-relative" ref={dropdownRef}>
            <button
              className="btn btn-sm btn-outline-primary border-2 px-3 px-md-4"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <i className="bi bi-sliders me-2"></i>
              Customize
            </button>

            {showDropdown && (
              <div className="position-absolute end-0 mt-2 z-3 filters-dropdown">
                <FiltersDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
      {showAddModal && (
        <TaskFormModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            reloadTasks?.();
          }}
        />
      )}
    </div>
  );
};

export default FiltersBar;
