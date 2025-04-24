export type Task = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: "To Do" | "Doing" | "Done";
  listId: number | null;
  userId: number;
  listName?: string;
  listColor?: string;
};
