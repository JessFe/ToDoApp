import { useEffect, useState, useCallback } from "react";
import { useUserContext } from "../context/UserContext";
import { useFiltersContext } from "../context/FiltersContext";
import { getTasksByUserId, editTask } from "../services/api";
import KanbanColumn from "./KanbanColumn";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskFormModal from "./TaskFormModal";
import { Task } from "../types";

const KanbanView = () => {
  const { user, token } = useUserContext();
  const { statusFilter, listsFilter, timeFilter, setReloadTasks, userLists } = useFiltersContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user?.id || !token) return;
    const result = await getTasksByUserId(user.id, token);
    if (result.success) {
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

  setReloadTasks?.(() => fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [user, token, setReloadTasks, userLists, fetchTasks, setReloadTasks]);

  // Cambia lo status e aggiorna localmente
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
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
    } else {
      console.error("Errore aggiornamento status:", result.message);
    }
  };

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

      const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const days = parseInt(timeFilter); // es "3 days" + 3

      if (isNaN(days)) return false;

      if (task.status === "Done") {
        return diffDays >= -(days - 1) && diffDays <= 0;
      } else {
        return diffDays >= 0 && diffDays <= days - 1;
      }
    })();

    return matchStatus && matchList && matchTime;
  });

  const toDo = filteredTasks.filter((task) => task.status === "To Do");
  const doing = filteredTasks.filter((task) => task.status === "Doing");
  const done = filteredTasks.filter((task) => task.status === "Done");

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row">
      <div className="col-md-4">
        <KanbanColumn
          title="To Do"
          tasks={toDo}
          onStatusChange={handleStatusChange}
          onCardClick={(task) => setSelectedTask(task)}
        />
      </div>
      <div className="col-md-4">
        <KanbanColumn
          title="Doing"
          tasks={doing}
          onStatusChange={handleStatusChange}
          onCardClick={(task) => setSelectedTask(task)}
        />
      </div>
      <div className="col-md-4">
        <KanbanColumn
          title="Done"
          tasks={done}
          onStatusChange={handleStatusChange}
          onCardClick={(task) => setSelectedTask(task)}
        />
      </div>
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
