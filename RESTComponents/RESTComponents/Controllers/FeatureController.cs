using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RESTComponents.Helpers;
using RESTComponents.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RESTComponents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeatureController : ControllerBase
    {


        public Root myRoot;

        public FeatureController()
        {
            myRoot = new Filer().LoadFiler();
        }


        // GET: api/<PlayerController>
        [HttpGet("{action}")]
        public Root GetRoot()
        {
            return myRoot;
        }
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public List<List<int>> GetWinner(int attackingTerritoryId, int defencingTerritoryId)
        {
            int attackers = myRoot.features[attackingTerritoryId - 1].properties.troops;
            int defencors = myRoot.features[defencingTerritoryId - 1].properties.troops;
            var result = new RandomCalculator().calculateWinner(attackers, defencors);
            if(result[0].Count!=0)
            {
                myRoot.features[defencingTerritoryId - 1].properties.playerId = myRoot.features[attackingTerritoryId-1].properties.playerId;
                myRoot.features[defencingTerritoryId - 1].properties.troops = result[0].Count;
                myRoot.features[attackingTerritoryId - 1].properties.troops = 1;
            }
            else
            {
               myRoot.features[defencingTerritoryId - 1].properties.troops = result[1].Count;
               myRoot.features[attackingTerritoryId - 1].properties.troops = 1;
            }
            return result;
        }
        [HttpGet("GetTroopsLimit/{id}")]
        public int GetTroopsLimit(int playerId)
        {
            return new RandomCalculator().countTerritories(myRoot, playerId)/ 3;
        }



    }
}
