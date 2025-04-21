namespace ToDoApp.Models
{
    public class ListItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Color { get; set; } = null!;
    }
}
