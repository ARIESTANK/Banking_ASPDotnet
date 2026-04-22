using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using MyBackendApp.Database;
using MyBackendApp.Models;
using MyBackendApp.Encode;

namespace MyBackendApp.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase {
        private AppDbContext _db;
        private EncryptHelper _encrypt;

        public AccountController(AppDbContext db,EncryptHelper encrypt){ _db=db ;_encrypt=encrypt;} 

        [HttpGet("by-userID/{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id){
            var account = await _db.Accounts.FirstOrDefaultAsync(u=>u.userID==id);
            if(account==null) return NotFound($"No Account Active in userID : {id}");
            else return Ok(account);
        }

        [HttpGet("activeAccount")]
        public async Task<ActionResult<Account>> GetActiveAccount(){
            var account = await _db.Accounts.Where(t=>t.status == "active").ToListAsync();
            if(account!=null) return Ok(account);
            else return NotFound();
        }
        [HttpPost]
        public async Task<ActionResult<Account>> Create([FromBody] AccountCreate newAcc)
        {
            if(newAcc == null) return BadRequest();
            
            Random random = new Random();
            string number = "";
            for (int i = 0; i < 16; i++)
            {
                number += random.Next(0, 10); // digits 0–9
            }
            var user = await _db.Users.FindAsync(newAcc.userID);
            var account = new Account
            {
                accountNumber=number,
                type=newAcc.type,
                amount=(float)newAcc.amount,
                status=newAcc.status,
                user=user,
                userID=newAcc.userID,
            };
            _db.Accounts.Add(account);
            await _db.SaveChangesAsync();

            return StatusCode(201,"created");
        }

    }
}
