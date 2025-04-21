using Microsoft.Data.SqlClient;
using System.Data;

namespace ToDoApp.Data
{
    // Questa classe si occupa di aprire connessioni al DB e lanciare query
    public class DatabaseService
    {
        private readonly string _connectionString;

        // Il costruttore legge la connection string da appsettings.json
        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ToDoAppConnection")!;
            // "!" indica che la connection string non sarà mai null (configurata in appsettings.json).
            // Senza "!" GetConnectionString potrebbe restituire null quindi ho un warning.
        }

        // Metodo per SELECT che restituisce una DataTable con i risultati
        public async Task<DataTable> ExecuteQueryAsync(string query, List<SqlParameter>? parameters = null)
        {
            var dataTable = new DataTable();

            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                if (parameters != null)
                    command.Parameters.AddRange(parameters.ToArray());

                await connection.OpenAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    dataTable.Load(reader); // carica i dati nel DataTable
                }
            }

            return dataTable;
        }

        // Metodo per INSERT, UPDATE, DELETE - non restituisce dati
        public async Task<int> ExecuteNonQueryAsync(string query, List<SqlParameter>? parameters = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                if (parameters != null)
                    command.Parameters.AddRange(parameters.ToArray());

                await connection.OpenAsync();
                return await command.ExecuteNonQueryAsync(); // restituisce il numero di righe coinvolte
            }
        }

        // Metodo per query tipo SELECT COUNT(*) o INSERT con OUTPUT inserted.Id
        public async Task<object?> ExecuteScalarAsync(string query, List<SqlParameter>? parameters = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand(query, connection))
            {
                if (parameters != null)
                    command.Parameters.AddRange(parameters.ToArray());

                await connection.OpenAsync();
                return await command.ExecuteScalarAsync(); // restituisce un singolo valore
            }
        }
    }
}
