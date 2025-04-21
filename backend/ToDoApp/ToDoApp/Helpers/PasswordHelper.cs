using System.Security.Cryptography;
using System.Text;

namespace ToDoApp.Helpers
{
    public static class PasswordHelper
    {
        // Crea un hash della password
        public static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        // Confronta due password: quella salvata e quella in input (dopo hash)
        public static bool VerifyPassword(string passwordInput, string hashedPassword)
        {
            var hashInput = HashPassword(passwordInput);
            return hashInput == hashedPassword;
        }
    }
}
