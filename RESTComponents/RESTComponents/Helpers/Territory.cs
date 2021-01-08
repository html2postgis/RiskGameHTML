using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Helpers
{
    public class Territory
    {
        public int Id { get; set; }
        public int PlayerID { get; set; }
        public int Troops { get; set; }
    }
    public interface ITerritoryList
    {
        // Add new player at the beginning 
        bool AddTerritory(Territory newPlayer);
        // Get all players
        List<Territory> GetTerritories();
        // Searches through players' list to find the right player 
        Territory Find(int key);
        // Removes player when all teritories are lost
        Territory Remove(int key);
        // Updates all troop number for player
        //void Update(Player player);
    }
    public class TerritoryList : ITerritoryList
    {
        Dictionary<int, Territory> players = new Dictionary<int, Territory>();
        int currentId = 0;
        Object locker = new Object();
        public bool AddTerritory(Territory newPlayer)
        {
            lock (locker)
            {
                newPlayer.Id = currentId;
                players.Add(currentId++, newPlayer);
                return true;
            }
        }

        public Territory Find(int key)
        {
            Territory tmpPlayer;
            players.TryGetValue(key, out tmpPlayer);
            return tmpPlayer;
        }

        public List<Territory> GetTerritories()
        {
            return players.Values.ToList();
        }

        public Territory Remove(int key)
        {
            Territory tmpPlayer;
            players.TryGetValue(key, out tmpPlayer);
            if (players.Remove(key))
            {
                return tmpPlayer;
            }
            return null;
        }
        void Update(Territory tmpPlayer)
        {
            players[tmpPlayer.Id] = tmpPlayer;
        }


    }

}
