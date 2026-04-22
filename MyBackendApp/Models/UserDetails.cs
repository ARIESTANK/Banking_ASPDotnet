using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBackendApp.Models{
    //additional user datas
    public class UserDetails{
        [Key]
        public int userDetailID { get; set; }

        [Required(ErrorMessage = "Phone No is required")]
        public required string phone { get; set; }

        [Required(ErrorMessage = "Location is required")]
        public required string address { get; set; }

        [Required(ErrorMessage = "UserID is required")]
        public required int userID { get; set; }

        [ForeignKey("userID")]
        public required User user{get;set;}


    }
}