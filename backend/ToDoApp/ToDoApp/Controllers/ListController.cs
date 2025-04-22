using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoApp.Models;
using ToDoApp.Services;

namespace ToDoApp.Controllers
{
    [Authorize]
    [ApiController]
    //[Route("api/[controller]")]
    [Route("api/lists")]
    public class ListController : ControllerBase
    {
        private readonly ListService _listService;

        // Costruttore che riceve il service
        public ListController(ListService listService)
        {
            _listService = listService;
        }

        #region GET

        // Ottiene tutte le liste di un utente
        // GET /api/list?userId=1
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] int userId)
        {
            var lists = await _listService.ListsGetAll(userId);
            return Ok(lists);
        }

        #endregion

        #region POST

        // Crea una nuova lista
        // POST /api/list
        [HttpPost]
        public async Task<IActionResult> CreateList([FromBody] ListItem list)
        {
            var newId = await _listService.ListCreate(list);
            return Ok(new { message = "List created successfully", listId = newId });
        }

        #endregion

        #region PUT

        // Modifica una lista esistente
        // PUT /api/list
        [HttpPut]
        public async Task<IActionResult> EditList([FromBody] ListItem list)
        {
            var success = await _listService.ListEdit(list);
            if (!success)
                return NotFound(new { message = "List not found or update failed" });

            return Ok(new { message = "List updated successfully" });
        }

        #endregion

        #region DELETE

        // Elimina una lista
        // DELETE /api/list/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            var success = await _listService.ListDelete(id);
            if (!success)
                return NotFound(new { message = "List not found or deletion failed" });

            return Ok(new { message = "List deleted successfully" });
        }

        #endregion
    }
}
