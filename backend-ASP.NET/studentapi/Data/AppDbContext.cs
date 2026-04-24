using Microsoft.EntityFrameworkCore;
using studentapi.Models;

namespace studentapi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Student> Students => Set<Student>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    Id = 1,
                    Name = "Aarav Sharma",
                    Email = "aarav.sharma@example.com",
                    Phone = "9876543210",
                    Course = "Computer Science",
                    EnrollmentDate = new DateTime(2025, 1, 10)
                },
                new Student
                {
                    Id = 2,
                    Name = "Maya Patel",
                    Email = "maya.patel@example.com",
                    Phone = "9123456780",
                    Course = "Mathematics",
                    EnrollmentDate = new DateTime(2025, 2, 14)
                },
                new Student
                {
                    Id = 3,
                    Name = "Rohan Mehta",
                    Email = "rohan.mehta@example.com",
                    Phone = "9988776655",
                    Course = "Physics",
                    EnrollmentDate = new DateTime(2025, 3, 20)
                }
            );
        }
    }
}
