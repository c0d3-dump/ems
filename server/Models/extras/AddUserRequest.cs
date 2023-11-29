namespace ems.Models
{
  public class AddUserRequest
  {
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Role { get; set; }
    public string? Name { get; set; }
    public int DepartmentId { get; set; }
  }
}