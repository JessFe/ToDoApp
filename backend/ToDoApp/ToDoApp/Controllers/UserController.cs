using Microsoft.AspNetCore.Mvc;
using ToDoApp.Models;
using ToDoApp.Services;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        // Costruttore che riceve il servizio UserService
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // Endpoint per la registrazione di un nuovo utente
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var result = await _userService.UserCreate(user);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, userId = result.UserId });
        }

        // Endpoint per il login di un utente esistente
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var result = await _userService.UserLogin(user.Username, user.Password);
            if (!result.Success)
            {
                return Unauthorized(new { message = result.Message });
            }

            return Ok(new { message = result.Message, user = result.User });
        }
    }
}
