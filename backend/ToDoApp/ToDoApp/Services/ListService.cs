using ToDoApp.Models;
using ToDoApp.Repositories;

namespace ToDoApp.Services
{
    public class ListService
    {
        private readonly ListRepository _listRepository;

        // Il service riceve il repository
        public ListService(ListRepository listRepository)
        {
            _listRepository = listRepository;
        }

        #region GET

        // Recupera tutte le liste associate a un utente
        public async Task<List<ListItem>> ListsGetAll(int userId)
        {
            return await _listRepository.ListsGetAll(userId);
        }

        #endregion

        #region POST

        // Crea una nuova lista per l'utente
        public async Task<int> ListCreate(ListItem list)
        {
            return await _listRepository.ListCreate(list);
        }

        #endregion

        #region PUT

        // Modifica una lista esistente
        public async Task<bool> ListEdit(ListItem list)
        {
            return await _listRepository.ListEdit(list);
        }

        #endregion

        #region DELETE

        // Elimina una lista specifica
        public async Task<bool> ListDelete(int listId)
        {
            return await _listRepository.ListDelete(listId);
        }

        #endregion
    }
}
