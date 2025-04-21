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
            return Convert.ToInt32(result); // ritorna l'ID generato
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
