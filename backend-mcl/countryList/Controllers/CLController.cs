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
                    VisitDate = Convert.ToInt32(row["VisitDate"]),
                    Notes = row["Notes"].ToString(),
                    Rating = Convert.ToInt32(row["Rating"])
                });
            }

            return Ok(countryVisits);
        }

        [HttpPost]
        public IActionResult Post([FromBody] CountryVisit countryVisit)
        {
            var query = @"INSERT INTO countries (CountryName, VisitDate, Notes, Rating) 
                  VALUES (@CountryName, @VisitDate, @Notes, @Rating)";

            var sqlDataSource = _configuration.GetConnectionString("CLCAppDB");
            using (var myCon = new MySqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (var myCommand = new MySqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@CountryName", countryVisit.CountryName);
                    myCommand.Parameters.AddWithValue("@VisitDate", countryVisit.VisitDate);
                    myCommand.Parameters.AddWithValue("@Notes", countryVisit.Notes);
                    myCommand.Parameters.AddWithValue("@Rating", countryVisit.Rating);

                    myCommand.ExecuteNonQuery();
                }
                myCon.Close();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var query = @"DELETE FROM countries WHERE ID = @ID";

            var sqlDataSource = _configuration.GetConnectionString("CLCAppDB");
            using (var myCon = new MySqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (var myCommand = new MySqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ID", id);

                    myCommand.ExecuteNonQuery();
                }
                myCon.Close();
            }

            return Ok();
        }


    }
}
