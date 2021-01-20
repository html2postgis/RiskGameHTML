using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Helpers
{
    public class Territory
    {
        public int Id { get; set; }
        public string StateName { get; set; }
        public string PlayerName { get; set; }
       
        public int Troops { get; set; }
    }
    public interface ITerritoryList
    {
        // Add new player at the beginning 
        bool AddTerritory(Territory newPlayer);
        public bool AddJustInt(Territory newPlayer);
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
        Dictionary<int, Territory> territoriesDic = new Dictionary<int, Territory>();
        Object locker = new Object();
        int maxId = 0;
        
        public bool AddJustInt(Territory newPlayer)
        {
            lock (locker)
            {
                newPlayer.Id = maxId;
                
                territoriesDic.Add(maxId++, newPlayer);
                return true;
            }
        }
        public bool AddTerritory(Territory newPlayer)
        {
            lock (locker)
            {
                
                territoriesDic.Add(newPlayer.Id, newPlayer);
                return true;
            }
        }

        public Territory Find(int key)
        {
            Territory tmpPlayer;
            territoriesDic.TryGetValue(key, out tmpPlayer);
            return tmpPlayer;
        }

        public List<Territory> GetTerritories()
        {
            return territoriesDic.Values.ToList();
        }

        public Territory Remove(int key)
        {
            Territory tmpPlayer;
            territoriesDic.TryGetValue(key, out tmpPlayer);
            if (territoriesDic.Remove(key))
            {
                return tmpPlayer;
            }
            return null;
        }
        void Update(Territory tmpPlayer)
        {
            territoriesDic[tmpPlayer.Id] = tmpPlayer;
        }


    }

}
