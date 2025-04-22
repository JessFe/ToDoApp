using Microsoft.Data.SqlClient;
using System.Data;
using ToDoApp.Data;
using ToDoApp.Models;

namespace ToDoApp.Repositories
{
    public class ListRepository
    {
        private readonly DbHandler _dbHandler;

        public ListRepository(DbHandler dbHandler)
        {
            _dbHandler = dbHandler;
        }

        #region GET

        // Ottiene tutte le liste associate a uno specifico utente
        public async Task<List<ListItem>> ListsGetAll(int userId)
        {
            var query = "SELECT * FROM Lists WHERE UserId = @UserId";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@UserId", userId)
            };

            var table = await _dbHandler.ExecuteQueryAsync(query, parameters);

            var lists = new List<ListItem>();
            foreach (DataRow row in table.Rows)
            {
                lists.Add(new ListItem
                {
                    Id = (int)row["Id"],
                    UserId = (int)row["UserId"],
                    Name = (string)row["Name"],
                    Color = (string)row["Color"]
                });
            }

            return lists;
        }

        #endregion

        #region POST

        // Crea una nuova lista per l'utente
        public async Task<int> ListCreate(ListItem list)
        {
            var query = @"
                INSERT INTO Lists (UserId, Name, Color)
                VALUES (@UserId, @Name, @Color);
                SELECT SCOPE_IDENTITY();";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@UserId", list.UserId),
                new SqlParameter("@Name", list.Name),
                new SqlParameter("@Color", list.Color)
            };

            var result = await _dbHandler.ExecuteScalarAsync(query, parameters);
            return Convert.ToInt32(result); // ritorna l'id generato
        }

        #endregion

        #region PUT

        // Modifica una lista esistente
        public async Task<bool> ListEdit(ListItem list)
        {
            var query = @"
                UPDATE Lists
                SET Name = @Name, Color = @Color
                WHERE Id = @Id AND UserId = @UserId";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Name", list.Name),
                new SqlParameter("@Color", list.Color),
                new SqlParameter("@Id", list.Id),
                new SqlParameter("@UserId", list.UserId)
            };

            int affected = await _dbHandler.ExecuteNonQueryAsync(query, parameters);
            return affected > 0;
        }

        #endregion

        #region DELETE

        // Elimina una lista
        public async Task<bool> ListDelete(int listId)
        {
            var query = "DELETE FROM Lists WHERE Id = @Id";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Id", listId)
            };

            int affected = await _dbHandler.ExecuteNonQueryAsync(query, parameters);
            return affected > 0;
        }

        #endregion


    }
}
