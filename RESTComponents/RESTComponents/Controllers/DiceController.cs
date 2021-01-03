using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RESTComponents.Models;
using RESTComponents.Helpers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RESTComponents.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DiceController : ControllerBase
    {
        
        
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public List<List<int>> GetWinner1()
        {
            return new RandomCalculator().calculateWinner(10,3);
        }
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public List<List<int>> GetWinner2(int attackers, int defencors)
        {
            return new RandomCalculator().calculateWinner(attackers, defencors);
        }
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public int[] GetInitialTerritories()
        {
            return new RandomCalculator().generatePlayersTerritory();
        }
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public Dictionary<string,int> GetInitialTroops()
        {
            int players = 3;
            int numOfTerritory = 40;
            int divisor =13;
            
            var res = new Dictionary<string, Dictionary<string, int>>();
            var allOfTerritories = new RandomCalculator().generatePlayersTerritory().ToList();
            var abba = new RandomCalculator();
            Dictionary<string, int> meh = new Dictionary<string, int>();
            for (int i = 0; i < players; i++)
            {
                numOfTerritory = numOfTerritory - divisor;

                if (i != players - 1)
                {
                    foreach (var a in abba.initialTroopsDeploy(allOfTerritories.Take(13).ToArray(),30-13))
                    {
                        meh.Add(a.Key,a.Value);

                    }

                   allOfTerritories.RemoveRange(0, 13);
                }
                else
                {
                    foreach (var a in abba.initialTroopsDeploy(allOfTerritories.ToArray(),30-14))
                    {
                        meh.Add(a.Key, a.Value);
                    }

                    
                }


            }
            
            return meh.Keys.OrderBy(k => Int32.Parse(k)).ToDictionary(k => k, k => meh[k]);
        }
    //    // GET api/<DiceController>/5
    //    [HttpGet("{id}")]
    //    public string Get(int id)
    //    {
    //        return "value";
    //    }
       
    //// POST api/<DiceController>
    //[HttpPost]
    //    public void Post([FromBody] string value)
    //    {
    //    }

    //    // PUT api/<DiceController>/5
    //    [HttpPut("{id}")]
    //    public void Put(int id, [FromBody] string value)
    //    {
    //    }

    //    // DELETE api/<DiceController>/5
    //    [HttpDelete("{id}")]
    //    public void Delete(int id)
    //    {
    //    }
    }
}

    