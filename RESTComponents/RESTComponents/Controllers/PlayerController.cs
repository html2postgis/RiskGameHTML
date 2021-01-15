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

        // GET api/<PlayerController>/5
        [HttpGet("GetPlayerTerList/{id}")]
        public List<Territory> GetPlayerTerList(int id)
        {
            //_playerList.GetPlayers()[id].territories.Sort();
            return _playerList.GetPlayers()[id].territories;
        }
        [HttpGet("GetPlayerTroopLimit/{id}")]
        public int GetPlayerTroopLimit(int id)
        {
            return _playerList.GetPlayers()[id].territories.Count/3;
        }
        [HttpPut("RemovePlayerTerr/{id}")]
        public IActionResult RemovePlayerTerr(int id,[FromBody] int terr_id)
        {
            foreach (var temp in _playerList.GetPlayers()[id].territories)
            {
                if (temp.Id == terr_id)
                {
                    _playerList.GetPlayers()[id].territories.Remove(temp);
                    break;
                }
            }
            return Ok(terr_id);
        }
        [HttpPut("AddPlayerTerr/{id}")]
        public IActionResult AddPlayerTerr(int id, [FromBody] int terr_id)
        {
            Territory ter = new Territory();
            ter.Id = terr_id;
            _playerList.GetPlayers()[id].territories.Add(ter);
            return Ok(terr_id);
        }

    }
}
