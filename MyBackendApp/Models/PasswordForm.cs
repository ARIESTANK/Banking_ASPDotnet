namespace MyBackendApp.Models
{
    public class PasswordForm
{
    public required string Current { get; set; }
    public required string Next { get; set; }
    public required string Confirm { get; set; }
}
}