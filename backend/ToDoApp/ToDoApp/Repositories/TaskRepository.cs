using Microsoft.Data.SqlClient;
using System.Data;
using ToDoApp.Data;
using ToDoApp.Models;

namespace ToDoApp.Repositories
{
    public class TaskRepository
    {
        private readonly DbHandler _dbHandler;

        public TaskRepository(DbHandler dbHandler)
        {
            _dbHandler = dbHandler;
        }

        #region GET

        // Recupera tutti i task di un utente
        public async Task<List<TaskItem>> TasksGetAll(int userId)
        {
            var query = @"
                        SELECT t.*, l.Name AS ListName, l.Color AS ListColor
                        FROM Tasks t
                        LEFT JOIN Lists l ON t.ListId = l.Id
                        WHERE t.UserId = @UserId";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@UserId", userId)
            };

            var table = await _dbHandler.ExecuteQueryAsync(query, parameters);

            return ConvertToTaskList(table);
        }

        // Recupera i task associati a una specifica lista
        public async Task<List<TaskItem>> TasksGetByList(int listId)
        {
            string query;
            var parameters = new List<SqlParameter>();

            if (listId == 0)
            {
                // Cerca i task senza lista
                query = @"
                        SELECT t.*, l.Name AS ListName, l.Color AS ListColor
                        FROM Tasks t
                        LEFT JOIN Lists l ON t.ListId = l.Id
                        WHERE t.ListId IS NULL";
            }
            else
            {
                // Cerca i task della lista specificata
                query = @"
                        SELECT t.*, l.Name AS ListName, l.Color AS ListColor
                        FROM Tasks t
                        LEFT JOIN Lists l ON t.ListId = l.Id
                        WHERE t.ListId = @ListId";
                parameters.Add(new SqlParameter("@ListId", listId));
            }

            var table = await _dbHandler.ExecuteQueryAsync(query, parameters);

            return ConvertToTaskList(table);
        }


        // Funzione interna per convertire DataTable in lista di TaskItem
        private List<TaskItem> ConvertToTaskList(DataTable table)
        {
            var list = new List<TaskItem>();
            foreach (DataRow row in table.Rows)
            {
                list.Add(new TaskItem
                {
                    Id = (int)row["Id"],
                    UserId = (int)row["UserId"],
                    ListId = row["ListId"] == DBNull.Value ? null : (int?)row["ListId"],
                    Title = (string)row["Title"],
                    Description = row["Description"] == DBNull.Value ? null : (string)row["Description"],
                    DueDate = (DateTime)row["DueDate"],
                    Status = (string)row["Status"],
                    ListName = row.Table.Columns.Contains("ListName") && row["ListName"] != DBNull.Value ? (string)row["ListName"] : null,
                    ListColor = row["ListColor"] == DBNull.Value ? "gray" : (string)row["ListColor"]

                });
            }
            return list;
        }

        #endregion

        #region POST

        // Crea un nuovo task
        public async Task<int> TaskCreate(TaskItem task)
        {
            var query = @"
                INSERT INTO Tasks (UserId, ListId, Title, Description, DueDate, Status)
                VALUES (@UserId, @ListId, @Title, @Description, @DueDate, @Status);
                SELECT SCOPE_IDENTITY();";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@UserId", task.UserId),
                new SqlParameter("@ListId", (object?)task.ListId ?? DBNull.Value),
                new SqlParameter("@Title", task.Title),
                new SqlParameter("@Description", (object?)task.Description ?? DBNull.Value),
                new SqlParameter("@DueDate", task.DueDate),
                new SqlParameter("@Status", task.Status)
            };

            var result = await _dbHandler.ExecuteScalarAsync(query, parameters);
            return Convert.ToInt32(result);
        }

        #endregion

        #region PUT

        // Modifica un task esistente
        public async Task<bool> TaskEdit(TaskItem task)
        {
            var query = @"
                UPDATE Tasks
                SET Title = @Title,
                    Description = @Description,
                    DueDate = @DueDate,
                    Status = @Status,
                    ListId = @ListId
                WHERE Id = @Id AND UserId = @UserId";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Id", task.Id),
                new SqlParameter("@UserId", task.UserId),
                new SqlParameter("@Title", task.Title),
                new SqlParameter("@Description", (object?)task.Description ?? DBNull.Value),
                new SqlParameter("@DueDate", task.DueDate),
                new SqlParameter("@Status", task.Status),
                new SqlParameter("@ListId", (object?)task.ListId ?? DBNull.Value)
            };

            int affected = await _dbHandler.ExecuteNonQueryAsync(query, parameters);
            return affected > 0;
        }

        #endregion

        #region DELETE

        // Elimina un task
        public async Task<bool> TaskDelete(int taskId)
        {
            var query = "DELETE FROM Tasks WHERE Id = @Id";

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Id", taskId)
            };

            int affected = await _dbHandler.ExecuteNonQueryAsync(query, parameters);
            return affected > 0;
        }

        #endregion

    }
}
