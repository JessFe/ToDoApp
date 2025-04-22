using ToDoApp.Models;
using ToDoApp.Repositories;

namespace ToDoApp.Services
{
    public class TaskService
    {
        private readonly TaskRepository _taskRepository;

        // Il service riceve il repository
        public TaskService(TaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        #region GET

        // Ottiene tutti i task di un utente
        public async Task<List<TaskItem>> TasksGetAll(int userId)
        {
            return await _taskRepository.TasksGetAll(userId);
        }

        // Ottiene tutti i task associati a una specifica lista
        public async Task<List<TaskItem>> TasksGetByList(int listId)
        {
            return await _taskRepository.TasksGetByList(listId);
        }

        #endregion

        #region POST

        // Crea un nuovo task
        public async Task<int> TaskCreate(TaskItem task)
        {
            return await _taskRepository.TaskCreate(task);
        }

        #endregion

        #region PUT

        // Modifica un task esistente
        public async Task<bool> TaskEdit(TaskItem task)
        {
            return await _taskRepository.TaskEdit(task);
        }

        #endregion

        #region DELETE

        // Elimina un task
        public async Task<bool> TaskDelete(int taskId)
        {
            return await _taskRepository.TaskDelete(taskId);
        }

        #endregion
    }
}
