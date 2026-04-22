using System.ComponentModel.DataAnnotations;

namespace MyBackendApp.Models
{
    public class User
    {
        [Key]
        public int userID { get; set; }

        [Required(ErrorMessage = "Full name is required")]
        public required  string name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public required string email { get; set; }

        public required string role {get; set; }

        [Required(ErrorMessage = "Password is required")]
        public required string password { get; set; }
    }
}
