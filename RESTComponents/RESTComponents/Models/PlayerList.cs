using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Models
{
    public class PlayerList :IPlayerList
    {
        Dictionary<int, Player> players = new Dictionary<int, Player>();
        int currentId = 0;
        Object locker = new Object();
        public bool AddPlayer(Player newPlayer)
        {
            lock (locker)
            {
                newPlayer.Id = currentId;
                players.Add(currentId++, newPlayer);
                return true;
            }
        }

        public Player Find(int key)
        {
            Player tmpPlayer;
            players.TryGetValue(key, out tmpPlayer);
            return tmpPlayer;
        }

        public List<Player> GetPlayers()
        {
            return players.Values.ToList();
        }

        public Player Remove(int key)
        {
            Player tmpPlayer;
            players.TryGetValue(key, out tmpPlayer);
            if (players.Remove(key))
            {
                return tmpPlayer;
            }
            return null;
        }
        void Update(Player tmpPlayer)
        {
           players[tmpPlayer.Id] = tmpPlayer;
        }
       
    }
   
}
