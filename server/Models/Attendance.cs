namespace ems.Models
{
  public class Attendance
  {
    public int AttendanceId { get; set; }
    public required int UserId { get; set; }
    public DateOnly AttendanceDate { get; set; }
    public TimeOnly AttendanceInTime { get; set; }
    public TimeOnly? AttendanceOutTime { get; set; }
  }
}