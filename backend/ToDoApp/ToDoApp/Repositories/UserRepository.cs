using Microsoft.Data.SqlClient;
using ToDoApp.Data;
using ToDoApp.Helpers;
using ToDoApp.Models;

namespace ToDoApp.Repositories
{
    public class UserRepository
    {
        private readonly DbHandler _dbHandler;

        // Costruttore che riceve il DbHandler
        public UserRepository(DbHandler dbHandler)
        {
            _dbHandler = dbHandler;
        }

        // Controlla se esiste un utente con lo stesso Username
        public async Task<bool> UserExists(string username)
        {
            var query = "SELECT 1 FROM Users WHERE Username = @Username";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Username", username)
            };

            var result = await _dbHandler.ExecuteScalarAsync(query, parameters);
            return result != null;
        }


        // Registra un nuovo utente nel database, salvando la password criptata
        public async Task<int> UserCreate(User user)
        {
            // Hash della password prima di salvarla
            string hashedPassword = PasswordHelper.HashPassword(user.Password);

            var query = @"
                INSERT INTO Users (Name, Username, Password)
                VALUES (@Name, @Username, @Password);
                SELECT SCOPE_IDENTITY();";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Name", user.Name),
                new SqlParameter("@Username", user.Username),
                new SqlParameter("@Password", hashedPassword)
            };

            var result = await _dbHandler.ExecuteScalarAsync(query, parameters);
            //return Convert.ToInt32(result); // ritorna l'ID generato

            int newUserId = Convert.ToInt32(result);

            // DEMO Crea liste
            var listRepo = new ListRepository(_dbHandler);

            var list1 = new ListItem { UserId = newUserId, Name = "Let's begin", Color = "blue" };
            var list2 = new ListItem { UserId = newUserId, Name = "Customize", Color = "orange" };

            int list1Id = await listRepo.ListCreate(list1);
            int list2Id = await listRepo.ListCreate(list2);

            // DEMO Crea task
            var taskRepo = new TaskRepository(_dbHandler);
            var today = DateTime.UtcNow.Date;

            var task1 = new TaskItem
            {
                UserId = newUserId,
                Title = "ToDo app",
                Description = "Made with ♥ by Jess",
                DueDate = new DateTime(2025, 4, 25),
                Status = "Done",
                ListId = null // nessuna lista
            };

            var task2 = new TaskItem
            {
                UserId = newUserId,
                Title = "Happy to see you here!",
                Description = "Take a look around and try all the options",
                DueDate = today,
                Status = "Doing",
                ListId = list1Id
            };

            var task3 = new TaskItem
            {
                UserId = newUserId,
                Title = "Add a new task",
                Description = "Click the Add Task button",
                DueDate = today,
                Status = "To Do",
                ListId = list1Id
            };

            var task4 = new TaskItem
            {
                UserId = newUserId,
                Title = "View or Edit a Task",
                Description = "Click a card",
                DueDate = today.AddDays(1),
                Status = "To Do",
                ListId = list1Id
            };

            var task5 = new TaskItem
            {
                UserId = newUserId,
                Title = "Change a Task's Status",
                Description = "Click on the task's status to change it",
                DueDate = today.AddDays(1),
                Status = "To Do",
                ListId = list1Id
            };

            var task6 = new TaskItem
            {
                UserId = newUserId,
                Title = "Filters",
                Description = "Click Customize and choose between Status, Time, and Lists",
                DueDate = today.AddDays(2),
                Status = "To Do",
                ListId = list2Id
            };

            var task7 = new TaskItem
            {
                UserId = newUserId,
                Title = "Manage your Lists",
                Description = "Click Customize and go to Manage your Lists",
                DueDate = today.AddDays(3),
                Status = "To Do",
                ListId = list2Id
            };

            var task8 = new TaskItem
            {
                UserId = newUserId,
                Title = "Themes",
                Description = "Click Customize and select your favorite color",
                DueDate = today.AddDays(4),
                Status = "To Do",
                ListId = list2Id
            };

            await taskRepo.TaskCreate(task1);
            await taskRepo.TaskCreate(task2);
            await taskRepo.TaskCreate(task3);
            await taskRepo.TaskCreate(task4);
            await taskRepo.TaskCreate(task5);
            await taskRepo.TaskCreate(task6);
            await taskRepo.TaskCreate(task7);
            await taskRepo.TaskCreate(task8);


            return newUserId;
        }

        // Verifica se username e password combaciano (per il login)
        public async Task<User?> UserLogin(string username, string password)
        {
            var query = "SELECT * FROM Users WHERE Username = @Username";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Username", username)
            };

            var table = await _dbHandler.ExecuteQueryAsync(query, parameters);

            if (table.Rows.Count == 0)
                return null; // utente non trovato

            var row = table.Rows[0];

            var user = new User
            {
                Id = (int)row["Id"],
                Name = (string)row["Name"],
                Username = (string)row["Username"],
                Password = (string)row["Password"] // password hashata
            };

            // Confronta la password inserita con quella hashata nel DB
            bool isValid = PasswordHelper.VerifyPassword(password, user.Password);
            if (!isValid)
                return null;

            return user;
        }

    }
}
