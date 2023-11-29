using ems.Data;
using ems.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ems.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class DepartmentsController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetDepartments()
    {
      return Ok(await database.Departments.ToListAsync());
    }

    [HttpGet]
    [Route("{departmentId:int}")]
    public async Task<IActionResult> GetDepartment([FromRoute] int departmentId)
    {
      var department = await database.Departments.FindAsync(departmentId);

      if (department == null)
      {
        return NotFound();
      }
      return Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> AddDepartment(AddDepartmentRequest addDepartmentRequest)
    {
      var newDepartment = new Department()
      {
        DepartmentName = addDepartmentRequest.DepartmentName,
      };

      await database.Departments.AddAsync(newDepartment);
      await database.SaveChangesAsync();

      return Ok(newDepartment);
    }

    [HttpPut]
    [Route("{departmentId:int}")]
    public async Task<IActionResult> UpdateDepartment([FromRoute] int departmentId, UpdateDepartmentRequest updateDepartmentRequest)
    {
      var department = await database.Departments.FindAsync(departmentId);

      if (department != null)
      {
        department.DepartmentName = updateDepartmentRequest.DepartmentName;

        await database.SaveChangesAsync();
        return Ok(department);
      }
      return NotFound();
    }


    [HttpDelete]
    [Route("{departmentId:int}")]
    public async Task<IActionResult> DeleteDepartment([FromRoute] int departmentId)
    {

      var department = await database.Departments.FindAsync(departmentId);
      if (department != null)
      {
        database.Remove(department);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}