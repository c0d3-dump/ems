namespace ems.Models
{
  public class UserAttendanceData
  {
    public required User User { get; set; }
    public required List<AttendanceData> AttendanceDatas { get; set; }
  }
}