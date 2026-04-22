using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyBackendApp.Models
{

    public class Account{
        [Key]
        public int accountId{ get; set;}

        //attributes
        public required string accountNumber{get;set;}
        public required string type{get;set;}
        public required float amount{get;set;}
        public required string status{get;set;}
        //foreign key
        public required int userID {get;set;}

        [ForeignKey("userID")]
        public required User user{get;set;}
    }
}
