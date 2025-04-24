import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useFiltersContext } from "../context/FiltersContext";
import { getTasksByUserId, editTask } from "../services/api";
import KanbanColumn from "./KanbanColumn";
import { Task } from "../types";

const KanbanView = () => {
  const { user, token } = useUserContext();
  const { statusFilter, listsFilter, timeFilter } = useFiltersContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id || !token) return;

      const result = await getTasksByUserId(user.id, token);

      if (!result.success) {
        setError(result.message);
      } else {
        setTasks(result.data);
      }

      setLoading(false);
    };

    fetchTasks();
  }, [user, token]);

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
  console.log("DEBUG listsFilter:", listsFilter);
  console.log(
    "DEBUG task.listId:",
    tasks.map((t) => ({ id: t.id, listId: t.listId }))
  );

  const toDo = filteredTasks.filter((task) => task.status === "To Do");
  const doing = filteredTasks.filter((task) => task.status === "Doing");
  const done = filteredTasks.filter((task) => task.status === "Done");

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row">
      <div className="col-md-4">
        <KanbanColumn title="To Do" tasks={toDo} onStatusChange={handleStatusChange} />
      </div>
      <div className="col-md-4">
        <KanbanColumn title="Doing" tasks={doing} onStatusChange={handleStatusChange} />
      </div>
      <div className="col-md-4">
        <KanbanColumn title="Done" tasks={done} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default KanbanView;
