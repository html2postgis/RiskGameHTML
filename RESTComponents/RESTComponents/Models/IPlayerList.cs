using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Models
{
    public interface IPlayerList
    {
        // Add new player at the beginning 
        bool AddPlayer(Player newPlayer);
        // Get all players
        List<Player> GetPlayers();
        // Searches through players' list to find the right player 
        Player Find(int key);
        // Removes player when all teritories are lost
        Player Remove(int key);
        // Updates all troop number for player
        void Update(Player player);
    }
}
