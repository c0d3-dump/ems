using ems.Models;
using Microsoft.EntityFrameworkCore;

namespace ems.Data
{
  public class Database(DbContextOptions options) : DbContext(options)
  {
    public DbSet<User> Users { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Attendance> Attendances { get; set; }
  }
}