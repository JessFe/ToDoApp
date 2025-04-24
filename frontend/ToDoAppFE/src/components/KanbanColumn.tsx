import KanbanCard from "./KanbanCard";
import { Task } from "../types";

type KanbanColumnProps = {
  title: string;
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: Task["status"]) => void;
};

const KanbanColumn = ({ title, tasks, onStatusChange }: KanbanColumnProps) => {
  return (
    <div>
      {/* Titolo colonna con numero task */}
      <h6 className="mb-3 mt-2 text-center ">
        {title} <span className="badge bg-primary bg-opacity-75 ms-2">{tasks.length}</span>
      </h6>

      {/* Card per ogni task */}
      <div className="d-flex flex-column gap-3">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
