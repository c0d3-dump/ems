namespace ems.Models
{
  public class UpdateUserRequest
  {
    public required string Email { get; set; }
    public string? Name { get; set; }
    public int DepartmentId { get; set; }
  }
}