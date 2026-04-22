using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBackendApp.Models
{
    public class Transaction
    {
        // ✅ Primary Key
        [Key]
        public int transactionID { get; set; }

        // ✅ Unique transaction number (NOT PK)
        [Required]
        public string transactionNumber { get; set; } = Guid.NewGuid().ToString();

        // ✅ Sender Account ID (FK)
        [Required]
        public int senderId { get; set; }

        // ✅ Receiver Account ID (FK)
        [Required]
        public int receiverId { get; set; }

        // ✅ Amount
        [Required]
        public decimal amount { get; set; }

        // ✅ Transaction Type (Transfer, Deposit, Withdraw)
        [Required]
        public string type { get; set; }

        // ✅ Status (Pending, Completed, Failed)
        public string status { get; set; } = "Completed";

        // ✅ Description (optional)
        public string? description { get; set; }

        // ✅ Created Time
        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}