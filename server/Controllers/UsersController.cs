using ems.Data;
using ems.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Auth0.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace ems.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UsersController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
      return Ok(await database.Users
        .Include(users => users.Department)
        .ToListAsync());
    }

    [HttpGet]
    [Route("{email}")]
    public async Task<IActionResult> GetUser([FromRoute] string email)
    {
      var user = await database.Users.Where(u => u.Email == email).FirstAsync();

      if (user == null)
      {
        return NotFound();
      }

      var attendances = await database.Attendances.Where(a => a.UserId == user.UserId)
        .OrderBy(o => o.AttendanceDate)
        .Take(30).ToListAsync();

      var attendanceData = new List<AttendanceData>();
      attendances.ForEach(attendance =>
      {
        var t = (attendance.AttendanceOutTime ?? TimeOnly.FromDateTime(DateTime.Now)) - attendance.AttendanceInTime;
        attendanceData.Add(new AttendanceData()
        {
          Date = attendance.AttendanceDate.ToString("d MMM"),
          Hours = t.TotalHours.ToString()?.Split(".")[0] ?? ""
        });
        Console.WriteLine(t);
      });

      user.Attendances = attendances.Where(a => a.AttendanceDate == DateOnly.FromDateTime(DateTime.Now)).ToList();

      Console.WriteLine(attendanceData.ToString());

      return Ok(new UserAttendanceData()
      {
        User = user,
        AttendanceDatas = attendanceData
      });
    }

    [HttpGet]
    [Route("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
      var totalUsers = await database.Users.CountAsync();
      var totalUsersWithBirthdays = await database.Users.Where(users =>
          users.BirthDate.HasValue && users.BirthDate.Value.Day == DateTime.Now.Day &&
          users.BirthDate.HasValue && users.BirthDate.Value.Month == DateTime.Now.Month)
        .CountAsync();
      var totalAnniversaries = await database.Users.Where(users =>
            users.JoiningDate.Day == DateTime.Today.Day &&
            users.JoiningDate.Month == DateTime.Today.Month)
        .CountAsync();

      var statistics = new Statistics()
      {
        TotalUsers = totalUsers,
        TotalUsersWithBirthdays = totalUsersWithBirthdays,
        TotalAnniversaries = totalAnniversaries,
      };
      return Ok(statistics);
    }

    [HttpPost]
    public async Task<IActionResult> AddUser(AddUserRequest addUserRequest)
    {
      var newUser = new User()
      {
        Email = addUserRequest.Email,
        Password = addUserRequest.Password,
        Role = addUserRequest.Role,
        Name = addUserRequest.Name,
        JoiningDate = DateTime.Now,
        BirthDate = addUserRequest.BirthDate,
        DepartmentId = addUserRequest.DepartmentId
      };

      await database.Users.AddAsync(newUser);
      await database.SaveChangesAsync();

      return Ok(newUser);
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LoginUser(LoginUserRequest loginUserRequest)
    {
      var user = await database.Users.Where(u => u.Email == loginUserRequest.Email).FirstAsync();

      if (user != null && user.Password == loginUserRequest.Password)
      {
        return Ok(user);
      }
      return NotFound();
    }


    [HttpPut]
    [Route("{userId:int}")]
    public async Task<IActionResult> UpdateUser([FromRoute] int userId, UpdateUserRequest updateUserRequest)
    {
      var user = await database.Users.FindAsync(userId);

      if (user != null)
      {
        user.Email = updateUserRequest.Email;
        user.Name = updateUserRequest.Name;
        user.DepartmentId = updateUserRequest.DepartmentId;

        await database.SaveChangesAsync();
        return Ok(user);
      }
      return NotFound();
    }


    [HttpDelete]
    [Route("{userId:int}")]
    public async Task<IActionResult> DeleteUser([FromRoute] int userId)
    {

      var user = await database.Users.FindAsync(userId);
      if (user != null)
      {
        database.Remove(user);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}