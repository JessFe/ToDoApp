using ToDoApp.Models;
using ToDoApp.Repositories;

namespace ToDoApp.Services
{
    public class UserService
    {
        private readonly UserRepository _userRepository;

        // Il service riceve il repository
        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Registra un nuovo utente
        public async Task<(bool Success, string Message, int? UserId)> UserCreate(User user)
        {
            // Controlla che username non esista già
            bool exists = await _userRepository.UserExists(user.Username);
            if (exists)
                return (false, "Username already exists.", null);

            // Controlla che i campi siano compilati (controllo semplice lato backend)
            if (string.IsNullOrWhiteSpace(user.Name) ||
                string.IsNullOrWhiteSpace(user.Username) ||
                string.IsNullOrWhiteSpace(user.Password))
            {
                return (false, "All fields are required.", null);
            }

            // Crea l'utente
            int userId = await _userRepository.UserCreate(user);
            return (true, "User registered successfully.", userId);
        }

        // Login utente
        public async Task<(bool Success, string Message, User? User)> UserLogin(string username, string password)
        {
            // Prova a fare il login
            var user = await _userRepository.UserLogin(username, password);
            if (user == null)
                return (false, "Invalid username or password.", null);

            return (true, "Login successful.", user);
        }
    }
}
