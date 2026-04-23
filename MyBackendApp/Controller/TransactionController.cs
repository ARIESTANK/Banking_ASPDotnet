using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// calling db and models

using MyBackendApp.Models;
using MyBackendApp.Database;
using MyBackendApp.Encode;

namespace MyBackendApp.Controller{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase {
        private AppDbContext _db;
        private EncryptHelper _encrypt;
        public TransactionController (AppDbContext db,EncryptHelper encrypt){ _db=db ;_encrypt=encrypt;} //setting db route

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetAll()
        => await _db.Transactions.ToListAsync();
        
        [HttpGet("by-userID/{id}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetByUser(int id)
        {
            var transactions = await _db.Transactions.Where(t=>t.senderId == id || t.receiverId == id).OrderByDescending(t => t.createdAt).ToListAsync();
            if(!transactions.Any()) return NotFound();
            else return Ok(transactions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ── Validate sender account exists ──
            var senderAccount = await _db.Accounts
                .FirstOrDefaultAsync(a => a.userID == dto.senderId);

            if (senderAccount == null && dto.type=="transfer")
                return NotFound(new { message = "Sender account not found." });

            // ── Validate receiver account exists ──
            var receiverAccount = await _db.Accounts
                .FirstOrDefaultAsync(a => a.accountNumber == dto.receiverId);

            if (receiverAccount == null )
                return NotFound(new { message = "Receiver account not found." });

            // ── Prevent self-transfer ──
            if (senderAccount!=null && (senderAccount.accountId == receiverAccount.accountId))
                return BadRequest(new { message = "Sender and receiver cannot be the same account." });

            // ── Check sufficient balance for Transfer/Withdraw ──
            if ( dto.type == "withdraw")
            {
                if (receiverAccount.amount < (float)dto.amount)
                    return BadRequest(new { message = "Insufficient balance." });
            }

            if ( dto.type == "transfer")
            {
                if (senderAccount.amount < (float)dto.amount)
                    return BadRequest(new { message = "Insufficient balance." });
            }
            // ── Validate amount ──
            if (dto.amount <= 0)
                return BadRequest(new { message = "Amount must be greater than zero." });

            using var dbTransaction = await _db.Database.BeginTransactionAsync();
            try
            {
                // ── Adjust balances based on type ──
                switch (dto.type)
                {
                    case "transfer":
                        senderAccount.amount   -= dto.amount;
                        receiverAccount.amount += dto.amount;
                        break;

                    case "deposit":
                        receiverAccount.amount += dto.amount;
                        break;

                    case "withdraw":
                        receiverAccount.amount -= dto.amount;
                        break;

                    default:
                        return BadRequest(new { message = "Invalid transaction type. Use Transfer, Deposit, or Withdraw." });
                }
                // ── Create transaction record ──
                var transaction = new Transaction
                {
                    transactionNumber = Guid.NewGuid().ToString(),
                    senderId          = dto.senderId,
                    receiverId        = receiverAccount.userID,
                    amount            = (decimal) dto.amount,
                    type              = dto.type,
                    status            = "Completed",
                    description       = dto.description,
                    createdAt         = DateTime.UtcNow,
                };

                _db.Transactions.Add(transaction);
                await _db.SaveChangesAsync();
                await dbTransaction.CommitAsync();

                return StatusCode(201, transaction);
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                return StatusCode(500, new { message = "Transaction failed.", error = ex.Message });
            }
        }

    }

}
