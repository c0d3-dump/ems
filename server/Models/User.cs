using Microsoft.EntityFrameworkCore;

namespace ems.Models
{
  public class User
  {
    public int UserId { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
    public int DepartmentId { get; set; }
    public required DateTime JoiningDate { get; set; }

    public string? Name { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Address { get; set; }

    public Department? Department { get; set; }
    public List<Attendance>? Attendances { get; set; }
  }
}