using Microsoft.AspNetCore.Mvc;
using ToDoApp.Helpers;
using ToDoApp.Models;
using ToDoApp.Services;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwtService;

        // Costruttore che riceve UserService e JwtService
        public UserController(UserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        // POST /api/user/register
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

        // POST /api/user/login
        // Endpoint per il login di un utente esistente
        // Verifica username e password e restituisce un token JWT + info utente.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var result = await _userService.UserLogin(user.Username, user.Password);
            if (!result.Success || result.User == null)
                return Unauthorized(new { message = result.Message });

            // Genera il token JWT
            var token = _jwtService.GenerateToken(result.User);

            return Ok(new
            {
                message = result.Message,
                token = token,
                user = new
                {
                    id = result.User.Id,
                    name = result.User.Name,
                    username = result.User.Username
                }
            });
        }

    }
}
