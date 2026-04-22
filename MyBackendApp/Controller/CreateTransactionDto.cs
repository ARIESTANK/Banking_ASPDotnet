namespace MyBackendApp.Models
{
    public class CreateTransactionDto
    {
        public int senderId    { get; set; }
        public required string  receiverId  { get; set; }
        public float amount      { get; set; }
        public string  type        { get; set; } = string.Empty;  // Transfer | Deposit | Withdraw
        public string? description { get; set; }
    }
}