using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using MyBackendApp.Database;
using MyBackendApp.Models;
using MyBackendApp.Encode;
namespace MyBackendApp.Controller
{


    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private AppDbContext _db;
        private EncryptHelper _encrypt;
        public AuthController (AppDbContext db,EncryptHelper encrypt) { _db=db; _encrypt=encrypt; }
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] Login login){
            if(login == null || string.IsNullOrEmpty(login.email)) return BadRequest("No Email to check in body");
            var userData =await _db.Users.FirstOrDefaultAsync(u=>u.email==login.email);
            if(userData==null) return NotFound($"No user found with {login.email}");
            else{
                if(_encrypt.Verify(login.password,userData.password)){
                    return Ok(userData);
                }else{
                    return StatusCode(401,"Unauthenicated, password Wrong");
                }
            }
        }

    }
}
