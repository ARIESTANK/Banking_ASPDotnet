namespace MyBackendApp.Models
{
    public class AccountCreate
{
    public required int userID { get; set; }
    public required string type { get; set; }
    public required decimal amount { get; set; }
    public required string status { get; set; }
}
}