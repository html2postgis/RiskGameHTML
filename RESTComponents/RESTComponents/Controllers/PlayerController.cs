using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RESTComponents.Helpers;
using RESTComponents.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RESTComponents.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        public IPlayerList _playerList;
        public Root myRoot;

        public PlayerController(IPlayerList playerList)
        {
            _playerList = playerList;
        }

        // GET: api/<PlayerController>
        [HttpGet("{action}")]
        public IEnumerable<Player> GetPlayersList()
        {
            return _playerList.GetPlayers();
        }
        // GET: api/<PlayerController>
        [HttpGet("{action}")]
        public Root GetRoot()
        {
            return myRoot;
        }
        // GET api/<PlayerController>/5
        [HttpGet("GetPlayerTerList/{id}")]
        public List<Territory> GetPlayerTerList(int id)
        {
            //_playerList.GetPlayers()[id].territories.Sort();
            return _playerList.GetPlayers()[id].territories;
        }
        [HttpGet("GetMy")]
        public Root GetMy()
        {
            //_playerList.GetPlayers()[id].territories.Sort();

            return new Filer().LoadFiler();
        }
        [HttpGet("GetPlayerTroopLimit/{id}")]
        public int GetPlayerTroopLimit(int id)
        {
            return _playerList.GetPlayers()[id].territories.Count/3;
        }


        [HttpPost("{action}")]
        public IActionResult AddPlayerTerr([FromBody] helper help)
        {
            Territory ter = new Territory();
            ter.Id = help.territoryid;
            _playerList.GetPlayers()[help.attackerid - 1].territories.Add(ter);


            //subtract
            foreach (var temp in _playerList.GetPlayers()[help.defenderid - 1].territories)
            {
                if (temp.Id == help.territoryid)
                {
                    _playerList.GetPlayers()[help.defenderid - 1].territories.Remove(temp);
                    break;
                }
            }
            return Ok(help);
        }

    }
}
