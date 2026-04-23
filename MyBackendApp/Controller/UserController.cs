using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// calling db and models

using MyBackendApp.Models;
using MyBackendApp.Database;
using MyBackendApp.Encode;

namespace MyBackendApp.Controller{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase {
        private AppDbContext _db;
        private EncryptHelper _encrypt;
        public UserController (AppDbContext db,EncryptHelper encrypt){ _db=db ;_encrypt=encrypt;} //setting db route

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        => await _db.Users.ToListAsync();

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<User>> Get(int id){
            var user= await _db.Users.FindAsync(id);
            if(user==null) return NotFound();
            else return Ok(user);
        }
            [HttpPost]
            public async Task<ActionResult<User>> Create([FromBody] User user){
                if(user==null) return BadRequest("Need User Data");
                else{
                    if(user.password==null) return BadRequest("Need User Data");
                    else{
                        var hashedPwd= _encrypt.HashPassword(user.password);
                        user.password=hashedPwd;
                            _db.Users.Add(user);
                        await _db.SaveChangesAsync();
                        return CreatedAtAction(nameof(Get), new { id = user.userID }, user);
                    }
                }

            }
        [HttpPut("promote/{id}")]
        public async Task<ActionResult<User>> Promote(int id){
            var user= await _db.Users.FindAsync(id);
            if(user==null) return NotFound();
            user.role = "admin";
            _db.SaveChanges();
            return Ok(user);
        }
        [HttpPost("change-password/{id}")]
        public async Task<ActionResult<User>> ChangePwd([FromBody] PasswordForm form, int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            if (string.IsNullOrEmpty(form.Current) || string.IsNullOrEmpty(form.Next))
                return BadRequest("Password fields cannot be empty");

            if (form.Next != form.Confirm)
                return BadRequest("New password and confirm password do not match");

            if (string.IsNullOrEmpty(user.password))
                return StatusCode(500, "User password not set in database");

            if (_encrypt.Verify(form.Current, user.password))
            {
                user.password = _encrypt.HashPassword(form.Next);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Password updated successfully" });
            }

            return Unauthorized("Current password is incorrect");
        }

       [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // 1. Find the user in the database
            var user = await _db.Users.FindAsync(id);

            // 2. Check if the user exists
            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            try 
            {
                // 3. Remove the user
                _db.Users.Remove(user);
                
                // 4. Save changes to the database
                await _db.SaveChangesAsync();

                return Ok(new { message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                // Handle potential database constraints (e.g., existing foreign keys)
                return BadRequest(new { message = "Error deleting user. Ensure they have no active accounts.", error = ex.Message });
            }
        }


    }

}
