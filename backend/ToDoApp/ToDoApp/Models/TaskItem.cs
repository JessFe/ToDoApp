namespace ToDoApp.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? ListId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = null!; // "To Do", "Doing", "Done"
        public string? ListName { get; set; }
        public string ListColor { get; set; } = "gray";

    }
}
