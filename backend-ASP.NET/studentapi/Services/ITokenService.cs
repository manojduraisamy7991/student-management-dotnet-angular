using studentapi.Models;

namespace studentapi.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
