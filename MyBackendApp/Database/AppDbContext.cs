using Microsoft.EntityFrameworkCore;
using MyBackendApp.Models;

namespace MyBackendApp.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts{get;set;}
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Transaction> Transactions {get;set;} 
    }
}
