using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using countryList.Models;
using System;

namespace countryList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CountriesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var query = "SELECT * FROM countries";
            var table = new DataTable();
            var sqlDataSource = _configuration.GetConnectionString("CLCAppDB");
            using (var myCon = new MySqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (var myCommand = new MySqlCommand(query, myCon))
                {
                    using (var myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
                myCon.Close();
            }

            var countryVisits = new List<CountryVisit>();
            foreach (DataRow row in table.Rows)
            {
                countryVisits.Add(new CountryVisit
                {
                    ID = Convert.ToInt32(row["ID"]),
                    CountryName = row["CountryName"].ToString(),
                    VisitDate = Convert.ToInt32(row["VisitDate"]), // This should not throw an exception if VisitDate is a year
                    Notes = row["Notes"].ToString(),
                    Rating = Convert.ToInt32(row["Rating"])
                });
            }

            return Ok(countryVisits);
        }
    }
}
