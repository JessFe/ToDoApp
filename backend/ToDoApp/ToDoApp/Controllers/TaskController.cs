using Microsoft.AspNetCore.Mvc;
using ToDoApp.Models;
using ToDoApp.Services;

namespace ToDoApp.Controllers
{
    [ApiController]
    //[Route("api/[controller]")]
    [Route("api/tasks")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;

        // Costruttore che riceve il service
        public TaskController(TaskService taskService)
        {
            _taskService = taskService;
        }

        #region GET

        // GET /api/task?userId={}
        // GET /api/tasks?listId={}
        // Ottiene tutti i task di un utente o lista

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? userId, [FromQuery] int? listId)
        {
            if (userId.HasValue)
            {
                var tasks = await _taskService.TasksGetAll(userId.Value);
                return Ok(tasks);
            }

            if (listId.HasValue)
            {
                var tasks = await _taskService.TasksGetByList(listId.Value);
                return Ok(tasks);
            }

            return BadRequest(new { message = "Missing query parameter: userId or listId" });
        }
        #endregion

        #region POST

        // POST /api/tasks
        // Crea un nuovo task
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
        {
            var taskId = await _taskService.TaskCreate(task);
            return Ok(new { message = "Task created successfully", taskId });
        }

        #endregion

        #region PUT

        // PUT /api/tasks/{id}
        // Modifica un task esistente
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTask(int id, [FromBody] TaskItem task)
        {
            var success = await _taskService.TaskEdit(task);
            if (!success)
                return NotFound(new { message = "Task not found or update failed." });

            return Ok(new { message = "Task updated successfully." });
        }

        #endregion

        #region DELETE

        // DELETE /api/tasks/{id}
        // Elimina un task
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var success = await _taskService.TaskDelete(id);
            if (!success)
                return NotFound(new { message = "Task not found or deletion failed." });

            return Ok(new { message = "Task deleted successfully." });
        }

        #endregion
    }
}
