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
        public ITerritoryList _territoryList;
        // GET: api/<FormSubmitController>
        public DiceController(ITerritoryList territoryList)
        {
            _territoryList = territoryList;
        }
        //[HttpPost("{action}")]
        //public IActionResult AddInitialTerritory([FromBody] Territory territory)
        //{
            
        //    _territoryList.AddTerritory(territory);
        //    var ordered = _territoryList.GetTerritories().OrderBy(o => o.Id).ToList();
        //    var newList = new TerritoryList();
        //    foreach(var item in ordered)
        //    {
        //        newList.AddTerritory(item);
        //    }
        //    _territoryList = newList;
        //    Console.WriteLine("Action1");
        //    return Created("", territory);
        //}
        //[HttpPost("{action}")]
        //public IActionResult AddInitialList([FromBody] List<Territory> territories)
        //{
        //    foreach (var item in territories)
        //    {
        //        _territoryList.AddTerritory(item);
        //    }
            
        //    Console.WriteLine("Action1");
        //    return Created("", territories);
        //}
        [HttpGet("{action}")]
        public List<Territory> GetAllTerritories()
        {
            return _territoryList.GetTerritories();
        }
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public List<List<int>> GetWinner1()
        {
            return new RandomCalculator().calculateWinner(10, 3);
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
       
        [HttpPost("{action}")]
        public IActionResult PostInitialTerritories([FromBody] int[] myarray)
        {
            for(int i =0;i < myarray.Length;i++)
            {
            _territoryList.AddJustInt(new Territory { Id = myarray[i], PlayerName="", Troops = 0 });

            }
            Console.WriteLine("Action1");
            return Created("", myarray);
        }
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public List<int> GetInitialTroops()
        {
            int players = 3;
            int numOfTerritory = 40;
            int divisor = 13;

            var res = new Dictionary<string, Dictionary<string, int>>();
            // var allOfTerritories = new RandomCalculator().generatePlayersTerritory().ToList();
            var allOfTerritories = new List<int>();
            for (int i =0; i<  _territoryList.GetTerritories().Count;i++)
            {
                allOfTerritories.Add(_territoryList.GetTerritories()[i].Id);
            }
          
            
            var abba = new RandomCalculator();
            Dictionary<string, int> meh = new Dictionary<string, int>();
            var meh2 = new List<int>();
            for (int i = 0; i < players; i++)
            {
                numOfTerritory = numOfTerritory - divisor;

                if (i != players - 1)
                {
                    foreach (var a in abba.initialTroopsDeploy2(allOfTerritories.Take(13).ToArray(), 30 - 13))
                    {
                        meh2.Add(a);

                    }

                    allOfTerritories.RemoveRange(0, 13);
                }
                else
                {
                    foreach (var a in abba.initialTroopsDeploy2(allOfTerritories.ToArray(), 30 - 14))
                    {
                        meh2.Add(a);
                    }


                }


            }
            return meh2;
            //return meh.Keys.OrderBy(k => Int32.Parse(k)).ToDictionary(k => k, k => meh[k]);
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

