import { useEffect, useState, useCallback } from "react";
import { useUserContext } from "../context/UserContext";
import { useFiltersContext } from "../context/FiltersContext";
import { getTasksByUserId, editTask } from "../services/api";   // api per ottenere e modificare task
import KanbanColumn from "./KanbanColumn";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskFormModal from "./TaskFormModal";
import { Task } from "../types";

const KanbanView = () => {
  const { user, token } = useUserContext();
  const { statusFilter, listsFilter, timeFilter, setReloadTasks, userLists } = useFiltersContext();

  // stati
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);   // Stato per la modale con dettagli della task
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);       // Stato la modale di modifica

  // Funzione per caricare i task da backend
  const fetchTasks = useCallback(async () => {
    if (!user?.id || !token) return;

    const result = await getTasksByUserId(user.id, token);

    if (result.success) {
      // Aggiunge nome e colore lista a ogni task
      const enrichedTasks = result.data.map((task: Task) => {
        const list = userLists.find((l) => l.id === task.listId);
        return {
          ...task,
          listName: list?.name ?? task.listName,
          listColor: list?.color ?? task.listColor,
        };
      });

      setTasks(enrichedTasks);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, [user?.id, token, userLists]);

  // Rende la funzione fetchTasks richiamabile da fuori tramite context
  setReloadTasks?.(() => fetchTasks);

  // Carica task al mount e ogni volta che cambiano
  useEffect(() => {
    fetchTasks();
  }, [user, token, setReloadTasks, userLists, fetchTasks, setReloadTasks]);

  // Aggiorna lo status di una task
  const handleStatusChange = async (taskId: number, newStatus: Task["status"]) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate || !token || !user) return;

    const updatedTask: Task = {
      ...taskToUpdate,
      status: newStatus,
      userId: user.id,
    };

    const result = await editTask(updatedTask, token);
    if (result.success) {
      // Aggiorna lo stato locale
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
    } else {
      console.error("Errore aggiornamento status:", result.message);
    }
  };

  // Filtra i task in base ai filtri selezionati
  const filteredTasks = tasks.filter((task) => {
    const matchStatus = statusFilter.includes(task.status);

    const matchList =
      (task.listId === null && listsFilter.includes(-1)) ||
      (typeof task.listId === "number" && listsFilter.includes(task.listId));

    const matchTime = (() => {
      if (timeFilter === "All") return true;
      if (!task.dueDate) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0); // resetta orario
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      // la differenza di giorni tra oggi e la data di scadenza
      const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));  //Converte i millisecondi in giorni

      if (timeFilter === "Today") {
        return diffDays === 0;   // Mostra solo le task che scadono oggi
      }

      const days = parseInt(timeFilter); // es "3 days" + 3
      if (isNaN(days)) return false;

      // se Done: 3 days mostra le task con data odierna + 2 giorni passati
      // se ToDo o Doing: 3 days mostra le task con data odierna + 2 giorni futuri
      if (task.status === "Done") {
        return diffDays >= -(days - 1) && diffDays <= 0;
      } else {
        return diffDays >= 0 && diffDays <= days - 1;
      }
    })();

    return matchStatus && matchList && matchTime;
  });

  // Divide i task filtrati in colonne
  const toDo = filteredTasks.filter((task) => task.status === "To Do");
  const doing = filteredTasks.filter((task) => task.status === "Doing");
  const done = filteredTasks.filter((task) => task.status === "Done");

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="kanban-wrapper">
      <div className="row flex-nowrap overflow-auto">
        {toDo.length > 0 && (
          <div className="col-12 col-md-4">
            <KanbanColumn
              title="To Do"
              tasks={toDo}
              onStatusChange={handleStatusChange}
              onCardClick={(task) => setSelectedTask(task)}
            />
          </div>
        )}

        {doing.length > 0 && (
          <div className="col-12 col-md-4">
            <KanbanColumn
              title="Doing"
              tasks={doing}
              onStatusChange={handleStatusChange}
              onCardClick={(task) => setSelectedTask(task)}
            />
          </div>
        )}

        {done.length > 0 && (
          <div className="col-12 col-md-4">
            <KanbanColumn
              title="Done"
              tasks={done}
              onStatusChange={handleStatusChange}
              onCardClick={(task) => setSelectedTask(task)}
            />
          </div>
        )}
      </div>

      {/* Modali */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => {
            setTaskToEdit(selectedTask);
            setSelectedTask(null);
          }}
          onDeleteSuccess={() => {
            setSelectedTask(null);
            setTimeout(() => {
              setReloadTasks?.(fetchTasks);
              fetchTasks();
            }, 0);
          }}
        />
      )}
      {taskToEdit && (
        <TaskFormModal
          mode="edit"
          taskToEdit={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSuccess={() => {
            setTaskToEdit(null);
            setReloadTasks?.(fetchTasks);
          }}
        />
      )}
    </div>
  );
};

export default KanbanView;
