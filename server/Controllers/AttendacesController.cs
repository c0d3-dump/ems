using ems.Data;
using ems.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ems.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AttendancesController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetAttendances()
    {
      return Ok(await database.Attendances.ToListAsync());
    }

    [HttpGet]
    [Route("{userId:int}")]
    public async Task<IActionResult> GetAttendace([FromRoute] int userId)
    {
      var attendances = await database.Attendances.Where(attendance => attendance.UserId == userId).ToListAsync();
      return Ok(attendances);
    }

    [HttpPost]
    [Route("check-in/{userId:int}")]
    public async Task<IActionResult> CheckIn([FromRoute] int userId)
    {
      var attendance = await database.Attendances.Where(attendance =>
          attendance.AttendanceDate == DateOnly.FromDateTime(DateTime.Now)
          && attendance.UserId == userId)
        .ToListAsync();

      if (attendance.Count > 0)
      {
        return NotFound();
      }

      var newAttendance = new Attendance()
      {
        UserId = userId,
        AttendanceDate = DateOnly.FromDateTime(DateTime.Now),
        AttendanceInTime = TimeOnly.FromDateTime(DateTime.Now),
      };

      await database.Attendances.AddAsync(newAttendance);
      await database.SaveChangesAsync();

      return Ok(newAttendance);
    }

    [HttpPost]
    [Route("check-out/{userId:int}")]
    public async Task<IActionResult> CheckOut([FromRoute] int userId)
    {
      var attendance = await database.Attendances.Where(attendance =>
          attendance.AttendanceDate == DateOnly.FromDateTime(DateTime.Now)
          && attendance.UserId == userId)
        .FirstAsync();

      if (attendance != null && attendance.AttendanceOutTime == null)
      {
        attendance.AttendanceOutTime = TimeOnly.FromDateTime(DateTime.Now);

        await database.SaveChangesAsync();
        return Ok(attendance);
      }
      return NotFound();
    }
  }
}