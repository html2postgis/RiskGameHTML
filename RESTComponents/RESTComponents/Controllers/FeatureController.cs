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
    [Route("[controller]")]
    [ApiController]
    public class FeatureController : ControllerBase
    {


        public IRoot myRootW;
        public Filer myFiler = new Filer();
        public FeatureController(IRoot otherRoot)
        {
            myRootW = otherRoot;
            

        }


        // GET: api/<PlayerController>
        [HttpGet("{action}")]
        public Root GetRoot()
        {
            myRootW.AssignRoot(new Filer().LoadFiler());
            return myRootW.GetRoot();
        }
        // GET: api/<DiceController>
        [HttpGet("{action}")]
        public List<List<int>> GetWinner(int attackingTerritoryId, int defencingTerritoryId)
        {
            
            var tmpList = myRootW.GetRoot();
            int attackers = tmpList.features[attackingTerritoryId - 1].properties.troops-1;
            int defencors = tmpList.features[defencingTerritoryId - 1].properties.troops;
            var result = new RandomCalculator().calculateWinner(attackers, defencors);
            if(result[0].Count!=0)
            {
                tmpList.features[defencingTerritoryId - 1].properties.playerId = tmpList.features[attackingTerritoryId-1].properties.playerId;
                tmpList.features[defencingTerritoryId - 1].properties.troops = result[0].Count;
                tmpList.features[attackingTerritoryId - 1].properties.troops = 1;
            }
            else
            {
               tmpList.features[defencingTerritoryId - 1].properties.troops = result[1].Count;
               tmpList.features[attackingTerritoryId - 1].properties.troops = 1;
            }

            //new Filer().SaveFiler(tmpList);
            return result;
        }
        [HttpGet("GetTroopsLimit/{id}")]
        public int GetTroopsLimit(int id)
        {

            //var tmpList = new Filer().ChangesFiler("InitialMap_copy.json");
            var tmpList = myRootW.GetRoot();
            return new RandomCalculator().countTerritories(tmpList,id+1)/ 3;
        }

        [HttpGet("GetIfValidTerritory/{id}")]
        public List<Feature> GetIfValidTerritory(int id, int territoryId)
        {
            var tmpList = myRootW.GetRoot();
            
            return new RandomCalculator().selectPlayersTerritories(tmpList, id + 1, territoryId);
            
          
        }


        [HttpPost("AddTroopToTerritory")]
        public int AddTroopToTerritory([FromBody]int territoryId)
        {
            var tmpList = myRootW.GetRoot();
            new RandomCalculator().AddTroop(tmpList, territoryId);
            Console.WriteLine("logi ", tmpList.features[territoryId-1].properties.troops);
            return 1;
        }

        [HttpPost("MoveTroopToTerritory")]
        public int MoveTroopToTerritory([FromBody] Message message)
        {
            var tmpList = myRootW.GetRoot();
            new RandomCalculator().MoveTroop(tmpList, message.originTerritoryId, message.finalTerritoryId, message.numOfTroops);
            
            return 1;
        }
    }
    
}
